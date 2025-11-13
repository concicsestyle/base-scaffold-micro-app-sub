# 子应用微应用路由跳转功能使用指南

## 概述

本功能为子应用提供了向其他微应用或主应用发送路由跳转请求的能力，通过主应用作为中介实现微应用间的路由跳转。

## 功能特性

- ✅ 支持子应用跳转到其他微应用
- ✅ 支持子应用跳转到主应用
- ✅ 支持带参数的路由跳转
- ✅ 支持向主应用发送自定义消息
- ✅ 提供组合式函数和全局方法两种使用方式
- ✅ 完整的TypeScript类型支持
- ✅ 错误处理和日志记录

## 使用方法

### 1. 组合式函数方式（推荐）

```typescript
import { useSubMicroAppRouter } from '@/composables/useSubMicroAppRouter';

const { 
  navigateToMicroApp, 
  navigateToMain, 
  navigateToMainPage, 
  getCurrentMicroApp, 
  isMicroAppEnvironment,
  sendMessageToMain 
} = useSubMicroAppRouter();

// 跳转到其他微应用
navigateToMicroApp('sub-micro-app-ips', '/plan/manage');

// 跳转到主应用首页
navigateToMain();

// 跳转到主应用指定页面
navigateToMainPage('/adminManage/index');

// 带参数跳转
navigateToMicroApp('sub-micro-app-mes', '/production/order', {
  orderId: 'ORD-2024-001',
  status: 'processing'
});
```

### 2. 全局方法方式

```typescript
// 在Vue组件中
this.$subMicroAppRouter.navigateToMicroApp('sub-micro-app-ips', '/plan/detail');

// 在setup中
const { proxy } = getCurrentInstance();
proxy?.$subMicroAppRouter.navigateToMain();
```

### 3. 工具类方式

```typescript
import { subMicroAppRouter } from '@/utils/microApp';

subMicroAppRouter.navigateToMicroApp('sub-micro-app-qms', '/quality/manage');
```

## API 参考

### useSubMicroAppRouter()

返回子应用微应用路由跳转相关的工具函数。

#### navigateToMicroApp(targetApp, path, query)

跳转到其他微应用。

- `targetApp: string` - 目标应用名称（如：'sub-micro-app-ips'）
- `path: string` - 目标路径（如：'/plan/manage'）
- `query?: Record<string, any>` - 查询参数

#### navigateToMain()

跳转到主应用首页。

#### navigateToMainPage(path, query)

跳转到主应用指定页面。

- `path: string` - 目标路径
- `query?: Record<string, any>` - 查询参数

#### getCurrentMicroApp()

获取当前微应用信息。

#### isMicroAppEnvironment()

检查是否为微应用环境。

#### sendMessageToMain(type, data)

向主应用发送自定义消息。

- `type: string` - 消息类型
- `data?: any` - 消息数据

### SubMicroAppRouter 类

#### navigateToMicroApp(targetApp, path, query)

跳转到其他微应用。

#### navigateToMain()

跳转到主应用首页。

#### navigateToMainPage(path, query)

跳转到主应用指定页面。

#### getCurrentMicroApp()

获取当前微应用信息。

#### isMicroAppEnvironment()

检查是否为微应用环境。

#### sendMessageToMain(type, data)

向主应用发送自定义消息。

## 工作原理

1. **请求发送**：子应用通过事件中心向主应用发送路由跳转请求
2. **请求处理**：主应用接收请求并解析目标应用和路径
3. **路由跳转**：主应用使用Vue Router进行实际的路由跳转
4. **应用加载**：主应用加载目标微应用并传递参数

## 注意事项

1. 子应用只能发送跳转请求，不能直接进行路由跳转
2. 所有跳转请求都需要通过主应用进行中转
3. 确保目标微应用已在主应用中正确配置
4. 参数会自动进行URL编码
5. 建议使用组合式函数方式，更符合Vue 3最佳实践

## 示例

完整的使用示例请参考 `src/views/examples/SubMicroAppNavigation.vue` 文件。

## 错误处理

系统包含完整的错误处理机制：

1. **事件中心检查**：跳转前检查事件中心是否可用
2. **参数验证**：验证目标应用和路径参数
3. **错误日志**：详细的错误日志记录便于调试
4. **降级处理**：当事件中心不可用时给出友好提示

## 调试

在浏览器控制台中可以看到详细的跳转日志： 