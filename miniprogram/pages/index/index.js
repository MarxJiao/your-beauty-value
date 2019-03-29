Page({
  data: {
    loading: false,
    result: false,
    noResult: false,
    noPerson: false,
    imageUrl: '',
    age: 0,
    beauty: 0,
    expression: '',
    face_shape: '',
    gender: '',
    glasses: '',
    emotion: '',
    filterData: {
      expression: {
        none: '面无表情',
        smile: '面带微笑',
        laugh: '兴高采烈'
      },
      face_shape: {
        square: '四方大脸',
        triangle: '三角脸',
        oval: '椭圆脸',
        heart: '脸程心形',
        round: '圆脸'
      },
      glasses: {
        none: '隐形眼镜',
        common: '文艺眼镜',
        sun: '带墨镜'
      },
      emotion: {
        angry: '情绪激愤',
        disgust: '心生厌恶',
        fear: '有些恐惧',
        happy: '心情不错',
        sad: '略带忧伤',
        surprise: '大吃一惊',
        neutral: '情绪稳定'
      },
      gender: {
        male: '男',
        female: '女'
      }
    }
  },

  showInfo(info) {
    this.setData(Object.assign({
      loading: false,
      result: false,
      noResult: false,
      noPerson: false
    },
    {
      [info]: true
    }));
  },

  chooseIamge() {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 1,
        sizeType: ['original'],
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
    const filePath = res.tempFilePaths[0];
    const cloudPath = 'my-image' + Math.random().toString(36).substr(2) + filePath.match(/\.[^.]+?$/)[0];
    return wx.cloud.uploadFile({
      cloudPath,
      filePath,
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
    console.log(res);
    const data = res.result.result;
    if (!data) {
      this.showInfo('noPerson');
      return;
    }
    if (data.face_num > 0) {
      const personData = data.face_list[0];
      this.setData({
        age: personData.age,
        beauty: personData.beauty,
        expression: this.data.filterData.expression[personData.expression.type],
        face_shape: this.data.filterData.face_shape[personData.face_shape.type],
        gender: this.data.filterData.gender[personData.gender.type],
        glasses: this.data.filterData.glasses[personData.glasses.type],
        emotion: this.data.filterData.emotion[personData.emotion.type],
        imageUrl: res.result.imageUrl
      });
      this.showInfo('result');
    }
  },

  action() {
    this.chooseIamge().then(res => {
      this.showInfo('loading');
      return this.doUpload(res);
    }).then(res => {
      return this.getImageInfo(res.fileID);
    }).then(res => {
      this.handleResult(res);
    }).catch(err => {
      // 这里暂时这样判断用户取消操作，用户取消不需要提示信息
      if (err && err.errMsg === 'chooseImage:fail cancel') {
        return;
      }
      this.showInfo('noResult');
    });
  }
});
