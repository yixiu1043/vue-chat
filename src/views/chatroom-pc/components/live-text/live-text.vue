<template>
  <div class="live-text">
    <ul class="list">
      <li class="item clear" v-for="item in lotteryList" :key="item.lottery_id">
        <div class="lottery-logo fl">
          <img
            :src="
              require(`../../../../assets/hall/icon_${item.lottery_code.toLowerCase()}.png`)
            "
            ondragstart="return false"
          />
        </div>
        <div class="detail fl">
          <p class="name">{{ item.lottery_name }}</p>
          <p class="issue">{{ item.last_issue_no }}</p>
          <p class="reslut">
            <span
              class="ball user-select-one"
              :class="item.lottery_code.toLowerCase()"
              :style="{ backgroundColor: ball.color }"
              v-for="(ball, i) in item.last_open_number"
              :key="i"
              >{{ ball.number }}</span
            >
          </p>
        </div>
      </li>
    </ul>
    <div class="refresh">
      <canvas ref="canvas" width="30" height="60"></canvas>
      <div class="refresh-icon" @click="refreshLotteryData">
        <font-awesome-icon icon="redo-alt" rotation="90" :spin="isIconSpin" />
      </div>
    </div>
  </div>
</template>
<script>
import LotteryService from '@/service/lottery';

export default {
  props: {
    lotteryList: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      isIconSpin: false,
    };
  },
  mounted() {
    this.$nextTick(() => this.drawLine());
  },
  methods: {
    refreshLotteryData() {
      this.isIconSpin = true;
      LotteryService.getLotteryList()
        .then(() => { this.isIconSpin = false; });
    },
    drawLine() {
      const { canvas } = this.$refs;
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(15, 60);
      ctx.strokeStyle = '#2d97ff';
      ctx.stroke();
      ctx.closePath();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/color.scss";

.live-text {
  position: relative;
  font-size: 14px;
  height: 100%;

  .list {
    height: 100%;
    overflow: auto;
    .item {
      padding: 15px;
      margin-bottom: 10px;
      background-color: $primary_white;

      .lottery-logo {
        margin-top: 9px;

        img {
          width: 40px;
          height: 40px;
          background: url(../../../../assets/hall/icon_bg.png) no-repeat center /
            cover;
          border: px2rem(2px) solid $hall_lottery_icon_border;
          border-radius: 5px;
        }
      }

      .detail {
        padding-left: 15px;

        .issue {
          padding: 5px 0;
          font-size: 10px;
          color: $gray;
        }

        .reslut {
          .ball {
            display: inline-block;
            width: 25px;
            height: 25px;
            margin-right: 5px;
            font-size: 13px;
            font-weight: bolder;
            line-height: 25px;
            color: $white;
            text-align: center;
            background-color: $red;
            border-radius: 5px;
          }
        }
      }
    }
  }
  .refresh {
    width: 20px;
    position: absolute;
    right: 40px;
    top: 0;
    opacity: 0.5;
    .refresh-icon {
      color: $white;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      margin-top: -1px;
      cursor: pointer;
      background-image: radial-gradient(#138aff, #409fff, #84c3ff);
      transition: opacity 0.5s;
    }
    &:hover {
      opacity: 1;
    }
  }
}
</style>
