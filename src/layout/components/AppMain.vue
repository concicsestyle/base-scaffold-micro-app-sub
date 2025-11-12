<template>
  <section class="sub-app-main" :class="{ 'sub-app-main-hideHeader': !hideHeader }">
    <router-view v-slot="{ Component, route }">
      <transition v-if="!route.meta.noCache" :enter-active-class="animate" mode="out-in">
        <keep-alive v-if="!route.meta.noCache" :include="tagsViewStore.cachedViews">
          <component :is="Component" v-if="!route.meta.link" :key="route.path" />
        </keep-alive>
      </transition>
      <transition v-if="route.meta.noCache" :enter-active-class="animate" mode="out-in">
        <component :is="Component" v-if="!route.meta.link && route.meta.noCache" :key="route.path" />
      </transition>
    </router-view>
    <iframe-toggle />
  </section>
</template>

<script setup name="AppMain" lang="ts">
import { useSettingsStore } from '@/store/modules/settings';
import { useTagsViewStore } from '@/store/modules/tagsView';

import IframeToggle from './IframeToggle/index.vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const route = useRoute();
const tagsViewStore = useTagsViewStore();
const hideHeader = computed(() => useSettingsStore().hideHeader);

// 随机动画集合
const animate = ref<string>('');
const animationEnable = ref(useSettingsStore().animationEnable);
watch(
  () => useSettingsStore().animationEnable,
  (val: boolean) => {
    animationEnable.value = val;
    if (val) {
      animate.value = proxy?.animate.animateList[Math.round(Math.random() * proxy?.animate.animateList.length)] as string;
    } else {
      animate.value = proxy?.animate.defaultAnimate as string;
    }
  },
  { immediate: true }
);

onMounted(() => {
  addIframe();
});

watchEffect(() => {
  addIframe();
});

function addIframe() {
  if (route.meta.link) {
    useTagsViewStore().addIframeView(route);
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.module.scss' as *;

.sub-app-main {
  /* 60= navbar  34=tagsView  20=margin  */
  height: calc(100vh - 60px - 34px - 2 * 20px);
  min-height: calc(100vh - 60px - 34px - 2 * 20px);
  position: relative;
  overflow: auto;
  background-color: #ffffff;
}

.sub-app-main-hideHeader {
  //margin-left: $base-sidebar-width !important;
}

.fixed-header + .sub-app-main {
  padding-top: 80px;
}

.hasTagsView {
  .sub-app-main {
    /* 84 = navbar + tags-view + padding * 2 = 60 + 34 + 20 * 2 */
    min-height: calc(100vh - 134px);
  }

  .fixed-header + .sub-app-main {
    padding-top: 114px;
  }
}
</style>
<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 6px;
  }
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 3px;
}
</style>
