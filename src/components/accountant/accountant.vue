<template>
  <section :class="[{ pc: $root.isPC }, 'accountant-con']">
    <transition name="slide">
      <mt-popup class="confirm" v-model="isShowConfirm" position="bottom">
        <div class="container">
          <div class="header" :class="theme">
            {{ playName }}
            <span class="close-btn" @click="hideConfirm">
              <font-awesome-icon icon="times" />
            </span>
          </div>
          <div class="info">
            <span
              >共{{ getResultInfo }}注，投注金额{{
                this.getResultBetAmount
              }}元</span
            >
          </div>
          <div class="inputs">
            <mt-field
              label="下注金額"
              class="bet-money"
              placeholder="金额"
              type="text"
              :attr="{ autofocus: true }"
              v-model="betAmount"
            />
          </div>
          <div class="footer">
            <mt-button
              class="button no"
              type="default"
              size="small"
              @click="hideConfirm"
            >
              取消下注
            </mt-button>
            <mt-button
              class="button yes"
              :class="theme"
              type="default"
              size="small"
              @click="addOrder"
            >
              确定下注
            </mt-button>
          </div>
        </div>
      </mt-popup>
    </transition>
    <div class="accountant" :class="theme">
      <div class="keyboard-btn" @click="closeKeyboard">
        <font-awesome-icon icon="keyboard" />
      </div>
      <mt-button class="button btn" type="default" @click="cleanBetList">
        清空所选
      </mt-button>
      <div class="info">共{{ getResultInfo }}注</div>
      <mt-button class="button btn" type="default" @click="showConfirm">
        确定下注
      </mt-button>
    </div>
  </section>
</template>

<script>
import LotteryService from '@/service/lottery';
import { showToast } from '@/service/helper';
import { listenKeyboard } from '@/lib/device';

export default {
  props: {
    theme: {
      type: String,
      required: true,
      deafult: 'light',
    },
    betList: {
      type: Array,
      required: true,
      deafult: () => [],
    },
    playName: {
      type: String,
      required: true,
      deafult: '',
    },
    betName: {
      type: String,
      required: true,
      deafult: '',
    },
    gameName: {
      type: String,
      required: true,
      deafult: '',
    },
    playType: {
      type: Number,
      required: true,
      deafult: '',
    },
    betType: {
      type: Number,
      required: true,
      deafult: '',
    },
    gameType: {
      type: Number,
      required: true,
      deafult: '',
    },
    issue: {
      type: String,
      required: true,
      deafult: '',
    },
    unitPrice: {
      type: Number,
      required: true,
      deafult: 2,
    },
  },
  data() {
    return {
      resultInfo: {},
      isShowConfirm: false,
      betAmount: '',
    };
  },
  watch: {
    unitPrice: {
      handler(val) {
        this.betAmount = `${val}`;
      },
      immediate: true,
    },
    betAmount() {
      // 檢查只允許輸入數字
      setTimeout(() => {
        if (/[^0-9.]/g.test(this.betAmount)) {
          this.betAmount = this.betAmount.replace(/[^0-9.]/g, '');
          this.betAmount = this.betAmount.replace(/(\..*)\./g, '$1');
        }
      }, 10);
    },
    betList() {
      this.betCounter();
    },
  },
  computed: {
    getResultInfo() {
      return this.resultInfo.betCount ? this.resultInfo.betCount : 0;
    },
    getResultBetAmount() {
      const { betCount } = this.resultInfo;
      return (this.betAmount * (betCount || 0)).toFixed(2);
    },
  },
  mounted() {
    this.$nextTick(() => {
      const $input = document.querySelector('.bet-money input');
      listenKeyboard($input);
    });
  },
  methods: {
    showConfirm() {
      if (this.getResultInfo === 0) {
        showToast('注数不得为0', 'bottom');
        return false;
      }
      this.isShowConfirm = true;
      return true;
    },
    hideConfirm() {
      this.isShowConfirm = false;
      this.betAmount = this.unitPrice;
    },
    betCounter() {
      this.resultInfo = LotteryService.betCounter(
        this.gameType, this.betType, this.playType,
        this.betList, this.gameName, this.betName,
        this.playName, this.betAmount,
      );
    },
    transformPostContent(postContent) {
      const content = postContent;
      const array = content.split(',');
      const res = [];
      array.forEach((item) => {
        let temp = item;
        temp = temp.split('|');
        temp[2] = this.betAmount;
        temp = temp.join('|');
        res.push(temp);
      });
      return res.toString();
    },
    addOrder() {
      this.isShowConfirm = false;
      const { betCount, playType } = this.resultInfo;
      let { postContent } = this.resultInfo;
      if (+this.gameType === 19) {
        // 因为PC蛋蛋下注格式与ssc/pk10不一样，需要进行特殊处理
        postContent = this.transformPostContent(postContent);
      }
      LotteryService.addOrder({
        issue_no: this.issue,
        lottery_id: this.gameType,
        play_type_id: playType,
        bet_content: postContent,
        unit_price: this.betAmount,
        bet_count: betCount,
      })
        .then((result) => {
          // 判斷下注是否成功
          if (result) {
            // 傳送下注訊息到聊天室
            this.$emit('on-send-bet-msg',
              LotteryService.getAddOrderMessage(
                this.gameName,
                this.issue,
                this.gameType,
                this.playType,
                [...this.betList],
                this.getResultBetAmount,
              ));
            this.resetBetAmount();
            this.closeKeyboard();
            this.cleanBetList();
          }
        });
    },
    resetBetAmount() {
      this.betAmount = this.unitPrice;
    },
    closeKeyboard() {
      this.$emit('closeKeyboard');
    },
    cleanBetList() {
      this.$emit('cleanBetList');
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../styles/compass.scss";
@import "../../styles/color.scss";
@import "./accountant.scss";
@import "./accountant-pc.scss";

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(0, 100%, 0);
  opacity: 0;
}
</style>
