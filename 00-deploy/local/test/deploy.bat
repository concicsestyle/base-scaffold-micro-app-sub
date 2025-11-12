@echo off

:: 登录到镜像仓库
type dockerHarborPwd.txt | docker login --username=admin --password-stdin hbr.sinomach-he.cn:12345

set REPOSITORY=hbr.sinomach-he.cn:12345/base-scaffold
set NAME=base-scaffold-admin-test
set VERSION=latest

:: 复制目录
robocopy ../../../dist/ ./dist/ /E

:: 打包推送
call docker build -f Dockerfile -t %REPOSITORY%/%NAME%:%VERSION% .
call docker push %REPOSITORY%/%NAME%:%VERSION%

:: 删除目录
rmdir /s /q "./dist"

:: 结束
echo Done.
