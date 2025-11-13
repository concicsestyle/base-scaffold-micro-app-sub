@echo off
chcp 65001 > nul
setlocal EnableDelayedExpansion

rem Check version parameter
if "%1"=="" (
    echo Error: Please provide version parameter
    echo Usage: package-front.bat ^<version^>
    echo Example: package-front.bat 1.0
    exit /b 1
)

set VERSION=%1
set IMAGE_NAME=hbr.sinomach-he.cn:12345/mom-dev/web-basic-service:%VERSION%
set HARBOR_REGISTRY=hbr.sinomach-he.cn:12345

echo ======================================
echo Starting frontend packaging
echo Version: %VERSION%
echo Image: %IMAGE_NAME%
echo ======================================

rem Check if dist directory exists and delete it
if exist "dist" (
    echo Found dist directory, deleting...
    rmdir /s /q "dist"
    if !errorlevel! neq 0 (
        echo Error: Failed to delete dist directory
        exit /b 1
    )
    echo Dist directory deleted successfully
) else (
    echo Dist directory not found, skipping deletion
)

rem Execute npm build:dev command
echo Running build:dev command...
call npm run build:dev
if !errorlevel! neq 0 (
    echo Error: npm build:dev failed
    exit /b 1
)
echo Frontend build completed

rem Build Docker image
echo Building Docker image...
docker build -t %IMAGE_NAME% .
if !errorlevel! neq 0 (
    echo Error: Docker image build failed
    exit /b 1
)
echo Docker image built successfully

rem Login to Harbor
echo Logging in to Harbor registry...
docker login %HARBOR_REGISTRY%
if !errorlevel! neq 0 (
    echo Error: Harbor login failed
    exit /b 1
)
echo Harbor login successful

rem Push image
echo Pushing image to Harbor...
docker push %IMAGE_NAME%
if !errorlevel! neq 0 (
    echo Error: Image push failed
    exit /b 1
)

echo ======================================
echo Packaging and push completed!
echo Image: %IMAGE_NAME%
echo ======================================

endlocal
