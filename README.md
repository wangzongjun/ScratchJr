我们是一群Scratch爱好者，感谢Scratch提供了非常棒的少儿编程工具。
ScratchJr是Scratch官方提供的面向5-7岁儿童，学习Scratch的入门工具。相比较Scratch而言，ScratchJr更加适合初学者。

官方开源地址[ScratchJr](https://github.com/LLK/scratchjr)，官方提供了iPad和Android平板版本。

[jfo8000](https://github.com/jfo8000/ScratchJr-Desktop/)提供了[window 和 Mac版本](https://jfo8000.github.io/ScratchJr-Desktop/)，安装后就可以体验ScratchJr。

**我们的目标是把ScratchJr修改为网页版本，在浏览器中就可以体验ScratchJr，同时保持与官方版本的兼容。**

网页版本当前修改计划：

1. 修改Bug
2. 实现类似Scratch中作品导入、导出的功能，以及云存储功能

---


与官方保持同步，目前更新到官方2020-9-14版本，这个版本的主要修改：
1. 统一iOS 和 Android与JS交互的接口，具体的见tablet\OS.js
2. 升级iOS底层，不再使用iOS已经废弃的WebView，使用新的WKWebView。
3. 增加新的国际化语言

**官方版本只考虑了iOS 和 Andorid，对网页支持的并不好，主要体现在以下几个方面：**

1. **事件点击**：官方版本点击事件使用的是ontouchstart/ontouchmove/ontouchend，网页版本在此基础上增加了onmousedown/onmousemove/onmouseup，详细修改见 utils/lib.js
2. **数据存储**：官方调用的是iOS 和 Andorid底层的API，iOS主要是sqlite数据库接口，网页版本也使用的sqlite接口，详细说明见tablet\Database.js。在这里额外说明下，**iOS系统上默认关闭了sqlite数据库存储的接口，由于Firefox不支持web SQL，所以网页版本目前不支持Firefox浏览器（支持Chome和Edge浏览器）**。
3. **录音/录制视频、声音播放功能**：官方调用的是iOS 和 Andorid底层的API，网页版本使用recordrtc实现录制功能，使用soundmanager2实现声音播放功能，详细说明见tablet\Web.js；


**tablet底层接口简要说明，目前包括三个平台：**
1. **Adnroid.js**：js调用Android底层API
2. **iOS.js**：js调用iOS底层API
3. **WebOS.js**：调用网页相关功能

在**OS.waitForInterface()**中获取平台相关信息，调用对应的平台。

## 使用

### window.JrConfig对象

scratchJr的配置，需要载入编辑器之前完成

```js
window.JrConfig = {
    //点击保存到云端按钮
    onSaveCloud: function(contents, name){
        //contents: sjr项目文件
        //name: 作品名称
    }
}

```

### window.ScratchJr对象

scratchjr对外暴露的接口

```js
//获取作品文件
window.ScratchJr.getProjectSjr((contents, name)=>{
    //contents: sjr项目文件
    //name: 作品名称
});
//获取作品封面
window.ScratchJr.getProjectCover((cover)=>{
    //cover：base64封面
});

//从URL加载sjr项目文件
window.ScratchJr.loadProjectSjr(url);
```