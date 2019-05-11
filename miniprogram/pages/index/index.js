Page({
    data: {
        showResult: false,
        result: '',
        errorInfo: '',
        imageUrl: '',
        shareTitle: '想知道你的颜值吗？来测试下吧',
        shareMsg: ''
    },
    onShareAppMessage() {
        return {
            title: this.data.shareTitle
        };
    },

    chooseIamge() {
        return new Promise((resolve, reject) => {
            wx.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
                success: res => {
                    resolve(res);
                },
                fail: err => {
                    reject(err);
                }
            });
        });
    },

    // 上传图片
    doUpload: function (res) {
        const now = new Date();
        const folderName = now.getFullYear() + '-' + now.getMonth() + '/' + now.getDate();
        const filePath = res.tempFilePaths[0];
        const cloudPath = folderName + '/m' + now.getTime().toString(32) + Math.random().toString(36).substr(2) + filePath.match(/\.[^.]+?$/)[0];
        return wx.cloud.uploadFile({
            cloudPath,
            filePath
        });
    },

    getImageInfo(fileID) {
        return wx.cloud.callFunction({
            // 需调用的云函数名
            name: 'getImageData',
            // 传给云函数的参数
            data: {
                fileID,
            }
        });
    },

    handleResult(res) {
        const result = res.result;
        if (result.errno === 0 && result.data && result.data.text) {
            this.setData({
                result: result.data.text,
                shareMsg: result.data.shareMsg,
                shareTitle: result.data.shareTitle,
                imageUrl: result.data.imageUrl,
                showResult: true
            });
        }
        else {
            wx.showToast({
                title: result.errMsg,
                icon: 'none'
            });
        }
    },

    action() {
        this.chooseIamge().then(res => {
            wx.showLoading({
                title: '图片上传中'
            });
            return this.doUpload(res);
        }).then(res => {
            wx.showLoading({
                title: '图片分析中'
            });
            return this.getImageInfo(res.fileID);
        }).then(res => {
            wx.hideLoading();
            this.handleResult(res);
        }).catch(err => {
            // 这里暂时这样判断用户取消操作，用户取消不需要提示信息
            if (err && err.errMsg === 'chooseImage:fail cancel') {
                return;
            }
            wx.hideLoading();
            wx.showToast({
                icon: 'none',
                title: '程序出错，请稍后重试。或者向客服反馈'
            });
        });
    }
});
