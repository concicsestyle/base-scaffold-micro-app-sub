#!/bin/bash

echo "开始部署多服务应用到服务器..."

# 服务器目录
SERVER_DIR="/data/frontend_service"
BACKUP_DIR="/data/frontend_service_backup_$(date +%Y%m%d_%H%M%S)"

# 检查服务器目录是否存在
if [ ! -d "$SERVER_DIR" ]; then
    echo "创建服务器目录: $SERVER_DIR"
    sudo mkdir -p "$SERVER_DIR"
    sudo chown -R $USER:$USER "$SERVER_DIR"
fi

# 备份现有文件
if [ -d "$SERVER_DIR" ] && [ "$(ls -A $SERVER_DIR)" ]; then
    echo "备份现有文件到: $BACKUP_DIR"
    sudo cp -r "$SERVER_DIR" "$BACKUP_DIR"
fi

# 清理服务器目录
echo "清理服务器目录..."
sudo rm -rf "$SERVER_DIR"/*

# 部署主应用
echo "部署主应用..."
if [ -d "base-scaffold-micro-app-main/dist/app-main" ]; then
    sudo cp -r base-scaffold-micro-app-main/dist/app-main/* "$SERVER_DIR/"
    echo "主应用部署完成"
else
    echo "警告: 主应用构建目录不存在，请先构建主应用"
fi

# 部署子应用
declare -A apps=(
    ["basic"]="base-scaffold-micro-app-basic"
    ["eam"]="base-scaffold-micro-app-eam"
    ["ips"]="base-scaffold-micro-app-ips"
    ["mes"]="base-scaffold-micro-app-mes"
    ["ppm"]="base-scaffold-micro-app-ppm"
    ["qms"]="base-scaffold-micro-app-qms"
    ["sys"]="base-scaffold-micro-app-sys"
)

for app_id in "${!apps[@]}"; do
    app_dir="${apps[$app_id]}"
    dist_dir="$app_dir/dist/app-$app_id"
    server_app_dir="$SERVER_DIR/app-$app_id"
    
    echo "部署 $app_id 服务..."
    if [ -d "$dist_dir" ]; then
        # 清理目标目录
        sudo rm -rf "$server_app_dir"
        # 直接复制整个app-xxx目录到服务器目录
        sudo cp -r "$dist_dir" "$SERVER_DIR/"
        echo "$app_id 服务部署完成"
    else
        echo "警告: $app_id 服务构建目录不存在，请先构建该服务"
    fi
done

# 设置权限
echo "设置文件权限..."
sudo chown -R nginx:nginx "$SERVER_DIR"
sudo chmod -R 755 "$SERVER_DIR"

# 检查Nginx配置
echo "检查Nginx配置..."
if sudo nginx -t; then
    echo "Nginx配置检查通过"
    echo "重启Nginx服务..."
    sudo systemctl reload nginx
    echo "Nginx服务重启完成"
else
    echo "错误: Nginx配置检查失败，请检查配置文件"
    exit 1
fi

echo "部署完成！"
echo "服务器目录: $SERVER_DIR"
echo "备份目录: $BACKUP_DIR"
echo "访问地址: http://your-domain.com"

# 显示部署结果
echo ""
echo "部署结果:"
ls -la "$SERVER_DIR"
echo ""
for app_id in "${!apps[@]}"; do
    if [ -d "$SERVER_DIR/app-$app_id" ]; then
        echo "✓ $app_id 服务: $SERVER_DIR/app-$app_id"
    else
        echo "✗ $app_id 服务: 未找到"
    fi
done 