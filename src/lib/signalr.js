import $ from 'jquery';
import 'signalr';
import './hubs';
import store from '@/store';
import router from '@/router';
import { appConfig } from '@/config';
import { SignalrApiUrl } from '@/api/url';
import ChatService from '../service/chat';
import UserService from '../service/user';
import LotteryService from '../service/lottery';

// 得到一个字符串的utf8编码，
// C#中通过 System.Text.Encoding.UTF8.GetString(bytes)解码为相应的字符串。
const encodeUtf8 = (text) => {
  const code = encodeURIComponent(text);
  const bytes = [];
  for (let i = 0; i < code.length; i++) {
    const c = code.charAt(i);
    if (c === '%') {
      const hex = code.charAt(i + 1) + code.charAt(i + 2);
      const hexVal = parseInt(hex, 16);
      bytes.push(hexVal);
      i += 2;
    } else {
      bytes.push(c.charCodeAt(0));
    }
  }
  return bytes;
};

const getAppId = () => {
  const { host } = window.location;
  const utf8Host = encodeUtf8(host);
  const base64Host = window.btoa(utf8Host);
  return base64Host;
};

const {
  encryt_user_id, encryt_user_type, encryt_user_number,
} = store.state.userInfo;

const mainHubProxy = $.connection.mainHub;
mainHubProxy.client.addContosoChatMessageToPage = (userName, message) => {
  console.log(`${userName} ${message} `);
};

// 接收websocket通知
mainHubProxy.client.getMessage = (message) => {
  // 6 结算完成
  // 3 开奖号码
  const { MessageType, Title, Content } = message;
  if (MessageType === 6) {
    UserService.updateUserInfo();
    ChatService.sendPrivateMessage('win', `${Title}: ${Content} `, appConfig.systemAvatar, '系统消息');
  }

  if (MessageType === 3) {
    const { lotteryWhiteList } = appConfig;
    const lotteryId = +Content.split('|')[1];
    if (lotteryWhiteList.includes(lotteryId)) {
      LotteryService.getLotteryList();
    }
    store.commit('SET_LOTTERY_LAST_OPEN', {
      type: Content.split('|')[1],
      issue: Content.split('|')[2],
      openNumber: Content.split('|')[3],
    });
  }
};

export const signalrStart = () => {
  console.log('系统开始连接');
  // 声明hub代理;
  const { domainSetting } = store.state;

  $.connection.hub.url = `${domainSetting.api_domain_signalr}${SignalrApiUrl}`;
  $.connection.hub.qs = {
    userName: encryt_user_id,
    userType: encryt_user_type,
    userId: encryt_user_number,
    appId: getAppId(),
  };

  $.connection.hub.start()
    .done(() => {
      console.log('系统连接成功');
    })
    .fail(() => {
      console.log('系统连接失败!');
      $.connection.hub.start();
    });

  $.connection.hub.error((err) => {
    console.log(`连接错误: ${err} `);
    if (router.currentRoute.path !== '/login') {
      setTimeout(() => {
        $.connection.hub.start();
      }, 8000);
    }
  });

  $.connection.hub.disconnected(() => {
    console.log('服务器连接断开');
    if (router.currentRoute.path !== '/login') {
      setTimeout(() => {
        $.connection.hub.start();
      }, 8000);
    }
  });
};
