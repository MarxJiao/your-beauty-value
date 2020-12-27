// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    return {
        backgroundUrl: 'https://6d79-my-test-5877bc-1257953462.tcb.qcloud.la/assets/2021-new-year.001.png?sign=8b7fe05c2203e38a4c88c6e1ef86b59a&t=1609078739',
        // backgroundUrl: '',
        mainColor: '',
        subColor: ''
    }
}