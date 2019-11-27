<template>
  <div :class="[{ pc: $root.isPC }, 'security', 'user-select-one']">
    <me-head title="安全中心" />
    <div class="detail">
      <popup-item
        v-for="(item, index) in securityList"
        :key="index"
        :id="item.id"
        :popup-title="item.popupTitle"
        ref="popupItem"
      />
      <div class="bank" @click="toBank">
        <p>银行卡管理</p>
        <p>
          <font-awesome-icon icon="angle-right" color="#8a8c8e" size="1x" />
        </p>
      </div>
    </div>
    <bank-pc ref="bankPc" @on-show-bank="showBank" v-if="$root.isPC" />
    <me-popup
      ref="popup"
      :footer="false"
      @on-close="cleanBankValue"
      v-if="$root.isPC"
    >
      <bind-bank-card slot="content" ref="bindBankCard" />
    </me-popup>
  </div>
</template>
<script>
import MeHead from '@/components/head';
import PopupItem from './popups/index';
import BankPc from '../components/bank-pc/index';
import BindBankCard from '../bind-bank-card';
import MePopup from '@/components/popup';

export default {
  name: 'security-center',
  components: {
    MeHead,
    PopupItem,
    BankPc,
    BindBankCard,
    MePopup,
  },
  data() {
    return {
      securityList: [
        {
          popupTitle: '修改登录密码',
          id: 0,
        },
        {
          popupTitle: '修改资金密码',
          id: 1,
        },
      ],
    };
  },
  methods: {
    toBank() {
      if (this.$root.isPC) {
        this.$refs.bankPc.show();
        return;
      }
      this.$router.push('/bank');
    },
    showBank() {
      this.$refs.bankPc.hide();
      this.$refs.popup.show();
    },
    cleanBankValue() {
      this.$refs.bindBankCard.cleanValue();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
$w: 100%;
$h: 100%;

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}

.security {
  width: $w;
  height: $h;

  .detail {
    width: 90%;
    padding: 0 5%;
    margin-top: px2rem(10px);

    .bank {
      margin-top: px2rem(2px);
      width: 0.94 * $w;
      padding: 0 0.03 * $w;
      height: px2rem(60px);
      line-height: px2rem(60px);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid $border_color;
      font-size: px2rem(16px);
    }
  }
}

.security.pc {
  width: $w;
  height: $h;

  .detail {
    margin-top: 10px;

    .bank {
      margin-top: 2px;
      width: 0.94 * $w;
      padding: 0 0.03 * $w;
      height: 60px;
      line-height: 60px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid $border_color;
      font-size: 16px;
      cursor: pointer;
    }
  }
}
</style>
