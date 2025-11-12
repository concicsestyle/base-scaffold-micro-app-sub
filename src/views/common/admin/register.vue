<template>
  <div class="register">
    <el-form ref="registerRef" :model="registerForm" :rules="registerRules" class="register-form">
      <div class="title-box">
        <h3 class="title">{{ configTitle || title }}</h3>
        <!--        <lang-select />-->
      </div>
      <el-form-item v-if="tenantEnabled" prop="tenantId">
        <el-select v-model="registerForm.tenantId" filterable :placeholder="proxy.$t('register.selectPlaceholder')" style="width: 100%">
          <el-option v-for="item in tenantList" :key="item.tenantId" :label="item.companyName" :value="item.tenantId"> </el-option>
          <template #prefix><svg-icon icon-class="company" class="el-input__icon input-icon" /></template>
        </el-select>
      </el-form-item>
      <el-form-item prop="userName">
        <el-input v-model="registerForm.userName" text size="large" auto-complete="off" :placeholder="proxy.$t('register.userName')">
          <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          size="large"
          auto-complete="off"
          :placeholder="proxy.$t('register.password')"
          @keyup.enter="handleRegister"
        >
          <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          size="large"
          auto-complete="off"
          :placeholder="proxy.$t('register.confirmPassword')"
          @keyup.enter="handleRegister"
        >
          <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="captchaEnabled" prop="code">
        <el-input
          v-model="registerForm.code"
          size="large"
          auto-complete="off"
          :placeholder="proxy.$t('register.code')"
          style="width: 63%"
          @keyup.enter="handleRegister"
        >
          <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template>
        </el-input>
        <div class="register-code">
          <img :src="codeUrl" class="register-code-img" @click="getCode" />
        </div>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="large"
          type="primary"
          style="width: 100%; border-radius: 10px; background-image: linear-gradient(to right, #8490f3, #4e6bef); border: none; font-size: 16px"
          @click.prevent="handleRegister"
        >
          <span v-if="!loading">{{ proxy.$t('register.register') }}</span>
          <span v-else>{{ $t('register.registering') }}</span>
        </el-button>
        <div style="margin-top: 10px; float: right; margin-left: 230px">
          <router-link class="link-type" :to="'/login'">{{ proxy.$t('register.switchLoginPage') }}</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-register-footer">
      <span>{{ copyright || 'Copyright © 2025 国机重型装备集团股份有限公司 All Rights Reserved.' }}</span>
      <a href="https://beian.miit.gov.cn" target="_blanck">&nbsp;{{ icp || '蜀ICP备2024113851号-1 | 京公网安备11010802010327号' }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCodeImg, register, getTenantList } from '@/api/common/admin/login';
import { getCommonConfigByCode } from '@/api/infra/common/commonConfig';
import { RegisterForm, TenantVO } from '@/api/common/admin/types';
import { to } from 'await-to-js';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const title = ref(import.meta.env.VITE_APP_TITLE);
const router = useRouter();

const registerForm = ref<RegisterForm>({
  tenantId: '',
  userName: '',
  password: '',
  confirmPassword: '',
  code: '',
  uuid: '',
  userType: 'sys_user'
});

// 租户开关
const tenantEnabled = ref(false);

const copyright = ref();
const icp = ref();
const configTitle = ref();

const equalToPassword = (rule: any, value: string, callback: any) => {
  if (registerForm.value.password !== value) {
    callback(new Error(t('register.rule.confirmPassword.equalToPassword')));
  } else {
    callback();
  }
};

const registerRules: ElFormRules = {
  tenantId: [{ required: true, trigger: 'blur', message: t('register.rule.tenantId.required') }],
  userName: [
    { required: true, trigger: 'blur', message: t('register.rule.userName.required') },
    { min: 2, max: 20, message: t('register.rule.userName.length', { min: 2, max: 20 }), trigger: 'blur' }
  ],
  password: [
    { required: true, trigger: 'blur', message: t('register.rule.password.required') },
    { min: 5, max: 20, message: t('register.rule.password.length', { min: 5, max: 20 }), trigger: 'blur' },
    { pattern: /^[^<>"'|\\]+$/, message: t('register.rule.password.pattern', { strings: '< > " \' \\ |' }), trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, trigger: 'blur', message: t('register.rule.confirmPassword.required') },
    { required: true, validator: equalToPassword, trigger: 'blur' }
  ],
  code: [{ required: true, trigger: 'change', message: t('register.rule.code.required') }]
};
const codeUrl = ref('');
const loading = ref(false);
const captchaEnabled = ref(true);
const registerRef = ref<ElFormInstance>();
// 租户列表
const tenantList = ref<TenantVO[]>([]);

const handleRegister = () => {
  registerRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      const [err] = await to(register(registerForm.value));
      if (!err) {
        const userName = registerForm.value.userName;
        await ElMessageBox.alert('<span style="color: red; ">' + t('register.registerSuccess', { userName }) + '</font>', '系统提示', {
          app: undefined,
          dangerouslyUseHTMLString: true,
          type: 'success'
        });
        await router.push('/login');
      } else {
        loading.value = false;
        if (captchaEnabled.value) {
          getCode();
        }
      }
    }
  });
};

const getCode = async () => {
  const res = await getCodeImg();
  const { data } = res;
  captchaEnabled.value = data.captchaEnabled === undefined ? true : data.captchaEnabled;
  if (captchaEnabled.value) {
    codeUrl.value = 'data:image/gif;base64,' + data.img;
    registerForm.value.uuid = data.uuid;
  }
};

const initTenantList = async () => {
  const { data } = await getTenantList(false);
  tenantEnabled.value = data.tenantEnabled === undefined ? true : data.tenantEnabled;
  if (tenantEnabled.value) {
    tenantList.value = data.voList;
    if (tenantList.value != null && tenantList.value.length !== 0) {
      registerForm.value.tenantId = tenantList.value[0].tenantId;
    }
  }
};

onMounted(async () => {
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
  await initTenantList();
  await getCode();
});
</script>

<style lang="scss" scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url('../../../assets/images/login-bg2.png');
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

.register-form {
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
    margin-left: 0;
  }
}

.register-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.register-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-register-footer {
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

.register-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
