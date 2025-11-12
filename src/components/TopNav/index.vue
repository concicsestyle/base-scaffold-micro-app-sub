<template>
  <!-- 横向子菜单 -->
  <div class="horizontal-menu">
    <div v-for="(item, index) in topMenus" :key="index" @click="handleSelect(item.path)">
      <div class="menu-item" v-if="index < visibleNumber" :class="{ 'menu-item-active': currentIndex === item.path }">
        <div class="menu-item-content">
          <svg-icon
            v-if="item.meta && item.meta.icon && item.meta.icon !== '#' && !item.meta.icon?.startsWith('http')"
            :icon-class="item.meta ? item.meta.icon : ''"
            :color="currentIndex === item.path ? '#0075C2' : '#4e5969'"
          />
          <img v-else :src="item.meta.icon" style="height: 20px; width: 20px" alt="" />
          <span>{{ item.meta?.title }}</span>
        </div>
      </div>
    </div>
    <div v-if="topMenus.length > visibleNumber">
      <el-popover class="box-item" placement="bottom" trigger="hover" width="868">
        <template #reference>
          <div class="menu-item">
            <svg-icon icon-class="more" />
            <span>更多菜单</span>
          </div>
        </template>
        <div class="more-container">
          <div v-for="(item, index) in topMenus" :key="index" class="more-menu-item" @click="handleSelect(item.path)">
            <svg-icon :icon-class="item.meta ? item.meta.icon : ''" size="14px" />
            <span style="font-size: 14px">{{ item.meta?.title }}</span>
          </div>
        </div>
      </el-popover>
    </div>
  </div>

  <!--<el-menu :default-active="activeMenu" mode="horizontal" :ellipsis="false" @select="handleSelect">-->
  <!--  &lt;!&ndash;<div class="logo-div" @click="goToExternalLink">&ndash;&gt;-->
  <!--  &lt;!&ndash;  <img src="@/assets/images/menuLog.png" style="height: 80px; width: 180px" />&ndash;&gt;-->
  <!--  &lt;!&ndash;</div>&ndash;&gt;-->
  <!--  <template v-for="(item, index) in topMenus">-->
  <!--    <el-menu-item style="" v-if="index < visibleNumber" :key="index" :style="{ '&#45;&#45;theme': theme }" :index="item.path">-->
  <!--      <svg-icon-->
  <!--        v-if="item.meta && item.meta.icon && item.meta.icon !== '#' && !item.meta.icon?.startsWith('http')"-->
  <!--        :icon-class="item.meta ? item.meta.icon : ''"-->
  <!--      />-->
  <!--      <img v-else :src="item.meta.icon" style="height: 20px; width: 20px" />-->
  <!--      <span class="mr-2"></span>{{ item.meta?.title }}-->
  <!--    </el-menu-item>-->
  <!--  </template>-->

  <!--  &lt;!&ndash; 顶部菜单超出数量折叠 &ndash;&gt;-->
  <!--  <el-sub-menu v-if="topMenus.length > visibleNumber" :style="{ '&#45;&#45;theme': theme }" index="more" style="margin-left: 10px">-->
  <!--    <template #title><span style="font-size: 18px">更多菜单</span></template>-->
  <!--    <template v-for="(item, index) in topMenus">-->
  <!--      <el-menu-item v-if="index >= visibleNumber" :key="index" :index="item.path">-->
  <!--        <svg-icon :icon-class="item.meta ? item.meta.icon : ''" style="height: 20px; width: 20px" />-->
  <!--        <span class="mr-2"></span>{{ item.meta?.title }}-->
  <!--      </el-menu-item>-->
  <!--    </template>-->
  <!--  </el-sub-menu>-->
  <!--</el-menu>-->
</template>

<script setup lang="ts">
import { constantRoutes } from '@/router';
import { isHttp } from '@/utils/validate';
import { useAppStore } from '@/store/modules/app';
import { useSettingsStore } from '@/store/modules/settings';
import { usePermissionStore } from '@/store/modules/permission';
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router';
import { useSubMicroAppRouter } from '@/composables/useSubMicroAppRouter';
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import SvgIcon from '@/components/SvgIcon/index.vue';

// 顶部栏初始数
const visibleNumber = ref<number>(-1);
// 当前激活菜单的 index
const currentIndex = ref<string>();
// 隐藏侧边栏路由
const hideList = ['/index', '/adminUser/profile'];

const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const route = useRoute();
const router = useRouter();

// 主题颜色
const theme = computed(() => settingsStore.theme);
// 所有的路由信息
const routers = computed(() => permissionStore.getTopbarRoutes());

// 顶部显示菜单
const topMenus = computed(() => {
  const topMenus: RouteRecordRaw[] = [];
  routers.value.map((menu) => {
    if (menu.hidden !== true) {
      // 兼容顶部栏一级菜单内部跳转
      if (menu.path === '/' && menu.children) {
        topMenus.push(menu.children ? menu.children[0] : menu);
      } else {
        topMenus.push(menu);
      }
    }
  });
  return topMenus;
});

// 设置子路由
const childrenMenus = computed(() => {
  const childrenMenus: RouteRecordRaw[] = [];
  routers.value.map((router) => {
    router.children?.forEach((item) => {
      if (item.parentPath === undefined) {
        if (router.path === '/') {
          item.path = '/' + item.path;
        } else {
          if (!isHttp(item.path)) {
            item.path = router.path + '/' + item.path;
          }
        }
        item.parentPath = router.path;
      }
      childrenMenus.push(item);
    });
  });
  return constantRoutes.concat(childrenMenus);
});

// 默认激活的菜单
const activeMenu = computed(() => {
  let path = route.path;
  if (path === '/index') {
    path = '/infra/adminUser';
  }
  let activePath = path;
  if (path !== undefined && path.lastIndexOf('/') > 0 && hideList.indexOf(path) === -1) {
    const tmpPath = path.substring(1, path.length);
    if (!route.meta.link) {
      activePath = '/' + tmpPath.substring(0, tmpPath.indexOf('/'));
      appStore.toggleSideBarHide(false);
    }
  } else if (!route.children) {
    activePath = path;
    appStore.toggleSideBarHide(true);
  }
  activeRoutes(activePath);
  return activePath;
});

const setVisibleNumber = () => {
  const width = document.body.getBoundingClientRect().width / 3;
  visibleNumber.value = parseInt(String(width / 85));
};

// 获取微应用路由跳转工具
const { navigateToMicroApp } = useSubMicroAppRouter();

/**
 * 处理菜单选择 - 支持微应用路由跳转和 meta/link 跳转
 */
const handleSelect = (key: string) => {
  console.log('🔍 菜单项点击:', { key, route: routers.value.find((item) => item.path === key) });
  currentIndex.value = key;
  const route = routers.value.find((item) => item.path === key);
//   判断是不是基座的菜单
  if(['管理端','基础设施','工作流'].includes(route?.menuDetail?.menuName)){
    window.location.href = import.meta.env.VITE_APP_SERVER_BASEURL_MAIN;
    return
  }
  // 优先检查是否有 meta/link 配置
  if (route?.meta?.link) {
    console.log('🔍 发现 meta.link，调用 handleLinkNavigation');
    handleLinkNavigation(route.meta.link);
    return;
  }

  // 检查是否为微应用路由跳转
  if (isMicroAppRoute(key)) {
    handleMicroAppNavigation(key, route);
    return;
  }

  if (isHttp(key)) {
    // http(s):// 路径直接重定向到当前窗口
    window.location.href = key;
  } else if (!route || !route.children) {
    // 没有子路由路径内部打开
    const routeMenu = childrenMenus.value.find((item) => item.path === key);
    if (routeMenu && routeMenu.query) {
      const query = JSON.parse(routeMenu.query);
      router.push({ path: key, query: query });
    } else {
      router.push({ path: key });
    }
    appStore.toggleSideBarHide(true);
  } else {
    // 显示左侧联动菜单
    activeRoutes(key);
    appStore.toggleSideBarHide(false);
  }
};

/**
 * 处理 meta/link 跳转
 */
const handleLinkNavigation = (link: string) => {
  try {
    console.log('🔍 子应用菜单点击链接:', link);
    console.log('🔍 handleLinkNavigation 被调用');
    
    // 检查是否为外部链接
    if (isHttp(link)) {
      // 检查是否为微应用链接
      if (link.includes('/sub-micro-app-')) {
        console.log('🔍 检测到微应用链接，准备跳转:', link);
        
        // 使用微应用路由跳转工具
        const { targetApp, targetPath } = parseMicroAppLink(link);
        if (targetApp && targetPath) {
          navigateToMicroApp(targetApp, targetPath);
          console.log(`🔍 跳转到微应用: ${targetApp}, 路径: ${targetPath}`);
        } else {
          // 如果解析失败，直接跳转
          window.location.href = link;
          console.log(`🔍 直接跳转到微应用: ${link}`);
        }
        return;
      }
      
      // 其他外部链接直接重定向到当前窗口
      window.location.href = link;
      console.log(`🔍 重定向到外部链接: ${link}`);
    } else {
      // 内部路由跳转
      router.push({ path: link });
      appStore.toggleSideBarHide(true);
      console.log(`🔍 跳转到内部路由: ${link}`);
    }
  } catch (error) {
    console.error('❌ 链接跳转失败:', error);
  }
};

/**
 * 解析微应用链接
 */
const parseMicroAppLink = (link: string): { targetApp: string; targetPath: string } => {
  try {
    const url = new URL(link);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    
    if (pathSegments.length >= 1) {
      const targetApp = pathSegments[0]; // 如 sub-micro-app-ips
      let targetPath = '/' + pathSegments.slice(1).join('/');

      // 规范化：去掉重复的微应用前缀，例如 /sub-micro-app-ips/sub-micro-app-ips/product → /sub-micro-app-ips/product
      const duplicatePrefix = `/${targetApp}/`;
      while (targetPath.startsWith(duplicatePrefix)) {
        targetPath = targetPath.slice(duplicatePrefix.length - 1);
      }

      // 如果 targetPath 仍然以 /sub-micro-app-xxx 开头，去掉微应用前缀，仅保留业务段
      if (targetPath.startsWith(`/${targetApp}/`)) {
        targetPath = targetPath.replace(`/${targetApp}`, '');
      }

      return { targetApp, targetPath };
    }
    
    return { targetApp: '', targetPath: '' };
  } catch (error) {
    console.error('❌ 解析微应用链接失败:', error);
    return { targetApp: '', targetPath: '' };
  }
};

/**
 * 处理微应用路由跳转
 */
const handleMicroAppNavigation = (key: string, route: any) => {
  try {
    // 解析微应用路径
    const pathSegments = key.split('/').filter(Boolean);
    
    if (pathSegments.length < 1) {
      console.error('微应用路由格式错误:', key);
      return;
    }
    
    const targetApp = pathSegments[0]; // 如: sub-micro-app-basic
    let targetPath = '/'; // 默认路径
    
    // 如果有子路径，构建完整路径
    if (pathSegments.length > 1) {
      // 跳过第一个微应用名称，构建子路径
      const subPath = pathSegments.slice(1).join('/');
      targetPath = '/' + subPath;
    }
    
    // 使用微应用路由跳转工具
    navigateToMicroApp(targetApp, targetPath);
    
    // 更新侧边栏状态
    appStore.toggleSideBarHide(true);
    
    console.log(`跳转到微应用: ${targetApp}, 路径: ${targetPath}`);
  } catch (error) {
    console.error('微应用路由跳转失败:', error);
  }
};

/**
 * 检查是否为微应用路由跳转（只有没有子菜单的微应用路由才需要跳转）
 */
const isMicroAppRoute = (path: string): boolean => {
  // 只有以 /sub-micro-app- 开头且没有子菜单的路由才需要跳转
  if (path.startsWith('/sub-micro-app-')) {
    const route = routers.value.find((item) => item.path === path);
    // 如果没有子菜单，则需要跳转到微应用
    return !route || !route.children || route.children.length === 0;
  }
  
  return false;
};

const activeRoutes = (key: string) => {
  const routes: RouteRecordRaw[] = [];
  if (childrenMenus.value && childrenMenus.value.length > 0) {
    childrenMenus.value.map((item) => {
      if (key == item.parentPath || (key == 'index' && '' == item.path)) {
        routes.push(item);
      }
    });
  }
  if (routes.length > 0) {
    permissionStore.setSidebarRouters(routes);
  } else {
    appStore.toggleSideBarHide(true);
  }
  return routes;
};

onMounted(() => {
  window.addEventListener('resize', setVisibleNumber);
  setVisibleNumber();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', setVisibleNumber);
});
</script>

<style lang="scss">
.topmenu-container.el-menu--horizontal > .el-menu-item {
  float: left;
  height: 80px !important;
  line-height: 80px !important;
  color: #999093 !important;
  padding: 0 5px !important;
  margin: 0 16px !important;
  font-size: 18px !important;
}

.topmenu-container.el-menu--horizontal > .el-menu-item.is-active,
.el-menu--horizontal > .el-sub-menu.is-active .el-submenu__title {
  border-bottom: 2px solid #{'var(--theme)'} !important;
  color: #303133;
}

/* sub-adminMenu item */
.topmenu-container.el-menu--horizontal > .el-sub-menu .el-sub-menu__title {
  float: left;
  height: 80px !important;
  line-height: 80px !important;
  color: #999093 !important;
  padding: 0 5px !important;
  margin: 0 10px !important;
}

/* 背景色隐藏 */
.topmenu-container.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
.topmenu-container.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.topmenu-container.el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  background-color: #ffffff !important;
}

/* 图标右间距 */
.topmenu-container .svg-icon {
  margin-right: 4px;
}

.el-menu--horizontal.el-menu {
  border: none !important;
}

.el-menu--popup-container {
  .el-menu-item {
    height: 50px !important;
    line-height: 50px !important;
    color: #999093 !important;
    padding: 0 5px !important;
    margin: 0 16px !important;
    font-size: 18px !important;
  }
}
</style>
<style lang="scss" scoped>
@use '@/assets/styles/variables.module.scss' as *;

.horizontal-menu {
  height: calc($base-navbar-height - 2 * 10px); /* 10px: padding-top */
  margin-left: calc(118px + 68px); /* 118px: logo宽度 68px: 间距 */
  display: flex;
  gap: 12px;
  align-items: center;

  .menu-item {
    display: flex;
    padding: 5px 10px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    border-radius: 2px;
    color: var(--color-text-5);
    cursor: pointer;

    .menu-item-content {
      display: flex;
      align-items: center;
      color: inherit;
    }

    &:hover {
      background-color: var(--color-primary-plain);
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 22px; /* 157.143% */
    }
  }

  .menu-item-active {
    background-color: var(--color-primary-plain);
    color: var(--color-primary);
  }
}

.more-container {
  width: 868px;
  height: 218px;
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  gap: 12px;
  padding: 10px;
  align-items: start;

  .more-menu-item {
    display: flex;
    padding: 5px 10px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    border-radius: 2px;
    color: var(--color-text-5);
    cursor: pointer;

    &:hover {
      background-color: var(--color-primary-plain);
      color: var(--color-primary);
    }
  }
}

.logo-div {
  background-color: #121e44;
  height: 80px;
  width: 180px;
  margin-right: 16px;
  position: relative; /* 为伪元素提供定位基准 */
  overflow: hidden; /* 限制渐变在元素内 */
}

.logo-div::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  /* 从下至顶的渐变：底部半透明白色，向上逐渐变透明 */
  background: linear-gradient(to top, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none; /* 不影响点击事件（确保@click正常触发） */
  z-index: 1; /* 保证渐变在图片上方 */
}
</style>
