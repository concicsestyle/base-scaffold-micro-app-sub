# 端口配置汇总表

## ✅ 端口配置已完成

| 服务名称 | 项目目录 | 开发端口 | 生产路径 | 状态 |
|---------|---------|----------|----------|------|
| 主应用 | base-scaffold-micro-app-main | **19888** | `/` | ✅ 已配置 |
| 基础服务 | base-scaffold-micro-app-basic | **19901** | `/app-basic/` | ✅ 已配置 |
| EAM服务 | base-scaffold-micro-app-eam | **19902** | `/app-eam/` | ✅ 已配置 |
| IPS服务 | base-scaffold-micro-app-ips | **19903** | `/app-ips/` | ✅ 已配置 |
| MES服务 | base-scaffold-micro-app-mes | **19904** | `/app-mes/` | ✅ 已配置 |
| PPM服务 | base-scaffold-micro-app-ppm | **19905** | `/app-ppm/` | ✅ 已配置 |
| QMS服务 | base-scaffold-micro-app-qms | **19906** | `/app-qms/` | ✅ 已配置 |
| SYS服务 | base-scaffold-micro-app-sys | **19907** | `/app-sys/` | ✅ 已配置 |

## 🔧 修改内容

### 1. 环境变量文件修改
已修改以下文件中的 `VITE_APP_PORT` 配置：

- `base-scaffold-micro-app-eam/env/.env.localDev` → 19902
- `base-scaffold-micro-app-ips/env/.env.localDev` → 19903  
- `base-scaffold-micro-app-mes/env/.env.localDev` → 19904
- `base-scaffold-micro-app-ppm/env/.env.localDev` → 19905
- `base-scaffold-micro-app-qms/env/.env.localDev` → 19906
- `base-scaffold-micro-app-sys/env/.env.localDev` → 19907

### 2. 主应用端口映射
主应用 `base-scaffold-micro-app-main/src/views/externalApp/index.vue` 中的端口映射已正确配置：

```typescript
const devPorts = {
  'basic': 19901,
  'eam': 19902,
  'ips': 19903,
  'mes': 19904,
  'ppm': 19905,
  'qms': 19906,
  'sys': 19907
};
```

## 🚀 启动测试

### 开发环境启动顺序
1. **主应用**：`cd base-scaffold-micro-app-main && npm run localDev` (端口: 19888)
2. **基础服务**：`cd base-scaffold-micro-app-basic && npm run localDev` (端口: 19901)
3. **EAM服务**：`cd base-scaffold-micro-app-eam && npm run localDev` (端口: 19902)
4. **IPS服务**：`cd base-scaffold-micro-app-ips && npm run localDev` (端口: 19903)
5. **MES服务**：`cd base-scaffold-micro-app-mes && npm run localDev` (端口: 19904)
6. **PPM服务**：`cd base-scaffold-micro-app-ppm && npm run localDev` (端口: 19905)
7. **QMS服务**：`cd base-scaffold-micro-app-qms && npm run localDev` (端口: 19906)
8. **SYS服务**：`cd base-scaffold-micro-app-sys && npm run localDev` (端口: 19907)

### 访问地址
- **主应用**：http://localhost:19888
- **基础服务**：http://localhost:19901
- **EAM服务**：http://localhost:19902
- **IPS服务**：http://localhost:19903
- **MES服务**：http://localhost:19904
- **PPM服务**：http://localhost:19905
- **QMS服务**：http://localhost:19906
- **SYS服务**：http://localhost:19907

## ⚠️ 注意事项

1. **端口冲突已解决**：所有服务现在使用不同的端口号
2. **防火墙设置**：确保本地防火墙允许这些端口访问
3. **重启服务**：修改端口后需要重启开发服务器
4. **生产环境**：生产环境使用路径路由，不依赖端口号

## 🔍 验证方法

### 检查端口是否被占用
```bash
# Windows
netstat -ano | findstr :19901
netstat -ano | findstr :19902
# ... 其他端口

# Linux/Mac
netstat -tulpn | grep :19901
netstat -tulpn | grep :19902
# ... 其他端口
```

### 测试服务连通性
```bash
# 测试各个服务是否正常启动
curl http://localhost:19888
curl http://localhost:19901
curl http://localhost:19902
# ... 其他端口
```

端口配置修改完成！现在每个服务都有独立的端口号，不会发生冲突。 