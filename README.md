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
render_simple.js为第一版简单的实现版本，render.js为主要功能的函数。
我将render渲染拆分了3步 总patch（粗略的比对，判断我们要怎么做） --> process（判断要怎么执行） --> 具体的patch，具体的mount 或者 具体的unmount（具体的执行）
