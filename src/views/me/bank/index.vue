<template>
  <div :class="[{ pc: $root.isPC }, 'bank']">
    <me-head title="银行卡管理" v-if="!$root.isPC" />
    <div class="card-con">
      <BankInfo :bankInfoItem="bankinof" v-on="$listeners" />
    </div>
  </div>
</template>
<script>
import MeHead from '@/components/head';
import { showToast } from '@/service/helper';
import BankInfo from '../components/bank-info/index';
import Req from '@/api/request';
import BindBankCard from '../bind-bank-card';

export default {
  name: 'bank',
  components: {
    MeHead,
    BankInfo,
    BindBankCard,
  },
  data() {
    return {
      bankinof: {},
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.getBankInfo();
    });
  },
  created() {
    this.getBankInfo();
  },
  methods: {
    getBankInfo() {
      Req.getUserBankInfo()
        .then(({ status, result, error }) => {
          if (!status) {
            showToast(error);
          }
          if (!this.$root.isPC && !result.card_no) {
            showToast('请绑定银行卡');
          }
          this.bankinof = { ...result };
          this.$RefreshButton.hide();
        })
        .catch(() => {
          showToast('网络异常，请刷新');
          this.$nextTick(() => {
            this.$RefreshButton.show({ el: '.content' });
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";

.bank {
  width: 100%;
  height: 100%;

  .card-con {
    @include prefixer-value(height, calc(100% - 2.5rem), webkit moz o ms);
    width: 100%;
  }
}

.bank.pc {
  width: 100%;
  height: 100%;

  .card-con {
    width: 100%;
    height: 150px;
  }
}
</style>
