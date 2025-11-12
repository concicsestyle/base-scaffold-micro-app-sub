<template>
  <div v-if="allLoading && singleLoginWay" v-loading="allLoading" class="ma" style="height: 100%"></div>
  <div v-if="!allLoading && !singleLoginWay" class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <div class="title-box">
        <h3 class="title">{{ configTitle || title }}</h3>
        <!--        <lang-select />-->
      </div>
      <el-form-item v-if="tenantEnabled" prop="tenantId">
        <el-select v-model="loginForm.tenantId" filterable :placeholder="proxy.$t('login.selectPlaceholder')" style="width: 100%">
          <el-option v-for="item in tenantList" :key="item.tenantId" :label="item.companyName" :value="item.tenantId"></el-option>
          <template #prefix><svg-icon icon-class="company" class="el-input__icon input-icon" /></template>
        </el-select>
      </el-form-item>
      <el-form-item prop="userName">
        <el-input v-model="loginForm.userName" text size="large" auto-complete="off" :placeholder="proxy.$t('login.userName')">
          <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          size="large"
          auto-complete="off"
          :placeholder="proxy.$t('login.password')"
          @keyup.enter="handleLogin"
        >
          <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="captchaEnabled" prop="code">
        <el-input
          v-model="loginForm.code"
          size="large"
          auto-complete="off"
          :placeholder="proxy.$t('login.code')"
          style="width: 63%"
          @keyup.enter="handleLogin"
        >
          <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" class="login-code-img" @click="getCode" />
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">{{ proxy.$t('login.rememberPassword') }}</el-checkbox>
      <el-form-item style="float: right">
        <el-button circle :title="proxy.$t('login.adminSocial.pc_base_platform')" @click="doSocialLogin('pc_base_platform')">
          <svg-icon icon-class="social-base-platform" />
        </el-button>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="large"
          type="primary"
          style="width: 100%; border-radius: 10px; background-image: linear-gradient(to right, #8490f3, #4e6bef); border: none; font-size: 16px"
          @click.prevent="handleLogin"
        >
          <span v-if="!loading">{{ proxy.$t('login.login') }}</span>
          <span v-else>{{ proxy.$t('login.logging') }}</span>
        </el-button>
        <div v-if="register" style="margin-top: 10px; float: right; margin-left: 280px">
          <router-link class="link-type" :to="'/register'">{{ proxy.$t('login.switchRegisterPage') }}</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>{{ copyright || 'Copyright © 2025 国机重型装备集团股份有限公司 All Rights Reserved.' }}</span>
      <a href="https://beian.miit.gov.cn" target="_blanck">&nbsp;{{ icp || '蜀ICP备2024113851号-1 | 京公网安备11010802010327号' }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { callback, getCodeImg, getTenantList, login } from '@/api/common/admin/login';
import { getCommonConfigByCode } from '@/api/infra/common/commonConfig';
import { authBinding } from '@/api/infra/admin/adminSocial/auth';
import { useUserStore } from '@/store/modules/user';
import { LoginData, TenantVO } from '@/api/common/admin/types';
import { to } from 'await-to-js';
import { HttpStatus } from '@/enums/RespEnum';
import { getToken, setToken } from '@/utils/auth';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const title = ref(import.meta.env.VITE_APP_TITLE);
const userStore = useUserStore();
const router = useRouter();
const allLoading = ref(true);
const route = useRoute();
const singleLoginWay = import.meta.env.VITE_APP_SINGLE_LOGIN_WAY;

/**
 * 接收Route传递的参数
 * @param {Object} route.query.
 */
const code = route.query.code as string;
const state = route.query.state as string;
const source = route.query.source as string;
const stateJson = state ? JSON.parse(atob(state)) : {};
const tenantId = (stateJson.tenantId as string) ? (stateJson.tenantId as string) : '000000';
const domain = stateJson?.domain ? (stateJson?.domain as string) : window.location.host;

const loginForm = ref<LoginData>({
  tenantId: '000000',
  userName: '',
  password: '',
  rememberMe: false,
  code: '',
  uuid: ''
} as LoginData);

const loginRules: ElFormRules = {
  tenantId: [{ required: true, trigger: 'blur', message: t('login.rule.tenantId.required') }],
  userName: [{ required: true, trigger: 'blur', message: t('login.rule.userName.required') }],
  password: [{ required: true, trigger: 'blur', message: t('login.rule.password.required') }],
  code: [{ required: true, trigger: 'change', message: t('login.rule.code.required') }]
};

const codeUrl = ref('');
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(true);
// 租户开关
const tenantEnabled = ref(false);

// 注册开关
const register = ref(false);
const redirect = ref('/');
const loginRef = ref<ElFormInstance>();
// 租户列表
const tenantList = ref<TenantVO[]>([]);

const copyright = ref();
const icp = ref();
const configTitle = ref();

watch(
  () => router.currentRoute.value,
  (newRoute: any) => {
    redirect.value = newRoute.query && newRoute.query.redirect && decodeURIComponent(newRoute.query.redirect);
  },
  { immediate: true }
);

const handleLogin = () => {
  loginRef.value?.validate(async (valid: boolean, fields: any) => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在 localStorage 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        localStorage.setItem('tenantId', String(loginForm.value.tenantId));
        localStorage.setItem('userName', String(loginForm.value.userName));
        localStorage.setItem('password', String(loginForm.value.password));
        localStorage.setItem('rememberMe', String(loginForm.value.rememberMe));
      } else {
        // 否则移除
        localStorage.removeItem('tenantId');
        localStorage.removeItem('userName');
        localStorage.removeItem('password');
        localStorage.removeItem('rememberMe');
      }
      // 调用action的登录方法
      const [err] = await to(userStore.login(loginForm.value));
      if (!err) {
        const redirectUrl = redirect.value || '/';
        await router.push(redirectUrl);
        loading.value = false;
      } else {
        loading.value = false;
        // 重新获取验证码
        if (captchaEnabled.value) {
          await getCode();
        }
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};

/**
 * 获取验证码
 */
const getCode = async () => {
  const res = await getCodeImg();
  const { data } = res;
  captchaEnabled.value = data.captchaEnabled === undefined ? true : data.captchaEnabled;
  if (captchaEnabled.value) {
    codeUrl.value = 'data:image/gif;base64,' + data.img;
    loginForm.value.uuid = data.uuid;
  }
};

const getLoginData = async () => {
  const tenantId = localStorage.getItem('tenantId');
  const userName = localStorage.getItem('userName');
  const password = localStorage.getItem('password');
  const rememberMe = localStorage.getItem('rememberMe');
  loginForm.value = {
    tenantId: tenantId === null ? String(loginForm.value.tenantId) : tenantId,
    userName: userName === null ? String(loginForm.value.userName) : userName,
    password: password === null ? String(loginForm.value.password) : String(password),
    rememberMe: rememberMe === null ? false : Boolean(rememberMe)
  } as LoginData;
};

/**
 * 获取租户列表
 */
const initTenantList = async () => {
  const { data } = await getTenantList(false);
  tenantEnabled.value = data.tenantEnabled === undefined ? true : data.tenantEnabled;
  if (tenantEnabled.value) {
    tenantList.value = data.voList;
    if (tenantList.value != null && tenantList.value.length !== 0) {
      loginForm.value.tenantId = tenantList.value[0].tenantId;
    }
  }
};

/**
 * 第三方登录
 * @param type
 */
const doSocialLogin = (type: string) => {
  authBinding(type, loginForm.value.tenantId).then((res: any) => {
    if (res.code === HttpStatus.SUCCESS) {
      // 获取授权地址跳转
      console.log(res.data);
      window.location.href = res.data;
    } else {
      ElMessage.error(res.msg);
    }
  });
};

const processResponse = async (res: any) => {
  if (res.code !== 200) {
    throw new Error(res.msg);
  }
  if (res.data !== null) {
    setToken(res.data.access_token);
  }
  ElMessage.success(res.msg);
  setTimeout(() => {
    location.href = import.meta.env.VITE_APP_CONTEXT_PATH + 'index';
  }, 2000);
};

const handleError = (error: any) => {
  ElMessage.error(error.message);
  setTimeout(() => {
    location.href = import.meta.env.VITE_APP_CONTEXT_PATH + 'index';
  }, 2000);
};

const callbackByCode = async (data: LoginData) => {
  try {
    const res = await callback(data);
    await processResponse(res);
    loading.value = false;
  } catch (error) {
    handleError(error);
  }
};

const loginByCode = async (data: LoginData) => {
  try {
    const res = await login(data);
    await processResponse(res);
    loading.value = false;
  } catch (error) {
    handleError(error);
  }
};

onMounted(async () => {
  if (code) {
    // 如果域名不相等 则重定向处理
    const host = window.location.host;
    if (domain !== host) {
      const urlFull = new URL(window.location.href);
      urlFull.host = domain;
      window.location.href = urlFull.toString();
      return;
    }
    // 路径有code，执行授权逻辑
    const data: LoginData = {
      socialCode: code,
      socialState: state,
      tenantId: tenantId,
      source: source || singleLoginWay || 'pc_base_platform',
      clientId: import.meta.env.VITE_APP_CLIENT_ID,
      grantType: 'adminSocial'
    };
    // 修复基础平台单点登录问题
    if (data.source?.toString()?.indexOf(',') > -1) {
      data.source = data.source[0];
    }
    if (data?.source === 'pc_base_platform') {
      data.createRoleKey = 'none';
    }
    if (!getToken()) {
      await loginByCode(data);
    } else {
      // await callbackByCode(data);
      // 退出登录，使用单点登录账号
      await useUserStore().logout();
      await loginByCode(data);
    }
    return;
  }
  if (singleLoginWay) {
    doSocialLogin(singleLoginWay);
    return;
  }
  const res = await getCommonConfigByCode('SITE_INFO');
  if (res?.data && res?.data?.detail) {
    const detailJson = JSON.parse(res?.data?.detail);
    if (detailJson?.copyright) {
      copyright.value = detailJson?.copyright;
    }
    if (detailJson?.icp) {
      icp.value = detailJson?.icp;
    }
    if (detailJson?.name) {
      configTitle.value = detailJson?.name;
    }
  }
  allLoading.value = false;
  await getLoginData();
  await initTenantList();
  await getCode();
});
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url('../../../assets/images/login-bg1.png');
  background-size: cover;
}

.title-box {
  display: flex;

  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
  }

  :deep(.lang-select--style) {
    line-height: 0;
    color: #7483a3;
  }
}

.login-form {
  border-radius: 20px;
  background: #ffffff;
  opacity: 0.9;
  width: 400px;
  padding: 25px 25px 5px 25px;
  z-index: 1;
  margin-top: 100px;
  margin-left: 800px;

  .el-input {
    height: 40px;

    input {
      height: 40px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #303030;
  font-family: Arial, serif;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
