<template>
  <div :class="[{ pc: $root.isPC }, 'slide']">
    <span class="arrow" @click="prev">
      <font-awesome-icon icon="chevron-left" />
    </span>
    <div
      class="content"
      @mousedown="changeDown"
      @mouseup="changeUp"
      @touchstart="changeDown"
      @touchmove.capture="changeUp"
      @touchend="changeEnd"
    >
      <mt-swipe
        :auto="0"
        ref="Swipe"
        :show-indicators="false"
        @change="handleChange"
      >
        <mt-swipe-item v-for="item in lotteryLinks" :key="item.name">
          <div class="middle">
            <lottery-snapshot :lotteryData="changeData(item)" />
          </div>
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <span class="arrow" @click="next">
      <font-awesome-icon icon="chevron-right" />
    </span>
  </div>
</template>
<script>
import $ from 'jquery';
import LotterySnapshot from '../lottery-snapshot';
import { getBallColor, formatDate } from '@/service/helper';

export default {
  components: {
    LotterySnapshot,
  },
  props: {
    lotteryLinks: {
      type: Array,
      required: true,
      default: () => [],
    },
    lotteryData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      downX: 0,
      moveX: 0,
      upX: 0,
      isChangeHeadData: true,
      defaultIndex: 0,
      swipeWidth: 0,
      swipeTimer: null,
    };
  },
  watch: {
    defaultIndex(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.isChangeHeadData = true;
      } else {
        this.isChangeHeadData = false;
      }
    },
  },
  methods: {
    formatLotteryData(lotteryDataInfo) {
      const data = {};
      data.code = this.changeStr(lotteryDataInfo.lottery_code).toLowerCase();
      data.name = lotteryDataInfo.lottery_name;
      data.issue = lotteryDataInfo.current_issue_no;
      data.locked = false;
      data.timer = this.getLotteryTime > 0 ? formatDate(this.getLotteryTime) : '00:00';
      data.number = [];
      lotteryDataInfo.last_open_number.split(',').forEach((num) => {
        const obj = {};
        obj.number = num;
        obj.color = getBallColor(lotteryDataInfo.lotteryId, num);
        data.number.push(obj);
      });
      return data;
    },
    getLotteryTime(lotteryData) {
      const timer = lotteryData.lock_seconds + lotteryData.remain_seconds;
      return timer;
    },
    changeStr(str) {
      if (str) {
        return str;
      }
      return '';
    },
    handleChange(index) {
      this.defaultIndex = index;
      const lotteryId = this.lotteryLinks[index].lottery_id;
      const lotteryName = this.lotteryLinks[index].lottery_name;
      const lotteryCode = this.lotteryLinks[index].lottery_code.toLowerCase();
      this.$emit('on-change-swipe', lotteryId, lotteryName, lotteryCode);
    },
    next() {
      this.$refs.Swipe.next();
    },
    prev() {
      this.$refs.Swipe.prev();
    },
    changeDown(e) {
      if (this.$root.isPC) {
        this.downX = e.pageX;
        return;
      }
      if (e && e.touches) {
        this.downX = e.touches[0].clientX;
        this.swipeWidth = (parseInt($('.mint-swipe').css('width'), 10)) / 2;
      }
    },
    changeUp(e) {
      if (this.$root.isPC) {
        this.upX = e.clientX;
        const moveDistance = this.downX - this.upX;
        if (moveDistance > 80) {
          this.next();
        }
        if (moveDistance < -80) {
          this.prev();
        }
        return;
      }
      if (e && e.touches) {
        this.upX = e.touches[0].clientX;
        const moveDistance = this.downX - this.upX;
        if (Math.abs(moveDistance) > this.swipeWidth) {
          this.isChangeHeadData = true;
        } else {
          this.isChangeHeadData = false;
        }
      }
    },
    changeEnd() {
      if (!this.$root.isPC) {
        this.isChangeHeadData = true;
      }
    },
    changeData(item) {
      if (this.isChangeHeadData) {
        return this.lotteryData;
      }
      return this.formatLotteryData(item);
    },
  },

};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";

$height: 50px;

.slide {
  width: 100%;
  height: px2rem($height);
  display: flex;
  /* background-color: $black; */
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  span.arrow {
    width: 5%;
    height: 100%;
    color: $black;
    font-size: px2rem(12px);
    text-align: center;
    background-color: $white;
    line-height: px2rem($height);
  }
  .content {
    width: 90%;
    height: 100%;
    .middle {
      width: 100%;
      height: px2rem($height);
    }
  }
}
.slide.pc {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: $white;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  span.arrow {
    width: 5%;
    height: 100%;
    color: $black;
    font-size: 12px;
    text-align: center;
    background-color: $white;
    line-height: $height;
  }
  .content {
    width: 90%;
    height: 100%;
    .middle {
      width: 100%;
      height: $height;
    }
  }
}
</style>
