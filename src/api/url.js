export const ApiUrl = {
  register: '/api/v1/mobile/AddMember3',

  signIn: '/api/v1/mobile/SignIn',

  userInfo: '/api/v1/mobile/UserInfo',

  addOrder: '/api/v1/mobile/AddOrder',

  currentLotteryInfo: '/api/v1/mobile/CurrentLotteryInfo3',

  lotteryOpenInfo: '/api/v1/mobile/LotteryOpenInfos2',

  lotteryHall: '/api/v1/mobile/LotteryHall',

  // 订单记录api
  orderRecord: '/api/v1/mobile/Orders',

  // 撤单api
  deleteOrder: '/api/v1/mobile/CancelOrder',

  moneyOrders: '/api/v1/mobile/MoneyOrders',

  // 根据日期查询资金盈亏报表
  moneyReport: '/api/v1/mobile/MoneyReport',

  // 获取用户信息
  getUserInfo: '/api/v1/mobile/UserInfo',

  // 修改登录密码
  setUserPassword: '/api/v1/mobile/UpdateLoginPassword',

  // 修改资金密码
  UpdateMoneyPassword: '/api/v1/mobile/UpdateMoneyPassword',

  // 添加银行卡
  BindBankCard: '/api/v1/mobile/BindBankCard',

  // 获取银行信息
  UserBankInfo: '/api/v1/mobile/UserBankInfo',

  // 提现
  Withdrawal: '/api/v1/mobile/Withdrawal',

  // 获取充值网址
  DepositUrl: '/api/v1/mobile/DepositUrl',

  // 获取app版本
  Version: '/api/v1/mobile/Version',

  // 获取所有平台公告
  News: '/api/v1/mobile/News',

  // 获取所有优惠活动
  Promotions: '/api/v1/mobile/Promotions',

  // 获取全局配置信息
  GlobalConfig: '/api/v1/mobile/GlobalConfig',

  // 获取平台支持的银行
  SupportBanks: '/api/v1/mobile/SupportBanks',

  // 修改用户头像
  SetUserAvatar: '/api/v1/mobile/SetUserAvatar',

  // 修改用户昵称
  SetUserNickName: '/api/v1/mobile/SetUserNickName',

  // 获取指定彩种最新10条开奖记录
  LotteryInfos: '/api/v1/mobile/LotteryInfos',

  // 檢查使用者token有無過期
  CheckToken: '/api/v1/mobile/CheckToken',

  // 檢查是否能在聊天室發言
  CheckChatStatusInChatRoom: '/api/v1/mobile/CheckChatStatusInChatRoom',

  // 檢查鳳凰有無禁止用戶發言
  ForbidSpeakInChatRoom: '/api/v1/mobile/ForbidSpeakInChatRoom',

  // 获取禁言用户列表
  GetForbidChatUsersInChatRoom: '/api/v1/mobile/GetForbidChatUsersInChatRoom',

  // 禁言用户
  SetChatStatus: '/api/v1/mobile/SetChatStatus',

  // 獲取註冊必填信息
  ContactConfig: '/api/v1/mobile/ContactConfig',

  // 送出簡訊
  SendMobileCode: '/api/v1/mobile/SendMobileCode',
};

export const FHJHApiUrl = {
  getChatPlan: '/Api/Chat/plan',
};

// 获取域名配置
export const SettingApiUrl = '/setting';

export const ChatApiUrl = {

  getToken: '/user/token',

  blockChatRoomUser: '/chatroom/user/block',

  chatRoomList: '/chatroom/list',

  sendChatTime: '/chatroom/send_chat_time',

};

export const SignalrApiUrl = '/signalr';
