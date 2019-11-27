<template>
  <div class="chatroom-pc">
    <header>
      <pc-head @on-toggle-room="init" />
    </header>
    <section class="main">
      <div class="left-con" v-show="isLeftShow">
        <left-meun
          :admin-list="adminList"
          :user-list="userList"
          :list="leftNavList"
          @on-change-user-tab="onChangeUserTab"
          @on-change-admin-tab="onChangeAdminTab"
        />
      </div>
      <div class="middle-con">
        <div class="message-view" v-show="middleView === 'message'">
          <float-tab @on-click-tab="onClickTab" />

          <div class="head">
            <div class="head-lottery">
              <lottery-slide
                :lottery-links="lotteryWhiteList"
                :lottery-data="snapshotData"
                @on-change-swipe="changeGame"
              />
            </div>
          </div>

          <div class="message" ref="message" @scroll="onScrollMessge">
            <change-left-btn
              @on-change-left="changeLeft"
              :do-lift-icon="doLiftIcon"
            />
            <message
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
          </div>

          <!-- 显示彩种列表 -->
          <div class="select-lottery">
            <lottery-select
              ref="lotterySelect"
              @on-change-lottery="changeLottery"
              :lottery-links="lotteryWhiteList"
            />
          </div>

          <div class="back-bottom" @click="backBottom" v-show="isBackIcon">
            <mt-badge size="small" v-if="unReadNum > 0">{{
              unReadNum
            }}</mt-badge>
            <font-awesome-icon icon="chevron-circle-down" size="lg" />
          </div>
        </div>

        <div class="other-view" v-show="middleView !== 'message'">
          <money-record v-show="middleView === 'money-record'" />
          <withdraw v-show="middleView === 'withdraw'" ref="withdraw" />
          <recharge v-show="middleView === 'recharge'" />
          <bet-history v-show="middleView === 'bet-history'" ref="betHistory" />
          <discounts v-show="middleView === 'discounts'" />
          <security-center v-show="middleView === 'security-center'" />
          <profit-report v-show="middleView === 'profit-report'" />
          <notice v-show="middleView === 'notice'" />
        </div>
      </div>
      <div class="right-con">
        <nav-tab @on-change-tab="onChangeRightMenuTab" :list="rightNavList" />
        <div class="iframe-con" v-show="rightTabView === 'iframeAnimate'">
          <iframe-animate
            class="iframe"
            ref="iframeAnimate"
            :animate-data="animateData"
            :lottery-code="lotteryCode"
            :lottery-id="lotteryId"
          />
        </div>
        <div class="trend-con" v-show="rightTabView === 'trend'">
          <trend ref="trend" :lottery-links="lotteryWhiteList" />
        </div>
        <div class="history-con" v-show="rightTabView === 'history'">
          <history ref="history" />
        </div>
        <div
          class="live-con"
          style="overflow-y: scroll;"
          v-show="rightTabView === 'liveText'"
        >
          <live-text ref="liveText" :lottery-list="liveTextLotteryList" />
        </div>
        <recharge
          v-show="rightTabView === 'recharge'"
          ref="recharge"
          :theme="theme"
        />
      </div>
    </section>
    <!-- 下注弹窗 -->
    <bet-popup
      ref="betPopup"
      :lottery-data="snapshotData"
      @on-set-bet="onSetBet"
    />
    <!-- 禁言用户 -->
    <notalk
      @on-confirm="addChatRoomBlockUser"
      :no-talk-user="noTalkUser"
      ref="noTalkPopup"
    />
    <!-- 禁言列表 -->
    <unban-popup
      ref="unbanPopup"
      :black-list="blackList"
      @un-ban="removeChatRoomBlockUser"
      @on-page-change="onUnbanPageChange"
    />
    <!-- 首次登录引导弹窗 -->
    <me-popup ref="guideModal" :cancel-button="false">
      <div class="guide-modal" slot="content">
        <font-awesome-icon icon="exclamation-circle" class="icon" />
        <span
          >尊敬的会员！首次登录，请点击右上角头像进入个人中心，设置您的个性头像和昵称！</span
        >
      </div>
    </me-popup>
    <popup-image ref="PopupImage" :bigImgUlr="bigImgUlr" />
  </div>
</template>
<script>
import Req from '@/api/request';
import chatMixins from '@/mixins/chat';
import {
  toolkit, getBallColor, showToast,
} from '@/service/helper';
import IframeAnimate from '@/components/iframe';
import Keyboard from '@/components/keyboard';

const PcHead = () => import('./components/pc-head');
const NavTab = () => import('./components/nav-tab');
const LeftMeun = () => import('./components/left-meun');
const MoneyRecord = () => import('@/views/me/money-record');
const Withdraw = () => import('@/views/me/withdraw');
const BetHistory = () => import('@/views/me/bet-history');
const Discounts = () => import('@/views/me/discounts');
const SecurityCenter = () => import('@/views/me/security-center');
const ProfitReport = () => import('@/views/me/profit-report');
const Notice = () => import('@/views/me/notice');
const ChangeLeftBtn = () => import('./components/change-left-btn');
const Message = () => import('@/components/message');
const Trend = () => import('../trend');
const History = () => import('@/components/history');
const LiveText = () => import('./components/live-text');
const Recharge = () => import('@/components/recharge');
const Notalk = () => import('@/components/notalk');
const FloatTab = () => import('./components/float-tab');
const UnBan = () => import('@/components/un-ban');
const UnbanPopup = () => import('./components/unban-popup');
const MePopup = () => import('@/components/popup');
const BetPopup = () => import('@/components/bet-popup');
const LotterySlide = () => import('@/components/lottery-slide');
const LotterySelect = () => import('@/components/lottery-select');
const PopupImage = () => import('@/components/popupImage/index');

export default {
  name: 'chatroom-pc',
  mixins: [chatMixins],
  components: {
    PcHead,
    LeftMeun,
    MoneyRecord,
    Withdraw,
    BetHistory,
    Discounts,
    SecurityCenter,
    ProfitReport,
    Notice,
    ChangeLeftBtn,
    NavTab,
    Keyboard,
    Message,
    IframeAnimate,
    Trend,
    History,
    LiveText,
    Notalk,
    UnBan,
    UnbanPopup,
    Recharge,
    MePopup,
    BetPopup,
    LotterySelect,
    LotterySlide,
    FloatTab,
    PopupImage,
  },
  data() {
    return {
      middleView: 'message',
      rightTabView: 'liveText',
      isLeftShow: true,
      doLiftIcon: 'angle-double-left',
      adminList: [
        { title: '充值、提款咨询' },
        { title: '注册、优惠咨询' },
        { title: '投注、兑奖咨询' },
        { title: '诚招代理、月赚百万' },
      ],
      userList: [
        {
          name: 'message', title: '聊天室', icon: 'comments', color: '#2196f3',
        },
        {
          name: 'money-record', title: '资金明细', icon: 'file-invoice-dollar', color: '#76becc',
        },
        {
          name: 'bet-history', title: '投注记录', icon: 'list-ol', color: '#98ca69',
        },
        {
          name: 'discounts', title: '优惠活动', icon: 'ad', color: '#ad58e9',
        },
        {
          name: 'security-center', title: '安全中心', icon: 'unlock', color: '#f15b6c',
        },
        {
          name: 'profit-report', title: '盈亏报表', icon: 'chart-line', color: '#bed742',
        },
        {
          name: 'withdraw', title: '提现', icon: 'hand-holding-usd', color: '#6eceee',
        },
        {
          name: 'recharge', title: '充值', icon: 'coins', color: '#ffc20e',
        },
        {
          name: 'notice', title: '系统公告', icon: 'bullhorn', color: '#8552a1',
        },
      ],
      leftNavList: [
        { title: '客服/管理', icon: 'user-shield', tab: 'adminList' },
        { title: '个人中心', icon: 'user', tab: 'userList' },
      ],
      rightNavList: [
        { title: '文字开奖', icon: 'bars', tab: 'liveText' },
        { title: '动画', icon: 'flag-usa', tab: 'iframeAnimate' },
        { title: '走势', icon: 'trophy', tab: 'trend' },
      ],
      adminData: {},
      noTalkUser: '',
    };
  },
  computed: {
    liveTextLotteryList() {
      const array = [...this.lotteryList];
      array.forEach((item) => {
        const newItem = item;
        const last_open_number = [];
        newItem.last_open_number.split(',').forEach((num) => {
          const obj = {};
          obj.number = num;
          obj.color = getBallColor(item.lottery_id, num);
          last_open_number.push(obj);
        });
        newItem.last_open_number = last_open_number;
      });
      return array;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name === 'register-pc') {
        vm.$refs.guideModal.show();
      }
    });
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
      this.getCurrentLotteryInfo(); // 進入頁面取得新一期開獎資訊
      this.getPlanLotteryInof();// 获取计划推送信息
      // 加入聊天室
      if (this.isChatCloudConnected) {
        this.joinChatRoom();
      }
    },
    onChangeRightMenuTab(tab) {
      this.rightTabView = tab;
      switch (tab) {
        case 'trend':
          this.onRefreshTrend();
          break;
        case 'iframeAnimate':
          this.getCurrentLotteryInfo();
          break;
        default:
          break;
      }
    },
    onChangeUserTab(tabName) {
      switch (tabName) {
        case 'recharge':
          this.getRechargeUrl();
          break;
        case 'bet-history':
          this.middleView = tabName;
          this.$refs.betHistory.$data.activeClass = 0;
          this.$refs.betHistory.getOrderRecord(1, '否');
          break;
        case 'withdraw':
          this.middleView = tabName;
          this.$refs.withdraw.showBankToast();
          break;
        default:
          this.middleView = tabName;
          break;
      }
    },
    onRefreshTrend() {
      this.$refs.trend.getLotteryOpenInfo({
        lotteryType: this.lotteryId,
        count: 20,
      });
    },
    onChangeAdminTab(data) {
      this.adminData = Object.assign(
        data,
        { url: this.globalConfig.kefu_url },
      );
      this.$refs.serviceChat.show();
    },
    changeLeft() {
      this.isLeftShow = !this.isLeftShow;
      if (this.isLeftShow) {
        this.doLiftIcon = 'angle-double-left';
      } else {
        this.doLiftIcon = 'angle-double-right';
      }
    },
    backBottom() {
      toolkit.scrollTop(
        this.$refs.message,
        this.$refs.message.scrollTop,
        this.$refs.message.scrollHeight,
        1000,
      );
      this.isBackIcon = false;
      this.unReadNum = 0;
    },
    onScrollMessge(e) {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (scrollHeight - (scrollTop + clientHeight) >= 100) {
        this.isAutoScroll = false;
        this.isBackIcon = true;
      } else {
        this.isAutoScroll = true;
        this.unReadNum = 0;
        this.isBackIcon = false;
      }
    },
    getRechargeUrl() {
      Req.getDepositUrl()
        .then(({ status, result, error }) => {
          if (!status) {
            showToast(error);
          }
          window.open(result, '_blank');
        });
    },
    toggleBetMessage(bool) {
      if (!bool) {
        this.sysMsgType.push('user_bet');
      } else {
        this.sysMsgType.forEach((item, index) => {
          if (item === 'user_bet') {
            this.sysMsgType.splice(index, 1);
          }
        });
      }
    },
    showUnban() {
      this.$refs.unbanPopup.show();
      this.getChatRoomBlockUserList();
    },
    onClickTab(tab) {
      if (tab.name === 'toggle-bet') {
        this.toggleBetMessage(tab.dataState);
      }
      if (tab.name === 'block-list') {
        this.showUnban();
      }
    },
    pastepic(event) {
      if (event.originalEvent) {
        event = event.originalEvent;
      }
      console.log(event);
      const { clipboardData } = event;
      console.log(clipboardData.getData('Files'));
      if (clipboardData && clipboardData.items) {
        let item = clipboardData.items[0];
        const types = clipboardData.types || [];
        for (let i = 0; i < types.length; i++) {
          if (types[i] === 'Files') {
            item = clipboardData.items[i];
            break;
          }
        }
        if (item && item.kind === 'file' && item.type.match(/^p_w_picpath\//i)) {
          const blob = item.getAsFile(); const
            reader = new FileReader();
          reader.onload = function (e) {
            const imgStr = e.target.result;
            if (imgStr.indexOf('base64,') != -1) {
              // showpic(imgStr);
              console.log(imgStr);
            }
          };
          reader.readAsDataURL(blob);
        } else {
          alert('该粘贴内容非图片格式~');
        }
      } else {
        alert('没有发现粘贴内容~');
      }
    },

  },
  watch: {
    chatList() {
      if (this.isAutoScroll) {
        this.backBottom();
      } else {
        this.unReadNum++;
      }
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
@import "@/styles/color.scss";
@import "@/styles/compass.scss";
@import "./chatroom.scss";
</style>
