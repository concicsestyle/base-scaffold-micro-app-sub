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
      <el-popover class="box-item" placement="bottom" trigger="click" width="868">
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
  <!--  <el-sub-menu v-if="topMenus.length > visibleNumber" :style="{ '&#45;&#45;theme': theme }" index="more">-->
  <!--    <template #title>更多菜单</template>-->
  <!--    <template v-for="(item, index) in topMenus">-->
  <!--      <el-menu-item v-if="index >= visibleNumber" :key="index" :index="item.path"-->
  <!--        ><svg-icon :icon-class="item.meta ? item.meta.icon : ''" /> {{ item.meta?.title }}</el-menu-item-->
  <!--      >-->
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
import { RouteRecordRaw } from 'vue-router';
import { Action } from 'element-plus';
import { useUserStore } from '@/store/modules/user';

// 顶部栏初始数
const visibleNumber = ref<number>(-1);
// 当前激活菜单的 index
const currentIndex = ref<string>();
// 隐藏侧边栏路由
const hideList = ['/index', '/adminUser/profile'];

const appStore = useAppStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const route = useRoute();
const router = useRouter();

// 主题颜色
const theme = computed(() => settingsStore.theme);
// 所有的路由信息
const routers = computed(() => permissionStore.getTopbarRoutes());
const portalUrl = ref(import.meta.env.VITE_APP_BASE_PLATFORM_PORTAL_URL);
// 微前端应用编码
const microAppCode = import.meta.env.VITE_APP_MICRO_APP_CODE;

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
  // 默认激活第一个菜单
  activeMenuV2();
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

// 默认激活菜单
const activeMenuV2 = () => {
  let path = route.path;
  const activeCode = route.query?.active;
  let hasPermissionPath = false;
  if (activeCode) {
    // 找到routers中对应的菜单
    for (const perRoute of routers.value) {
      if (perRoute.path === activeCode) {
        path = perRoute.path;
        hasPermissionPath = true;
        break;
      }
    }
  } else {
    if (path === '/index') {
      // 没有指定激活的菜单的话则默认激活第一个hide为false的菜单
      for (const perRoute of routers.value) {
        if (!perRoute.hidden) {
          hasPermissionPath = true;
          path = perRoute.path;
          break;
        }
      }
    } else {
      // 判断路由的第一层code是否存在，不存在则默认跳转至首页
      const firstPath = path.substring(0, path.indexOf('/', 1));
      for (const perRoute of routers.value) {
        if (perRoute.path === firstPath) {
          hasPermissionPath = true;
          break;
        }
      }
    }
  }
  if (!hasPermissionPath) {
    if (path === '/adminUser/profile') {
      // 个人中心单独处理
      path = '/adminManage/index';
    } else {
      // 未找到菜单权限，则跳转至母应用的首页
      path = '/index';
    }
  }

  // if (path === '/index') {
  //   path = '/adminManage/index';
  // }
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
  // appStore.toggleSideBarHide(true);
  activeRoutes(activePath);
  handleSelect(activePath);
};

// 默认激活的菜单
const activeMenu = computed(() => {
  let path = route.path;
  if (path === '/index') {
    path = `/${microAppCode}/index`;
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

const handleSelect = (key: string) => {
  currentIndex.value = key;
  const route = routers.value.find((item) => item.path === key);
  if (isHttp(key)) {
    // http(s):// 路径新窗口打开
    window.open(key, '_blank');
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

const goToExternalLink = () => {
  console.log('goToExternalLink portalUrl.value', portalUrl.value);
  ElMessageBox.confirm('请选择基础平台门户跳转方式', '即将跳转至基础平台门户', {
    confirmButtonText: '当前窗口',
    cancelButtonText: '新窗口',
    distinguishCancelAndClose: true,
    type: 'warning',
    center: true
  })
    .then((v) => {
      window.open(portalUrl.value, '_self');
    })
    .catch((action: Action) => {
      if (action === 'cancel') {
        window.open(portalUrl.value, '_blank');
      }
    });
};

onMounted(() => {
  window.addEventListener('resize', setVisibleNumber);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', setVisibleNumber);
});

onMounted(() => {
  setVisibleNumber();
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
