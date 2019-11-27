import Cookies from 'js-cookie';

/**
 * 全局配置localstorage
 */
export default class SettingStorage {
  /**
   * 設定聊天室是否显示动画
   * @param token
   */
  static setIsLotteryAnimate = (bool) => {
    Cookies.set('isLotteryAnimate', bool);
  };

  /**
   * 從cookie獲取是否显示动画
   * @returns {*}
   */
  static getIsLotteryAnimate = () => {
    const isLotteryAnimate = Cookies.get('isLotteryAnimate');
    if (isLotteryAnimate) {
      return isLotteryAnimate;
    }
    return false;
  };


  /**
   * 設定聊天室是否顯示下注信息
   * @param token
   */
  static setIsShowBetMessage = (bool) => {
    Cookies.set('showBetMessage', bool);
  };

  /**
   * 從cookie獲取是否顯示下注信息
   * @returns {*}
   */
  static getIsShowBetMessage = () => {
    const showBetMessage = Cookies.get('showBetMessage');
    if (showBetMessage) {
      return showBetMessage;
    }
    return false;
  };


  /**
   * 設置域名配置
   * @param domain
   */
  static setDomain = (domainSetting) => {
    localStorage.domainSetting = JSON.stringify(domainSetting);
  };

  /**
   * 獲取域名配置
   * @returns {*}
   */
  static getDomain = () => {
    const { domainSetting } = localStorage;
    if (domainSetting) {
      return JSON.parse(domainSetting);
    }
    return false;
  };

  /**
   * 存公共信息
   */
  static setGlobalConfig = (globalConfig) => {
    localStorage.globalConfig = JSON.stringify(globalConfig);
  };

  /**
   * 取公共信息
   */
  static getGlobalConfig = () => {
    const { globalConfig } = localStorage;
    if (globalConfig) {
      return JSON.parse(globalConfig);
    }
    return false;
  };

  /**
   * 存提示信息
   */
  static setNoticeList = (noticeList) => {
    localStorage.noticeList = JSON.stringify(noticeList);
  };

  /**
   * 取提示信息
   */
  static getNoticeList = () => {
    const { noticeList } = localStorage;
    if (noticeList) {
      return JSON.parse(noticeList);
    }
    return false;
  };

  /**
   * 保存优惠信息
   */
  static setPromotion = async (promotions) => {
    localStorage.promotions = JSON.stringify(promotions);
  };

  /**
   * 获取优惠信息
   */
  static getPromotion = () => {
    const { promotions } = localStorage;
    if (promotions) {
      return JSON.parse(promotions);
    }
    return false;
  };

  /**
   * 存动画数据
   */
  static setAnimationData = (animationData) => {
    localStorage.animationData = JSON.stringify(animationData);
  };

  /**
   * 存上一次开奖数据
   */
  static setUpLotteryData = (upLottery, type, time) => {
    const upLotteryData = {
      upLottery,
      type,
      time,
    };
    localStorage.upLotteryData = JSON.stringify(upLotteryData);
  };

  /**
   * 取上一次开奖数据
   */
  static getUpLotteryData = () => {
    const { upLotteryData } = localStorage;
    if (upLotteryData) {
      return JSON.parse(upLotteryData);
    }
    return false;
  }

  /**
   * 存彩种列表
   */
  static setLotteryList = (lotteryList) => {
    localStorage.lotteryList = JSON.stringify(lotteryList);
  };

  /**
   * 取彩种列表
   */
  static getLotteryList = () => {
    const { lotteryList } = localStorage;
    if (lotteryList) {
      return JSON.parse(lotteryList);
    }
    return false;
  }
}
