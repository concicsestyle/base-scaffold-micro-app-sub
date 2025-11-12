<template>
  <div class="navbar">
    <!--    <hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container" @toggle-click="toggleSideBar" />-->
    <!--    <breadcrumb v-if="!settingsStore.topNav" id="breadcrumb-container" class="breadcrumb-container" />-->
    <div class="flex">
      <div style="width: 100%; display: flex; align-items: center">
        <img src="@/assets/images/logo-blue.png" alt="" style="width: 118px; object-fit: cover" @click="goToExternalLink" />
      </div>
    </div>
    <top-nav v-if="settingsStore.topNav" id="topmenu-container" class="topmenu-container" />

    <div class="right-menu">
      <template v-if="appStore.device !== 'mobile'">
        <!--        <el-select-->
        <!--          v-if="userId === 1 && tenantEnabled"-->
        <!--          v-model="companyName"-->
        <!--          class="min-w-244px"-->
        <!--          clearable-->
        <!--          filterable-->
        <!--          reserve-keyword-->
        <!--          :placeholder="proxy.$t('navbar.selectTenant')"-->
        <!--          @change="dynamicTenantEvent"-->
        <!--          @clear="dynamicClearEvent"-->
        <!--        >-->
        <!--          <el-option v-for="item in tenantList" :key="item.tenantId" :label="item.companyName" :value="item.tenantId"> </el-option>-->
        <!--          <template #prefix><svg-icon icon-class="company" class="el-input__icon input-icon" /></template>-->
        <!--        </el-select>-->

        <el-tooltip v-if="microAppCode" content="微前端子应用" effect="dark" placement="bottom">
          <div class="right-menu-item hover-effect mr-1">
            <svg-icon icon-class="question" />
          </div>
        </el-tooltip>

        <user-app-center ref="userAppCenterRef" />
        <div class="right-menu-item hover-effect" @click="openUserAppCenter">
          <el-tooltip content="我的应用" effect="dark" placement="bottom">
            <svg-icon icon-class="table" color="#0079C3" />
          </el-tooltip>
        </div>

        <div class="right-menu-item hover-effect" @click="syncBasePlatformInfo">
          <el-tooltip v-if="checkRole(['superAdmin', 'admin'])" content="全量同步" effect="dark" placement="bottom">
            <svg-icon icon-class="redis-list" color="#0079C3" />
          </el-tooltip>
        </div>
        <el-divider direction="vertical" />

        <el-select
          v-if="deptList?.length > 0"
          v-model="curDeptId"
          class="min-w-300px ml-3 mr-4"
          filterable
          reserve-keyword
          placeholder="请选择部门"
          @change="changeDeptEvent"
        >
          <template #prefix>
            <svg-icon icon-class="company" class="el-input__icon input-icon" />
          </template>
          <el-option v-for="item in deptList" :key="item.deptId" :label="`${item.deptName}（${item.deptCode || item.deptId}）`" :value="item.deptId">
          </el-option>
        </el-select>

        <!--        <search-menu ref="searchMenuRef" />-->
        <!--        <el-tooltip content="搜索" effect="dark" placement="bottom">-->
        <!--          <div class="right-menu-item hover-effect" @click="openSearchMenu">-->
        <!--            <svg-icon class-name="search-icon" icon-class="search" />-->
        <!--          </div>-->
        <!--        </el-tooltip>-->

        <!-- 消息 -->
        <!--        <el-tooltip :content="proxy.$t('navbar.message')" effect="dark" placement="bottom">-->
        <!--          <div>-->
        <!--            <el-popover placement="bottom" trigger="click" transition="el-zoom-in-top" :width="300" :persistent="false">-->
        <!--              <template #reference>-->
        <!--                <el-badge :value="newNotice > 0 ? newNotice : ''" :max="99">-->
        <!--                  <div class="right-menu-item hover-effect" style="display: block"><svg-icon icon-class="message" /></div>-->
        <!--                </el-badge>-->
        <!--              </template>-->
        <!--              <template #default>-->
        <!--                <notice></notice>-->
        <!--              </template>-->
        <!--            </el-popover>-->
        <!--          </div>-->
        <!--        </el-tooltip>-->

        <div class="right-menu-item">
          <el-tooltip :content="proxy.$t('navbar.full')" effect="dark" placement="bottom">
            <screenfull id="screenfull" />
          </el-tooltip>
        </div>

        <!--        <el-tooltip :content="proxy.$t('navbar.language')" effect="dark" placement="bottom">-->
        <!--          <lang-select id="lang-select" class="right-menu-item hover-effect" />-->
        <!--        </el-tooltip>-->

        <!--        <el-tooltip :content="proxy.$t('navbar.layoutSize')" effect="dark" placement="bottom">-->
        <!--          <size-select id="size-select" class="right-menu-item hover-effect" />-->
        <!--        </el-tooltip>-->
      </template>

      <el-popover ref="popoverRef" placement="bottom-start" trigger="hover" :width="240">
        <template #reference>
          <div class="avatar-container">
            <div class="avatar-name">{{ userStore.nickname.slice(0, 1) }}</div>
          </div>
        </template>
        <div class="popup-content">
          <div class="popup-header">
            <div class="inside-avatar-container">
              <div class="avatar-name">{{ userStore.nickname.slice(0, 1) }}</div>
            </div>
            <div class="header-right">
              <div class="header-title">{{ userStore.nickname }}</div>
              <div class="header-sub">
                <div class="status"></div>
                <div>在线</div>
              </div>
            </div>
          </div>
          <div class="popup-item" @click="handleCommand('personalCenter')">
            <svg-icon icon-class="userCircle" class="w-5 h-5 mr-1" color="#4E5969"></svg-icon>
            个人中心
          </div>
          <div class="popup-item" @click="handleCommand('setLayout')">
            <svg-icon icon-class="setting-2" class="w-5 h-5 mr-1" color="#4E5969"></svg-icon>
            布局设置
          </div>
          <div class="popup-item" @click="handleCommand('logout')">
            <svg-icon icon-class="exit" class="w-5 h-5 mr-1" color="#4E5969"></svg-icon>
            退出登录
          </div>
        </div>
      </el-popover>
      <!--<div class="avatar-container">-->
      <!--  <el-dropdown class="right-menu-item hover-effect" trigger="click" @command="handleCommand">-->
      <!--    <div class="avatar-wrapper">-->
      <!--      <img :src="userStore.avatar" class="user-avatar" />-->
      <!--      <el-icon>-->
      <!--        <caret-bottom />-->
      <!--      </el-icon>-->
      <!--    </div>-->
      <!--    <template #dropdown>-->
      <!--      <el-dropdown-menu>-->
      <!--        <router-link v-if="!dynamic" to="/adminUser/profile">-->
      <!--          <el-dropdown-item>{{ proxy.$t('navbar.personalCenter') }}</el-dropdown-item>-->
      <!--        </router-link>-->
      <!--        <el-dropdown-item v-if="settingsStore.showSettings" command="setLayout">-->
      <!--          <span>{{ proxy.$t('navbar.layoutSetting') }}</span>-->
      <!--        </el-dropdown-item>-->
      <!--        <el-dropdown-item divided command="logout">-->
      <!--          <span>{{ proxy.$t('navbar.logout') }}</span>-->
      <!--        </el-dropdown-item>-->
      <!--      </el-dropdown-menu>-->
      <!--    </template>-->
      <!--  </el-dropdown>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script setup lang="ts">
import UserAppCenter from './TopBar/userAppCenter.vue';
import SearchMenu from './TopBar/search.vue';
import { useAppStore } from '@/store/modules/app';
import { useUserStore } from '@/store/modules/user';
import { useSettingsStore } from '@/store/modules/settings';
import { useNoticeStore } from '@/store/modules/notice';
import { getTenantList } from '@/api/common/admin/login';
import { dynamicClear, dynamicTenant } from '@/api/infra/global/globalTenant';
import { changeCurDept, userCurDept } from '@/api/infra/admin/adminUser';
import { syncAllOrgRelationInfo } from '@/api/infra/platform/basePlatform';
import { TenantVO } from '@/api/common/admin/types';
import { DeptVO } from '@/api/infra/admin/adminDept/types';
import notice from './notice/index.vue';
import router from '@/router';
import { ElMessageBoxOptions } from 'element-plus/es/components/message-box/src/message-box.type';
import { checkPermi, checkRole } from '@/utils/permission';
import { Action } from 'element-plus';

const appStore = useAppStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const noticeStore = storeToRefs(useNoticeStore());
const newNotice = ref(<number>0);

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const userId = ref(userStore.userId);
const deptList = ref(userStore.deptList);
const curDeptId = ref(undefined);
const companyName = ref(undefined);
const tenantList = ref<TenantVO[]>([]);
// 是否切换了租户
const dynamic = ref(false);
// 租户开关
const tenantEnabled = ref(true);
// 搜索菜单
const searchMenuRef = ref<InstanceType<typeof SearchMenu>>();
// 应用中心
const userAppCenterRef = ref<InstanceType<typeof UserAppCenter>>();
const microAppCode = import.meta.env.VITE_APP_MICRO_APP_CODE;
const portalUrl = ref(import.meta.env.VITE_APP_BASE_PLATFORM_PORTAL_URL);

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

/**
 * 同步全部信息
 */
const syncBasePlatformInfo = async () => {
  ElMessageBox.confirm('全量同步会清除当前环境组织架构信息，是否继续同步？', '请选择同步方式', {
    cancelButtonText: '全量同步（清除本地数据）',
    confirmButtonText: '增量同步',
    distinguishCancelAndClose: true,
    type: 'warning',
    center: true
  })
    .then((v) => {
      proxy?.$modal.loading('正在增量同步，请稍候...');
      syncAllOrgRelationInfo({ clearFlag: 0 });
      setTimeout(() => {
        proxy?.$modal.closeLoading();
        window.location.reload();
      }, 30000);
    })
    .catch((action: Action) => {
      if (action === 'cancel') {
        proxy?.$modal.loading('正在全量同步，请稍候...');
        syncAllOrgRelationInfo({ clearFlag: 1 });
        setTimeout(() => {
          proxy?.$modal.closeLoading();
          window.location.reload();
        }, 30000);
      }
    });
};

const openUserAppCenter = () => {
  userAppCenterRef.value?.openDialog();
};

const openSearchMenu = () => {
  searchMenuRef.value?.openSearch();
};

// 部门切换
const changeDeptEvent = async (deptId: string) => {
  console.log(deptId);
  const filterDept = deptList.value.filter((dept) => {
    if (dept.deptId === deptId) {
      return dept;
    }
  });
  await proxy?.$modal.confirm('确认切换至"' + filterDept[0].deptName + '"？');
  await changeCurDept({ deptId: deptId });
  curDeptId.value = deptId;
  // proxy?.$modal.msgSuccess('已切换至"' + filterDept[0].deptName + '"！');
  // await proxy?.$router.push('/');
  // await proxy?.$tab.closeAllPage();
  // await proxy?.$tab.refreshPage();
  proxy?.$modal.loading('正在切换，请稍候...');
  setTimeout('window.location.reload()', 2000);
};

// 动态切换
const dynamicTenantEvent = async (tenantId: string) => {
  if (companyName.value != null && companyName.value !== '') {
    await dynamicTenant(tenantId);
    dynamic.value = true;
    await proxy?.$router.push('/');
    await proxy?.$tab.closeAllPage();
    await proxy?.$tab.refreshPage();
  }
};

const dynamicClearEvent = async () => {
  await dynamicClear();
  dynamic.value = false;
  await proxy?.$router.push('/');
  await proxy?.$tab.closeAllPage();
  await proxy?.$tab.refreshPage();
};

/** 租户列表 */
const initTenantList = async () => {
  const { data } = await getTenantList(true);
  tenantEnabled.value = data.tenantEnabled === undefined ? true : data.tenantEnabled;
  if (tenantEnabled.value) {
    tenantList.value = data.voList;
  }
};

/** 当前部门 */
const initCurDept = async () => {
  if (userStore.deptList.length > 0) {
    deptList.value = userStore.deptList;
    const { data } = await userCurDept();
    if (data) {
      curDeptId.value = data.deptId;
    }
  }
};

defineExpose({
  initTenantList,
  initCurDept
});

const logout = async () => {
  await ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  } as ElMessageBoxOptions);
  userStore.logout().then(() => {
    router.replace({
      path: '/login',
      query: {
        redirect: encodeURIComponent(router.currentRoute.value.fullPath || '/')
      }
    });
    proxy?.$tab.closeAllPage();
  });
};

const emits = defineEmits(['setLayout']);
const setLayout = () => {
  emits('setLayout');
};

const personalCenter = () => {
  proxy.$router.push('/adminUser/profile');
};
// 定义Command方法对象 通过key直接调用方法
const commandMap: { [key: string]: any } = {
  personalCenter,
  setLayout,
  logout
};

const handleCommand = (command: string) => {
  // 判断是否存在该方法
  if (commandMap[command]) {
    commandMap[command]();
  }
};
//用深度监听 消息
watch(
  () => noticeStore.state.value.notices,
  (newVal) => {
    newNotice.value = newVal.filter((item: any) => !item.read).length;
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.module.scss' as *;

:deep(.el-select .el-input__wrapper) {
  height: 30px;
}

:deep(.el-badge__content.is-fixed) {
  top: 12px;
}

.flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.navbar {
  height: $base-navbar-height;
  padding: 10px 20px;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: space-between;
  background: var(--color-white);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 76px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    //float: left;
    margin-left: 68px;
  }

  .topmenu-container {
    position: absolute;
    //left: 50px;
    //left: 10px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    display: flex;
    justify-content: center;
    align-items: center;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      padding: 8px;
      width: 32px;
      height: 32px;
      font-size: 18px;
      color: #5a5e66;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      width: 32px;
      height: 32px;
      background-color: var(--color-primary-plain);
      border-radius: 16px;
      margin-left: 20px;

      .avatar-name {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--color-primary-2);

        font-size: 10px;
        font-weight: 400;
      }

      //.avatar-wrapper {
      //  margin-top: 5px;
      //  position: relative;
      //
      //  .user-avatar {
      //    cursor: pointer;
      //    width: 40px;
      //    height: 40px;
      //    border-radius: 10px;
      //    margin-top: 16px;
      //  }
      //
      //  i {
      //    cursor: pointer;
      //    position: absolute;
      //    right: -24px;
      //    top: 24px;
      //    font-size: 16px;
      //  }
      //}
    }
  }
}

.inside-avatar-container {
  width: 32px;
  height: 32px;
  background-color: var(--color-primary-plain);
  border-radius: 16px;

  .avatar-name {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--color-primary-2);

    font-size: 10px;
    font-weight: 400;
  }
}

.popup-content {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;

  .popup-header {
    display: flex;
    justify-content: flex-start;
    padding: 12px;
    align-items: center;
    gap: 8px;
    align-self: stretch;

    .header-right {
      .header-title {
        display: -webkit-box;
        -webkit-box-orient: vertical;

        overflow: hidden;
        color: var(--color-text-5);
        text-overflow: ellipsis;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px; /* 150% */
      }

      .header-sub {
        display: flex;
        align-items: center;

        &:nth-child(1) {
          color: var(--color-text-sub);
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 20px; /* 166.667% */
        }

        .status {
          width: 6px;
          height: 6px;
          border-radius: 3px;
          background-color: #00b42a;
          margin-right: 4px;
        }
      }
    }
  }

  .popup-item {
    width: 97%;
    display: flex;
    padding: 9px 8px;
    align-items: center;
    gap: 4px;
    align-self: stretch;
    cursor: pointer;
    border-radius: 4px;

    color: var(---Text-5-, #1d2129);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */

    &:hover {
      background-color: var(--color-hover);
      transition: background-color 0.1s ease;
    }
  }

  .disabled {
    cursor: default;
  }
}
</style>
