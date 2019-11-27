import axios from '@/lib/axios';
import store from '@/store';
import UserStorage from '@/storage/user';
import {
  ApiUrl, ChatApiUrl, FHJHApiUrl, SettingApiUrl,
} from './url';

export default class Req {
  /**
   * 获取域名配置
   * @returns {Promise<any | never>}
   */
  static getDomainSetting = async () => axios.get(`${SettingApiUrl}`)
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error)));

  /**
   * 鳳凰會員註冊
   * @param userup_number
   * @param user_id
   * @param password
   * @param user_type
   * @param user_level
   * @param real_name
   * @param mobile
   * @param email
   * @param wechat
   * @returns {Promise<any | never>}
   */
  static register = async (
    {
      userup_number,
      user_id,
      password,
      user_type,
      user_level,
      mobile,
      email,
      wechat,
      mobile_code,
    }) => (axios.post(
    `${ApiUrl.register}`, {
      invite_code: userup_number,
      user_id,
      password,
      user_type,
      user_level,
      mobile,
      email,
      wechat,
      mobile_code,
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 鳳凰會員登入
   * @param user_id
   * @param password
   * @returns {Promise<any | never>}
   */
  static signIn = async (user_id, password) => axios.post(`${ApiUrl.signIn}`, {
    user_id,
    password,
  })
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error)));

  /**
   * 查詢用戶資訊
   * @param token
   * @returns {Promise<any | never>}
   */
  static userInfo = async token => axios.get(`${ApiUrl.userInfo}`,
    { params: { token } })
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error)));

  /**
   * 获取融云token
   * @param userId
   * @param name
   * @param avatar
   * @returns {Promise<any | never>}
   */
  static getChatCloudToken = async (userId, name, avatar) => (axios.get(`${ChatApiUrl.getToken}`, {
    params: {
      userId,
      name,
      avatar,
    },
  })
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 变更聊天室成员的禁言状态（chatLib）
   * @param encryt_user_id
   * @param status
   * @returns {Promise<any | never>}
   */
  static blockChatRoomUser = async (encryt_user_id, status) => (axios.get(`${ChatApiUrl.blockChatRoomUser}`, {
    params: {
      userId: encryt_user_id,
      status,
      token: store.state.token,
    },
  })
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 获取聊天室列表
   */
  static getChatRoomList = () => (axios.get(`${ChatApiUrl.chatRoomList}`)
    .then(res => (Promise.resolve(res.data)))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 获取获取聊天时间段
   */
  static getSendChatTime = () => (axios.get(`${ChatApiUrl.sendChatTime}`)
    .then(res => (Promise.resolve(res.data)))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 变更聊天室成员的禁言状态（凤凰）
   * @param encryt_user_id
   * @param status
   * @returns {Promise<any | never>}
   */
  static setChatStatus = async (encryt_user_id, status) => (axios.post(`${ApiUrl.SetChatStatus}`, {
    encryt_user_id,
    status,
    token: store.state.token,
  })
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 获取聊天室禁言/黑名单成员列表
   * @param pageIndex
   * @param pageSize
   * @returns {Promise<any | never>}
   */
  static getChatRoomBlockUserList = async (pageIndex = 0, pageSize = 10) => (axios.get(`${ApiUrl.GetForbidChatUsersInChatRoom}`, {
    params: {
      pageIndex,
      pageSize,
      token: store.state.token,
    },
  })
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 获取彩种列表
   */
  static getLotteryList = async () => axios.get(`${ApiUrl.lotteryHall}`)
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error)));

  /**
   * 获取彩票开奖计划
   * @param lotteryCode
   * @param planId
   * @returns {Promise<AxiosPromise<any>>}
   */
  static getLotteryPlan = async (lotteryCode, planId) => axios.get(`${FHJHApiUrl.getChatPlan}`, {
    params: {
      type: lotteryCode,
      plan: planId,
    },
  })
    .then(res => Promise.resolve(res.data.data))
    .catch(error => Promise.reject(JSON.stringify(error)));

  /**
   * 取得當期可下注開講資訊
   * @param lotteryType
   * @returns {Promise<AxiosPromise<any>>}
   */
  static getCurrentLotteryInfo = async lotteryType => axios.get(`${ApiUrl.currentLotteryInfo}`, {
    params: {
      lottery_type: lotteryType,
      token: store.state.token,
    },
  })
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error)));

  /**
   * 获取开奖走势
   * @param lotteryType
   * @param count
   * @param token
   * @returns {Promise<AxiosPromise<any>>}
   */
  static getLotteryOpenInfo = async ({ lotteryType, count }) => axios.get(`${ApiUrl.lotteryOpenInfo}`, {
    params: {
      lottery_type: lotteryType,
      count,
      token: store.state.token,
      timestamp: Date.now(),
    },
  })
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error)));

  /**
   * 新增下注
   * @param issue_no
   * @param lottery_id
   * @param play_type_id
   * @param bet_content
   * @param unit_price
   * @param model
   * @param user_id
   * @param position
   * @param bet_count
   * @returns {Promise<any | never>}
   */
  static addOrder = async (
    {
      issue_no,
      lottery_id,
      play_type_id,
      bet_content,
      unit_price,
      model,
      user_id,
      position,
      bet_count,
    }) => (axios.post(
    `${ApiUrl.addOrder}`, {
      issue_no,
      lottery_id,
      play_type_id,
      bet_content,
      unit_price,
      model,
      user_id,
      position,
      bet_count,
      token: store.state.token,
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   *
   *获取用户资金订单记录
   * @param page
   * @param status
   */
  static getOrderRecord = async (page, status) => (axios.get(
    `${ApiUrl.orderRecord}`, {
      params: {
        user_id: store.state.userInfo.user_id,
        token: store.state.token,
        page,
        status,
      },
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   *
   *获取用户资金订单记录
   * @param order_id
   */
  static deleteOrder = async order_id => (axios.post(
    `${ApiUrl.deleteOrder}`, {
      order_id,
      token: store.state.token,
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 获取用户账变记录（资金明细）
   * @param user_id
   * @param page
   */
  static getMoneyRecord = async page => (axios.get(
    `${ApiUrl.moneyOrders}`, {
      params: {
        user_id: store.state.userInfo.user_id,
        token: store.state.token,
        page,
      },
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 根据日期查询资金盈亏报表
   * @param user_id
   * @param date 2019-03-09
   */
  static getMoneyReport = async ({ user_id, date }) => (axios.get(
    `${ApiUrl.moneyReport}`, {
      params: {
        user_id,
        token: store.state.token,
        date,
      },
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 修改用户登录密码
   * @param old_password
   * @param new_password
   */
  static updataUserPassword = async ({ oldPassword, newPassword }) => (axios.post(
    `${ApiUrl.setUserPassword}`,
    {
      token: store.state.token,
      old_password: oldPassword,
      new_password: newPassword,
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 修改资金密码
   * @param old_password
   * @param new_password
   */
  static UpdateMoneyPassword = async ({ oldPassword, newPassword }) => (axios.post(
    `${ApiUrl.UpdateMoneyPassword}`,
    {
      token: store.state.token,
      old_password: oldPassword,
      new_password: newPassword,
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 绑定银行卡
   * @param uaername
   * @param uaername
   * @param bankId
   * @param moneyPassword
   */
  static BindBankCard = async ({
    uaername, bankName, bankId, moneyPassword,
  }) => (axios.post(
    `${ApiUrl.BindBankCard}`,
    {
      user_id: store.state.userInfo.user_id,
      token: store.state.token,
      bank_name: bankName,
      card_name: uaername,
      card_no: bankId,
      money_password: moneyPassword,
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   *
   * 获取银行卡信息
   */
  static getUserBankInfo = async () => (axios.get(
    `${ApiUrl.UserBankInfo}`, {
      params: {
        user_id: store.state.userInfo.user_id,
        token: store.state.token,
      },
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 提现
   * @param old_password
   * @param new_password
   */
  static Withdrawal = async ({
    money, moneyPassword, cancelToken,
  }) => (axios.post(
    `${ApiUrl.Withdrawal}`,
    {
      token: store.state.token,
      money,
      money_password: moneyPassword,
    },
    { cancelToken },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   *
   * 获取充值网址
   */
  static getDepositUrl = async () => (axios.get(
    `${ApiUrl.DepositUrl}`, {
      params: {
        token: store.state.token,
      },
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   *
   * 获取版本号
   */
  static getVersion = async userAgent => (axios.get(
    `${ApiUrl.Version}`, {
      params: {
        type: userAgent,
      },
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   *
   * 获取所有平台公告
   */
  static getNews = async () => (axios.get(
    `${ApiUrl.News}`,
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   *
   * 获取所有优惠活动
   */
  static getPromotions = async () => (axios.get(
    `${ApiUrl.Promotions}`,
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   *
   * 获取获取全局配置信息
   */
  static getGlobalConfig = async () => (axios.get(
    `${ApiUrl.GlobalConfig}`,
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 获取平台支持的银行
   */
  static getSupportBanks = async () => (axios.post(
    `${ApiUrl.SupportBanks}`,
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 修改用户头像
   */
  static setUserAvatar = async avatar => (axios.post(
    `${ApiUrl.SetUserAvatar}`,
    {
      token: store.state.token,
      avatar,
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 修改用户昵称
   */
  static setUserNickName = async nicknane => (axios.post(
    `${ApiUrl.SetUserNickName}`,
    {
      token: store.state.token,
      nicknane,
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 验证Token是否过期
   */
  static checkToken = async user_id => (axios.post(
    `${ApiUrl.CheckToken}`,
    {
      user_id,
      token: store.state.token,
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 驗證有無在聊天室發言權限
   */
  static CheckChatStatusInChatRoom = () => (axios.get(
    `${ApiUrl.CheckChatStatusInChatRoom}`,
    {
      params: { token: store.state.token },
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 驗證有無在聊天室發言權限
   */
  static forbidSpeakInChatRoom = () => (axios.post(
    `${ApiUrl.ForbidSpeakInChatRoom}`,
    {
      token: store.state.token,
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   *
   * 获取指定彩种的最新10条消息
   */
  static getLotteryInfos = async lotteryType => (axios.get(
    `${ApiUrl.LotteryInfos}`,
    {
      params: {
        lottery_type: lotteryType,
        page: 1,
        token: store.state.token,
      },
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 驗證有無在聊天室發言權限
   */
  static getContactConfig = () => (axios.get(
    `${ApiUrl.ContactConfig}`,
    {
      token: UserStorage.getToken(),
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));

  /**
   * 發送註冊驗證簡訊
   */
  static sendMobileCode = mobile => (axios.post(
    `${ApiUrl.SendMobileCode}?mobile=${mobile}`,
    {
      mobile,
    },
  )
    .then(res => Promise.resolve(res.data))
    .catch(error => Promise.reject(JSON.stringify(error))));
}
