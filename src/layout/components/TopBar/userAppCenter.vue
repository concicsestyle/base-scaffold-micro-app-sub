<template>
  <div>
    <el-dialog
      v-model="showDialog"
      center
      title="我的应用"
      destroy-on-close
      close-on-click-modal
      width="1200px"
      @close="closeDialog"
      class="app-dialog"
    >
      <!-- 应用分类标签 -->
      <div class="category-tabs flex gap-6 text-base mb-6">
        <div
          :class="[appCategoryName === '' ? 'text-primary border-primary' : '', 'cursor-pointer pb-2 transition-colors']"
          @click="appCategoryName = ''"
        >
          全部
        </div>
        <div
          v-for="(item, index) in categoryList"
          :key="index"
          @click="appCategoryName = item"
          :class="[appCategoryName === item ? 'text-primary border-primary' : '', 'cursor-pointer pb-2 transition-colors']"
        >
          {{ item }}
        </div>
      </div>

      <!-- 应用列表 - 使用容器包裹实现无滚动条滚动 -->
      <div class="app-container">
        <div class="app-grid grid grid-cols-4 gap-6">
          <div
            v-for="item in appCategoryList"
            :key="item.id"
            class="app-card flex gap-4 items-center rounded-lg p-3 h-[100px] cursor-pointer transition-all duration-300 hover:scale-102 hover:shadow-lg"
            @click="goApp(item)"
          >
            <div class="w-[56px] h-[56px] shrink-0">
              <el-badge
                :value="item?.msgCount?.unread + item?.taskCount?.processing + item?.taskCount?.pending || 0"
                :max="99"
                :offset="[0, -10]"
                :show-zero="false"
              >
                <el-image class="w-full h-full object-cover rounded-md" :src="item.icon" />
              </el-badge>
            </div>
            <div class="flex flex-col h-[80px]">
              <div class="h-[20px] text-xs"></div>
              <div class="line-clamp-1 text-[#121E44] h-[20px] text-sm">{{ item?.appName }}</div>
              <div class="line-clamp-2 text-[#9E9E9E] h-[40px] text-xs">{{ item?.appDesc }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="layoutUserAppCenter">
import { getUserAppAllList, getAppCodeInfo } from '@/api/infra/platform/basePlatform';
import { getCurrentInstance } from 'vue';
import type { ComponentInternalInstance } from 'vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const showDialog = ref(false);
const appCategoryArr = ref([]);

// 按类别分组应用
const groupByCategory = (dataList: any) => {
  if (!dataList) {
    return [];
  }

  const groupedObj = dataList.reduce((result: any, item: any) => {
    const category = item.shopAppCategoryName;
    if (!result[category]) {
      result[category] = [];
    }
    result[category].push(item);
    return result;
  }, {});

  categoryList.value = Object.keys(groupedObj ?? {});

  return Object.keys(groupedObj).map((category) => ({
    appCategoryName: category,
    appCategoryList: groupedObj[category]
  }));
};

// 打开弹窗
const openDialog = async () => {
  proxy?.$modal.loading('加载中...');
  try {
    const userAppAllList = await getUserAppAllList();
    appCategoryArr.value = groupByCategory(userAppAllList.data);
  } finally {
    proxy?.$modal.closeLoading();
    showDialog.value = true;
  }
};

const categoryList = ref([]); // 应用类别列表
const appCategoryName = ref(''); // 当前选中的应用类别

// 过滤当前分类的应用
const appCategoryList = computed(() => {
  if (appCategoryName.value === '') {
    return appCategoryArr.value.flatMap((category) => category.appCategoryList);
  }
  const matchedCategory = appCategoryArr.value.find((item) => item.appCategoryName === appCategoryName.value);
  return matchedCategory ? matchedCategory.appCategoryList : [];
});

// 关闭弹窗
const closeDialog = () => {
  showDialog.value = false;
};

// 跳转应用
const goApp = async (appInfo: any) => {
  proxy?.$modal.loading('请求打开页面中，请稍候...');
  try {
    const appCodeInfoRes = await getAppCodeInfo({ appId: appInfo.appId });
    const codeUrl = appCodeInfoRes.data.codeUrl;

    if (!codeUrl?.startsWith('http')) {
      proxy?.$modal.msgWarning('应用建设中！');
      return;
    }

    window.open(codeUrl, '_blank');
  } finally {
    proxy?.$modal.closeLoading();
  }
};

// 暴露方法
defineExpose({
  openDialog
});
</script>

<style lang="scss" scoped>
.app-dialog {
  --el-dialog-padding-primary: 15px 20px;
}

// 弹窗整体高度控制
:deep(.el-dialog) {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: 90vh; /* 弹窗最大高度不超过视口的90% */
  display: flex;
  flex-direction: column;
}

// 优化弹窗头部
:deep(.el-dialog__header) {
  padding: 12px 20px !important;
  margin: 0 !important;
  font-weight: 600;
  font-size: 18px !important;
  color: #1f2225;
  border-bottom: 1px solid #dde0e5 !important;
  flex-shrink: 0; /* 头部不收缩 */

  .el-dialog__title {
    line-height: 1;
  }

  .el-dialog__headerbtn {
    top: 12px !important;
  }
}

// 弹窗内容区自适应高度
:deep(.el-dialog__body) {
  padding: 15px 20px 20px !important;
  flex-grow: 1; /* 内容区自动填充剩余空间 */
  overflow: hidden; /* 隐藏默认滚动条 */
}

// 应用列表容器 - 实现无滚动条滚动
.app-container {
  height: 100%;
  overflow-y: auto; /* 启用垂直滚动 */
  padding-right: 8px; /* 预留滚动条空间，避免内容抖动 */

  // 隐藏滚动条但保留滚动功能
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

// 分类标签样式
.category-tabs {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 5px;
  flex-shrink: 0; /* 分类标签不收缩 */

  .text-primary {
    color: #0079C3;
    font-weight: 500;
  }

  .border-primary {
    border-bottom: 3px solid #0079C3;
  }
}

// 应用卡片样式
.app-card {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}
</style>
