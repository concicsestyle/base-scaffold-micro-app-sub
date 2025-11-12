<template>
  <div>
    <div style="height: 68vh" class="iframe-wrapper">
      <iframe :src="iframeUrl" style="width: 100%; height: 100%" frameborder="0" scrolling="no" class="custom-iframe" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getToken } from '@/utils/auth';
import { globalBaseUrl } from '@/utils/request';

// Props 定义方式变化
const props = defineProps({
  insId: {
    type: [String, Number],
    default: null
  }
});

const iframeUrl = ref('');
const appShortName = import.meta.env.VITE_APP_SHORT_APP_NAME;
const tokenKey = 'Authorization-' + appShortName;

onMounted(async () => {
  const url = globalBaseUrl() + `/warm-flow-ui/index.html?id=${props.insId}&type=FlowChart`;
  iframeUrl.value = url + `&${tokenKey}=Bearer ` + getToken() + '&clientId=' + import.meta.env.VITE_APP_CLIENT_ID;
});
</script>
<style scoped>
.iframe-wrapper {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.custom-iframe {
  width: 100%;
  border: none;
  background: transparent;
}
</style>
