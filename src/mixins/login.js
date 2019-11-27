import { mapState } from 'vuex';
import { signalrStart } from '@/lib/signalr';
import UserService from '@/service/user';
import ChatService from '@/service/chat';
import { showToast } from '@/service/helper';
import MeButton from '@/components/button';
import UserStorage from '@/storage/user';

export default {
  components: {
    MeButton,
  },
  data() {
    return {
      username: '',
      password: '',
    };
  },
  computed: {
    ...mapState({
      isPC: state => state.isPC,
      userInfo: state => state.userInfo,
      chatRoomList: state => state.chatRoomList,
    }),
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.resetForm());
  },
  methods: {
    resetForm() {
      this.username = '';
      this.password = '';
    },
    login() {
      if (!this.username || !this.password) {
        showToast('请填写账号密码');
        return false;
      }
      return UserService.login(this.username, this.password)
        .then((res) => {
          if (res) {
            ChatService.chatCloudStart();
            signalrStart();
            const { roomId, roomName } = UserService.doRedirect();
            if (this.$root.isPC) {
              this.$router.replace({
                name: 'chatroom-pc',
                query: {
                  roomId,
                  roomName,
                },
              });
            } else {
              this.$tip('登录成功！');
              this.$router.replace({
                name: 'chatroom',
                query: {
                  roomId,
                  roomName,
                },
              });
              // this.$router.replace('/hall');
            }
          }
        });
    },
  },
};
