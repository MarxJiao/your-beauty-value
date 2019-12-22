let interstitialAd = null;
Page({
    data: {
        // 结果信息
        result: '',
        // 图片地址，用来显示图片。
        imageUrl: '',
        // 分享标题
        shareTitle: '想知道你的颜值吗？来测试下吧',
        // 其实是图片评价，开始时想做到分享后才展示的。
        shareMsg: '',
        // 错误信息
        errMsg: '',
        // loading 信息
        loadingMsg: '',
        // 上传按钮的文案
        uploadBtnText: '点击测量',
        // 程序运行状态 start, uploading, uploadError, analyzing, analyzeError, result
        status: 'start',
        // 用来标记广告状态
        showAdd: false,

        imagesView: [],
        backgroundUrl: '',
        themeBackground: ''
    },
    onShareAppMessage() {
        wx.reportAnalytics('log', {
            position: 'share',
            status: this.data.status
        })
        return {
            title: this.data.shareTitle
        };
    },
    onLoad() {
        if (wx.createInterstitialAd) {
            interstitialAd = wx.createInterstitialAd({
                adUnitId: 'adunit-4eaf816ccc1321e0' 
            });
            interstitialAd.onClose(res => {});
        }
        wx.cloud.callFunction({
            // 需调用的云函数名
            name: 'getTheme'
        }).then(res => {
            this.setData({
                backgroundUrl: res.result.backgroundUrl,
                themeBackground: res.result.backgroundUrl
            })
        });
    },

    setStatus(status, msg) {
        switch (status) {
            case 'start':
                this.setData({
                    status,
                    uploadBtnText: '点击测量',
                    backgroundUrl: this.data.themeBackground
                });
                break;
            case 'uploading':
                this.setData({
                    status,
                    loadingMsg: '图片上传中...'
                });
                break;
            case 'uploadError':
                this.setData({
                    status,
                    errMsg: '图片上传失败，请重试',
                    uploadBtnText: '重新测量'
                });
                break;
            case 'analyzing':
                this.setData({
                    status,
                    loadingMsg: '图片分析中...'
                });
                break;
            case 'analyzeError':
                this.setData({
                    status,
                    errMsg: msg,
                    uploadBtnText: '重新测量'
                });
                break;
            case 'result':
                this.setData({
                    status,
                    uploadBtnText: '重新测量',
                    backgroundUrl: ''
                });
                break;
        }
    },

    chooseIamge() {
        wx.reportAnalytics('log', {
            position: 'chooseImage',
            status: this.data.status
        })
        return new Promise((resolve, reject) => {
            wx.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
                success: res => {
                    this.setData({
                        imageUrl: res.tempFilePaths[0]
                    })
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
                imagesView: [this.data.imageUrl, result.data.imagesView[1]]
            });
            this.setStatus('result');
        }
        else {
            this.setStatus('analyzeError', result.errMsg);
        }
    },

    action() {
        this.chooseIamge().then(res => {
            this.setStatus('uploading');
            // 展示广告
            interstitialAd && interstitialAd.show().catch((err) => {});
            return this.doUpload(res);
        }).then(res => {
            this.setStatus('analyzing');
            return this.getImageInfo(res.fileID);
        }).then(res => {
            this.handleResult(res);
        }).catch(err => {
            // 这里暂时这样判断用户取消操作，用户取消不需要提示信息
            if (err && err.errMsg === 'chooseImage:fail cancel') {
                return;
            }
            this.setStatus('analyzeError', '程序出错，请稍后重试。或者点击帮助向客服反馈');
        });
    },

    reset() {
        this.setStatus('start');
        wx.reportAnalytics('log', {
            position: 'back',
            status: this.data.status
        })
    },

    viewImages() {
        if (this.data.imagesView && this.data.imagesView.length) {
            wx.previewImage({
                urls: this.data.imagesView
            });
        }
    }
});
