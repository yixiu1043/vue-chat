<template>
  <transition name="slide">
    <div class="chatroom" :class="theme">
      <section class="content">
        <div class="screen" :class="screenClass" v-show="isShowScreen">
          <iframe-animate
            class="iframe"
            ref="iframeAnimate"
            :animate-data="animateData"
            :lottery-code="lotteryCode"
            :lottery-id="lotteryId"
          />
        </div>
        <div class="container">
          <top-tabs
            :tabs="topTabs"
            ref="topTabs"
            :chatroomTitle="chatroomTitle"
            @on-change-tab="onChangeTopTab"
            @on-select-chatroom="onSelectChatroom"
            :theme="theme"
          />
          <lottery-slide
            :lottery-links="lotteryWhiteList"
            :lottery-data="snapshotData"
            @on-change-swipe="changeGame"
          />
          <div class="scroll-container">
            <fab-menu
              class="fab-menu"
              :tabs="leftTabsByAdmin"
              @on-change-tab="onChangeLeftTab"
              ref="leftTabs"
            />
            <div
              class="scroll"
              @scroll.passive="onScrollMessage"
              v-show="leftTabView === 'chat'"
            >
              <message
                class="message"
                :chat-list="chatList"
                :user-msg-type="userMsgType"
                :sys-msg-type="sysMsgType"
                :color="msgColor"
                :lottery-data="snapshotData"
                @on-click-avatar="onClickAvatar"
                @on-click-message="onClickMessage"
                @on-follow-bet="onFollowBet"
                @on-show-image="onShowImage"
              />
            </div>
            <div style="width: 100%;" v-show="leftTabView !== 'chat'">
              <history v-show="leftTabView === 'history'" ref="history" />
              <recharge
                v-show="leftTabView === 'recharge'"
                ref="recharge"
                :theme="theme"
              />
              <un-ban
                v-show="leftTabView === 'unban'"
                :black-list="blackList"
                @un-ban="removeChatRoomBlockUser"
                @on-page-change="onUnbanPageChange"
              />
            </div>
          </div>
        </div>
      </section>
      <keyboard
        ref="keyboard"
        @on-message-send="sendPersonMessage"
        :issue="currentIssue"
        :game-type="lotteryId"
        :theme="theme"
        :joined="joined"
        :can-chat="canChat"
        :input-disabled="chatInputDisabled"
        @on-show-lotterylist="showLotteryList"
      />

      <popup-menu
        ref="leftMenu"
        :room-list="chatRoomList"
        @on-toggle-room="changeMenu"
      />

      <bet-popup
        ref="betPopup"
        :lottery-data="snapshotData"
        @on-set-bet="onSetBet"
      />

      <!-- 显示彩种列表 -->
      <div class="select-lottery">
        <lottery-select
          ref="lotterySelect"
          @on-change-lottery="changeLottery"
          :lottery-links="lotteryWhiteList"
        />
      </div>
      <!-- 禁言用户 -->
      <no-talk
        @on-confirm="addChatRoomBlockUser"
        :no-talk-user="noTalkUser"
        ref="noTalkPopup"
      />
      <!-- 消息下拉按钮 -->
      <div class="back-bottom" @click="backBottom" v-show="isBackIcon">
        <mt-badge size="small" v-if="unReadNum > 0">{{ unReadNum }}</mt-badge>
        <font-awesome-icon icon="chevron-circle-down" size="lg" />
      </div>
      <!-- 弹窗图片 -->
      <popup-image ref="PopupImage" :bigImgUlr="bigImgUlr" />
    </div>
  </transition>
</template>

<script>
import $ from 'jquery';
import chatMixins from '@/mixins/chat';
import UserService from '@/service/user';
import UserStorage from '@/storage/user';
import SettingStorage from '@/storage/setting';
import { isPlatform } from '@/lib/device';

const Scroll = () => import('@/components/scroll');
const TopTabs = () => import('./components/tabs/top-tabs');
const FabMenu = () => import('./components/fab-menu/fab-menu');
const UnBan = () => import('@/components/un-ban');
const Keyboard = () => import('@/components/keyboard');
const Message = () => import('@/components/message');
const PopupMenu = () => import('@/components/popup-menu');
const IframeAnimate = () => import('@/components/iframe');
const Trend = () => import('@/components/trend');
const History = () => import('@/components/history');
const Recharge = () => import('@/components/recharge');
const LotterySnapshot = () => import('@/components/lottery-snapshot');
const NoTalk = () => import('@/components/notalk');
const LotterySlide = () => import('@/components/lottery-slide');
const BetPopup = () => import('@/components/bet-popup');
const LotterySelect = () => import('@/components/lottery-select');
const PopupImage = () => import('@/components/popupImage/index');

export default {
  name: 'chatroom',
  mixins: [chatMixins],
  components: {
    TopTabs,
    FabMenu,
    Scroll,
    UnBan,
    Keyboard,
    Message,
    PopupMenu,
    IframeAnimate,
    Trend,
    History,
    Recharge,
    LotterySnapshot,
    NoTalk,
    LotterySlide,
    BetPopup,
    LotterySelect,
    PopupImage,
  },
  data() {
    return {
      topTabView: 'iframeAnimate',
      topTabs: [
        {
          name: 'switchScreen',
          title: '显示动画',
        },
        {
          name: 'switchBetMessage',
          title: '隐藏下注',
        },
        {
          name: 'trend',
          title: '走势图',
        },
      ],
      chatroomTitle: this.$route.query.roomName,
      leftTabView: 'chat',
      leftTabs: [
        {
          name: 'unban',
          title: '解禁',
          color: '#888',
        },
        {
          name: 'history',
          title: '记录',
          color: '#4688e0',
        },
        {
          name: 'recharge',
          title: '充值',
          color: '#cc3ee2',
        },
        {
          name: 'refresh',
          title: '刷新',
          color: '#55c770',
        },
        {
          name: 'quit',
          title: '退出',
          color: '#f44336',
        },
        {
          name: 'chat',
          title: '聊天',
          color: '#f0c040',
        },
        // {
        //   name: 'menu',
        //   title: '游戏',
        //   color: '#f3704b',
        // },
      ],
      noTalkUser: '',
      noTalkUserId: '',
      blackList: [],
      isShowScreen: false,
    };
  },
  computed: {
    leftTabsByAdmin() {
      if (!this.userInfo.isAdmin) {
        const index = this.leftTabs.findIndex(item => item.name === 'unban');
        if (index >= 0) {
          this.leftTabs.splice(index, 1);
        }
      }
      return this.leftTabs;
    },
    screenClass() {
      return this.screenClassFun();
    },
  },
  created() {
    this.init();
    this.CheckChatStatusInChatRoom();
  },
  methods: {
    init() {
      this.openNumber = '';
      this.joined = false;
      this.setChatList([]); // 初始化聊天列表
      this.sendPrivateMessage('system', '您正在加入聊天室...');
      this.updateUserInfo(); // 获取用户余额信息
      this.getCurrentLotteryInfo(); // 進入頁面取得新一期開獎資訊
      this.initTabView(); // 初始化tab的视图
      this.getPlanLotteryInof();// 获取计划推送信息
      // 加入聊天室
      if (this.isChatCloudConnected) {
        this.joinChatRoom();
      }
    },
    initTabView() {
      this.leftTabView = 'chat';
      this.topTabView = +SettingStorage.getIsLotteryAnimate() ? 'iframeAnimate' : 'lotterySnapshot';
    },
    updateUserInfo() {
      return UserService.updateUserInfo(UserStorage.getToken())
        .then(() => {
          this.$refs.topTabs.$data.chageNickName = UserStorage.getUserInfo().nick_name;
          this.$refs.topTabs.$data.imgStr = UserStorage.getUserInfo().avatar;
          this.$refs.topTabs.getPeopleNumber();
        });
    },
    changeMenu(meunData, flag) {
      if (flag) {
        this.topTabs[3].title = meunData.name;
      }
    },
    onSelectChatroom() {
      this.$refs.leftMenu.show();
    },
    onChangeTopTab(tab) {
      switch (tab) {
        case 'trend':
          this.$router.push('/trend');
          SettingStorage.setLotteryList(this.lotteryList);
          break;
        case 'switchScreen':
          this.isShowScreen = !this.isShowScreen;
          if (this.isShowScreen) {
            this.topTabs[0].title = '隐藏动画';
            this.getCurrentLotteryInfo();
          } else {
            this.topTabs[0].title = '显示动画';
          }
          this.chatListResponsive();
          break;
        case 'switchBetMessage':
          if (this.topTabs[1].title === '显示下注') {
            this.topTabs[1].title = '隐藏下注';
            this.sysMsgType.push('user_bet');
          } else {
            this.topTabs[1].title = '显示下注';
            this.sysMsgType.forEach((item, index) => {
              if (item === 'user_bet') {
                this.sysMsgType.splice(index, 1);
              }
            });
          }
          break;
        default:
          break;
      }
    },
    onChangeLeftTab(tab) {
      switch (tab) {
        // case 'menu':
        //   this.$refs.leftMenu.show();
        //   break;
        case 'quit':
          this.quitChatRoom('/hall');
          break;
        case 'unban':
          this.leftTabView = 'unban';
          this.getChatRoomBlockUserList();
          break;
        case 'refresh':
          this.leftTabView = 'chat';
          window.location.reload();
          break;
        case 'history':
          this.leftTabView = 'history';
          this.$refs.history.init();
          this.chatListResponsive();
          break;
        case 'light':
        case 'dark':
          this.theme = tab;
          break;
        default:
          this.leftTabView = tab;
          break;
      }
    },
    screenClassFun() {
      if (isPlatform().isIOS) {
        return 'is-ios';
      }
      if (isPlatform().isAndroid) {
        return 'is-android';
      }
      return '';
    },
    onScrollMessage(e) {
      const { scrollTop, scrollHeight } = e.target;
      if (scrollHeight - (scrollTop + $('.scroll')
        .height()) >= 50) {
        this.isAutoScroll = false;
        this.isBackIcon = true;
      } else {
        this.isAutoScroll = true;
        this.unReadNum = 0;
        this.isBackIcon = false;
        this.updateUnreadNumber();
      }
    },
    backBottom() {
      $('.scroll').animate({
        scrollTop: $('.message').height(),
      }, 50);
      this.isBackIcon = false;
      this.unReadNum = 0;
    },
    updateUnreadNumber(value) {
      if (!this.isAutoScroll) {
        if (this.topTabs[1].title === '隐藏下注') {
          this.unReadNum++;
        }
        if (this.topTabs[1].title === '显示下注') {
          if (value[value.length - 1].msgType !== 'user_bet') {
            this.unReadNum++;
          }
        }
      } else {
        this.unReadNum = 0;
      }
    },
    chatListResponsive() {
      setTimeout(() => {
        let scrollHeight = $(window).height();
        scrollHeight -= $('.keyboard-container').height();
        scrollHeight -= $('.top-tabs').height();
        scrollHeight -= $('.slide').height();

        if (this.isShowScreen) {
          scrollHeight -= $('.iframe').height();
        }

        $('.scroll').css('height', scrollHeight);
        $('.scroll-container').css('height', scrollHeight);

        if (this.isAutoScroll) {
          $('.scroll').animate({
            scrollTop: $('.message').height(),
          }, 100);
        }
      }, 100);
    },
  },
  watch: {
    chatList(value) {
      this.updateUnreadNumber(value);
      this.chatListResponsive();
    },
    lotteryLastOpen() {
      // 偵測開獎訊息
      const isOpenNumber = this.lotteryLastOpen.openNumber;
      const isCurrentLottery = this.lotteryLastOpen.type === this.lotteryId;
      if (isOpenNumber && isCurrentLottery) {
        this.openNumber = this.lotteryLastOpen.openNumber;
        this.getCurrentLotteryInfo(this.lotteryLastOpen.openNumber);
      }
    },
    isChatCloudConnected(newVal, oldVal) {
      // 刷新页面重连接融云服务，如果此时在聊天室页面，需要自动加入聊天室
      if (newVal && newVal !== oldVal) {
        this.joinChatRoom();
      } else {
        this.sendPrivateMessage('system', '连接中...');
      }
    },
    $route() {
      clearInterval(this.getCountdownTimer);
      clearTimeout(this.getNewOpenTimer);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./chatroom.scss";

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}

.fab-menu {
  right: 0;
}

.countdown {
  line-height: 15px;

  .issue {
    text-align: center;
  }
}
</style>
