<template>
  <div :class="[{ pc: $root.isPC }, 'withdraw']">
    <me-head title="提现" />
    <div class="money-content">
      <BankInfo :bankInfoItem="bankinof" @click.native="setBank" />
      <div class="money-box" v-if="bankinof.card_no">
        <div class="money">
          <div class="input-box">
            <span>
              可提金额:
            </span>
            <mt-field type="number" v-model="defaultMoney" disabled></mt-field>
          </div>
          <div class="input-box">
            <span>
              提现金额:
            </span>
            <mt-field
              placeholder="请输入提现金额"
              type="number"
              v-model="money"
              ref="numberInput"
            ></mt-field>
          </div>
          <div class="input-box">
            <span>
              资金密码:
            </span>
            <mt-field
              placeholder="请输入资金密码"
              type="password"
              v-model="moneyPassword"
              ref="chatInput"
            ></mt-field>
          </div>
        </div>
        <div class="get-money-munber" @click="getMoney">
          <mt-button size="large">立即提现</mt-button>
        </div>
      </div>
    </div>
    <me-popup
      ref="popup"
      title="添加银行卡"
      :footer="isfooter"
      @on-close="cleanBankValue"
    >
      <bind-bank-card slot="content" ref="bindBankCard" />
    </me-popup>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import axios from 'axios';
import MeHead from '@/components/head';
import Marquee from '@/components/marquee/index';
import BankInfo from '../components/bank-info/index';
import { showToast } from '@/service/helper';
import Req from '@/api/request';
import BindBankCard from '../bind-bank-card';
import MePopup from '@/components/popup';
import { listenKeyboard } from '@/lib/device';

export default {
  name: 'withdraw',
  components: {
    MeHead,
    BankInfo,
    Marquee,
    BindBankCard,
    MePopup,
  },
  data() {
    return {
      money: '',
      moneyPassword: '',
      bankinof: {},
      source: null,
      defaultMoney: '',
      isfooter: false,
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
    }),
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.getBankInfo();
      vm.startSource();
      vm.cleanValue();
    });
  },
  created() {
    this.getBankInfo();
  },
  watch: {
    bankinof(newVal) {
      if (newVal && newVal.card_no) {
        this.$nextTick(() => {
          const $numberInput = this.$refs.numberInput.$refs.input;
          const $input = this.$refs.chatInput.$refs.input;
          listenKeyboard($numberInput);
          listenKeyboard($input);
        });
      }
    },
  },
  methods: {
    getBankInfo() {
      this.defaultMoney = this.userInfo.total_amount || 0;
      Req.getUserBankInfo()
        .then(({ status, result, error }) => {
          if (status) {
            this.bankinof = { ...result };
          } else {
            showToast(error);
          }
          if (!this.$root.isPC && !result.card_no) {
            showToast('请绑定银行卡');
          }
          this.$RefreshButton.hide();
        })
        .catch(() => {
          showToast('网络异常，请刷新');
          this.$nextTick(() => {
            this.$RefreshButton.show({ el: '.money-content' });
          });
        });
    },
    showBankToast() {
      if (!this.bankinof.card_no) {
        showToast('请绑定银行卡');
      }
    },
    setBank() {
      if (this.$root.isPC) {
        this.$refs.popup.show();
        return;
      }
      this.$router.push('/bind-bank-card');
    },
    getMoney() {
      const flag = this.judge();
      if (!flag) {
        showToast('内容不能为空');
      } else {
        this.cancelRequest();
        this.Withdrawal();
      }
    },
    Withdrawal() {
      const { money, moneyPassword } = this;
      Req.Withdrawal({ money, moneyPassword, cancelToken: this.cancelTokenCallback() })
        .then(({ status, result, error }) => {
          if (status) {
            showToast(result);
          } else {
            showToast(error);
          }
          this.$RefreshButton.hide();
          this.cleanValue();
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            showToast(error);
          } else {
            showToast('网络异常，请刷新');
            this.$nextTick(() => {
              this.$RefreshButton.show({ el: '.money-content' });
            });
            this.cleanValue();
          }
        });
    },
    judge() {
      const { money, moneyPassword } = this;
      if (!money || !moneyPassword) {
        return false;
      }
      return true;
    },
    startSource() {
      const { CancelToken } = axios;
      const source = CancelToken.source();
      this.source = source;
    },
    cancelRequest() {
      if (typeof this.source === 'function') {
        this.source('终止请求');
      }
    },
    cancelTokenCallback() {
      return new axios.CancelToken(((c) => {
        this.source = c;
      }));
    },
    cleanValue() {
      this.money = '';
      this.moneyPassword = '';
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
@import "./index.scss";
@import "./index-pc.scss";
</style>
