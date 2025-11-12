```bash
# 安装依赖
pnpm i
或者
npm install --registry=https://registry.npmmirror.com
```

### 微前端应用说明
1. 如需关闭微前端，注释掉 VITE_APP_MICRO_APP_FLAG 即可
2. 主应用/子应用不支持部署配置上下文，请使用独立域名部署
3. VITE_APP_MICRO_APP_CODE 应用编码必须以 sub-micro-app-开头，例如：sub-micro-app-xxx，否则无法解析
4. 主应用/基础平台在配置菜单时，菜单编码需要和子应用配置VITE_APP_MICRO_APP_CODE对应，路径也必须包含VITE_APP_MICRO_APP_CODE
