import { toCamelCase } from '@/utils/index';

/**
 * 获取微前端事件操作对象
 * 主应用无需使用
 */
export function getMicroAppEventCenterWindow(microAppCode?: string): any {
  // 判断是否是微前端环境
  if (window.__MICRO_APP_ENVIRONMENT__ || window.__MICRO_APP_BASE_APPLICATION__) {
    // 判断是否是沙箱模式
    if (window.__MICRO_APP_ENVIRONMENT__ && !microAppCode) {
      // 微前端沙箱模式
      const eventCenterWindow = window[`microApp`];
      return eventCenterWindow;
    } else {
      if (!microAppCode) {
        microAppCode = import.meta.env.VITE_APP_MICRO_APP_CODE;
      }
      const microAppCodeCamelCase = toCamelCase(microAppCode, true, false, true);
      // 关闭沙箱后需要自定义事件对象
      const eventCenterWindow = window[`eventCenterFor${microAppCodeCamelCase}`];
      return eventCenterWindow;
    }
  }
  return window[`microApp`];
}
