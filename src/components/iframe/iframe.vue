<template>
  <div class="iframe-box">
    <iframe
      :src="animateSrc"
      class="iframe"
      @load="transferData"
      :key="componentKey"
      ref="iframe"
      disabled
      scrolling="no"
      frameborder="0"
    ></iframe>
    <div id="wrapper"></div>
    <div class="shadow"></div>
  </div>
</template>
<script>
import SettingStorage from '@/storage/setting';
import { appConfig } from '@/config';

export default {
  props: {
    lotteryCode: {
      type: String,
      required: true,
    },
    lotteryId: {
      type: [String, Number],
      required: true,
    },
    animateData: {
      type: Object,
      required: true,
      default: () => { },
    },
  },
  data() {
    return {
      componentKey: 0,
      animateSrc: '',
      timer: null,
      isShowBg: true,
    };
  },
  watch: {
    animateData(newValue) {
      if (newValue) {
        this.transferData();
      }
      this.forceRerender();
      const { lotteryNumber, periodicalTime } = this.animateData;
      if (lotteryNumber && lotteryNumber.length > 0) {
        SettingStorage.setUpLotteryData(lotteryNumber, this.lotteryCode, periodicalTime);
      }
    },
    lotteryCode() {
      this.updateAnimateSrc();
    },
  },
  methods: {
    updateAnimateSrc() {
      this.animateSrc = `/static/iframe/${this.lotteryCode}/index.html`;
    },
    forceRerender() {
      this.componentKey += 1;
    },
    transferData() {
      if (this.lotteryCode) {
        this.updateAnimateSrc();
        const { animationDuration } = appConfig.animateOption[this.lotteryId]
          || { animationDuration: 15000 };
        this.animateData.animationDuration = animationDuration;
        SettingStorage.setAnimationData(this.animateData);
        this.$refs.iframe.contentWindow.postMessage(this.animateData, '*');
      }
    },
    createGxk3Data(
      marketCountDownTime,
      lockCountDownTime,
      lotteryNumber,
      periodicalTime,
      nextDrawBetTime,
      nextLotteryNumber,
    ) {
      return {
        marketCountDownTime,
        lockCountDownTime,
        lotteryNumber,
        periodicalTime,
        nextDrawBetTime,
        nextLotteryNumber,
      };
    },
    createLucky28Data(
      marketCountDownTime,
      lockCountDownTime,
      lotteryNumber,
      periodicalTime,
      nextLotteryNumber,
    ) {
      return {
        marketCountDownTime,
        lockCountDownTime,
        lotteryNumber,
        periodicalTime,
        nextLotteryNumber,
      };
    },
    createCqsscData(
      marketCountDownTime,
      lockCountDownTime,
      lotteryNumber,
      periodicalTime,
      nextLotteryNumber,
    ) {
      return {
        marketCountDownTime,
        lockCountDownTime,
        lotteryNumber,
        periodicalTime,
        nextLotteryNumber,
      };
    },
    createFtData(
      marketCountDownTime,
      lockCountDownTime,
      lotteryNumber,
      nextPeriodicalTime,
      periodicalTime,
      nextLotteryNumber,
    ) {
      return {
        marketCountDownTime,
        lockCountDownTime,
        lotteryNumber,
        nextPeriodicalTime,
        periodicalTime,
        nextLotteryNumber,
      };
    },
    createPk10Data(
      marketCountDownTime,
      lockCountDownTime,
      lotteryNumber,
      nextPeriodicalTime,
      periodicalTime,
      nextLotteryNumber,
    ) {
      return {
        marketCountDownTime,
        lockCountDownTime,
        lotteryNumber,
        nextPeriodicalTime,
        periodicalTime,
        nextLotteryNumber,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
$width: 100%;
$height: 100%;

.iframe-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;

  .iframe {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
    width: 100%;
    height: 100%;
  }

  #wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("../../assets/chatroom/read.gif") no-repeat #000;
    background-size: 30% auto;
    background-position: 50% 50%;
  }
  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 4;
    background-color: transparent;
  }
}
</style>
