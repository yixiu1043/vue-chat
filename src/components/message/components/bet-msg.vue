<template>
  <div :class="[{ pc: $root.isPC }, 'user-bet']">
    <div class="title">
      <div class="img user-select-one">
        <img
          :src="require(`@/assets/hall/icon_${CONFIG[lotteryName]}.png`)"
          ondragstart="return false"
        />
      </div>
      <div class="bet-type">
        <p>{{ lotteryName }}</p>
        <p>
          <span>期号:</span><span>{{ issue }}期</span>
        </p>
      </div>
      <div class="bet-name">
        <p class="user-select-one">玩法</p>
        <p>{{ playName }}</p>
      </div>
    </div>
    <div class="bet-detail">
      <div class="bet-content">
        <div class="code">
          <p class="text-ellipsis" @click="showBetNumber">
            {{ betNumber }}
          </p>
        </div>
        <div class="text user-select-one">投注内容</div>
      </div>
      <div class="separation-line"></div>
      <div class="bet-money">
        <span class="money">{{ betMoney }}</span
        ><span class="text user-select-one">投注金额</span>
      </div>
    </div>
    <p class="bet-btn user-select-one" @click="followBet">跟单</p>
  </div>
</template>
<script>
import { showToast } from '@/service/helper';

const CONFIG = {
  重庆时时彩: 'cqssc',
  五分彩: 'wfc',
  分分彩: 'ffc',
  广西快3: 'gxk3',
  幸运28: 'lucky28',
  PC蛋蛋: 'lucky28',
  幸运飞艇: 'xyft',
  北京赛车: 'bjpk10',
};

export default {
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      CONFIG,
    };
  },
  computed: {
    lotteryName() {
      return this.msg.split('/')[0];
    },
    issue() {
      return this.msg.split('/')[1];
    },
    playName() {
      return this.msg.split('/')[2];
    },
    betNumber() {
      return this.msg.split('/')[3];
    },
    betMoney() {
      return this.msg.split('/')[4];
    },
  },
  methods: {
    showBetNumber() {
      showToast(this.betNumber, '', 'toast-middle');
    },
    followBet() {
      this.$emit('on-follow-bet', this.msg);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/color.scss";
@import "@/styles/compass.scss";

.user-bet {
  font-size: px2rem(12px);

  .title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid $border_color;
    padding: px2rem(5px);

    .img {
      width: px2rem(30px);
      height: px2rem(30px);
      background: url("../../../assets/hall/icon_bg.png") no-repeat center /
        cover;
      border-radius: px2rem(5px);
      img {
        border-radius: 50%;
        width: 100%;
        height: auto;
      }
    }

    .bet-type {
      min-width: px2rem(110px);
      padding-left: px2rem(10px);

      p:nth-child(1) {
        font-size: px2rem(12px);
      }
      p:nth-child(2) {
        font-size: px2rem(10px);
        color: $gray;
      }
    }

    .bet-name {
      padding-left: px2rem(10px);
      color: $gray;
      font-size: px2rem(12px);
      p:nth-child(2) {
        color: $red;
      }
    }
  }

  .bet-detail {
    overflow: hidden;
    padding: px2rem(10px) 0;
    display: flex;

    .separation-line {
      width: 0;
      height: 40px;
      border-right: 1px solid $border_color;
    }

    .bet-content,
    .bet-money {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      line-height: px2rem(20px);
      width: px2rem(125px);

      .code {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        font-size: px2rem(14px);
        justify-content: center;
        color: $red;
        .text-ellipsis {
          width: px2rem(125px);
          white-space: unset;
          text-align: center;
        }
      }

      .money {
        color: $red;
        font-size: px2rem(14px);
      }

      .text {
        color: $gray;
      }
    }
  }

  .bet-btn {
    border-top: 1px solid $border_color;
    text-align: center;
    line-height: px2rem(35px);
    font-size: px2rem(15px);
    color: $red;
  }
}

.user-bet.pc {
  width: 350px;
  border-radius: 5px;
  font-size: 12px;

  .title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid $border_color;
    padding: 10px;

    .img {
      width: 40px;
      height: 40px;
      background: url("../../../assets/hall/icon_bg.png") no-repeat center /
        cover;
      border-radius: 5px;
      img {
        border-radius: 50%;
        width: 100%;
        height: auto;
      }
    }

    .bet-type {
      padding-left: 20px;
      min-width: 160px;
      font-size: 10px;

      p:nth-child(1) {
        font-size: 14px;
      }
      p:nth-child(2) {
        color: $gray;
        font-size: 12px;
      }
    }

    .bet-name {
      padding-left: 10px;
      color: $gray;
      font-size: 12px;
      p:nth-child(2) {
        font-size: 14px;
        color: $red;
      }
    }
  }

  .bet-detail {
    overflow: hidden;
    padding: 10px 0;

    .separation-line {
      float: left;
      width: 0;
      height: 40px;
      border-right: 1px solid $border_color;
    }

    .bet-content,
    .bet-money {
      float: left;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      line-height: 20px;
      width: 170px;

      .code {
        float: left;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        font-size: 14px;
        color: $red;
        .text-ellipsis {
          width: 170px;
          white-space: unset;
          text-align: center;
          cursor: pointer;
        }
      }

      .money {
        color: $red;
        font-size: 14px;
      }

      .text {
        color: $gray;
      }
    }
  }

  .bet-btn {
    border-top: 1px solid $border_color;
    text-align: center;
    line-height: 35px;
    font-size: 15px;
    color: $red;
    cursor: pointer;
  }
}
</style>
