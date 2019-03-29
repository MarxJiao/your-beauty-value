// 云函数入口文件
const cloud = require('wx-server-sdk');
const fs = require('fs');
const axios = require('axios');

cloud.init();

const { MY_TOKEN } = process.env;

// 云函数入口函数
exports.main = async (event, context) => {

  // 获取图片临时的 https 地址
  const imageUrl = await cloud.getTempFileURL({
    fileList: [event.fileID]
  }).then(res => {
    return res.fileList[0].tempFileURL
  });

  return axios({
    method: 'post',
    url: `https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=${MY_TOKEN}`,
    data: {
      image: imageUrl,
      face_field: 'age,beauty,expression,face_shape,gender,glasses,landmark,landmark72,landmark150,race,quality,eye_status,emotion,face_type',
      image_type: 'URL'
    }
  }).then(res => {
    res.data.imageUrl = imageUrl;
    res.data.env = process.env;
    return res.data;
  });
}