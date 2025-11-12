<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { ElMessageBox } from 'element-plus';

interface Props {
  // 轮训时间，分钟
  checkUpdatesInterval?: number;
  // 检查更新的地址
  checkUpdateUrl?: string;
}

defineOptions({ name: 'CheckUpdates' });

const props = withDefaults(defineProps<Props>(), {
  checkUpdatesInterval: 5,
  checkUpdateUrl: import.meta.env.VITE_APP_APP_BASEURL + '/' || '/'
});

let isCheckingUpdates = false;
const currentVersionTag = ref('');
const lastVersionTag = ref('');
const timer = ref<ReturnType<typeof setInterval>>();
const appWebShortName = import.meta.env.VITE_APP_WEB_SHORT_APP_NAME
  ? import.meta.env.VITE_APP_WEB_SHORT_APP_NAME
  : import.meta.env.VITE_APP_SHORT_APP_NAME;
const lastVersionTagKey = ref('lastVersionTag-' + appWebShortName);

const open = () => {
  ElMessageBox.confirm('点击刷新以获取最新版本?', '新版本可用', {
    confirmButtonText: '刷新',
    cancelButtonText: '取消',
    type: 'success',
    draggable: true
  })
    .then(() => {
      lastVersionTag.value = currentVersionTag.value;
      localStorage.setItem(lastVersionTagKey.value, lastVersionTag.value);
      window.location.reload();
    })
    .catch(() => {});
};

async function getVersionTag() {
  try {
    // if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    //   return null;
    // }
    const response = await fetch(props.checkUpdateUrl, {
      cache: 'no-cache',
      method: 'HEAD'
    });
    return response.headers.get('etag') || response.headers.get('last-modified');
  } catch {
    console.error('Failed to fetch version tag');
    return null;
  }
}

async function checkForUpdates() {
  const versionTag = await getVersionTag();
  if (!versionTag) {
    return;
  }
  // 首次运行时不提示更新
  if (!lastVersionTag.value) {
    lastVersionTag.value = versionTag;
    localStorage.setItem(lastVersionTagKey.value, lastVersionTag.value);
    return;
  }
  if (lastVersionTag.value !== versionTag && versionTag) {
    clearInterval(timer.value);
    handleNotice(versionTag);
  }
}
function handleNotice(versionTag: string) {
  currentVersionTag.value = versionTag;
  open();
}

function start() {
  if (props.checkUpdatesInterval <= 0) {
    return;
  }
  // 每 checkUpdatesInterval(默认值为1) 分钟检查一次
  timer.value = setInterval(checkForUpdates, props.checkUpdatesInterval * 60 * 1000);
}

function handleVisibilitychange() {
  if (document.hidden) {
    stop();
  } else {
    if (!isCheckingUpdates) {
      isCheckingUpdates = true;
      checkForUpdates().finally(() => {
        isCheckingUpdates = false;
        start();
      });
    }
  }
}

function stop() {
  clearInterval(timer.value);
}

onMounted(() => {
  // 从缓存获取最新版本
  lastVersionTag.value = localStorage.getItem(lastVersionTagKey.value) || '';
  start();
  document.addEventListener('visibilitychange', handleVisibilitychange);
});

onUnmounted(() => {
  stop();
  document.removeEventListener('visibilitychange', handleVisibilitychange);
});
</script>
