const md5 = require("blueimp-md5");
const express = require('express');
const request = require('request');
const tools = require('./tools');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const dotenv = require('dotenv').config();

const APP_KEY = dotenv.parsed.APP_KEY;
const APP_SECRET = dotenv.parsed.APP_SECRET;

const BASEURL = {
  chat: 'https://lt.318app.com',
  fh: tools.getSetting().api_domain,
}

const apiServerApp = express();

apiServerApp.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
})

// 获取token
apiServerApp.get('/user/token', function (req, res) {
  const userId = req.query.userId || '';
  const name = req.query.name || '';
  const avatar = req.query.avatar || '';
  const signStr = JSON.stringify({
    app_secret: APP_SECRET,
    avatar: req.query.avatar,
    name: req.query.name,
    userId: req.query.userId,
  }) + APP_KEY;

  request.post({
    url: `${BASEURL.chat}/chat-api/authorization`,
    form: {
      avatar,
      userId,
      name,
      app_secret: APP_SECRET,
      sign: md5(signStr)
    },
  },
    (err, response, body) => {
      try {
        res.json(JSON.parse(body));
      } catch (error) {
        console.log(error);
      }

    }
  )
})

// 获取域名设定
apiServerApp.get('/setting', function (req, res) {
  const dotenv = require('dotenv').config();
  const setting = {};
  // setting.app_key = dotenv.parsed.APP_KEY;
  setting.api_domain = dotenv.parsed.SYSTEM_API_DOMAIN;
  setting.api_domain_signalr = dotenv.parsed.SYSTEM_API_DOMAIN_SIGNALR;
  setting.title = dotenv.parsed.SYSTEM_TITLE;
  res.json(setting);
});

// 验证是否管理员
const auth = (token, res, callback) => {
  const query = tools.getQueryParams({ token });
  request.get({
    url: `${BASEURL.fh}/api/v1/mobile/UserInfo?${query}`,
  },
    (err, response, body) => {
      const { result } = JSON.parse(body);
      if (result.has_forbid_chatroom_right) {
        callback();
      } else {
        res.json({ error: '您没有权限！' });
      }
    }
  )
};

// 添加聊天室黑名单
apiServerApp.get('/chatroom/user/block', function (req, res) {
  const userId = req.query.userId || '';
  const status = req.query.status || '';
  const token = req.query.token || '';
  const signStr = JSON.stringify({
    app_secret: APP_SECRET,
    status: String(status),
    userId: String(userId),
  }) + APP_KEY;

  auth(token, res, () => {
    request.put({
      url: `${BASEURL.chat}/chat-api/bannedStatus`,
      form: {
        userId,
        status,
        app_secret: APP_SECRET,
        sign: md5(signStr),
      },
    },
      (err, response, body) => {
        // console.log('OUTPUT: body', body);
        res.json(JSON.parse(body));
      }
    )
  })
})

//获取聊天室列表
apiServerApp.get('/chatroom/list', function (req, res) {
  res.json({
    error: 0,
    data: [
      {
        id: 'primary',
        name: '初级聊天室',
      },
      {
        id: 'vip',
        name: 'vip聊天室',
      },
    ],
    status: 1,
  });
})

//获取可以聊天发送表情和发图片的时间段
apiServerApp.get('/chatroom/send_chat_time', function (req, res) {
  res.json({
    error: 0,
    data: {
      start: 11,
      end: 24
    },
    status: 1,
  });
})

module.exports = apiServerApp;
