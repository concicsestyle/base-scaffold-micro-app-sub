import request from '../../../utils/request';
import { AxiosPromise } from 'axios';
import { LoginData, LoginResult, VerifyCodeResult, TenantInfo } from './types';
import { UserInfo } from '../../infra/app/appUser/types';

const clientId = import.meta.env.VITE_APP_CLIENT_ID;
const appBaseUrl = import.meta.env.VITE_APP_APP_BASEURL;
const singleLoginWay = import.meta.env.VITE_APP_SINGLE_LOGIN_WAY;

/**
 * @param data {LoginData}
 * @returns
 */
export function login(data: LoginData): AxiosPromise<LoginResult> {
  const params = {
    ...data,
    clientId: data.clientId || clientId,
    grantType: data.grantType || 'appPassword'
  };
  return request({
    url: '/auth/app/login',
    headers: {
      isToken: false,
      isEncrypt: true,
      repeatSubmit: false
    },
    method: 'post',
    data: params,
    params:
      params?.grantType === 'appSocial'
        ? {
            tenantId: params?.tenantId,
            domain: window.location.host,
            customRedirectUri: appBaseUrl + '/appSocialCallback?source=' + params?.source
          }
        : {}
  });
}

// 注册方法
export function register(data: any) {
  const params = {
    ...data,
    clientId: clientId,
    grantType: 'appPassword'
  };
  return request({
    url: '/auth/app/register',
    headers: {
      isToken: false,
      isEncrypt: true,
      repeatSubmit: false
    },
    method: 'post',
    data: params
  });
}

/**
 * 注销
 */
export function logout() {
  if (import.meta.env.VITE_APP_SSE === 'true') {
    request({
      url: '/infra/sse/close',
      method: 'get'
    }).then(() => {});
  }
  return request({
    url: '/auth/app/logout',
    method: 'post',
    params: singleLoginWay
      ? {
          customLogout: 1,
          customRedirectUri: appBaseUrl + '/login'
        }
      : {}
  });
}

/**
 * 获取验证码
 */
export function getCodeImg(): AxiosPromise<VerifyCodeResult> {
  return request({
    url: '/auth/captcha/code',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  });
}

/**
 * 第三方登录
 */
export function callback(data: LoginData): AxiosPromise<any> {
  const LoginData = {
    ...data,
    clientId: clientId,
    grantType: 'appSocial'
  };
  return request({
    url: '/auth/app/social/callback',
    method: 'post',
    data: LoginData
  });
}

// 获取用户详细信息
export function getInfo(): AxiosPromise<UserInfo> {
  return request({
    url: 'infra/admin/app/user/getInfo',
    method: 'get'
  });
}

// 获取租户列表
export function getTenantList(isToken: boolean): AxiosPromise<TenantInfo> {
  return request({
    url: '/auth/app/tenant/list',
    headers: {
      isToken: isToken
    },
    method: 'get'
  });
}
