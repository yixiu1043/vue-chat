import Cookies from 'js-cookie';
import { appConfig } from '../config';

const keys = {
  TOKEN_KEY: 'token',
};

/**
 * 使用者資訊存儲
 */
export default class UserStorage {
  /**
   * 設定token到cookie
   * @param token
   */
  static setToken = (token) => {
    Cookies.set(keys.TOKEN_KEY, token, { expires: 7 });
  }

  /**
   * 從cookie獲取token
   * @returns {*}
   */
  static getToken = () => {
    const token = Cookies.get(keys.TOKEN_KEY);
    if (token) {
      return token;
    }
    return false;
  }

  /**
   * 設置個人訊息到localstorage
   * @param userInfo
   */
  static setUserInfo = (userInfo) => {
    localStorage.userInfo = JSON.stringify(userInfo);
  }

  /**
   * 獲取個人訊息到localstorage
   * @returns {*}
   */
  static getUserInfo = () => {
    const { userInfo } = localStorage;
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    return false;
  }

  /**
   * 清除掉所有資訊
   */
  static clean = (callback) => {
    Cookies.remove(keys.TOKEN_KEY);
    localStorage.removeItem('userInfo');
    if (callback) {
      callback();
    }
  }

  /**
   * 存离开时在哪个聊天室信息；
   */
  static setChatroomInof = (ChatroomInof) => {
    Cookies.set('ChatroomInof', JSON.stringify(ChatroomInof), { expires: 7 });
  }

  /**
   * 将聊天室信息存储cookie
   * @returns {*}
   */
  static getChatroomInof = () => {
    const ChatroomInof = Cookies.get('ChatroomInof');
    if (ChatroomInof) {
      return JSON.parse(ChatroomInof);
    }
    return false;
  }

  /**
 * 存选择的彩种信息
 * @param userInfo
 */
  static setLotteryInfo = (LotteryInfo) => {
    localStorage.LotteryInfo = JSON.stringify(LotteryInfo);
  }

  /**
   * 取选择的彩种信息
   * @returns {*}
   */
  static getLotteryInfo = () => {
    const { LotteryInfo } = localStorage;
    if (LotteryInfo) {
      return JSON.parse(LotteryInfo);
    }
    return appConfig.defaultLottery;
  }
}
