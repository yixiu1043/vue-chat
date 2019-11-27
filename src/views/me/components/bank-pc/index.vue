<template>
  <div>
    <me-popup ref="listPopup" width="350" title="银行卡管理" :footer="false">
      <div class="collection-modal" slot="content">
        <bank-page v-on="$listeners" ref="bank" />
        <!-- <me-button class="add-btn" @click.native="$refs.addPopup.show()"
          >添加银行卡</me-button
        > -->
      </div>
    </me-popup>
    <!-- <me-popup
      ref="addPopup"
      title="添加银行卡"
      :footer="false"
      @on-close="cleanBankValue"
    >
      <bind-bank-card slot="content" ref="bindBankCard" />
    </me-popup> -->
  </div>
</template>
<script>
import MePopup from '@/components/popup';
import MeButton from '@/components/button';
import BankPage from '../../bank';
import BindBankCard from '../../bind-bank-card';

export default {
  components: {
    MePopup,
    MeButton,
    BankPage,
    BindBankCard,
  },
  methods: {
    show() {
      this.$refs.listPopup.show();
      this.$refs.bank.getBankInfo();
    },
    hide() {
      this.$refs.listPopup.hide();
    },
    cleanBankValue() {
      this.$refs.bindBankCard.cleanValue();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/color.scss";
.add-btn {
  width: 80%;
  margin: auto;
  background-color: $red;
  height: 32px;
  color: $white;
  font-size: 14px;
  cursor: pointer;
}
</style>
