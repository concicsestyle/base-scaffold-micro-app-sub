<template>
  <div :class="{ 'has-logo': showLogo }" :style="{ backgroundColor: bgColor }">
<!--    <div v-if="showLogo">-->
<!--      <div v-if="appStore.sidebar.opened" style="width: 180px; height: 80px">-->
<!--        <img src="@/assets/images/menuLog.png" alt="" style="width: 180px; height: 80px" @click="goToExternalLink" />-->
<!--      </div>-->
<!--    </div>-->
    <!--    <logo v-if="showLogo" :collapse="isCollapse" />-->
    <el-scrollbar :class="sideTheme" wrap-class="scrollbar-wrapper">
      <transition :enter-active-class="proxy?.animate.menuSearchAnimate.enter" mode="out-in">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :background-color="bgColor"
          :text-color="textColor"
          :unique-opened="true"
          :active-text-color="theme"
          :collapse-transition="false"
          mode="vertical"
        >
          <sidebar-item v-for="(r, index) in sidebarRouters" :key="r.path + index" :item="r" :base-path="r.path" />
        </el-menu>
      </transition>
    </el-scrollbar>
    <div class="flex">
      <hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container" @toggle-click="toggleSideBar" />
      <div style="width: 60px">收起菜单</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from './Logo.vue';
import SidebarItem from './SidebarItem.vue';
import variables from '@/assets/styles/variables.module.scss';
import { useAppStore } from '@/store/modules/app';
import { useSettingsStore } from '@/store/modules/settings';
import { usePermissionStore } from '@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { Action } from 'element-plus';
const portalUrl = ref(import.meta.env.VITE_APP_BASE_PLATFORM_PORTAL_URL);

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const route = useRoute();
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const sidebarRouters = computed<RouteRecordRaw[]>(() => permissionStore.getSidebarRoutes());
const showLogo = computed(() => settingsStore.sidebarLogo);
const sideTheme = computed(() => settingsStore.sideTheme);
const theme = computed(() => settingsStore.theme);
const isCollapse = computed(() => !appStore.sidebar.opened);

const toggleSideBar = () => {
  appStore.toggleSideBar(false);
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

const activeMenu = computed(() => {
  const { meta, path } = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});

const bgColor = computed(() => (sideTheme.value === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground));
const textColor = computed(() => (sideTheme.value === 'theme-dark' ? variables.menuColor : variables.menuLightColor));
</script>
