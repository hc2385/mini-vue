# mini-vue

#### 介绍
仿vue3.0，做一个简易版的mini-vue

#### 软件架构
基于webpack打包工具,www为测试页面主目录，src为主要功能模块

#### 实现的功能
```
一、runtime中实现的功能
    1、响应式数据ref，reactive
    2、监视函数 effect，计算函数computed
    3、简化版的渲染函数render_simple.js
    4、完成对这几种类型（数组，元素，组件，fragment，字符串/数字）的虚拟dom的渲染（render.js函数）
    5、完成patch函数（新旧dom的比较），内部实现了diff算法，完善了渲染功能
    6、组件可以传props（props目前只能传递数组类型）
    7、实现组件的调度函数getAllJobs，解决effect每次都要监视的问题。（schedule.js）
    8、实现nextTick（用的Promise实现的），在每个函数内部数据更新到dom之后进行的操作（schedule.js）
二、compiler中实现的功能
    1、将dom字符串转化为AST语法树（字符串 --> token数组 --> token数组转化为语法树） 
```


#### 响应式数据说明
```
1、在reactive这个文件夹内部封装了ref，reactive，effect三个主要的响应式操作。
2、computed是借助effect来实现的，reactive是借助proxy实现的
3、ref则是借助了track跟踪，和trigger触发代理这样的操作实现的响应式。
4、effect内部也是利用track和trigger实现，为了能多个effect同时运行，
内部采用map的存储方式，存储数据。
```


#### 渲染函数的说明
```
render_simple.js为第一版简单的实现版本，render.js为主要功能的函数。
我将render渲染拆分了3步：
  1、patch（粗略的比对，判断我们要怎么做）
  2、process（判断我用什么方式更新到dom上，是新旧dom更新，还是直接挂载，还是卸载） 
  3、具体的patch/具体的mount/具体的unmount（落实到具体的执行）
```

#### 组件操作的说明
```
1、组件props只能传递数组类型
2、目前组件更新的操作并没有去判断组件是否需要更新，而是遇到更新直接就更新
3、内部采用effect去追踪组件数据的变化，从而更新视图
4、重写调度函数getAllJobs，解决effect每次都要默认进行监视的问题。
```

#### nextTick
```
1、内部实现用的是Promise
2、原理就是该组件对应的effect方法执行之后，页面肯定是更新了，调用Promise.then方法去执行回调函数。
```

#### AST语法树的说明
```
1、AST语法树分为了7种，具体请看《AST数据类型.md》文件
2、实现AST的流程为，dom字符串-->token数组-->AST语法树
3、token实现思路：
    （1）、将html字符串从前往后扫描。包含一下三种内容
    （2）、将"<" 和">" 包裹的内容被认为是标签内容（可能包含属性，指令）
    （3）、将">" 和"<" 包裹的内容被认为是文本内容（可能包含文本，插值语法）
    （4）、将"</" 和"<" 包裹的内容被认为是结束内容
    （5）、返回一个一维的数组
4、AST语法树实现思路：
    （1）、循环token数组
    （2）、定义一个栈，用于保存上一次存储的父亲对象，定义一个collect，指向当前操作的孩子
    （3）、当遇到结束符号的时候，就出栈，更新collect为父亲的孩子
    （4）、若没遇到结束符号的时候，collect指向当前对象的孩子
```
