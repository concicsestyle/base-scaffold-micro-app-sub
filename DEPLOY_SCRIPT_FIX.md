# 部署脚本修复说明

## 🚨 问题描述

### 原始问题
原始部署脚本会导致目录结构重复，形成如下结构：
```
/data/frontend_service/
├── app-mes/
│   ├── app-mes/          # ❌ 重复目录
│   │   ├── index.html
│   │   ├── assets/
│   │   └── favicon.ico
│   └── ...
```

### 期望结构
修复后的脚本应该产生如下结构：
```
/data/frontend_service/
├── app-mes/
│   ├── index.html        # ✅ 直接放在app-mes下
│   ├── assets/
│   └── favicon.ico
├── app-basic/
│   ├── index.html
│   ├── assets/
│   └── favicon.ico
└── ...
```

## 🔧 修复方案

### 修复前（有问题）
```bash
# 原始逻辑
dist_dir="$app_dir/dist/app-$app_id"  # base-scaffold-micro-app-mes/dist/app-mes
server_app_dir="$SERVER_DIR/app-$app_id"  # /data/frontend_service/app-mes
sudo mkdir -p "$server_app_dir"
sudo cp -r "$dist_dir"/* "$server_app_dir/"  # 复制内容到已存在的目录
```

### 修复后（正确）
```bash
# 修复后的逻辑
dist_dir="$app_dir/dist/app-$app_id"  # base-scaffold-micro-app-mes/dist/app-mes
sudo rm -rf "$server_app_dir"  # 清理可能存在的旧目录
sudo cp -r "$dist_dir" "$SERVER_DIR/"  # 直接复制整个目录
```

## 📁 目录结构对比

### 构建输出结构
```
base-scaffold-micro-app-mes/
└── dist/
    └── app-mes/           # 构建输出目录
        ├── index.html
        ├── assets/
        └── favicon.ico
```

### 服务器部署结构（修复后）
```
/data/frontend_service/
├── index.html             # 主应用
├── assets/
├── favicon.ico
├── app-mes/               # MES服务
│   ├── index.html
│   ├── assets/
│   └── favicon.ico
├── app-basic/             # 基础服务
│   ├── index.html
│   ├── assets/
│   └── favicon.ico
└── ...                    # 其他服务
```

## 🚀 部署流程

### 1. 构建阶段
```bash
# 构建所有服务
cd base-scaffold-micro-app-main && npm run build
cd base-scaffold-micro-app-basic && npm run build
cd base-scaffold-micro-app-eam && npm run build
# ... 其他服务
```

### 2. 部署阶段
```bash
# 执行部署脚本
sudo ./deploy.sh
```

### 3. 验证阶段
```bash
# 检查部署结果
ls -la /data/frontend_service/
ls -la /data/frontend_service/app-mes/
```

## ✅ 修复效果

### 修复前的问题
- ❌ 目录结构重复：`app-mes/app-mes/`
- ❌ 访问路径错误：`/app-mes/app-mes/index.html`
- ❌ Nginx配置不匹配

### 修复后的效果
- ✅ 目录结构正确：`app-mes/index.html`
- ✅ 访问路径正确：`/app-mes/index.html`
- ✅ Nginx配置匹配

## 🔍 验证方法

### 检查目录结构
```bash
# 检查服务器目录结构
tree /data/frontend_service/ -L 2

# 预期输出
/data/frontend_service/
├── app-basic
├── app-eam
├── app-ips
├── app-mes
├── app-ppm
├── app-qms
├── app-sys
├── assets
├── favicon.ico
└── index.html
```

### 检查文件内容
```bash
# 检查MES服务的index.html是否存在
ls -la /data/frontend_service/app-mes/index.html

# 检查assets目录
ls -la /data/frontend_service/app-mes/assets/
```

### 测试访问
```bash
# 测试主应用
curl http://localhost/

# 测试MES服务
curl http://localhost/app-mes/
```

## ⚠️ 注意事项

1. **备份机制**：脚本会自动备份现有文件
2. **权限设置**：自动设置nginx用户权限
3. **Nginx重启**：部署完成后自动重启Nginx
4. **错误处理**：如果构建目录不存在会显示警告

修复完成！现在部署脚本会正确地将构建输出目录复制到服务器，避免目录重复的问题。 