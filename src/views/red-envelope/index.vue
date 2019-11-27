<template>
  <transition name="slide">
    <div class="red-envelope">
      <me-head title="发红包" />
      <main>
        <div class="input-box">
          <span>总金额</span>
          <mt-field
            placeholder="0.00"
            type="number"
            v-model="money"
            :attr="{ dir: 'rtl' }"
          ></mt-field>
          <span>元</span>
        </div>
        <div class="input-box">
          <span>红包个数</span>
          <mt-field
            placeholder="填写个数"
            type="Number"
            v-model="number"
            :attr="{ dir: 'rtl' }"
          ></mt-field>
          <span>个</span>
        </div>
        <div class="input-box">
          <mt-field
            placeholder="恭喜发财，大吉大利"
            type="textarea"
            rows="4"
            v-model="introduction"
            :attr="{ width: '100%' }"
          ></mt-field>
        </div>
        <p class="top-30 text-money">
          <span>￥:</span>
          <span>{{ (money * 1).toFixed(2) }}</span>
        </p>
        <div class="top-30 input-btn">
          <mt-button class="btn" type="default" @click.stop="sendEnvelope">
            塞钱进红包
          </mt-button>
        </div>
        <p class="top-30 text">
          未领取的红包,将于24小时后发起退款
        </p>
      </main>
      <money-envelope ref="MoneyEnvelope" />
    </div>
  </transition>
</template>
<script>
import MeHead from '@/components/head';
import MoneyEnvelope from '@/components/money-envelope/index';

export default {
  name: 'red-envelope',
  components: {
    MeHead,
    MoneyEnvelope,
  },
  data() {
    return {
      money: '',
      number: '',
      introduction: '恭喜发财，大吉大利',
    };
  },
  computed: {
    sendMoney() {
      return (this.money * this.number).toFixed(2);
    },
  },
  methods: {
    sendEnvelope() {
      console.log('红包');
      this.$refs.MoneyEnvelope.show();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(-100%, 0, 0);
}

.red-envelope {
  height: 100%;
  overflow: hidden;
  main {
    overflow: auto;
    @include prefixer-value(height, calc(100% - 2.5rem), webkit moz o ms);
    padding: px2rem(10px);
    background-color: rgba($color: $primary_gray, $alpha: 0.3);
    text-align: center;

    .input-box {
      background-color: white;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border: px2rem(1px) solid $border_color;
      margin-top: px2rem(20px);
      border-radius: px2rem(5px);
      padding: px2rem(3px) px2rem(10px);
      resize: none;

      /deep/.mint-cell {
        flex: 1;
        background-image: none;

        /deep/.mint-cell-wrapper {
          background-image: none;
        }
      }
      span {
      }
    }
    .top-30 {
      margin-top: px2rem(30px);
    }
    .btn {
      width: 80%;
    }
    .text-money {
      font-size: px2rem(16px);
    }
    .text {
      font-size: px2rem(10px);
    }
  }
}
</style>
