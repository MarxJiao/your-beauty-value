# 颜值测试小程序

使用小程序云函数和百度云的 ai 接口做的一个颜值测试小程序。（审核中，还没发布）

Serverless 的开发体验很棒。

## 实现过程

使用 `wx.chooseImage` 选择图片，使用 `wx.cloud.uploadFile` 上传图片并获取到图片的 `fileID`，传给自己写的云函数`getImageData`。

云函数中使用 `cloud.getTempFileURL` 获取到图片 https 协议的临时路径，把图片路径传给百度云接口，获取到信息后返回给前端。

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [百度云人脸检测接口文档](http://ai.baidu.com/docs#/Face-Detect-V3/top)

