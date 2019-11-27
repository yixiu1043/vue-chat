import Axios from 'axios';
import Req from '@/api/request';
import store from '../store';
import UserService from './user';
import chatCloud from '@/lib/chatCloud';
import { appConfig } from '@/config';
import { showToast } from './helper';

// 返回状态码
// 0        错误提示
// 1        操作成功
// 401      身份验证失败
// 403      拒绝执行此请求（请求地址不正确）
// 405      请求方法不被允许
// 422      参数验证失败
// 500      服务端错误
// 1002     禁止发言

export default class ChatService {
  /**
   * 融云服务启动函数
   */
  static chatCloudStart() {
    const { userInfo } = store.state;
    const { encryt_user_id, avatar, nick_name } = userInfo;
    Req.getChatCloudToken(encryt_user_id, nick_name, avatar)
      .then(({ data }) => {
        chatCloud.start(encryt_user_id, nick_name, avatar, data.token);
        ChatService.messageReceiver();
        ChatService.multiTerminalLogin();
        chatCloud.login((result) => {
          if (!result.status) {
            showToast(result.msg);
            ChatService.reconnect();
            return;
          }
          console.log(`userId:${result.data.userId}`);
          store.commit('SET_CHATCLOUD_CONNECT', true);
        });
      });
  }

  /**
   * 获取聊天室
   */
  static getChatRoomList() {
    Req.getChatRoomList()
      .then((result) => {
        if (!result.status) {
          showToast(result.error);
          return;
        }
        store.commit('SET_CHATROOM_LIST', result.data);
      });
  }

  /**
   * 获取聊天时间段
   */
  static getSendChatTime() {
    Req.getSendChatTime()
      .then((result) => {
        if (!result.status) {
          showToast(result.error);
          return;
        }
        store.commit('SET_SEND_CHAT_TIME', result.data);
      });
  }

  /**
   * 获取当前聊天室的彩票白名单
   * @param {array} allLottery
   * @param {array} lotteryIds
   * @returns {array}
   */
  static getChatRoomLotteryWhiteList(allLottery, lotteryIds) {
    const lotteryWhiteList = [];
    allLottery.forEach((item) => {
      lotteryIds.forEach((id) => {
        if (item.lottery_id === id) {
          lotteryWhiteList.push(item);
        }
      });
    });
    return lotteryWhiteList;
  }

  /**
   * 消息监听函数
   */
  static messageReceiver() {
    const { encryt_user_id } = store.state.userInfo;
    chatCloud.messageReceiver((result) => {
      // console.log('OUTPUT: messageReceiver -> result', result);
      switch (result.status) {
        case 0:
          showToast(result.msg);
          return;
        case 1002: // 已被禁言
          showToast(result.msg);
          return;
        default:
          break;
      }
      store.commit('ADD_CHAT_LIST', ChatService.makeChatDetailData(
        // encryt_user_id === result.data.sentUser ? 'me' : result.data.msgType,
        ChatService.setMessageType(encryt_user_id, result.data),
        result.data.msg,
        result.data.avatar,
        result.data.name,
        result.data.messageId,
        result.data.targetId,
        result.data.receivedTime,
        result.data.sentTime,
        result.data.sentUser,
      ));
    });
  }

  // 设置消息类型
  static setMessageType(id, data) {
    if (id === data.sentUser && data.msgType === 'user') {
      return 'me';
    }
    if (id === data.sentUser && data.msgType === 'me_img') {
      return 'me_img';
    }
    if (id === data.sentUser && data.msgType === 'me_emoji') {
      return 'me_emoji';
    }
    return data.msgType;
  }

  /**
   * 监听多端登录
   */
  static multiTerminalLogin() {
    chatCloud.multiTerminalLogin((result) => {
      // console.log('OUTPUT: multiTerminalLogin', result);
      if (result.status) {
        ChatService.disconnect();
        UserService.forceLogout();
      }
    });
  }

  /**
   * 加入聊天室
   * @param chatRoomId
   * @param success
   */
  static joinChatRoom(chatRoomId, success) {
    chatCloud.joinRoom(chatRoomId, (result) => {
      if (!result.status) {
        showToast(result.msg);
        ChatService.reconnect();
        return;
      }
      success();
    });
  }

  /**
   * 退出聊天室
   * @param chatRoomId
   * @param success
   */
  static quitChatRoom = (chatRoomId, success) => {
    chatCloud.leaveRoom(chatRoomId, (result) => {
      if (!result.status) {
        showToast(result.msg);
        ChatService.reconnect();
        return;
      }
      success();
    });
  };

  /**
   * 发送云端消息
   * @param content { msg, msgType, avatar, sentUser }
   * @param success
   * @param error
   */
  static sendPersonMessage(content, success) {
    chatCloud.sendMessage(content, (result) => {
      if (!result.status) {
        showToast(result.msg);
        ChatService.reconnect();
        return;
      }
      if (success) { success(); }
    });
  }

  /**
   * 发送本地消息
   * @param msgType
   * @param message
   * @param avatar
   * @param sentUser
   */
  static sendPrivateMessage(
    msgType,
    message,
    avatar,
    sentUser,
  ) {
    store.commit('ADD_CHAT_LIST', ChatService.makeChatDetailData(
      msgType,
      message,
      avatar,
      sentUser,
      (Math.random() * 10000),
      'chatroom',
      Date.now(),
      Date.now(),
    ));
  }

  /**
   * 格式化聊天室資料
   * @param msgType
   * @param msg
   * @param avatar
   * @param sentUser
   * @param messageId
   * @param targetId
   * @param receivedTime
   * @param sentTime
   * @returns {{msg: *, targetId: *, receivedTime: *,
   * messageId: *, sentTime: *, avatar: *, type: *, sentUser: *}}
   */
  static makeChatDetailData(
    msgType,
    msg,
    avatar,
    sentUser,
    messageId,
    targetId,
    receivedTime,
    sentTime,
    sentUserId,
  ) {
    return {
      msgType,
      msg,
      avatar,
      sentUser,
      messageId,
      targetId,
      receivedTime,
      sentTime,
      sentUserId,
    };
  }

  /**
   * 重连接
   */
  static reconnect(success) {
    // 偵測有無網路，有網路則自動重新連線
    Axios.get('/')
      .then(() => {
        chatCloud.reconnect(() => {
          ChatService.sendPrivateMessage('system', '重连接聊天室成功', appConfig.systemAvatar, '系统消息');
          success();
        });
      })
      .catch(() => {
        ChatService.sendPrivateMessage('system', '连接聊天室失败，3秒后重连', appConfig.systemAvatar, '系统消息');
        setTimeout(() => {
          ChatService.reconnect();
        }, 3000);
      });
  }

  /**
   * 断开连接
   */
  static disconnect() {
    chatCloud.close();
  }
}
