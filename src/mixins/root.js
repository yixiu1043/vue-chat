import { mapState } from 'vuex';
import ChatService from '@/service/chat';
import SettingService from '@/service/setting';
import { signalrStart } from '@/lib/signalr';
import LotteryService from '@/service/lottery';
import { appConfig } from '@/config';

export default {
  beforeCreate() {
    SettingService.getDomainSetting();
    SettingService.getGlobalConfig();
  },
  created() {
    this.reconnectRongCloud();
    signalrStart();
    this.goPCChatRoom();
    LotteryService.getLotteryList();
    ChatService.getChatRoomList();
    ChatService.getSendChatTime();
  },
  computed: {
    ...mapState({
      isChatCloudConnected: state => state.isChatCloudConnected,
      domainSetting: state => state.domainSetting,
      isPC: state => state.isPC,
      isLogged: state => state.isLogged,
    }),
  },
  methods: {
    goPCChatRoom() {
      // 刷新页面，vue重新实例化
      if (!this.isLogged && this.isPC) {
        // PC端未登录状态
        this.$router.replace('/login-pc');
      } else if (this.isLogged && this.isPC) {
        // PC端已登录状态
        const hash = decodeURI(window.location.hash);
        const path = hash.substring(1);
        this.$router.replace(path);
      } else if (!this.isLogged && !this.isPC) {
        // moblie端登录页切PC登录页
        this.$router.replace('login');
      }
    },
    reconnectRongCloud() {
      const excludeRoute = ['login', 'register', 'login-pc', 'register-pc'];
      const { name } = this.$route;
      if (!excludeRoute.includes(name)) {
        ChatService.chatCloudStart();
        signalrStart();
      }
      setTimeout(() => {
        if (!excludeRoute.includes(name)) {
          if (!this.isChatCloudConnected) {
            console.log('重新連線rc');
            ChatService.sendPrivateMessage('system', '系统逾时，重新连线中...', appConfig.systemAvatar, '系统消息');
            this.reconnectRongCloud();
          }
        }
      }, 10000);
    },
  },
};
