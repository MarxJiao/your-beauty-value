// 云函数入口文件
const cloud = require('wx-server-sdk');

const getAccessToken = require('./get-access-token');
const getFaceData = require('./get-face-data');
const handleResult = require('./handle-data-result');

cloud.init();


async function addFile(fileId) {
    const db = cloud.database({
        env: cloud.DYNAMIC_CURRENT_ENV
    });
    try {
        return await db.collection('files').add({
            // data 字段表示需新增的 JSON 数据
            data: {
                fileId,
                createTime: new Date(),
                openId: cloud.getWXContext().OPENID
            }
        })
    } catch (e) {
        console.error(e)
    }
}

// 云函数入口函数
exports.main = async (event, context) => {
    addFile(event.fileID);

    let imageBase64 = '';
    try {
        const res = await cloud.downloadFile({
            fileID: event.fileID
        });
        imageBase64 = res.fileContent.toString('base64');
    }
    catch (err) {
        return {
            errno: 9406,
            errMsg: '获取图片失败!'
        };
    }

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
        faceData = await getFaceData({token, image: imageBase64});
        return handleResult(faceData);
    }
    catch (err) {
        return {
            errno: 9405,
            errMsg: '获取人脸信息失败'
        };
    }
};

