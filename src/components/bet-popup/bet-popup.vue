<template>
  <me-popup ref="popup" title="投注信息" :footer="false" @on-close="reset">
    <div class="collection-modal" slot="content">
      <div :class="[{ pc: $root.isPC }, 'modal-content']">
        <div class="info">
          <span>投注彩种</span><span>{{ lotteryName }}</span>
        </div>
        <div class="info">
          <span>投注期数</span><span>{{ issue }}</span>
        </div>
        <div class="info">
          <span>投注玩法</span><span>{{ playName }}</span>
        </div>
        <div class="info">
          <span>投注内容</span>
          <div class="code">
            <p class="text-ellipsis" @click="showBetNumber">
              {{ betNumber }}
            </p>
          </div>
        </div>
        <div class="info">
          <span>投注注数</span><span>{{ betCount }}注</span>
        </div>
        <div class="info">
          <span>总金额</span><span>{{ totalMoney }}</span>
        </div>
        <div class="info">
          <span class="single-money">单注金额￥:</span>
          <input
            class="money-input"
            type="text"
            v-model="money"
            @keyup.enter="makeBetMsg"
            placeholder="输入单注金额"
          />
          <me-button class="bet-button" @click.native="makeBetMsg"
            >投注</me-button
          >
        </div>
      </div>
    </div>
  </me-popup>
</template>
<script>
import MePopup from '../popup';
import MeButton from '../button';
import { showToast } from '@/service/helper';
import { listenKeyboard } from '@/lib/device';

export default {
  components: {
    MePopup,
    MeButton,
  },
  data() {
    return {
      msg: '',
      money: '',
    };
  },
  computed: {
    lotteryName() {
      return this.msg && this.msg.split('/')[0];
    },
    issue() {
      return this.msg && this.msg.split('/')[1];
    },
    playName() {
      return this.msg && this.msg.split('/')[2];
    },
    betNumber() {
      return this.msg && this.msg.split('/')[3];
    },
    betCount() {
      return this.msg && this.betNumber.split('|').length;
    },
    betMoney() {
      return this.msg && this.msg.split('/')[4];
    },
    totalMoney() {
      if (this.money) {
        return (this.betCount * this.money).toFixed(2);
      }
      return this.betMoney;
    },
  },
  mounted() {
    this.$nextTick(() => {
      const $input = document.querySelector('.money-input');
      listenKeyboard($input);
    });
  },
  methods: {
    reset() {
      this.money = '';
    },
    showBetNumber() {
      showToast(this.betNumber, '', 'toast-middle');
    },
    getBetMsg(data) {
      this.msg = data;
    },
    show() {
      this.reset();
      this.$refs.popup.show();
    },
    hide() {
      this.reset();
      this.$refs.popup.hide();
    },
    makeBetMsg() {
      const newMsg = `${this.lotteryName}/${this.issue}/${this.playName}/${this.betNumber}/${this.totalMoney}`;
      this.$emit('on-set-bet', newMsg);
      this.$refs.popup.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/color.scss";
@import "@/styles/compass.scss";
@import "./bet-popup.scss";
</style>
