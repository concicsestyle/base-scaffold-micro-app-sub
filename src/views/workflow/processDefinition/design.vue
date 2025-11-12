<template>
  <div ref="container" class="w-full h-[calc(100vh-88px)]">
    <iframe ref="iframe" :src="iframeUrl" frameborder="0" height="100%" style="height: 100%; width: inherit"></iframe>
  </div>
</template>

<script setup name="WarmFlow" lang="ts">
const { proxy } = getCurrentInstance();
import { onMounted } from 'vue';
import { getToken } from '@/utils/auth';
import { globalBaseUrl } from '@/utils/request';

// definitionId为需要查询的流程定义id，
// disabled为是否可编辑, 例如：查看的时候不可编辑，不可保存
const iframeUrl = ref('');
const appShortName = import.meta.env.VITE_APP_SHORT_APP_NAME;
const tokenKey = 'Authorization-' + appShortName;

const iframeLoaded = () => {
  // iframe监听组件内设计器保存事件
  window.onmessage = (event) => {
    switch (event.data.method) {
      case 'close':
        close();
        break;
    }
  };
};
const open = async (definitionId, disabled) => {
  const url = globalBaseUrl() + `/warm-flow-ui/index.html?id=${definitionId}&disabled=${disabled}`;
  iframeUrl.value = url + `&${tokenKey}=Bearer ` + getToken() + '&clientId=' + import.meta.env.VITE_APP_CLIENT_ID;
};
/** 关闭按钮 */
function close() {
  const obj = { path: '/workflow/workflowEngine/processDefinition', query: { activeName: proxy.$route.query.activeName } };
  proxy.$tab.closeOpenPage(obj);
}

onMounted(() => {
  iframeLoaded();
  open(proxy.$route.query.definitionId, proxy.$route.query.disabled);
});
/**
 * 对外暴露子组件方法
 */
defineExpose({
  open
});
</script>
