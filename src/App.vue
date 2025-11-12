<template>
  <el-config-provider :locale="appStore.locale" :size="appStore.size">
    <router-view />
    <!-- 本地环境不开启 -->
    <!--    <check-updates v-if="!localEnv" />-->
  </el-config-provider>
</template>

<script setup lang="ts">
import { getCommonConfigByCode } from '@/api/infra/common/commonConfig';
import { useSettingsStore } from '@/store/modules/settings';
import { handleThemeStyle } from '@/utils/theme';
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore();
// 默认关闭
const localEnv = ref<boolean>(true);

onMounted(async () => {
  await nextTick(async () => {
    localEnv.value = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || import.meta.env.VITE_APP_ENV === 'localDev';
    // localEnv.value = false; // 调试使用
    await nextTick(() => {
      // 初始化主题样式
      handleThemeStyle(useSettingsStore().theme);
    });
    // 替换网站图标和名字等
    const res = await getCommonConfigByCode('SITE_INFO');
    if (res?.data && res?.data?.detail) {
      const detailJson = JSON.parse(res?.data?.detail);
      if (detailJson?.favicon) {
        const link = document.querySelector("link[rel~='icon']");
        if (!link) {
          const favicon = document.createElement('link');
          favicon.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(favicon);
        }
        link.href = detailJson?.favicon;
      }
      if (detailJson?.name) {
        document.title = detailJson?.name;
      }
    }
  });
});
</script>
