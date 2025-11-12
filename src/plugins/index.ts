import modal from './modal';
import tab from './tab';
import download from './download';
import cache from './cache';
import auth from './auth';
// 预设动画
import animate from '@/animate';

import { download as dl } from '@/utils/request';
import { useDict } from '@/utils/dict';
import { getAdminConfigKey, updateAdminConfigByKey } from '@/api/infra/admin/adminConfig';
import { getAppConfigKey, updateAppConfigByKey } from '@/api/infra/app/appConfig';
import { getPortalConfigKey, updatePortalConfigByKey } from '@/api/infra/portal/portalConfig';
import { parseTime, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '@/utils/common';

import { App } from 'vue';

export default function installPlugin(app: App) {
  // 页签操作
  app.config.globalProperties.$tab = tab;

  // 模态框对象
  app.config.globalProperties.$modal = modal;

  // 缓存对象
  app.config.globalProperties.$cache = cache;

  // 下载文件
  app.config.globalProperties.$download = download;

  // 认证对象
  app.config.globalProperties.$auth = auth;

  // 全局方法挂载
  app.config.globalProperties.useDict = useDict;
  app.config.globalProperties.download = dl;
  app.config.globalProperties.parseTime = parseTime;
  app.config.globalProperties.handleTree = handleTree;
  app.config.globalProperties.addDateRange = addDateRange;
  app.config.globalProperties.selectDictLabel = selectDictLabel;
  app.config.globalProperties.selectDictLabels = selectDictLabels;
  app.config.globalProperties.getAdminConfigKey = getAdminConfigKey;
  app.config.globalProperties.updateAdminConfigByKey = updateAdminConfigByKey;
  app.config.globalProperties.getAppConfigKey = getAppConfigKey;
  app.config.globalProperties.updateAppConfigByKey = updateAppConfigByKey;
  app.config.globalProperties.getPortalConfigKey = getPortalConfigKey;
  app.config.globalProperties.updatePortalConfigByKey = updatePortalConfigByKey;
  app.config.globalProperties.animate = animate;
}
