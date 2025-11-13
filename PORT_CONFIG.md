# 端口配置说明

## 📋 端口分配表

| 服务名称 | 项目目录 | 端口配置位置 | 开发端口 | 生产路径 |
|---------|---------|-------------|----------|----------|
| 主应用 | base-scaffold-micro-app-main | env/.env.localDev | 19888 | / |
| 基础服务 | base-scaffold-micro-app-basic | env/.env.localDev | 19901 | /app-basic/ |
| EAM服务 | base-scaffold-micro-app-eam | env/.env.localDev | 19902 | /app-eam/ |
| IPS服务 | base-scaffold-micro-app-ips | env/.env.localDev | 19903 | /app-ips/ |
| MES服务 | base-scaffold-micro-app-mes | env/.env.localDev | 19904 | /app-mes/ |
| PPM服务 | base-scaffold-micro-app-ppm | env/.env.localDev | 19905 | /app-ppm/ |
| QMS服务 | base-scaffold-micro-app-qms | env/.env.localDev | 19906 | /app-qms/ |
| SYS服务 | base-scaffold-micro-app-sys | env/.env.localDev | 19907 | /app-sys/ |

## 🔧 如何修改端口

### 1. 开发环境端口修改

#### 1.1 修改环境变量文件
每个项目都有 `env/` 目录，包含不同环境的配置文件：

```bash
# 基础服务端口配置示例
# 文件位置: base-scaffold-micro-app-basic/env/.env.localDev
VITE_APP_PORT = 19901  # 修改这里的端口号
```

#### 1.2 修改所有服务的端口
```bash
# 主应用
base-scaffold-micro-app-main/env/.env.localDev
VITE_APP_PORT = 19888

# 基础服务
base-scaffold-micro-app-basic/env/.env.localDev
VITE_APP_PORT = 19901

# EAM服务
base-scaffold-micro-app-eam/env/.env.localDev
VITE_APP_PORT = 19902

# IPS服务
base-scaffold-micro-app-ips/env/.env.localDev
VITE_APP_PORT = 19903

# MES服务
base-scaffold-micro-app-mes/env/.env.localDev
VITE_APP_PORT = 19904

# PPM服务
base-scaffold-micro-app-ppm/env/.env.localDev
VITE_APP_PORT = 19905

# QMS服务
base-scaffold-micro-app-qms/env/.env.localDev
VITE_APP_PORT = 19906

# SYS服务
base-scaffold-micro-app-sys/env/.env.localDev
VITE_APP_PORT = 19907
```

### 2. 生产环境路径修改

#### 2.1 修改主应用配置
文件位置：`base-scaffold-micro-app-main/src/views/externalApp/index.vue`

```typescript
// 应用URL - 根据环境动态生成
const appUrl = computed(() => {
  if (!currentApp.value) return '';
  
  const env = import.meta.env;
  const isDev = env.VITE_APP_ENV === 'localDev';
  
  if (isDev) {
    // 开发环境使用本地端口
    const devPorts = {
      'basic': 19901,  // 修改这里的端口号
      'eam': 19902,    // 修改这里的端口号
      'ips': 19903,    // 修改这里的端口号
      'mes': 19904,    // 修改这里的端口号
      'ppm': 19905,    // 修改这里的端口号
      'qms': 19906,    // 修改这里的端口号
      'sys': 19907     // 修改这里的端口号
    };
    const port = devPorts[currentApp.value.id as keyof typeof devPorts];
    if (port) {
      return `http://localhost:${port}/`;
    }
  }
  
  // 生产环境使用服务器路径
  return `/app-${currentApp.value.id}/`;
});
```

#### 2.2 修改Nginx配置
文件位置：`nginx.conf`

```nginx
# 基础服务
location /app-basic/ {
    alias /data/frontend_service/app-basic/;
    try_files $uri $uri/ /app-basic/index.html;
}

# EAM服务
location /app-eam/ {
    alias /data/frontend_service/app-eam/;
    try_files $uri $uri/ /app-eam/index.html;
}

# 其他服务类似...
```

## 🚀 快速修改脚本

### 批量修改端口脚本
```bash
#!/bin/bash
# 批量修改所有服务的端口

# 端口映射
declare -A ports=(
    ["main"]="19888"
    ["basic"]="19901"
    ["eam"]="19902"
    ["ips"]="19903"
    ["mes"]="19904"
    ["ppm"]="19905"
    ["qms"]="19906"
    ["sys"]="19907"
)

# 修改每个服务的端口
for app_id in "${!ports[@]}"; do
    port="${ports[$app_id]}"
    env_file="base-scaffold-micro-app-$app_id/env/.env.localDev"
    
    if [ -f "$env_file" ]; then
        echo "修改 $app_id 服务端口为 $port"
        sed -i "s/VITE_APP_PORT = [0-9]*/VITE_APP_PORT = $port/" "$env_file"
    else
        echo "警告: 找不到 $env_file"
    fi
done

echo "端口修改完成！"
```

## ⚠️ 注意事项

1. **端口冲突**：确保修改的端口号不与其他服务冲突
2. **防火墙**：确保服务器防火墙开放了相应端口
3. **环境一致性**：开发环境和生产环境的配置要保持一致
4. **重启服务**：修改端口后需要重启开发服务器

## 🔍 验证端口配置

### 1. 检查端口是否被占用
```bash
# Linux/Mac
netstat -tulpn | grep :19901

# Windows
netstat -ano | findstr :19901
```

### 2. 测试端口连通性
```bash
# 测试端口是否可访问
curl http://localhost:19901

# 或者使用telnet
telnet localhost 19901
```

### 3. 查看服务启动日志
```bash
# 启动服务时查看端口信息
npm run localDev
```

## 📝 配置示例

### 环境变量文件示例
```bash
# .env.localDev
VITE_APP_TITLE = 基础服务
VITE_APP_ENV = 'localDev'
VITE_APP_PORT = 19901  # 这里配置端口
VITE_APP_CONTEXT_PATH = '/sub-micro-app-basic/'
```

### Vite配置示例
```typescript
// vite.config.ts
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, path.resolve(process.cwd(), 'env'));
  return {
    server: {
      host: '0.0.0.0',
      port: Number.parseInt(env.VITE_APP_PORT, 10), // 使用环境变量中的端口
      open: true
    }
  };
});
```

这样您就可以根据需要灵活配置各个服务的端口了！ 