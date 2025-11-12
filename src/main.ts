import { createApp } from 'vue';
// global css
import 'virtual:uno.css';
import '@/assets/styles/index.scss';
import 'element-plus/theme-chalk/dark/css-vars.css';

// App、router、store
import App from './App.vue';
import store from './store';
import router from './router';
import { Router } from 'vue-router';

// 自定义指令
import directive from './directive';

// 注册插件
import plugins from './plugins/index'; // plugins

// 高亮组件
// import 'highlight.js/styles/a11y-light.css';
import 'highlight.js/styles/atom-one-dark.css';
import 'highlight.js/lib/common';
import HighLight from '@highlightjs/vue-plugin';

// svg图标
import 'virtual:svg-icons-register';
import ElementIcons from '@/plugins/svgicon';

// permission control
import './permission';

// 国际化
import i18n from '@/lang/index';

// vxeTable
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';
VXETable.setConfig({
  zIndex: 999999
});

// 修改 el-dialog 默认点击遮照为不关闭
import { ElDialog } from 'element-plus';
ElDialog.props.closeOnClickModal.default = false;

// --------------- 微前端子应用相关配置 start --------------- //
import { removeToken, setToken } from '@/utils/auth';
import { useAppStore } from '@/store/modules/app';
import { useSettingsStore } from '@/store/modules/settings';
import { getMicroAppEventCenterWindow } from '@/utils/global';
import { useTagsViewStore } from '@/store/modules/tagsView';

const microAppFlag = import.meta.env.VITE_APP_MICRO_APP_FLAG;
// 微前端应用编码
const microAppCode = import.meta.env.VITE_APP_MICRO_APP_CODE;
// 微前端事件操作对象
const eventCenterWindow = getMicroAppEventCenterWindow();

const app = createApp(App);
app.use(HighLight);
app.use(ElementIcons);
app.use(router);
app.use(store);
app.use(i18n);
app.use(VXETable);
app.use(plugins);
// 自定义指令
directive(app);
app.mount(`#${microAppCode}`);
// console.log('微前端环境值 __MICRO_APP_NAME__', window.__MICRO_APP_NAME__);
// console.log('微前端环境值 __MICRO_APP_ENVIRONMENT__', window.__MICRO_APP_ENVIRONMENT__);
// console.log('微前端环境值 __MICRO_APP_BASE_APPLICATION__', window.__MICRO_APP_BASE_APPLICATION__);
// 微前端环境
if (window.__MICRO_APP_ENVIRONMENT__ || window.__MICRO_APP_BASE_APPLICATION__) {
  console.log(`【${microAppCode}】微前端子应用渲染了！`);
  useSettingsStore().setHideHeader(true);
  useAppStore().toggleSideBarHide(false);
  handleMicroData(router);

  // 监听卸载操作
  window.addEventListener('unmount', function () {
    app.unmount();
    // 卸载所有数据监听函数
    eventCenterWindow?.clearDataListener();
    console.log(`【${microAppCode}】微前端子应用卸载了！`);
  });
} else {
  console.log(`【${microAppCode}】非微前端环境渲染了！`);
  useSettingsStore().setHideHeader(false);
  useAppStore().toggleSideBarHide(false);
}

// 与主应用进行数据交互
function handleMicroData(router: Router) {
  // eventCenterWindow 是主应用添加到window的数据通信对象
  if (eventCenterWindow) {
    // 主动获取主应用下发的数据
    const pullData = eventCenterWindow.getData();
    console.log(`【${microAppCode}】微前端子应用获取到主应用下发的数据`, pullData);
    // 清空tagsView
    useTagsViewStore()
      .delAllViews()
      .then(() => {});
    // 修改界面默认样式
    useSettingsStore().setHideHeader(true);
    useAppStore().toggleSideBarHide(false);
    if ((pullData?.type as string) === 'baseDataInfo') {
      const token = pullData?.authInfo?.token as string;
      // 保存
      setToken(token);
    }

    // 监听主应用下发的数据变化
    eventCenterWindow.addDataListener((data: Record<string, unknown>) => {
      console.log(`【${microAppCode}】微前端子应用监听主应用下发的数据`, data);

      if (data.path && typeof data.path === 'string') {
        data.path = data.path.replace(/^#/, '');
        // 当主应用下发path时进行跳转
        if (data.path && data.path !== router.currentRoute.value.path) {
          router.push(data.path as string).then(() => {});
        }
      }
    });

    // 监听主应用下发的全局数据变化
    eventCenterWindow.addGlobalDataListener((data: Record<string, unknown>) => {
      console.log(`【${microAppCode}】微前端子应用监听主应用下发的全局数据`, data);
      if (data.type === 'sideBarShow') {
        console.log(`【${microAppCode}】微前端子应用执行显示sideBar`);
        useAppStore().toggleSideBarHide(false);
      }
      if (data.type === 'sideBarHide') {
        console.log(`【${microAppCode}】微前端子应用执行隐藏sideBar`);
        useAppStore().toggleSideBarHide(true);
      }
      if (data.type === 'logout') {
        console.log(`【${microAppCode}】微前端子应用执行退出登录`);
        removeToken();
      }
      if (data.type === 'changeRoute') {
        if (data?.target === microAppCode) {
          console.log(`【${microAppCode}】微前端子应用执行路由切换`);
          useAppStore().toggleSideBarHide(false);
          router.push(data?.data?.path as string).then(() => {});
        }
      }
    });

    // 向主应用发送数据
    setTimeout(() => {
      console.log(`【${microAppCode}】微前端子应用向主应用发送数据`);
      eventCenterWindow.dispatch({
        source: microAppCode,
        data: microAppCode
      });
    }, 1000);
  }
}

// --------------- 微前端子应用相关配置 end --------------- //
