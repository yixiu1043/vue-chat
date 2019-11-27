import {
  showToast, showLoading, hideLoading, randomNumber,
} from './helper';
import UserStorage from '../storage/user';
import Req from '@/api/request';
import store from '../store';
import { onlineMemberCount } from '@/mock';
import { appConfig } from '@/config';

export default class UserService {
  // 確認用戶是否能發言
  static CheckChatStatusInChatRoom = () => Req.CheckChatStatusInChatRoom()
    .then(data => data);

  // 確認用戶是否有被鳳凰禁言
  static forbidSpeakInChatRoom = () => Req.forbidSpeakInChatRoom()
    .then(data => data);

  // 確認token是否還有效
  static checkToken = () => Req.checkToken(store.state.userInfo.user_id);

  /**
   * 獲取使用者資訊
   * @param token
   * @returns {Promise<{frozen_amount: *, user_id, total_amount: *,
   * nick_name: *, avatar: *} | never>}
   * chatroom_types:array,1：初级聊天室，2：vip聊天室；
   */
  static getUserInfo = token => Req.userInfo(token)
    .then(res => ({
      user_id: res.result.user_id,
      has_forbid_chatroom_right: res.result.has_forbid_chatroom_right,
      avatar: res.result.avatar,
      chatrooms: res.result.chatrooms,
      nick_name: res.result.nick_name,
      total_amount: res.result.total_amount,
      frozen_amount: res.result.frozen_amount,
      encryt_user_id: res.result.encryt_user_id,
      encryt_user_type: res.result.encryt_user_type,
      encryt_user_number: res.result.encryt_user_number,
    }));

  /**
   * 更新使用者資訊
   */
  static updateUserInfo = async () => UserService.getUserInfo(store.state.token)
    .then((res) => {
      const userInfo = {
        ...res,
        isAdmin: res.has_forbid_chatroom_right,
      };

      store.commit('UPDATE_USER_INFO', userInfo);
      UserStorage.setUserInfo(userInfo);
      return Promise.resolve();
    })
    .catch((error) => {
      showToast(error.response.message);
      return Promise.reject();
    });

  /**
   * 使用者登入
   * @param username
   * @param password
   * @returns {Promise<any | never | never>}
   */
  static login = (username, password) => {
    showLoading('登录中...');
    return Req.signIn(username, password)
      .then((res) => {
        if (!res.status) {
          showToast(res.error);
          hideLoading();
          return false;
        }

        if (res.result.token) {
          // 存入本地做為登入檢測用
          UserStorage.setToken(res.result.token);
          const userInfo = {
            ...res.result,
            isAdmin: res.result.has_forbid_chatroom_right,
          };
          store.commit('UPDATE_USER_INFO', userInfo);
          UserStorage.setUserInfo(userInfo);
          store.commit('SET_TOKEN', res.result.token);
          store.commit('SET_LOGIN', true);
          hideLoading();
          return true;
        }

        return false;
      });
  };

  static logout = (callback) => {
    UserStorage.clean(() => {
      store.commit('SET_TOKEN', '');
      store.commit('SET_LOGIN', false);
      if (callback) {
        callback();
      }
    });
  };

  static forceLogout = () => {
    UserService.logout(() => {
      const timer = setTimeout(() => {
        window.location.reload();
        clearTimeout(timer);
      }, 1000);
    });
  };

  /**
   * 使用者註冊
   */
  static register = (data) => {
    showLoading('注册中...');
    return Req.register(UserService.makeRegisterData(data))
      .then((res) => {
        hideLoading();
        if (!res.status) {
          showToast(res.error);
          return false;
        }
        showToast(res.result);
        return true;
      });
  };

  /**
   * 更改用户昵称
   */
  static setUserNickName = name => Req.setUserNickName(name)
    .then((res) => {
      if (!res.status) {
        showToast(res.error);
        return false;
      }
      return UserService.updateUserInfo().then(() => {
        showToast(res.result);
      });
    })

  /**
   * 更改用户头像
   */
  static setUserAvatar = avatar => Req.setUserAvatar(avatar)
    .then((res) => {
      if (!res.status) {
        showToast(res.error);
        return false;
      }
      return UserService.updateUserInfo().then(() => {
        showToast(res.result);
      });
    })

  /**
   * 檢測並整理註冊資料
   * @param data
   * @returns {*}
   */
  static makeRegisterData = data => ({
    userup_number: data.userup_number ? data.userup_number : '',
    user_id: data.user_id ? data.user_id : '',
    password: data.password ? data.password : '',
    user_type: 3,
    user_level: data.user_level ? data.user_level : '',
    mobile: data.mobile ? data.mobile : '',
    email: data.email ? data.email : '',
    wechat: data.wechat ? data.wechat : '',
    mobile_code: data.mobile_code ? data.mobile_code : '',
  });

  /**
   * 獲取註冊必填欄位
   */
  static getContactConfig = () => {
    showLoading('請稍等...');
    return Req.getContactConfig()
      .then((res) => {
        hideLoading();
        if (!res.status) {
          return false;
        }
        return res.result;
      });
  };

  /**
   * 發送註冊用簡訊
   */
  static sendMobileCode = (mobile) => {
    showLoading('发送中...');
    return Req.sendMobileCode(mobile)
      .then((res) => {
        hideLoading();
        if (!res.status) {
          showToast(res.error);
          return false;
        }
        showToast(res.result);
        return true;
      });
  };

  /**
   * 根据区间随机数
   */
  static randomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);

  // 根据当前时间，匹配时间段，获取到区间
  /**
   * 00:00~23:59::59;
   * 一小时一个时段，分24个时段；
   */
  static getPeriod = () => {
    const date = new Date();
    const hours = date.getHours();
    const time = date.getTime();
    return UserService.formatData(hours, time);
  };

  // 获取毫秒
  static getMs = (hh, mm, ss) => {
    const myDate = new Date();
    const year = myDate.getFullYear();
    const month = myDate.getMonth();
    const date = myDate.getDate();
    return Date.parse(new Date(year, month, date, hh, mm, ss));
  };

  // 格式化随机数
  static doData = (obj) => {
    const data = {
      num: randomNumber(obj.minPeopleNumber, obj.maxPeopleNumber),
      time: randomNumber(obj.changeMinTime, obj.changeMaxTime),
    };
    return data;
  };

  // 格式数据
  static formatData(index, time) {
    if (UserService.getMs(index, 0, 0) <= time && time <= UserService.getMs(index, 59, 59)) {
      return UserService.doData(onlineMemberCount[index]);
    }
    return {
      num: 123,
      time: 10,
    };
  }

  // 判断当前时间是否可以聊天
  static getSendChatState = (start, end) => {
    const date = new Date();
    const time = date.getTime();
    if (UserService.getMs(start, 0, 0) >= time || time >= UserService.getMs(end, 0, 0)) {
      showToast('聊天请稍等');
      return false;
    }
    return true;
  }

  // 判断用户进入哪个聊天室
  static doRedirect() {
    if (UserStorage.getChatroomInof()
      && UserService.isUserId()
      && UserStorage.getChatroomInof().roomId) {
      return UserStorage.getChatroomInof();
    }
    return appConfig.defaultRoomInfo;
  }

  // 判断两次登录是否是同一个人
  static isUserId() {
    const lastUserId = UserStorage.getChatroomInof().user_id;
    const nextUserId = UserStorage.getUserInfo().user_id;
    if (lastUserId !== nextUserId) {
      return false;
    }
    return true;
  }
}
