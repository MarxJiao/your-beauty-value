// pages/help/help.js
Page({
    preview: function () {
        wx.reportAnalytics('log', {
            position: 'preview',
            status: 'none'
        });
        wx.previewImage({
            urls: ['cloud://xcx-0b2817.7863-xcx-0b2817-1257953462/active/qrcode.jpg']
        });
    }
})