// 云函数入口文件
const cloud = require('wx-server-sdk');

const getAccessToken = require('./get-access-token');
const getFaceData = require('./get-face-data');
const handleResult = require('./handle-data-result');

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {

    // 获取图片临时的 https 地址
    const imageUrl = await cloud.getTempFileURL({
        fileList: [event.fileID]
    }).then(res => {
        return res.fileList[0].tempFileURL;
    });

    let token = '';
    try {
        token = await getAccessToken();
    }
    catch (err) {
        return {
            errno: 9404,
            errMsg: 'Get access token fail!'
        };
    }

    let faceData = {};
    try {
        faceData = await getFaceData({token, imageUrl});
        return handleResult(faceData, imageUrl);
    }
    catch (err) {
        return {
            errno: 9405,
            errMsg: '获取人脸信息失败'
        };
    }
};
