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
    if (personData.age > 10 && personData.age < 18) {
        personData.age = personData.age - 7;
    }
    const info = {
        age: personData.age,
        persent: (Math.pow(personData.beauty / 100, 1/2) * 100).toFixed(2),
        beauty: personData.beauty,
        expression: dataMap.expression[personData.expression.type],
        face_shape: dataMap.face_shape[personData.face_shape.type],
        gender: dataMap.gender[personData.gender.type],
        glasses: dataMap.glasses[personData.glasses.type],
        emotion: dataMap.emotion[personData.emotion.type],
        happieness: personData.beauty * 365
    };
    return {
        info,
        text: `${info.gender}，${info.age}岁，颜值${info.beauty}，超过了全球${info.persent}%的人，${info.face_shape}，${info.glasses}，${info.expression}。新年新气象，你的福气值高达${info.happieness}。`
    };
}

function getShareInfo(info) {
    let shareMsg = '';
    let shareTitle = '';
    if (info.gender === '男') {
        if (info.beauty > 70) {
            shareMsg = '你那笑魇如花的脸庞，宛若宠溺的桃花挂满枝头，只待微风轻拂，飘散芬芳';
            shareTitle = '你那笑魇如花的脸庞，宛若宠溺的桃花挂满枝头，只待微风轻拂，飘散芬芳。';
        }
        if (info.beauty > 60) {
            shareMsg = '明明可以靠脸吃饭，偏偏要靠才华';
            shareTitle = '我明明可以靠脸吃饭，偏偏要靠才华。';
        }
        else if (info.beauty > 50) {
            shareMsg = '清风拂面，朗朗君子大抵如此';
            shareTitle = '具测量，我英俊潇洒，一表人才。';
        }
        else if (info.beauty > 40) {
            shareMsg = '你是泰戈尔眼中的秋叶静美';
            shareTitle = '具测量，我长得很静美。';
        }
        else {
            if (info.age > 30) {
                shareMsg = '男人又老又丑不要紧，最重要的是要有才华。';
                shareTitle = '你是冬日暖阳的温存，你是落日余晖的惊艳。';
            }
            else if (info.age < 20) {
                shareMsg = '你是泰戈尔眼中的夏花绚丽';
                shareTitle = '我的颜值还在发育中，以后会好的。';
            }
            else {
                shareMsg = '男人又老又丑不要紧，最重要的是要有才华。';
                shareTitle = '你是冬日暖阳的温存，你是落日余晖的惊艳。';
            }
        }
    }
    else {
        if (info.beauty > 80) {
            shareMsg = '颜值已经突破天际，从你看似平淡的眼神中，看到了奥黛丽赫本的孤傲与芬芳';
            shareTitle = '我的颜值已经突破天际。';
        }
        if (info.beauty > 60) {
            shareMsg = '沉鱼落雁，闭月羞花';
            shareTitle = '我颜值不高，沉鱼落雁，闭月羞花而已。';
        }
        else if (info.beauty > 50) {
            shareMsg = '天生丽质。眼睛好亮！就像天空中最亮的星星';
            shareTitle = '我属于天生丽质那种。';
        }
        else if (info.beauty > 40) {
            shareMsg = '从你看似平淡的眼神中，看到了奥黛丽赫本的孤傲与芬芳';
            shareTitle = '经测量，我很有气质。';
        }
        else {
            if (info.expression !== '没笑') {
                shareMsg = '笑魇如花，貌美也如花';
            }
            else if (info.age > 30) {
                shareMsg = '你那笑魇如花的脸庞，宛若宠溺的桃花挂满枝头，只待微风轻拂，飘散芬芳';
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
