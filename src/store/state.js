import UserStorage from '@/storage/user';
import SettingStorage from '@/storage/setting';

const state = {
  token: UserStorage.getToken() || '',
  lotteryLastOpen: { type: '', issue: '', openNumber: '' },
  isLogged: false,
  chatList: [],
  chatRoomList: [],
  isChatCloudConnected: false,
  userInfo: UserStorage.getUserInfo() || {},
  lotteryList: [],
  userTotalNums: '',
  domainSetting: SettingStorage.getDomain() || {},
  globalConfig: SettingStorage.getGlobalConfig() || {},
  isPC: false,
  lotteryInfo: UserStorage.getLotteryInfo(),
  sendChatTime: {},
};

export default state;
