import request from '../../../../utils/request';
const appBaseUrl = import.meta.env.VITE_APP_APP_BASEURL;

// 绑定账号
export function authBinding(source: string, tenantId: string) {
  return request({
    url: '/auth/portal/binding/' + source,
    method: 'get',
    params: {
      tenantId: tenantId,
      domain: window.location.host,
      customRedirectUri: encodeURI(appBaseUrl + '/adminSocialCallback?source=' + source)
    }
  });
}

// 解绑账号
export function authUnlock(authId: string) {
  return request({
    url: '/auth/portal/unlock/' + authId,
    method: 'delete'
  });
}
//获取授权列表
export function getAuthList() {
  return request({
    url: 'infra/admin/portal/social/list',
    method: 'get'
  });
}
