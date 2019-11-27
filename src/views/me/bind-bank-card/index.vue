<template>
  <div ref="bankCard" :class="['bank-card', { pc: $root.isPC }]">
    <header>
      <me-head title="添加银行卡" v-if="!$root.isPC" />
    </header>
    <main class="main">
      <div class="content">
        <div class="input-box">
          <span>卡主姓名</span>
          <mt-field
            placeholder="请输入姓名"
            v-model="uaername"
            :disableClear="isClear"
            ref="chatInput"
          ></mt-field>
        </div>
        <div class="input-box select-content">
          <span>开户银行</span>
          <mt-field
            placeholder="请选择开户银行"
            v-model="bankName"
            :readonly="true"
            :disableClear="isClear"
            @click.native.capture="pickerVisible = true"
          >
            <font-awesome-icon icon="caret-down" class="move-animation" />
          </mt-field>
          <my-select
            :bankList="bankList"
            :isBank="pickerVisible"
            v-if="$root.isPC"
            @on-set-bank="setBank"
            @on-hide="pickerVisible = false"
          />
        </div>
        <div class="input-box">
          <span>银行卡号</span>
          <mt-field
            placeholder="请输入银行卡卡号"
            type="number"
            v-model="bankId"
            :disableClear="isClear"
            ref="numberInput"
          ></mt-field>
        </div>
        <div class="input-box">
          <span>资金密码</span>
          <mt-field
            placeholder="请输入资金密码"
            type="password"
            v-model="moneyPassword"
            :disableClear="isClear"
            ref="pwdInput"
          ></mt-field>
        </div>
        <div class="input-btn mt-5px" @click="getBankInfo">
          <mt-button size="large">确定</mt-button>
        </div>
      </div>
      <footer>
        <p>
          1.请认真核对您的银行卡信息，一经提交审核会员无法自行修改，如需修改请联系客服！
        </p>
        <p>2.为了您的账户安全，请认真设置您的账户资金密码！</p>
      </footer>
    </main>
    <div v-if="!$root.isPC">
      <mt-popup v-model="pickerVisible" class="picker" position="bottom">
        <mt-picker :slots="bankPickerSlots" @change="onBankChange"></mt-picker>
      </mt-popup>
    </div>
  </div>
</template>
<script>
import MeHead from '@/components/head';
import { showToast, showLoading, hideLoading } from '@/service/helper';
import { touchController, listenKeyboard } from '@/lib/device';
import MySelect from '../../../components/my-select/index';

import Req from '@/api/request';

export default {
  name: 'bind-bank-card',
  components: {
    MeHead,
    MySelect,
  },
  data() {
    return {
      isShow: false,
      isClear: true,
      pickerVisible: false,
      uaername: '',
      bankName: '',
      bankId: '',
      moneyPassword: '',
      bankList: [],
      bankPickerSlots: [
        {
          flex: 1,
          values: [],
          textAlign: 'center',
        },
      ],
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.cleanValue();
      vm.getBankName();
    });
  },
  created() {
    this.getBankName();
  },
  watch: {
    pickerVisible(bool) {
      touchController(bool, this.$refs.bankCard);
    },
  },
  mounted() {
    this.$nextTick(() => {
      const $numberInput = this.$refs.numberInput.$refs.input;
      const $pwdInput = this.$refs.pwdInput.$refs.input;
      listenKeyboard($numberInput);
      listenKeyboard($pwdInput);
    });
  },
  methods: {
    onBankChange(picke, value) {
      this.bankName = value.join('');
    },
    getBankInfo() {
      const {
        uaername, bankName, bankId, moneyPassword,
      } = this;
      const falg = this.contrastPassword(uaername, bankName, bankId, moneyPassword);
      if (falg) {
        this.addBank(uaername, bankName, bankId, moneyPassword);
      } else {
        showToast('填入信息不正确');
      }
    },
    contrastPassword(uaername, bankName, bankId, moneyPassword) {
      if (uaername && bankName && bankId && moneyPassword) {
        return true;
      }
      return false;
    },
    addBank(uaername, bankName, bankId, moneyPassword) {
      showLoading();
      Req.BindBankCard({
        uaername, bankName, bankId, moneyPassword,
      })
        .then(({ status, result, error }) => {
          hideLoading();
          if (status) {
            showToast(result);
          } else {
            showToast(error);
          }
          this.cleanValue();
          this.$RefreshButton.hide();
        })
        .catch(() => {
          hideLoading();
          this.cleanValue();
          showToast('网络异常，请刷新');
          this.$nextTick(() => {
            this.$RefreshButton.show({ el: '.main' });
          });
        });
    },
    getBankName() {
      Req.getSupportBanks()
        .then(({ status, result, error }) => {
          if (status) {
            this.bankList = [...result];
            this.bankPickerSlots[0].values = [...result];
            const bank = this.bankList[0];
            this.bankName = bank;
          } else {
            showToast(error);
          }
          this.$RefreshButton.hide();
        })
        .catch(() => {
          showToast('网络异常，请刷新');
          this.$nextTick(() => {
            this.$RefreshButton.show({ el: '.main' });
          });
        });
    },
    setBank(data) {
      this.bankName = data;
      this.pickerVisible = false;
    },
    cleanValue() {
      this.uaername = '';
      this.bankId = '';
      this.moneyPassword = '';
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
