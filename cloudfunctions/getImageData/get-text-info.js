/**
 * @file 讲数字信息转换为文字
 * @author Marx
 */

const dataMap = {
    expression: {
        none: '没笑',
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
        none: '没带眼镜',
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
        neutral: '表情平静'
    },
    gender: {
        male: '男',
        female: '女'
    }
};


module.exports = function (personData) {
    const {info, text} = getBaseInfo(personData);
    const {shareMsg, shareTitle} = getShareInfo(info);
    return {
        text,
        shareMsg,
        shareTitle
    };
};

function getBaseInfo(personData) {
    const info = {
        age: personData.age,
        persent: personData.beauty + personData.beauty / 4 - .3,
        beauty: personData.beauty,
        expression: dataMap.expression[personData.expression.type],
        face_shape: dataMap.face_shape[personData.face_shape.type],
        gender: dataMap.gender[personData.gender.type],
        glasses: dataMap.glasses[personData.glasses.type],
        emotion: dataMap.emotion[personData.emotion.type]
    };
    return {
        info,
        text: `${info.gender}，${info.age}岁，颜值${info.beauty}，超过了全球${info.persent}%的人，${info.face_shape}，${info.glasses}，${info.expression}，${info.emotion}`
    };
}

function getShareInfo(info) {
    let shareMsg = '';
    let shareTitle = '';
    if (info.gender === '男') {
        if (info.beauty > 60) {
            shareMsg = '明明可以靠脸吃饭，偏偏要靠才华';
            shareTitle = '我明明可以靠脸吃饭，偏偏要靠才华。';
        }
        else if (info.beauty > 50) {
            shareMsg = '英俊潇洒，一表人才';
            shareTitle = '具测量，我英俊潇洒，一表人才。';
        }
        else if (info.beauty > 40) {
            shareMsg = '其貌不扬';
            shareTitle = '具测量，我长得很平凡。';
        }
        else {
            if (info.age > 30) {
                shareMsg = '男人又老又丑不要紧，最重要的是要有才华。';
                shareTitle = '男人又老又丑不要紧，最重要的是要有才华。';
            }
            else if (info.age < 20) {
                shareMsg = '颜值还在发育中，以后会好的。当然，也可能更差';
                shareTitle = '我的颜值还在发育中，以后会好的。';
            }
            else {
                shareMsg = '男人又老又丑不要紧，最重要的是要有才华。';
                shareTitle = '嗷呜~~~。';
            }
        }
    }
    else {
        if (info.beauty > 80) {
            shareMsg = '颜值已经突破天际';
            shareTitle = '我的颜值已经突破天际。';
        }
        if (info.beauty > 60) {
            shareMsg = '沉鱼落雁，闭月羞花';
            shareTitle = '我颜值不高，沉鱼落雁，闭月羞花而已。';
        }
        else if (info.beauty > 50) {
            shareMsg = '天生丽质';
            shareTitle = '我属于天生丽质那种。';
        }
        else if (info.beauty > 40) {
            shareMsg = '很有气质';
            shareTitle = '经测量，我很有气质。';
        }
        else {
            if (info.expression !== '没笑') {
                shareMsg = '笑魇如花，貌美也如花';
            }
            else if (info.age > 30) {
                shareMsg = '主要看气质。还有，多读书';
            }
            else {
                shareMsg = '如花美眷，似水年华';
            }
            shareTitle = '经测量，我貌美如花。';
        }
    }
    shareTitle += '你也来测试一下吧';
    return {
        shareMsg,
        shareTitle
    };
}
