const qs = require('qs');
const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const dotenv = require('dotenv').config();
const robotsMock = require('./robot-mock');

// 获取指定时间的时间戳
const getDateTimestamp = (num, hour, minute, second = 0) => {
  const date = new Date().getTime() - (24 * 3600 * 1000 * num);
  return new Date(date).setHours(hour, minute, second, 0);
}

/**
 * 新增彩种需要配置的两个地方
 * 1. LOTTERYWHITELIST
 * 2. LOTTERYTIMECONFIG
 */

let RANDOMTEMP = '';
// 重慶時時彩。幸運飛艇，北京pk10，广西快三，分分彩,五分彩, pc蛋蛋
const LOTTERYWHITELIST = [1, 13, 28, 20, 17, 21, 19];
//配置时间表密度 rate = 百分比率, min= 最低間隔 max=最高間隔
const _rate_1080 = [
  // { rate: 20, min: 2, max: 15 },
  // { rate: 50, min: 30, max: 60 },
  // { rate: 30, min: 1, max: 10 },
  { rate: 20, min: 30, max: 60 },
  { rate: 50, min: 60, max: 90 },
  { rate: 30, min: 15, max: 30 }
];
const _rate_240 = [
  // { rate: 20, min: 2, max: 10 },
  // { rate: 50, min: 20, max: 30 },
  // { rate: 30, min: 1, max: 5 },
  { rate: 20, min: 20, max: 30 },
  { rate: 50, min: 30, max: 60 },
  { rate: 30, min: 10, max: 20 }
];
// 配置机器人禁言时间（彩票封盘时间）
const LOTTERYTIMECONFIG = {
  1: { // 重庆时时彩
    during: 1080,
    rate: _rate_1080,
    noBetTime: {
      start: getDateTimestamp(-1, 23, 50),
      end: getDateTimestamp(0, 00, 30),
    }
  },
  20: { // 北京PK10
    during: 1080,
    rate: _rate_1080,
    noBetTime: {
      start: getDateTimestamp(-1, 23, 50),
      end: getDateTimestamp(0, 09, 30),
    }
  },
  21: { // 广西K3
    during: 1080,
    rate: _rate_1080,
    noBetTime: {
      start: getDateTimestamp(-1, 22, 30),
      end: getDateTimestamp(0, 09, 30),
    }
  },
  13: { // 五分彩
    during: 240,
    rate: _rate_240,
    noBetTime: {}
  },
  17: { // 分分彩
    during: 40,
    rate: [
      // { rate: 100, min: 1, max: 3 },
      { rate: 100, min: 10, max: 30 },
    ],
    noBetTime: {}
  },
  28: { // 幸运飞艇
    during: 240,
    rate: _rate_240,
    noBetTime: {
      start: getDateTimestamp(0, 04, 04),
      end: getDateTimestamp(0, 13, 09),
    }
  },
  19: { // pc蛋蛋
    during: 260,
    rate: _rate_240,
    noBetTime: {
      start: getDateTimestamp(-1, 23, 55),
      end: getDateTimestamp(0, 09, 05),
    }
  },
}

// 获取键盘配置
const getKeyboardData = () => {
  try {
    const keyboard = yaml.load(
      fs.readFileSync(path.resolve(__dirname, '../src/yml/keyboard.yml'), 'utf8')
    );
    return keyboard;
  } catch (e) {
    console.log(e);
  }
}
const keyboard = getKeyboardData();

// 获取域名配置
const getSetting = () => {
  const setting = {};
  setting.api_domain = dotenv.parsed.SYSTEM_API_DOMAIN;
  setting.static_resource_path = dotenv.parsed.SYSTEM_STATIC_RESOURCE_PATH;
  return setting;
}
exports.getSetting = getSetting;

// 获取白名单彩种
exports.getWhiteList = () => {
  return LOTTERYWHITELIST;
}

// 过滤出彩票白名单
exports.filterLotteryList = (whiteList, lotteryList) => {
  const list = [];
  whiteList.forEach((id) => {
    lotteryList.forEach((item) => {
      if (id === item.lottery_id) {
        list.push(item);
      }
    });
  });
  return list;
}


// 转换id=1&token=123这种格式
exports.getQueryParams = (obj) => {
  return qs.stringify(obj);
}

// 生成机器人资料
makeRobotUser = (array) => {
  let i = 0;
  let robots = [];
  while (i <= (array.length - 1)) {
    const item = {};
    item.userId = i + 1;
    item.nickName = array[i];
    let random = Math.round(1 + Math.random() * 37);
    random = random < 10 ? ('0' + random) : random;
    const prefix = Math.round(Math.random()) === 0 ? 'girl' : 'boy';
    item.avatar = `${getSetting().static_resource_path}avatar/${prefix}-${random}.jpg`;
    robots[i] = item;
    i++;
  }
  return robots;
}
// 所有机器人资料
const ROBOTS = makeRobotUser(robotsMock);

// 获取机器人资料
exports.getRandomRobotUser = () => {
  const robots = ROBOTS;
  let random = Math.round(Math.random() * (robots.length - 1));
  if (RANDOMTEMP === random) {
    random = Math.round(Math.random() * (robots.length - 1));
  }
  RANDOMTEMP = random;
  return robots[random];
}

// 获取随机的下注金额
const getRandomMoney = (count, gameType) => {
  const base = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const randomBase = base[Math.round(Math.random() * (base.length - 1))];
  const zero = [1, 2,];
  const randomZero = zero[Math.round(Math.random() * (zero.length - 1))];
  let money = randomBase * count * (Math.pow(10, randomZero));
  if (+gameType === 19 && money < 10) {
    // 因为pc蛋蛋单注不能低于10元，需要特殊处理
    money = 10 * count * (Math.pow(10, randomZero));;
  }
  return money + '.00';
}

// 组装消息格式
const makeRandomContent = (count, gameName, issue, gameType, playType, playName, content) => {
  if (count === 1) {
    const betKey = Object.keys(content[0])[0];
    const betValue = Object.values(content[0])[0];
    const randomValue = betValue[Math.round(Math.random() * (betValue.length - 1))];
    return `${gameName}/${issue}/${playName}/${betKey}:${randomValue}/${getRandomMoney(1, gameType)}`;
  } else {
    let str = '';
    const randomValueTemp = [];
    for (let i = 0; i < count; i++) {
      /**
       * content长度为一，同时需要选两个号码以上才合法的玩法
       * ssc二星组选: 后二选二，前二选二
       * k3三不同号，二不同号
       */
      const item = content.length === 1 ? content[0] : content[i];
      const betKey = Object.keys(item)[0];
      let betValue = Object.values(item)[0];
      const randomIndex = Math.round(Math.random() * (betValue.length - 1));
      const randomValue = getValueByFilterPlayType(playType, betValue, randomIndex, randomValueTemp);
      randomValueTemp[i] = randomValue;
      if (content.length === 1) {
        str += `${randomValue},`;
      } else {
        str += `${betKey}:${randomValue}|`;
      }
    }
    if (content.length === 1) {
      const betKey = Object.keys(content[0])[0];
      str = str.substring(0, str.length - 1);
      const _str = `${betKey}:${str}`;
      return `${gameName}/${issue}/${playName}/${_str}/${getRandomMoney(content.length, gameType)}`;
    } else {
      str = str.substring(0, str.length - 1);
      return `${gameName}/${issue}/${playName}/${str}/${getRandomMoney(content.length, gameType)}`;
    }
  }
}

// 过滤玩法
const getValueByFilterPlayType = (playType, betValue, randomIndex, randomValueTemp) => {
  let randomValue = betValue[randomIndex];

  switch (playType) {
    case 1: // k3二同号单选
    case 3: // k3二不同号
    case 4: // k3三不同号
    case 200: // pk10/xyft猜冠亚军
    case 300: // pk10/xyft前三名
    case 25: // ssc后二组选组二
    case 27: // ssc前二组选组二
      // if (playType === 3 || playType === 4) {
      //   console.log('OUTPUT: getValueByFilterPlayType -> randomValueTemp', randomValueTemp);
      // }
      if (randomValueTemp.includes(randomValue)) {
        const _betValue = [...betValue];
        _betValue.splice(randomIndex, 1);
        const _randomIndex = Math.round(Math.random() * (_betValue.length - 1));
        randomValue = _betValue[_randomIndex];
        getValueByFilterPlayType(playType, _betValue, _randomIndex, randomValueTemp);
      }
      break;
    default:
      break;
  }
  return randomValue;
}

// 获取随机下注消息
exports.getRandomBetMessage = (lottery_type, issue) => {
  const { game_type } = keyboard;
  const lottery = game_type.filter(item => item.type === lottery_type)[0];
  const gameType = lottery.type;
  const gameName = lottery.name;
  const betType = lottery.bet_type;
  const randomBetType = betType[Math.round(Math.random() * (betType.length - 1))];
  const play = randomBetType.play;
  const randomPlay = play[Math.round(Math.random() * (play.length - 1))];
  const playName = randomPlay.name;
  const playType = randomPlay.rule_id;
  const content = randomPlay.keys;
  switch (playType) {
    case 25: // ssc后二组选组二
    case 27: // ssc前二组选组二
    case 3: // k3二不同号
      // 必须选两个号码才合法
      return makeRandomContent(2, gameName, issue, gameType, playType, playName, content);
    case 4: // k3三不同号
      // 必须选三个号码才合法
      return makeRandomContent(3, gameName, issue, gameType, playType, playName, content);
    case 32: // ssc定位胆
    case 400: // pk10定位胆
    case 500: // pk10两面
      // 随机注数都是合法的
      const random = Math.round(Math.random() * (content.length - 1) + 1);
      return makeRandomContent(random, gameName, issue, gameType, playType, playName, content);
    default:
      return makeRandomContent(content.length, gameName, issue, gameType, playType, playName, content);
  }
}

// 获取彩票开盘-封盘时间配置
exports.getLotteryConfig = (lotteryId) => {
  return LOTTERYTIMECONFIG[lotteryId];
}


// 隨機投注間隔時間(秒)
const _betInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// 合并数组
const _flatten = (arr) => {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? _flatten(toFlatten) : toFlatten);
  }, []);
}

// 获取投注时间表
const _getSchedule = (startTime, endTime, startInterval, endInterval) => {
  var times = [];
  var time = startTime;
  while (time > endTime) {
    let betTime = _betInterval(startInterval, endInterval);
    time -= betTime;
    times.push(time)
    if (time <= endInterval) {
      break;
    }
  }
  return times;
}

// 生成投注时间表
exports.makeTimeSchedule = (duration, currentTime, rate) => {
  let objs = [];
  let proportion = 0;
  let time = duration;
  rate.forEach((item, index) => {
    proportion += (item.rate / 100);
    objs.push(_getSchedule(time,
      time - (time * proportion),
      item.min, item.max));
    time = objs[index][objs[index].length - 1]
  })
  return _flatten(objs).filter((x) => {
    return x < currentTime;
  });;
}

