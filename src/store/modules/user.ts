import { to } from 'await-to-js';
import { getToken, removeToken, setToken } from '@/utils/auth';
import { login as loginApi, logout as logoutApi, getInfo as getUserInfo } from '@/api/common/admin/login';
import { getCommonConfigByCode } from '@/api/infra/common/commonConfig';
import { LoginData } from '@/api/common/admin/types';
import defAva from '@/assets/images/profile.jpg';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { DeptVO } from '@/api/infra/admin/adminDept/types';

const appWebShortName = import.meta.env.VITE_APP_WEB_SHORT_APP_NAME
  ? import.meta.env.VITE_APP_WEB_SHORT_APP_NAME
  : import.meta.env.VITE_APP_SHORT_APP_NAME;

export const useUserStore = defineStore('adminUser-' + appWebShortName, () => {
  const token = ref(getToken());
  const name = ref('');
  const nickname = ref('');
  const userId = ref<string | number>('');
  const tenantId = ref<string>('');
  const avatar = ref('');
  const roles = ref<Array<string>>([]); // 用户角色编码集合 → 判断路由权限
  const permissions = ref<Array<string>>([]); // 用户权限编码集合 → 判断按钮权限
  const deptList = ref<Array<DeptVO>>([]); // 用户部门列表

  /**
   * 登录
   * @param userInfo
   * @returns
   */
  const login = async (userInfo: LoginData): Promise<void> => {
    const [err, res] = await to(loginApi(userInfo));
    if (res) {
      const data = res.data;
      setToken(data.access_token);
      token.value = data.access_token;
      return Promise.resolve();
    }
    return Promise.reject(err);
  };

  // 获取用户信息
  const getInfo = async (): Promise<void> => {
    const [err, res] = await to(getUserInfo());
    if (res) {
      const data = res.data;
      const user = data.user;
      let profile = user.avatar == '' || user.avatar == null ? defAva : user.avatar;
      const baseConfigRes = await getCommonConfigByCode('SITE_INFO');
      if (baseConfigRes?.data && baseConfigRes?.data?.detail) {
        const baseConfigJson = JSON.parse(baseConfigRes?.data?.detail);
        if (baseConfigJson?.defaultAvatar) {
          profile = baseConfigJson?.defaultAvatar;
        }
      }

      if (data.roles && data.roles.length > 0) {
        // 验证返回的roles是否是一个非空数组
        roles.value = data.roles;
        permissions.value = data.permissions;
      } else {
        roles.value = ['ROLE_DEFAULT'];
      }
      if (data.deptList && data.deptList.length > 0) {
        deptList.value = data.deptList;
      }
      name.value = user.userName;
      nickname.value = user.nickName;
      avatar.value = profile;
      userId.value = user.userId;
      tenantId.value = user.tenantId;
      return Promise.resolve();
    }
    return Promise.reject(err);
  };

  // 注销
  const logout = async (): Promise<any> => {
    const logoutRes = await logoutApi();
    token.value = '';
    roles.value = [];
    permissions.value = [];
    deptList.value = [];
    removeToken();
    console.log(logoutRes);
    if (logoutRes.data) {
      // 直接拦截，调整统一登录
      window.location.href = logoutRes.data;
      return;
    }
    return logoutRes;
  };

  const setAvatar = (value: string) => {
    avatar.value = value;
  };

  return {
    userId,
    tenantId,
    token,
    nickname,
    avatar,
    roles,
    permissions,
    deptList,
    login,
    getInfo,
    logout,
    setAvatar
  };
});
