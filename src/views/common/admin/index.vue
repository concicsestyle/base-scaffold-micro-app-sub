<template>
  <div class="app-container home">
    <!-- 欢迎语 -->
    <el-row :gutter="20" class="home-header">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <p class="subtitle">欢迎使用 {{ title }}</p>
        <p class="welcome-text">今天是 {{ today }}，祝您工作愉快！您已连续登录 <b>7</b> 天 💼</p>
      </el-col>
    </el-row>

    <el-divider />

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :sm="24" :md="6" v-for="(card, index) in cards" :key="index">
        <el-card class="stat-card shadow-hover">
          <div class="stat-icon" :class="card.iconClass">
            <i :class="card.icon"></i>
          </div>
          <div class="stat-content">
            <h3>{{ card.title }}</h3>
            <p>{{ card.value }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-divider />

    <!-- 系统介绍 + 更新日志 -->
    <el-row :gutter="20" class="info-section">
      <el-col :sm="24" :md="12">
        <h4>系统简介</h4>
        <p>{{ title }} 是一套基于微前端架构的企业级管理系统，集成了权限控制、用户管理、日志监控、第三方应用集成等核心模块。</p>
        <blockquote>系统采用 Vue3 + TypeScript + Vite 技术栈构建，具备良好的扩展性和可维护性。</blockquote>
      </el-col>
      <el-col :sm="24" :md="12">
        <h4>更新日志</h4>
        <ul class="update-log">
          <li v-for="(log, idx) in updateLogs" :key="idx">
            <b>v{{ log.version }}</b> - {{ log.description }}
          </li>
        </ul>
      </el-col>
    </el-row>

    <el-divider />

    <!-- 快捷入口 -->
    <el-row :gutter="20" class="quick-access">
      <el-col :span="24">
        <h4>快捷入口</h4>
      </el-col>
      <el-col :sm="24" :md="6" v-for="(item, index) in quickAccess" :key="index">
        <el-card class="access-card shadow-hover" @click="goTo(item.path)">
          <i :class="item.icon"></i>
          <span>{{ item.title }}</span>
        </el-card>
      </el-col>
    </el-row>

    <el-divider />

    <!-- 公告栏 -->
    <el-row :gutter="20" class="notice-board">
      <el-col :span="24">
        <h4>平台公告</h4>
        <el-button text style="float: right; margin-top: -10px" @click="goToNoticeCenter">查看更多</el-button>
        <ul class="notice-list">
          <li v-for="(notice, idx) in notices" :key="idx">
            <strong><i class="el-icon-bell"></i> {{ notice.title }}</strong>
            <small>{{ notice.date }}</small>
            <p>{{ notice.content }}</p>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Index" lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const title = ref(import.meta.env.VITE_APP_TITLE);

// 获取当前日期
const today = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// 卡片数据
const cards = [
  {
    title: '用户总数',
    value: '12,500+',
    icon: 'el-icon-user-solid',
    iconClass: 'icon-user'
  },
  {
    title: '在线人数',
    value: '2,300+',
    icon: 'el-icon-s-custom',
    iconClass: 'icon-online'
  },
  {
    title: '活跃模块',
    value: '18 / 20',
    icon: 'el-icon-menu',
    iconClass: 'icon-module'
  },
  {
    title: '访问量统计',
    value: '89,400+',
    icon: 'el-icon-data-line',
    iconClass: 'icon-visits'
  }
];

// 快捷入口
const quickAccess = [
  { title: '用户管理', icon: 'el-icon-user', path: '/user/list' },
  { title: '角色权限', icon: 'el-icon-lock', path: '/role/list' },
  { title: '菜单配置', icon: 'el-icon-menu', path: '/menu/list' },
  { title: '日志查看', icon: 'el-icon-document', path: '/log/list' }
];

// 更新日志
const updateLogs = [
  { version: '1.2.0', description: '新增角色权限配置功能' },
  { version: '1.1.5', description: '优化登录流程与安全策略' },
  { version: '1.1.0', description: '支持多语言切换与国际化' },
  { version: '1.0.0', description: '基础版本发布' }
];

// 公告数据
const notices = [
  {
    title: '关于系统升级的通知',
    date: '2024-04-01',
    content: '为提升系统性能，将于本周五凌晨进行系统维护，请提前保存好数据。'
  },
  {
    title: '新功能上线预告',
    date: '2024-03-25',
    content: '下个版本将新增多租户支持和统一身份认证中心。'
  },
  {
    title: '安全漏洞修复提醒',
    date: '2024-03-18',
    content: '已修复部分 XSS 攻击风险，请及时更新浏览器插件。'
  }
];

// 路由跳转方法
const goTo = (path: string) => {};

const goToNoticeCenter = () => {};
</script>

<style scoped lang="scss">
.home {
  padding: 20px;
  padding-left: 40px;
  background-color: #f9f9f9;

  .home-header {
    .subtitle {
      color: #777;
      font-size: 16px;
    }
    .welcome-text {
      margin-top: 5px;
      font-size: 14px;
      color: #999;
    }
  }

  .stats-cards {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
  }

  .stat-card {
    display: flex;
    align-items: center;
    padding: 15px;
    transition: all 0.3s ease;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-5px);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin-right: 15px;
      i {
        font-size: 28px;
        color: #fff;
      }
    }

    .icon-user {
      background-color: #409eff;
    }

    .icon-online {
      background-color: #67c23a;
    }

    .icon-module {
      background-color: #e6a23c;
    }

    .icon-visits {
      background-color: #909399;
    }

    .stat-content {
      h3 {
        font-size: 18px;
        margin: 0;
        color: #333;
      }
      p {
        margin-top: 5px;
        font-size: 20px;
        font-weight: bold;
        color: #555;
      }
    }
  }

  .info-section {
    margin-top: 20px;
    h4 {
      margin-bottom: 10px;
    }
    blockquote {
      padding: 10px 20px;
      margin: 0 0 20px;
      font-size: 16px;
      border-left: 5px solid #eee;
      background-color: #fcfcfc;
    }
  }

  .quick-access {
    margin-top: 20px;
    .access-card {
      text-align: center;
      padding: 20px 0;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      border-radius: 10px;
      i {
        font-size: 24px;
        margin-bottom: 10px;
        color: #409eff;
      }
      span {
        font-size: 14px;
        color: #333;
      }
      &:hover {
        background-color: #f5f7fa;
      }
    }
  }

  .notice-board {
    margin-top: 20px;
    .notice-list {
      list-style-type: none;
      padding: 0;
      li {
        padding: 10px 0;
        border-bottom: 1px solid #eee;
        strong {
          display: block;
          font-size: 14px;
          margin-bottom: 5px;
        }
        small {
          color: #999;
          font-size: 12px;
          margin-bottom: 5px;
        }
        p {
          font-size: 13px;
          color: #666;
        }
      }
    }
  }

  .update-log {
    li {
      margin-bottom: 10px;
    }
  }
}

@media (max-width: 768px) {
  .stat-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .stat-icon {
    margin-right: 0 !important;
    margin-bottom: 10px;
  }
  .stat-content h3,
  .stat-content p {
    text-align: center;
  }
}
</style>
