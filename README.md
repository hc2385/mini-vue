# mini-vue

#### 介绍
仿vue3.0，做一个简易版的mini-vue

#### 软件架构
基于webpack打包工具,www为页面测试主目录，src为主要功能模块

#### 响应式数据说明
在reactive这个文件夹内部封装了ref，reactive，effect三个主要的响应式操作，computed是借助effect来实现的，reactive是借助proxy实现的
而ref则是借助了track跟踪，和trigger触发代理这样的操作实现的响应式。effect内部也是利用track和trigger实现，为了能多个effect同时运行，
内部采用map的存储方式，存储数据。

#### 渲染函数的说明
render函数为主要功能的函数，render_simple为第一版简单的实现版本
