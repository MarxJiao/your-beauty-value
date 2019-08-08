let interstitialAd = null;
Page({
    data: {
        // 是否展示结果
        showResult: false,
        // 结果信息
        result: '',
        // 图片地址，用来显示图片。
        imageUrl: '',
        // 分享标题
        shareTitle: '想知道你的颜值吗？来测试下吧',
        // 其实是图片评价，开始时想做到分享后才展示的。
        shareMsg: '',
        // 提示信息，用来提示现在程序的状态，比如上传中，图片分析中。
        tipInfo: '',
        // 程序运行状态
        status: '',
        // 用来标记广告状态
        showAdd: false
    },
    onShareAppMessage() {
        return {
            title: this.data.shareTitle
        };
    },
    onLoad() {
        if (wx.createInterstitialAd) {
            interstitialAd = wx.createInterstitialAd({
                adUnitId: 'adunit-4eaf816ccc1321e0' 
            });
            interstitialAd.onClose(res => {
                if (this.data.status === 'success') {
                    this.setData({
                        showAdd: false,
                        showResult: true
                    });
                }
                else {
                    this.setData({
                        showAdd: false
                    });
                }
            })

        }
    },

    setStatus(status, msg) {
        switch (status) {
            case 'uploading':
                this.setData({
                    showResult: false,
                    tipInfo: '图片上传中'
                });
                break;
            case 'analysing':
                this.setData({
                    tipInfo: '图片分析中'
                });
                break;
            case 'fail':
                this.setData({
                    tipInfo: msg || ''
                });
                break;
            case 'success':
                this.setData({
                    tipInfo: ''
                });
        }
        this.setData({
            status
        })
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
                showResult: !this.data.showAdd
            });
            this.setStatus('success');
        }
        else {
            this.setStatus('fail', result.errMsg);
        }
    },

    action() {
        this.chooseIamge().then(res => {
            this.setStatus('uploading');
            // 展示广告
            interstitialAd && interstitialAd.show().then(res => {
                this.setData({
                    showAdd: true
                });
            }).catch((err) => {
                this.setData({
                    showAdd: false
                });
            })
            return this.doUpload(res);
        }).then(res => {
            this.setStatus('analysing');
            return this.getImageInfo(res.fileID);
        }).then(res => {
            this.handleResult(res);
        }).catch(err => {
            // 这里暂时这样判断用户取消操作，用户取消不需要提示信息
            if (err && err.errMsg === 'chooseImage:fail cancel') {
                return;
            }
            this.setStatus('fail', '程序出错，请稍后重试。或者向客服反馈');
        });
    }
});
