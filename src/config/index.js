import serveImg from '@/assets/avatar/serve.png';
import adminImg from '@/assets/avatar/admin.png';

// 应用配置
export const appConfig = {
  /**
   * 系统头像
   */
  systemAvatar: serveImg,

  /**
   * 管理员头像
   */
  adminAvatar: adminImg,

  /**
   * 不显示气泡菜单的页面
   */
  notShowPopupMenuPages: ['chatroom', 'hall', 'login', 'register', 'chatroom-pc', 'login-pc', 'register-pc', '404'],

  /**
   * 不用keep-alive进行缓存的页面
   */
  noCachePages: ['money-record', 'history'],

  /**
   * 彩票白名单
   */
  lotteryWhiteList: [1, 13, 28, 20, 17, 21, 19],

  /**
   * 聊天室游戏权限
   */
  permissionLottery: {
    primary: {
      lotteryList: [1, 13, 28, 20, 17, 21, 19],
      defaultLottery: '1',
    },
    vip: {
      lotteryList: [1, 13, 28, 20, 17, 21, 19],
      defaultLottery: '1',
    },
  },

  /**
  * 动画键盘默认彩种
  */
  defaultLottery: {
    lotteryId: 1,
    lotteryName: '重庆时时彩',
    lotteryCode: 'cqssc',
  },

  /**
  * 默认聊天室
  */
  defaultRoomInfo: { roomId: 'primary', roomName: '初级聊天室' },

  /**
  * 开奖动画配置
  */
  animateOption: {
    1: {
      animationDuration: 5000,
      fullAnimationDuration: 15000,
    },
    13: {
      animationDuration: 5000,
      fullAnimationDuration: 15000,
    },
    17: {
      animationDuration: 5000,
      fullAnimationDuration: 15000,
    },
    20: {
      animationDuration: 8000,
      fullAnimationDuration: 30000,
    },
    21: {
      animationDuration: 10000,
      fullAnimationDuration: 30000,
    },
    28: {
      animationDuration: 15000,
      fullAnimationDuration: 30000,
    },
    19: {
      animationDuration: 15000,
      fullAnimationDuration: 30000,
    },
  },
};
