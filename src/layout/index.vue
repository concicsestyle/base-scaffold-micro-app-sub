<template>
  <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <div :class="{ sidebarHide: sidebar.hide, 'main-container-hideHeader': !hideHeader, hasTagsView: needTagsView }">
      <!-- <el-scrollbar>
        <div :class="{ 'fixed-header': fixedHeader }">
          <navbar ref="navbarRef" @setLayout="setLayout" />
          <tags-view v-if="needTagsView" />
        </div>
        <app-main />
        <settings ref="settingRef" />
      </el-scrollbar> -->
      <navbar ref="navbarRef" v-if="!hideHeader" @set-layout="setLayout" />
      <div class="flex sub-main-container">
        <!--<side-bar v-if="!sidebar.hide" class="sidebar-container" :class="{ sidebarHasTagsView: needTagsView }" />-->
        <side-bar v-show="!sidebar.hide" class="sub-sidebar-container" />
        <div class="sub-main-content" :class="sidebar.hide ? '' : 'mrt-20'">
          <div v-show="!hideHeader">
            <tags-view v-if="needTagsView" />
          </div>
          <app-main />
        </div>
      </div>
      <!--<div v-show="!hideHeader">-->
      <!--  <tags-view v-if="needTagsView" />-->
      <!--</div>-->
      <!--<app-main />-->
      <settings ref="settingRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SideBar from './components/Sidebar/index.vue';
import { AppMain, Navbar, Settings, TagsView } from './components';
import { useAppStore } from '@/store/modules/app';
import { useSettingsStore } from '@/store/modules/settings';
import { initWebSocket } from '@/utils/websocket';
import { initSSE } from '@/utils/sse';

const settingsStore = useSettingsStore();
const theme = computed(() => settingsStore.theme);
const sidebar = computed(() => useAppStore().sidebar);
const device = computed(() => useAppStore().device);
const needTagsView = computed(() => settingsStore.tagsView);
const fixedHeader = computed(() => settingsStore.fixedHeader);
const hideHeader = computed(() => settingsStore.hideHeader);

const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === 'mobile'
}));

const { width } = useWindowSize();
const WIDTH = 992; // refer to Bootstrap's responsive design

watchEffect(() => {
  // if (device.value === 'mobile' && sidebar.value.opened) {
  //   useAppStore().closeSideBar({ withoutAnimation: false });
  // }
  // if (width.value - 1 < WIDTH) {
  //   useAppStore().toggleDevice('mobile');
  //   useAppStore().closeSideBar({ withoutAnimation: true });
  // } else {
  //   useAppStore().toggleDevice('desktop');
  // }
});

const navbarRef = ref<InstanceType<typeof Navbar>>();
const settingRef = ref<InstanceType<typeof Settings>>();

onMounted(() => {
  nextTick(() => {
    navbarRef.value?.initTenantList();
    navbarRef.value?.initCurDept();
  });
});

onMounted(() => {
  initWebSocket(import.meta.env.VITE_APP_WEBSOCKET_URL);
});

onMounted(() => {
  initSSE(import.meta.env.VITE_APP_SSE_URL);
});

const handleClickOutside = () => {
  useAppStore().closeSideBar({ withoutAnimation: false });
};

const setLayout = () => {
  settingRef.value?.openSetting();
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/mixin.scss';
@use '@/assets/styles/variables.module.scss' as *;

.app-wrapper {
  @include mixin.clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  background-color: var(--bg-fill-3);

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  //width: calc(100% - #{$base-sidebar-width});
  width: 100%;
  transition: width 0.28s;
  background: $fixed-header-bg;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.sidebarHide .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}

.sidebarHasTagsView {
  top: 114px !important;
  //top: 80px !important;
}

.main-container-hideHeader {
  margin-left: 0 !important;
}
</style>
