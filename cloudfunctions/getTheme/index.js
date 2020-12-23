// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    return {
        backgroundUrl: 'https://6d79-my-test-5877bc-1257953462.tcb.qcloud.la/assets/bottom.png?sign=2f04602fb6eea9c5d44c1f70d8de8fe1&t=1608736452',
        // backgroundUrl: '',
        mainColor: '',
        subColor: ''
    }
}