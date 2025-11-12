<template>
  <div v-if="loading" v-loading="loading" element-loading-text="统一登录中..." class="social-callback" style="height: 100%"></div>
</template>

<script setup lang="ts">
import { login, callback } from '@/api/common/admin/login';
import { authBinding } from '@/api/infra/admin/adminSocial/auth';
import { setToken, getToken } from '@/utils/auth';
import { LoginData } from '@/api/common/admin/types';
import { useUserStore } from '@/store/modules/user';
import { getQueryObject } from '@/utils';
import { Action } from 'element-plus';
import { HttpStatus } from '@/enums/RespEnum';

const route = useRoute();
const loading = ref(true);
const singleLoginWay = import.meta.env.VITE_APP_SINGLE_LOGIN_WAY;
const portalUrl = ref(import.meta.env.VITE_APP_BASE_PLATFORM_PORTAL_URL);

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

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
const reParams = route.query.reParams as string;
const realReParams = ref('');
const loginForm = ref<LoginData>({
  tenantId: '000000',
  userName: '',
  password: '',
  rememberMe: false,
  code: '',
  uuid: ''
} as LoginData);

const processResponse = async (res: any) => {
  if (res.code !== 200) {
    throw new Error(res.msg);
  }
  if (res.data !== null) {
    setToken(res.data.access_token);
  }
  // ElMessage.success(res.msg);
  // setTimeout(() => {
  //   location.href = import.meta.env.VITE_APP_CONTEXT_PATH + 'index';
  // }, 2000);
  setTimeout(() => {
    if (realReParams.value) {
      location.href = realReParams.value;
    } else {
      location.href = import.meta.env.VITE_APP_CONTEXT_PATH + 'index';
    }
  }, 2000);
};

const handleError = (error: any) => {
  // ElMessage.error(error.message);
  // setTimeout(() => {
  //   location.href = import.meta.env.VITE_APP_CONTEXT_PATH + 'index';
  // }, 2000);
  ElMessageBox.confirm('统一登录失败，请重试或联系管理员', '系统提示', {
    confirmButtonText: '重试',
    cancelButtonText: '前往统一门户',
    distinguishCancelAndClose: true,
    type: 'warning',
    center: true
  })
    .then((v) => {
      doSocialLogin('pc_base_platform');
    })
    .catch((action: Action) => {
      if (action === 'cancel') {
        window.open(portalUrl.value, '_self');
      }
    });
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

const init = async () => {
  // 如果域名不相等 则重定向处理
  const host = window.location.host;
  if (domain !== host) {
    const urlFull = new URL(window.location.href);
    urlFull.host = domain;
    window.location.href = urlFull.toString();
    return;
  }

  const data: LoginData = {
    socialCode: code,
    socialState: state,
    tenantId: tenantId,
    source: source || singleLoginWay || 'pc_base_platform',
    clientId: import.meta.env.VITE_APP_CLIENT_ID,
    grantType: 'adminSocial'
  };
  // 修复基础平台单点登录问题
  if (source?.toString()?.indexOf(',') > -1) {
    data.source = source[0];
  }
  if (data?.source === 'pc_base_platform') {
    data.createRoleKey = 'none';
  }
  if (singleLoginWay) {
    await loginByCode(data);
    return;
  }
  if (!getToken()) {
    await loginByCode(data);
  } else {
    // await callbackByCode(data);
    // 退出登录，使用单点登录账号
    await useUserStore().logout();
    await loginByCode(data);
  }
};

onMounted(() => {
  nextTick(() => {
    // proxy?.$modal.loading('统一登录中...');
    if (reParams) {
      const decodeReParams = decodeURIComponent(reParams);
      console.log(decodeReParams);
      const queryObject = getQueryObject(decodeReParams);
      const codeStr = 'code=' + queryObject.code;
      realReParams.value = decodeReParams
        .replace(codeStr + '&', '')
        .replace('?' + codeStr, '')
        .replace('&' + codeStr, '');
      if (queryObject.source) {
        const sourceStr = 'source=' + queryObject.source;
        realReParams.value = realReParams.value
          .replace(sourceStr + '&', '')
          .replace('?' + sourceStr, '')
          .replace('&' + sourceStr, '');
      }
      console.log('realReParams', realReParams.value);
    }
    init();
  });
});
</script>
