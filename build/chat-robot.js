const request = require('request');
const tools = require('./tools');
const md5 = require("blueimp-md5");
const dotenv = require('dotenv').config();

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const ROBOT_ID = dotenv.parsed.ROBOT_ID;
const ROBOT_PWD = dotenv.parsed.ROBOT_PWD;
const CHATROOM = ['primary', 'vip'];

const APP_KEY = dotenv.parsed.APP_KEY;
const APP_SECRET = dotenv.parsed.APP_SECRET;

const BASEURL = {
  chat: 'https://lt.318app.com',
  fh: tools.getSetting().api_domain,
}
const MESSAGE_TIMER = {};
const TIME = {};
// 机器人账号信息
const ROBOT = {
  userId: ROBOT_ID,
  password: ROBOT_PWD,
}
// apiURL
const API = {
  signIn: '/api/v1/mobile/SignIn',
  lotteryInfo: '/api/v1/mobile/CurrentLotteryInfo3',
  lotteryList: '/api/v1/mobile/LotteryHall'
}
// 登录
const signIn = (user_id, password, lotterList) => {
  request.post({
    url: `${BASEURL.fh}${API.signIn}`,
    form: {
      user_id,
      password,
    },
  },
    (err, response, body) => {
      try {
        console.log('OUTPUT: 登录成功');
        const { result } = JSON.parse(body);
        for (let i = 0; i < lotterList.length; i++) {
          const item = lotterList[i];
          getLotteryOpenTime(item.lottery_id, item.lottery_code, result.token);
        }
      } catch (error) {
        console.log('OUTPUT: 登录失败->' + error);
      }
    })
}

// 获取彩票列表
const getLotteryList = (callback) => {
  request.get({
    url: `${BASEURL.fh}${API.lotteryList}`,
  },
    (err, response, body) => {
      try {
        console.log('OUTPUT: 获取彩票列表');
        const { result } = JSON.parse(body);
        const lotterList = tools.filterLotteryList(tools.getWhiteList(), result);
        callback(lotterList)
      } catch (error) {
        console.log('OUTPUT: 获取彩票列表失败->' + error);
      }
    })
}

// 获取距离封盘时间
const getLotteryOpenTime = (lottery_type, lottery_code, token) => {
  const query = tools.getQueryParams({ lottery_type, token });
  request.get({
    url: `${BASEURL.fh}${API.lotteryInfo}?${query}`,
  },
    (err, response, body) => {
      try {
        console.log('OUTPUT: 获取彩种开奖信息->' + lottery_type);
        const { result } = JSON.parse(body);
        setMessageTimer(lottery_type, lottery_code, result, token);
      } catch (error) {
        console.log('OUTPUT: 获取彩票开奖信息失败->' + error);
        setTimeout(() => {
          getLotteryOpenTime(lottery_type, lottery_code, token);
        }, 5000);
      }
    })
}

// 设置消息定时器
const setMessageTimer = (lottery_type, lottery_code, result, token) => {
  const { during, rate, noBetTime } = tools.getLotteryConfig(lottery_type)
  const schedule = tools.makeTimeSchedule(during, result.remain_seconds, rate);
  console.log('OUTPUT: 获取机器人时间表' + lottery_type + '-> schedule', JSON.stringify(schedule));

  TIME[lottery_type] = Math.round(result.remain_seconds);

  clearInterval(MESSAGE_TIMER[lottery_type]);
  MESSAGE_TIMER[lottery_type] = setInterval(() => {
    TIME[lottery_type]--;
    if (TIME[lottery_type] > 0 && schedule.includes(TIME[lottery_type])) {
      const isBetTime = !(new Date().getTime() >= noBetTime.start && new Date().getTime() <= noBetTime.end);
      console.log('OUTPUT: 彩种' + lottery_type + '可发送聊天信息->', isBetTime);
      if (isBetTime) {
        const { userId, nickName, avatar } = tools.getRandomRobotUser();
        // sendRobotMessage(userId, String(lottery_type), nickName, tools.getRandomBetMessage(lottery_type), avatar);
        let n = 0;
        while (n < CHATROOM.length) {
          sendRobotMessage(
            userId,
            CHATROOM[n],
            nickName,
            tools.getRandomBetMessage(lottery_type, result.current_issue_no),
            avatar);
          n++;
        }
      }
    }
    if (TIME[lottery_type] <= -result.lock_seconds) {
      getLotteryOpenTime(lottery_type, lottery_code, token);
    }
  }, 1000);
}

/**
 * 发送聊天信息
 * @param {*} sentUser 用户id
 * @param {*} targetId 房间id
 * @param {*} name 用户昵称
 * @param {*} msg 消息
 * @param {*} avatar 用户头像
 */
const sendRobotMessage = (sentUser, targetId, name, msg, avatar, ) => {
  if (sentUser && targetId && name && msg && avatar) {
    const nowTime = String(Date.now());
    const signStr = JSON.stringify({
      app_secret: APP_SECRET,
      avatar,
      msg,
      msgType: 'user_bet',
      name,
      sentTime: nowTime,
      sentUser: String(sentUser),
      targetId: targetId,
    }) + APP_KEY;

    request.post({
      url: `${BASEURL.chat}/chat-api/message`,
      form: {
        avatar,
        msg,
        msgType: 'user_bet',
        name,
        sentTime: nowTime,
        sentUser,
        targetId,
        app_secret: APP_SECRET,
        sign: md5(signStr),
      },
    },
      (err, response, body) => {
        // console.log('OUTPUT: sendRobotMessage -> body', body);
        if (err) {
          console.log('OUTPUT: 发送消息失败->' + err);
        }
      })
  }
}

const chatRobotService = () => {
  getLotteryList((lotterList) => {
    signIn(ROBOT.userId, ROBOT.password, lotterList);
  })
}

module.exports = chatRobotService();
