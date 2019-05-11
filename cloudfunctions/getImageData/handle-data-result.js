/**
 * @file 处理数据
 * @author Marx
 */

const getTextInfo = require('./get-text-info');

module.exports = function (res, imageUrl) {
    const data = res.result;
    let errMsg = '';
    let errno = res.error_code;
    if (!data) {
        if (res.error_code === 222304 || res.error_code === 222204) {
            errMsg = '图片过大';
        } else if (res.error_code === 222202) {
            errMsg = '图中无人';
        } else {
            errMsg = '服务端出现了问题';
        }
        return {
            errno,
            errMsg
        };
    }
    if (data.face_num > 0) {
        const personData = data.face_list[0];
        const result = getTextInfo(personData);
        result.imageUrl = imageUrl;
        return {
            errno: 0,
            data: result
        };
    }
};
