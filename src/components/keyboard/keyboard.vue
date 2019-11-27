<template>
  <div :class="[{ pc: $root.isPC }, 'keyboard-container']">
    <!--下注鍵盤-->
    <div v-show="isBetKeyboardShowing">
      <mt-popup v-model="pickerVisible" class="bet-dialog" position="top">
        <div class="bet-box">
          <div class="bet-content">
            <div class="bet-title">
              <span class="line"></span>
              <span class="text">{{ betTypeName }}</span>
              <span class="line"></span>
            </div>
            <div class="bet">
              <div
                class="item"
                :class="{ selected: betTypeName === bet.name }"
                v-for="(bet, i) in keyboardData.bet_type"
                :key="bet.type"
                @click="onBetTypeChange(i)"
              >
                <span>{{ bet.name }}</span>
              </div>
            </div>
            <div class="play-title">
              <span class="line"></span>
              <span class="text">{{ playTypeName }}</span>
              <span class="line"></span>
            </div>
            <div class="play">
              <div
                class="item"
                :class="{ selected: playTypeName === play.name }"
                v-for="(play, i) in keyboardDataBetType.play"
                :key="play.rule_id"
                @click="onPlayTypeChange(i)"
              >
                <span>{{ play.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </mt-popup>

      <div class="lottery-info" :class="theme">
        <div class="select-lottery-item" @click.stop="showLotteryList">
          <span>切换彩种</span>
          <span>
            <font-awesome-icon icon="angle-down" />
          </span>
        </div>
        <div class="toggle-play-btn" @click="pickerVisible = !pickerVisible">
          <span class="mr-5px">{{ betTypeName + " - " + playTypeName }}</span>
          <span>
            <font-awesome-icon icon="angle-down" v-if="pickerVisible" />
            <font-awesome-icon icon="angle-up" v-else />
          </span>
        </div>
        <div class="close-lottery" @click.stop="closeKeyboard">
          <font-awesome-icon icon="times" />
        </div>
      </div>
      <div class="keyboard-box user-select-one">
        <div class="box">
          <div
            v-for="(item, rowIndex) in keyboardDataPlay.keys"
            :data-row="rowIndex"
            :key="item.rule_id"
            class="bet-item"
          >
            <div class="play-name">
              <span class="text">{{ Object.keys(item)[0] }}</span>
            </div>
            <div class="key-part">
              <div class="hot-key" v-if="keyboardDataPlay.hot_keys.length">
                <span
                  class="item"
                  v-for="(hotKey, index) in keyboardDataPlay.hot_keys"
                  @click="format(rowIndex, Object.values(hotKey)[0])"
                  :key="index"
                >
                  {{ Object.keys(keyboardDataPlay.hot_keys[index])[0] }}
                </span>
              </div>
              <div class="keyboard">
                <span
                  :class="{
                    dice:
                      gameType === '21' &&
                      specialPlays.includes(keyboardDataPlay.rule_id),
                    active:
                      (!specialPlays.includes(keyboardDataPlay.rule_id) &&
                        betList[rowIndex].includes(key)) ||
                      (specialPlays.includes(keyboardDataPlay.rule_id) &&
                        betList[rowIndex].includes(i + 1))
                  }"
                  class="key-item"
                  v-for="(key, i) in getKeysData(rowIndex)"
                  :key="i"
                  @click="betChange(rowIndex, key, i)"
                  >{{ key }}</span
                >
                <span
                  v-for="num in 6 - (getKeysData(rowIndex).length % 6)"
                  class="key-item "
                  :class="{
                    'empty-item-show': getKeysData(rowIndex).length % 6 > 0,
                    'empty-item-hide': getKeysData(rowIndex).length % 6 === 0
                  }"
                  :key="'empty' + num"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Accountant
        :betList="betList"
        :betType="Number(keyboardDataBetType.type)"
        :betName="keyboardDataBetType.name || ''"
        :playType="Number(keyboardDataPlay.rule_id)"
        :playName="keyboardDataPlay.name || ''"
        :gameType="Number(gameType)"
        :gameName="keyboardData.name || ''"
        :issue="issue"
        @on-send-bet-msg="onSendBetMsg"
        ref="Accountant"
        @closeKeyboard="closeKeyboard"
        @cleanBetList="cleanBetList"
        :theme="theme"
        :unitPrice="keyboardData.unit_price || 2"
      />
    </div>
    <!-- 功能菜单 -->
    <div class="product">
      <product-menu
        @on-send-img="onSendImg"
        @on-show-emoji="onShowEmoji"
        ref="ProductMenu"
      />
    </div>
    <!-- 表情菜单 -->
    <div class="emoji-slide">
      <product-emoji ref="ProductEmoji" @on-add-emoji="onAddEmoji" />
    </div>
    <!--聊天輸入匡-->
    <div class="send" :class="theme" v-show="!isBetKeyboardShowing">
      <div class="btn-img user-select-one">
        <mt-button
          class="btn"
          :class="theme"
          type="default"
          size="small"
          @click.stop="showProduct"
          :disabled="isNoSend || !canChat || inputDisabled || !joined"
        >
          <font-awesome-icon icon="plus" />
        </mt-button>
      </div>
      <div class="text-input">
        <input
          v-model="text"
          type="text"
          :placeholder="canChat ? '彩种/期号/玩法/数字/金额' : '尚无法发言'"
          class="text-code"
          ref="chatInput"
          :disabled="inputDisabled || !canChat"
          @keyup.native.enter="sendMessage"
          v-if="!$root.isPC"
          key="移动端显示input框"
        />
        <mt-field
          :placeholder="canChat ? '彩种/期号/玩法/数字/金额' : '尚无法发言'"
          type="textarea"
          ref="chatInput"
          class="text-code"
          rows="2"
          v-model="text"
          @keyup.native.enter="sendMessage"
          v-else
          key="pc端显示textarea框"
        ></mt-field>
      </div>
      <div class="btn-group user-select-one">
        <mt-button
          class="btn"
          :class="theme"
          type="default"
          size="small"
          @click.stop="sendMessage"
          :disabled="isNoSend || !canChat || inputDisabled || !joined"
        >
          <font-awesome-icon icon="arrow-up" />
        </mt-button>
        <div class="btn-lottery" :class="theme" @click.stop="changeLottery">
          <img src="../../assets/chatroom/lottery.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import UserStorage from '@/storage/user';
import Accountant from '../accountant';
import { toolkit, showToast } from '@/service/helper';
import UserService from '@/service/user';
import { listenKeyboard } from '@/lib/device';
import LotteryService from '@/service/lottery';
import ProductMenu from './menu/index';
import ProductEmoji from './emoji/index';
import nativeTool from '@/lib/tool';


/* eslint-disable prefer-destructuring */

export default {
  props: {
    theme: {
      type: String,
      required: true,
      deafult: 'light',
    },
    inputDisabled: {
      type: Boolean,
      required: true,
      deafult: true,
    },
    joined: {
      type: Boolean,
      required: true,
      deafult: false,
    },
    issue: {
      type: String,
      required: true,
      deafult: '',
    },
    gameType: {
      type: [String, Number],
      required: true,
      deafult: '',
    },
    canChat: {
      type: Boolean,
      required: true,
      deafult: false,
    },
  },
  components: {
    Accountant,
    ProductMenu,
    ProductEmoji,
  },
  data() {
    return {
      pickerVisible: false,
      text: '',
      isNoSend: false,
      isBetKeyboardShowing: false,
      isLottyerList: false,
      keyboardData: {},
      keyboardDataBetType: {},
      keyboardDataPlay: {},
      betList: [],
      betTypeName: '',
      playTypeName: '',
      specialPlays: [1, 2],
      isShowProduct: false,
      inputEmojiList: [],
    };
  },
  computed: {
    ...mapState({
      sendChatTime: state => state.sendChatTime,
    }),
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  mounted() {
    this.$nextTick(() => {
      const $input = this.$refs.chatInput;
      listenKeyboard($input);
      this.loadKeyboardSetting();
      // 监听粘贴板，发送图片
      document.getElementsByTagName('body')[0].addEventListener('paste', this.pasteImg);
    });
  },
  watch: {
    keyboardDataPlay() {
      // 重置下注格式
      this.cleanBetList();
    },
    gameType() {
      this.loadKeyboardSetting();
    },
  },
  methods: {
    /**
       * 從yaml讀取鍵盤設定檔案，並且解析給picker使用
       */
    loadKeyboardSetting() {
      /* eslint-disable-next-line import/no-webpack-loader-syntax */
      const keyboard = require('json-loader!yaml-loader!../../yml/keyboard.yml');

      // 取出設定值，取出目标彩种的键盘配置
      keyboard.game_type.forEach((item) => {
        if (item.type === Number(this.gameType)) {
          this.keyboardData = item;
        }
      });

      this.keyboardDataBetType = this.keyboardData.bet_type[0];
      this.keyboardDataPlay = this.keyboardData.bet_type[0].play[0];
      this.betTypeName = this.keyboardDataBetType.name;
      this.playTypeName = this.keyboardDataPlay.name;
    },
    getKeysData(rowIndex) {
      if (this.keyboardDataPlay.display_keys) {
        return Object.values(this.keyboardDataPlay.display_keys[rowIndex])[0];
      }
      return Object.values(this.keyboardDataPlay.keys[rowIndex])[0];
    },
    onBetTypeChange(index) {
      this.keyboardDataBetType = this.keyboardData.bet_type[index];
      this.keyboardDataPlay = this.keyboardData.bet_type[index].play[0];
      this.betTypeName = this.keyboardDataBetType.name;
      this.playTypeName = this.keyboardDataPlay.name;
    },
    onPlayTypeChange(index) {
      this.pickerVisible = false;
      this.keyboardDataPlay = this.keyboardDataBetType.play[index];
      this.playTypeName = this.keyboardDataPlay.name;
    },
    betChange(rowIndex, key, itemIndex) {
      /**
         * k3二同号单选/二同号复选内容为骰子，需要特殊处理
         */
      const { rule_id } = this.keyboardDataPlay;

      const runFun = (content) => {
        if (!this.betList[rowIndex].includes(content)) {
          this.betList[rowIndex].push(content);
        } else {
          const index = this.betList[rowIndex].findIndex(betItem => betItem === content);
          this.betList[rowIndex].splice(index, 1);
        }
      };

      if (this.specialPlays.includes(rule_id)) {
        const item = Object.values(this.keyboardDataPlay.keys[rowIndex])[0][itemIndex];
        runFun(item);
      }
      if (!this.specialPlays.includes(rule_id)) {
        runFun(key);
      }
    },
    format(rowIndex, value) {
      // 快捷投注
      this.$set(this.betList, [rowIndex], [...value]);
    },
    closeKeyboard() {
      this.cleanBetList();
      this.isBetKeyboardShowing = false;
      this.$emit('closeKeyboard');
    },
    cleanBetList() {
      this.betList.length = 0;
      this.keyboardDataPlay.keys.forEach(() => {
        this.betList.push([]);
      });
    },
    noSendController() {
      // 防止按钮重复点击
      clearTimeout(this.timeout);
      this.isNoSend = true;
      this.sendButtonTimeout = setTimeout(() => {
        this.isNoSend = false;
        clearTimeout(this.timeout);
      }, 500);
    },
    beforeDestory() {
      this.betList = [];
    },
    // 发送彩种信息
    onSendBetMsg(msg) {
      if (!msg) {
        return;
      }
      const { avatar, nick_name } = this.userInfo;
      this.$emit('on-message-send', {
        msgType: 'user_bet',
        msg,
        sentUser: nick_name,
        avatar,
      });
    },
    // 用户发送消息
    sendMessage() {
      if (!this.canChat) {
        showToast('无法发言');
        return;
      }
      this.noSendController();
      if (toolkit.deleteBlank(this.text)) {
        showToast('不能输入空内容');
        this.text = '';
        return;
      }

      // 用户自定义消息
      if (!this.text.includes('/') && !this.text.includes('_emoji')) {
        this.onEmitMessage('user', this.text);
      }
      // 用户下注消息
      if (this.text.includes('/')) {
        // 通过下注字串进行下注
        try {
          LotteryService.betByMessage(this.text)
            .then(() => { this.text = ''; });
        } catch (error) {
          showToast('您输入的下注格有误！');
        }
      }
      // 用户发送表情
      if (this.text.includes('_emoji')) {
        this.$refs.ProductEmoji.hideEmoji();
        this.onEmitMessage('me_emoji', this.text);
        this.text = '';
        this.inputEmojiList = [];
      }
    },
    // 设置input框值；
    setInputText(text) {
      this.text = text;
    },
    // 显示功能菜单
    showProduct() {
      this.$refs.ProductMenu.showProduct();
      this.$refs.ProductEmoji.hideEmoji();
    },
    // 选择发送图
    onSendImg(imgFile) {
      const { start, end } = this.sendChatTime;
      if (UserService.getSendChatState(start, end)) {
        nativeTool.uploadImgToBase64(imgFile).then(({ result }) => {
          this.onEmitMessage('me_img', result);
        });
      }
    },
    // 统一发送事件和消息；
    onEmitMessage(msgType, msg) {
      const { avatar, nick_name } = this.userInfo;
      const { start, end } = this.sendChatTime;
      if (UserService.getSendChatState(start, end)) {
        this.$emit('on-message-send', {
          msgType,
          msg,
          sentUser: nick_name,
          avatar,
        });
      }
    },
    // 派发粘贴图片事件，并发送图片
    pasteImg(e) {
      nativeTool.pasteSendImg(e, this.onSendImg);
    },
    // 隐藏功能菜单
    hideProduct() {
      this.$refs.ProductMenu.hideProduct();
    },
    // 显示表情
    onShowEmoji() {
      this.$refs.ProductEmoji.showEmoji();
    },
    // 选择表情
    onAddEmoji(data) {
      this.inputEmojiList.push(`_emoji${data}`);
      this.text = this.inputEmojiList.join(';');
    },
    // 显示彩种列表板块
    showLotteryList() {
      this.hideBetKeyboard();
      this.$emit('on-show-lotterylist');
    },
    // 显示投注板块
    changeLottery() {
      this.$refs.ProductEmoji.hideEmoji();
      this.text = '';
      this.hideProduct();
      if (!UserStorage.getLotteryInfo()) {
        this.showLotteryList();
        return;
      }
      this.showBetKeyboard();
    },
    showBetKeyboard() {
      this.isBetKeyboardShowing = true;
    },
    hideBetKeyboard() {
      this.isBetKeyboardShowing = false;
    },
  },
};
</script>

<style scoped lang="scss">
@import "./keyboard.scss";
@import "./keyboard-pc.scss";
</style>
