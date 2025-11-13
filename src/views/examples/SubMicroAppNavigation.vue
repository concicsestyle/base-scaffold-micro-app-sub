<template>
  <div class="sub-micro-app-navigation-example">
    <el-card header="子应用微应用路由跳转示例">
      <div class="example-section">
        <h3>1. 跳转到其他微应用</h3>
        <el-space>
          <el-button type="primary" @click="goToIpsApp">跳转到IPS应用</el-button>
          <el-button type="success" @click="goToMesApp">跳转到MES应用</el-button>
          <el-button type="warning" @click="goToPpmApp">跳转到PPM应用</el-button>
          <el-button type="info" @click="goToQmsApp">跳转到QMS应用</el-button>
        </el-space>
      </div>

      <div class="example-section">
        <h3>2. 跳转到主应用</h3>
        <el-space>
          <el-button @click="goToMain">跳转到主应用首页</el-button>
          <el-button @click="goToMainPage">跳转到主应用管理页面</el-button>
        </el-space>
      </div>

      <div class="example-section">
        <h3>3. 带参数跳转</h3>
        <el-space>
          <el-button @click="goToIpsWithParams">带参数跳转到IPS应用</el-button>
          <el-button @click="goToMesWithParams">带参数跳转到MES应用</el-button>
        </el-space>
      </div>

      <div class="example-section">
        <h3>4. 当前微应用信息</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="当前应用">
            {{ currentAppInfo?.name || '未知应用' }}
          </el-descriptions-item>
          <el-descriptions-item label="当前路径">
            {{ currentAppInfo?.path || '/' }}
          </el-descriptions-item>
          <el-descriptions-item label="微应用环境">
            {{ isMicroAppEnv ? '是' : '否' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="example-section">
        <h3>5. 发送自定义消息到主应用</h3>
        <el-space>
          <el-button @click="sendCustomMessage">发送自定义消息</el-button>
          <el-button @click="sendDataMessage">发送数据消息</el-button>
        </el-space>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useSubMicroAppRouter } from '@/composables/useSubMicroAppRouter';

const { 
  navigateToMicroApp, 
  navigateToMain, 
  navigateToMainPage, 
  getCurrentMicroApp, 
  isMicroAppEnvironment,
  sendMessageToMain 
} = useSubMicroAppRouter();

// 获取当前微应用信息
const currentAppInfo = computed(() => getCurrentMicroApp());
const isMicroAppEnv = computed(() => isMicroAppEnvironment());

// 1. 跳转到其他微应用
const goToIpsApp = () => {
  navigateToMicroApp('sub-micro-app-ips', '/');
};

const goToMesApp = () => {
  navigateToMicroApp('sub-micro-app-mes', '/production/manage');
};

const goToPpmApp = () => {
  navigateToMicroApp('sub-micro-app-ppm', '/plan/manage');
};

const goToQmsApp = () => {
  navigateToMicroApp('sub-micro-app-qms', '/quality/manage');
};

// 2. 跳转到主应用
const goToMain = () => {
  navigateToMain();
};

const goToMainPage = () => {
  navigateToMainPage('/adminManage/index');
};

// 3. 带参数跳转
const goToIpsWithParams = () => {
  navigateToMicroApp('sub-micro-app-ips', '/plan/detail', {
    planId: '12345',
    mode: 'edit'
  });
};

const goToMesWithParams = () => {
  navigateToMicroApp('sub-micro-app-mes', '/production/order', {
    orderId: 'ORD-2024-001',
    status: 'processing'
  });
};

// 4. 发送自定义消息
const sendCustomMessage = () => {
  sendMessageToMain('customEvent', {
    message: 'Hello from Basic App!',
    timestamp: new Date().toISOString()
  });
};

const sendDataMessage = () => {
  sendMessageToMain('dataUpdate', {
    type: 'userAction',
    data: {
      action: 'navigation',
      target: 'sub-micro-app-ips',
      userId: 'user123'
    }
  });
};
</script>

<style scoped lang="scss">
.sub-micro-app-navigation-example {
  padding: 20px;
  
  .example-section {
    margin-bottom: 30px;
    
    h3 {
      margin-bottom: 15px;
      color: #303133;
    }
  }
}
</style> 