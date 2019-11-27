<template>
  <div class="recharge">
    <iframe :src="linkSrc" class="iframe" ref="iframe"></iframe>
  </div>
</template>
<script>
import { showToast, showLoading, hideLoading } from '@/service/helper';
import Req from '@/api/request';

export default {
  data() {
    return {
      linkSrc: '',
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.getRechargeUrl());
  },
  created() {
    this.getRechargeUrl();
  },
  methods: {
    getRechargeUrl() {
      showLoading('加载中,请稍候');
      Req.getDepositUrl()
        .then(({ status, result, error }) => {
          if (!status) {
            showToast(error);
          }
          this.linkSrc = result;
          hideLoading();
          this.$RefreshButton.hide();
        })
        .catch(() => {
          hideLoading();
          this.$nextTick(() => {
            this.$RefreshButton.show({ el: '.recharge' });
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.recharge {
  width: 100%;
  height: 100%;

  .iframe {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
