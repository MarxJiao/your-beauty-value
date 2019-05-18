//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: 'xcx-0b2817'
        // env: 'my-test-5877bc'
      })
    }

    this.globalData = {}
  }
})
