import { mapState, mapMutations, mapGetters } from 'vuex';
import Req from '@/api/request';
import { appConfig } from '@/config';
import ChatService from '@/service/chat';
import LotteryService from '@/service/lottery';
import UserService from '@/service/user';
import {
  showToast, getPlanMsgStr,
  getLotteryCodeForPlan, getBallColor, formatDate,
} from '@/service/helper';
import UserStorage from '@/storage/user';

export default {
  data() {
    return {
      theme: 'light',
      animateData: {},
      sysMsgType: ['system', 'plan', 'win', 'bet', 'user', 'user_bet'],
      userMsgType: ['me', 'me_img', 'me_emoji'],
      joined: false,
      locked: false,
      timer: 0,
      canChat: false,
      msgColor: {
        me: '#98E165',
        user: '#FFF',
        plan: '#FFBBBB',
        win: '#98E165',
        bonus: '#4688e0',
        bet: '#ffb',
        user_bet: '#FFF',
      },
      currentIssue: '',
      openNumber: '',
      lastOpenNumber: '',
      getNewOpenTimer: null,
      getCountdownTimer: null,
      chatInputDisabled: true,
      isAutoScroll: true,
      isBackIcon: false,
      unReadNum: 0,
      blackList: [],
      planPushInfoTimer: null,
      bigImgUlr: '',
    };
  },
  computed: {
    ...mapState({
      isChatCloudConnected: state => state.isChatCloudConnected,
      lotteryLastOpen: state => state.lotteryLastOpen,
      lotteryList: state => state.lotteryList,
      chatRoomList: state => state.chatRoomList,
      domainSetting: state => state.domainSetting,
      globalConfig: state => state.globalConfig,
      userInfo: state => state.userInfo,
      isPC: state => state.isPC,
      lotteryInfo: state => state.lotteryInfo,
    }),
    ...mapGetters({
      chatList: 'getChatList',
    }),
    roomId() {
      return this.$route.query.roomId || 'primary';
    },
    lotteryId() {
      return this.lotteryInfo.lotteryId;
    },
    lotteryCode() {
      return this.lotteryInfo.lotteryCode;
    },
    lotteryName() {
      return this.lotteryInfo.lotteryName;
    },
    lotteryWhiteList() {
      const lotteryIds = appConfig.permissionLottery[this.roomId].lotteryList;
      return ChatService.getChatRoomLotteryWhiteList(this.lotteryList, lotteryIds);
    },
    pushPlanInfoId() {
      return appConfig.permissionLottery[this.roomId].defaultLottery;
    },
    snapshotData() {
      const data = {};
      data.code = this.lotteryCode;
      data.name = this.lotteryName;
      data.issue = this.currentIssue;
      data.locked = this.locked;
      data.timer = this.timer > 0 ? formatDate(this.timer) : '00:00';
      data.number = [];
      this.lastOpenNumber.split(',').forEach((num) => {
        const obj = {};
        obj.number = num;
        obj.color = getBallColor(this.lotteryId, num);
        data.number.push(obj);
      });
      return data;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.init();
      if (from.name !== 'trend' && from.name !== 'red-envelope') {
        vm.CheckChatStatusInChatRoom();
      }
    });
  },
  beforeRouteUpdate(to, from, next) {
    next((vm) => {
      vm.CheckChatStatusInChatRoom();
    });
    this.init();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name !== 'trend' && to.name !== 'red-envelope') {
      this.quitChatRoom(to.path);
    }
    next();
  },
  methods: {
    ...mapMutations({
      setChatList: 'SET_CHAT_LIST',
      setLotteryInfo: 'SET_LOTTERY_INFO',
    }),
    joinChatRoom() {
      this.chatInputDisabled = true;
      ChatService.joinChatRoom(this.roomId, () => {
        if (!this.joined && this.globalConfig.kefu_qq && this.domainSetting.title) {
          const welcomeMsg = `欢迎来到《${this.domainSetting.title}》，祝您竞猜愉快！首次进入平台请加客服微信：${this.globalConfig.kefu_qq}  谢谢!\n`;
          this.sendPrivateMessage('system', welcomeMsg);
          if (!this.$root.isPC) {
            this.$tip('加入聊天室成功!');
          }
          this.chatInputDisabled = false;
          this.joined = true;
        }
      });

      // 如果5秒後沒連上聊天室則重新連線
      setTimeout(() => {
        if (!this.joined) {
          this.sendPrivateMessage('system', '聊天室逾时，重新连接中...');
          this.joinChatRoom();
        }
      }, 5000);
    },
    quitChatRoom(path) {
      ChatService.quitChatRoom(this.roomId, () => {
        if (!this.$root.isPC) {
          this.$tip('退出聊天室成功！');
        }
        this.$router.push(path);
      });
    },
    CheckChatStatusInChatRoom() {
      this.canChat = false;
      // 檢查是否允許發言
      UserService.CheckChatStatusInChatRoom()
        .then((data) => {
          if (!data.status) {
            showToast(data.error);
          } else {
            this.canChat = true;
          }
        });
    },
    getCurrentLotteryInfo(openNumber = '', newStart = false) {
      LotteryService.getCurrentLotteryInfo(this.lotteryId)
        .then((data) => {
          const {
            current_issue_no,
            lock_seconds,
            remain_seconds,
            last_issue_no,
            last_open_number,
          } = data.result;
          this.lastOpenNumber = last_open_number;

          // 對聊天室發送開始下注系統訊息
          this.$nextTick(() => {
            if (newStart && this.isChatCloudConnected) {
              this.locked = false;
              const startMsg = `${this.lotteryName}\n第${current_issue_no}期\n-----开始下注-----\n`;
              this.sendPrivateMessage('system', startMsg);
            }
          });
          // if (newStart && this.isChatCloudConnected) {
          //   this.locked = false;
          //   const startMsg = `${this.lotteryName}\n第${current_issue_no}期\n-----开始下注-----\n`;
          //   this.sendPrivateMessage('system', startMsg);
          // }

          // 有開獎號則會播放動畫，獲取時間後倒數重置
          if (openNumber) {
            // 獲取動畫時間來重置動畫
            this.lastOpenNumber = openNumber;
            const {
              fullAnimationDuration,
              animationDuration,
            } = appConfig.animateOption[this.lotteryId];

            // 有开奖号码之后要做的事情
            const doSomething = () => {
              this.sendPrivateMessage('system', `${this.lotteryName}\n第${last_issue_no}期\n开奖号码：${openNumber}\n`);
            };
            // 偵測動畫如果有開啟則等待結束後才通知開獎號碼
            if (this.topTabView === 'iframeAnimate') {
              setTimeout(() => {
                doSomething();
              }, animationDuration);
            } else {
              doSomething();
            }

            // 撈取新一期
            setTimeout(() => {
              this.getCurrentLotteryInfo();
            }, fullAnimationDuration);
          }

          // 配置產生動畫資料
          this.$nextTick(() => {
            this.animateData = this.getDataByGameType(
              this.lotteryId,
              openNumber,
              current_issue_no,
              lock_seconds,
              remain_seconds,
              last_issue_no,
              last_open_number,
            );
          });

          // 更新獎號資訊
          this.currentIssue = current_issue_no;

          // 如果倒數時間+封盤時間結束，則自動獲取下一期
          this.getNewOpenTimer = setTimeout(() => {
            this.getCurrentLotteryInfo('', true);
            clearTimeout(this.getNewOpenTimer);
          }, (remain_seconds + lock_seconds) * 1000);

          // 更新上方倒數計時器
          if (remain_seconds <= 0) {
            this.locked = true;
            this.timer = lock_seconds + remain_seconds;
          } else {
            this.locked = false;
            this.timer = remain_seconds;
          }

          clearInterval(this.getCountdownTimer);
          this.getCountdownTimer = setInterval(() => {
            if (Math.floor(this.timer) === 10 && !this.locked) {
              this.sendPrivateMessage('system',
                `${this.lotteryName}\n第${current_issue_no}期\n-----距离封盘时间10s-----\n`);
            }

            if (Math.floor(this.timer) <= 0 && !this.locked) {
              this.sendPrivateMessage('system',
                `${this.lotteryName}\n第${current_issue_no}期\n-----已封盘-----\n`);
              this.locked = true;
              this.timer = lock_seconds;
            }
            this.timer--;
          }, 1000);
        });
    },
    sendPrivateMessage(msgType, msg) {
      ChatService.sendPrivateMessage(msgType, msg, appConfig.systemAvatar, '系统消息');
    },
    sendPersonMessage(message) {
      const {
        msgType, msg, sentUser, avatar,
      } = message;
      ChatService.sendPersonMessage({
        msgType,
        msg,
        avatar,
        sentUser,
      }, () => {
        // 如果是通过用户点击键盘下注则要发送下注成功消息到聊天室,并且不能是发送图片的消息
        if (msg.includes('/') && msgType !== 'me_img' && msgType !== 'me_emoji') {
          const betSuccessMsg = LotteryService.transformBetMessage(
            msg,
            this.lotteryName,
            this.currentIssue,
          );
          this.sendPrivateMessage('bet', betSuccessMsg);
        }
        this.$refs.keyboard.setInputText('');
        this.backBottom();
      });
    },
    // 获取计划倒计时
    getPlanLotteryInof() {
      LotteryService.getCurrentLotteryInfo(this.pushPlanInfoId)
        .then((data) => {
          const {
            lock_seconds,
            remain_seconds,
          } = data.result;

          if (this.isChatCloudConnected) {
            clearTimeout(this.planPushInfoTimer);
            this.planPushInfoTimer = setTimeout(() => {
              this.getLotteryPlan(this.pushPlanInfoId);
              clearTimeout(this.planPushInfoTimer);
            }, (remain_seconds + lock_seconds) * 1000);
          }
        });
    },
    // 推送计划消息
    getLotteryPlan(planId) {
      Req.getLotteryPlan(getLotteryCodeForPlan(planId), 0)
        .then((data) => {
          const { plan, planName, lotteryName } = data;
          const planMsg = `${lotteryName}--精准计划\n----------\n${getPlanMsgStr(plan, planName)}`;
          this.sendPrivateMessage(
            'plan',
            planMsg,
          );
          this.getPlanLotteryInof();
        })
        .catch(() => {
          showToast('网络异常，请稍后');
        });
    },
    getDataByGameType(
      gameType,
      openNumber,
      current_issue_no,
      lock_seconds,
      remain_seconds,
      last_issue_no,
      last_open_number,
    ) {
      if (this.$refs.iframeAnimate) {
        switch (`${gameType}`) {
          case '1':
          case '13':
          case '17':
            return this.$refs.iframeAnimate.createCqsscData(
              Math.floor(remain_seconds),
              lock_seconds,
              openNumber,
              current_issue_no,
              last_open_number,
            );
          case '19':
            return this.$refs.iframeAnimate.createLucky28Data(
              Math.floor(remain_seconds),
              lock_seconds,
              openNumber,
              current_issue_no,
              last_open_number,
            );
          case '20':
            return this.$refs.iframeAnimate.createPk10Data(
              Math.floor(remain_seconds),
              lock_seconds,
              openNumber,
              current_issue_no,
              last_issue_no,
              last_open_number,
            );
          case '21':
            return this.$refs.iframeAnimate.createGxk3Data(
              Math.floor(remain_seconds),
              lock_seconds,
              openNumber,
              current_issue_no,
              current_issue_no,
              last_open_number,
            );
          case '28':
            return this.$refs.iframeAnimate.createFtData(
              Math.floor(remain_seconds),
              lock_seconds,
              openNumber,
              current_issue_no,
              last_issue_no,
              last_open_number,
            );
          default:
            return null;
        }
      }
      return null;
    },
    // 聊天室封禁服务
    removeChatRoomBlockUser(userId, nickname) {
      this.setChatRoomUserStatus(userId, nickname, 0);
    },
    addChatRoomBlockUser() {
      this.setChatRoomUserStatus(this.noTalkUserId, this.noTalkUser, 1);
    },
    // 聊天室封禁服务
    setChatRoomUserStatus(userId, nickname, status) {
      this.$loading.show({
        el: 'body',
        color: 'rgba(255,255,255,0.3)',
      });
      Req.setChatStatus(userId, status)
        .then((result1) => {
          this.$refs.noTalkPopup.hide();
          if (result1.error && result1.error === 'encryt_user_id参数错误') {
            this.$loading.hide();
            showToast('不能被禁言');
            return;
          }
          if (result1.error && result1.error !== 'encryt_user_id参数错误') {
            this.$loading.hide();
            showToast('发生错误');
            return;
          }

          Req.blockChatRoomUser(userId, status)
            .then((result2) => {
              this.$loading.hide();
              if (!result2.status) {
                showToast('发生错误');
                return;
              }
              if (status === 0) {
                const index = this.blackList.findIndex(item => item.encryt_user_id === userId);
                this.blackList.splice(index, 1);
              }
              const message = status === 1 ? '已被禁言' : '禁言已解除';
              showToast(`${nickname}${message}`);
            });
        });
    },
    getChatRoomBlockUserList(page) {
      this.$loading.show({ el: '.un-ban-table' });
      Req.getChatRoomBlockUserList(page)
        .then(({ result }) => {
          this.$loading.hide();
          const { data } = result;
          this.blackList = data;
        })
        .catch(() => {
          showToast('网络异常，请稍后');
        });
    },
    onUnbanPageChange(page) {
      this.getChatRoomBlockUserList(page);
    },
    onClickAvatar(sentUser, sentUserId) {
      const { isAdmin } = this.userInfo;
      if (isAdmin && sentUser !== '系统消息') {
        this.$refs.noTalkPopup.show();
        this.noTalkUser = sentUser;
        this.noTalkUserId = sentUserId;
      }
    },
    onClickMessage(message) {
      this.$refs.keyboard.setInputText(message);
    },
    onFollowBet(data) {
      this.$refs.betPopup.show();
      this.$refs.betPopup.getBetMsg(data);
    },
    onSetBet(newBetMsg) {
      this.onClickMessage(newBetMsg);
      this.$refs.keyboard.sendMessage();
      this.backBottom();
    },
    changeGame(lotteryId, lotteryName, lotteryCode) {
      this.setLotteryInfo({
        lotteryId,
        lotteryName,
        lotteryCode,
      });
      UserStorage.setLotteryInfo({
        lotteryId,
        lotteryName,
        lotteryCode,
      });
      this.getCurrentLotteryInfo();
    },
    changeLottery(lotteryId, lotteryName, lotteryCode) {
      this.$refs.keyboard.showBetKeyboard();
      this.changeGame(lotteryId, lotteryName, lotteryCode);
    },
    showLotteryList() {
      this.$refs.lotterySelect.show();
    },
    // 点击聊天发送的图片放大显示；
    onShowImage(url) {
      this.$refs.PopupImage.show();
      this.bigImgUlr = url;
    },
  },
};
