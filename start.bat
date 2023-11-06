@echo off

REM 进入 practice_level 文件夹
cd practice_level

REM 设置 NODE_OPTIONS 变量
set NODE_OPTIONS=--openssl-legacy-provider

REM 启动 npm start 在后台运行
start npm start

REM 返回到上一级目录
cd ..

REM 进入 start 文件夹
cd start

REM 设置 NODE_OPTIONS 变量
set NODE_OPTIONS=--openssl-legacy-provider

REM 启动 npm start 在后台运行
start npm start

REM 返回到上一级目录
cd ..

REM 打开 index.html 文件
start index.html