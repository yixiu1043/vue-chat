<template>
  <div class="recharge" :class="theme" :style="style">
    <header>
      <p class="head-text" v-for="item in headData" :key="item">{{ item }}</p>
    </header>
    <section>
      <p>
        <font-awesome-icon icon="phone" class="service-icon" rotation="90" />
        <span class="text">联系客服:</span>
        <span class="special">{{ globalConfig.kefu_phone }}</span>
      </p>
      <p>
        <font-awesome-icon icon="headset" class="service-icon" />
        <span class="text">客服QQ号:</span>
        <span class="special">{{ globalConfig.kefu_qq }}</span>
      </p>
      <div class="btn-box" v-if="!$root.isPC">
        <mt-button size="small" @click="goRecharge">立即充值 </mt-button>
        <mt-button size="small" @click="goCustomServece">咨询客服 </mt-button>
      </div>
    </section>
    <footer>
      <p v-for="item in footerData" :key="item">
        {{ item }}
      </p>
    </footer>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  props: {
    theme: {
      type: String,
      default: 'light',
    },
  },
  data() {
    return {
      headData: [
        ' 特别说明:',
        '支持V信、支付宝和银行卡转账;',
        '必须提供银行卡号;',
        '充值过程，请勿重复提交请求;',
      ],
      footerData: [
        '1.请在个人中心页充值入口进行充值;',
        '2.请在支付宝/微信中打开“扫一扫”;',
        '3.可长按“二维码”点击“识别图中二维码”或保存二维码图片;',
        '4.在“扫一扫”点右上角，选择“从相册中选择取二维码”选取保存的图片;',
        '5.如充值未及时到账或者有其他的疑问，请您联系客服反馈。',
      ],
      linkSrc: '',
    };
  },
  computed: {
    ...mapState({
      globalConfig: state => state.globalConfig,
      isPC: state => state.isPC,
    }),
    style() {
      if (this.isPC) {
        return { fontSize: '12px' };
      }
      return {};
    },
  },
  methods: {
    goCustomServece() {
      window.open(this.globalConfig.kefu_url, '_blank');
    },
    goRecharge() {
      this.$router.push('/recharge');
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";

.recharge.dark {
  color: $white;

  .special {
    color: $yellow;
  }
}

.recharge.light {
  .special {
    color: $red;
  }
}

.recharge {
  height: 100%;
  padding: px2rem(8px);
  overflow-y: scroll;
  font-size: px2rem(12px);
  line-height: px2rem(18px);

  header {
    p:nth-child(1) {
      font-size: px2rem(12px);
      font-weight: bold;
    }
  }

  section {
    margin: px2rem(10px) 0;

    p {
      margin-bottom: px2rem(10px);
    }

    .btn-box {
      button {
        margin: 0 px2rem(5px);
      }
    }
  }
}
</style>
