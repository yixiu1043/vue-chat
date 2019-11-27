<template>
  <div class="money-envelope">
    <me-popup ref="chatPopup" title="请输入支付密码" :footer="false">
      <div slot="content">
        <div class="envelope-content">
          <p class="top-20 text-money">￥:12</p>
          <div class="text top-20">
            <span>支付方式</span>
            <span>账户余额</span>
          </div>
          <div class="password top-20">
            <mt-field
              placeholder="请输入密码"
              type="password"
              v-model="password"
            ></mt-field>
          </div>
          <div class="top-20">
            <mt-button class="btn" type="default" @click.stop="sendEnvelope">
              发送红包
            </mt-button>
          </div>
        </div>
      </div>
    </me-popup>
  </div>
</template>
<script>
import MePopup from '../popup';

export default {
  components: {
    MePopup,
  },
  data() {
    return {
      password: '',
    };
  },
  methods: {
    hide() {
      this.$refs.chatPopup.hide();
    },
    show() {
      this.$refs.chatPopup.show();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
.envelope-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;

  .top-20 {
    margin-top: px2rem(20px);
  }
  .text-money {
    font-size: px2rem(24px);
    font-weight: bold;
  }
  .text {
    display: flex;
    justify-content: space-between;
    border-bottom: px2rem(1px) solid $border_color;
    font-size: px2rem(12px);
    span {
      line-height: px2rem(30px);
    }
  }
  .btn {
    width: 80%;
  }
  /deep/.mint-button--default {
    background-color: $red;
    color: $white;
  }
}
</style>
