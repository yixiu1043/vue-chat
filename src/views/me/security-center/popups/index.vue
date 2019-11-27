<template>
  <div :class="[{ pc: $root.isPC }, 'popup-box']">
    <div @click="showPopup" class="detail">
      <p>{{ popupTitle }}</p>
      <p>
        <font-awesome-icon icon="angle-right" color="#8a8c8e" size="1x" />
      </p>
    </div>
    <me-popup ref="popup" :title="popupTitle" @on-confirm="getPassword">
      <div slot="content" class="content">
        <div class="input-box">
          <span>旧密码</span>
          <mt-field
            placeholder="请输入旧密码"
            type="password"
            v-model="oldPassword"
            :disableClear="isClear"
            ref="oldInput"
          ></mt-field>
        </div>
        <div class="input-box">
          <span>新密码</span>
          <mt-field
            placeholder="请输入新密码"
            type="password"
            v-model="newPassword"
            :disableClear="isClear"
            ref="pwdInput"
          ></mt-field>
        </div>
        <div class="input-box">
          <span>新密码</span>
          <mt-field
            placeholder="请再次输入新密码"
            type="password"
            v-model="newPassword1"
            :disableClear="isClear"
            ref="chatInput"
          ></mt-field>
        </div>
      </div>
    </me-popup>
  </div>
</template>
<script>
import MePopup from '@/components/popup';
import { showToast } from '@/service/helper';
import Req from '@/api/request';
import { listenKeyboard } from '@/lib/device';

export default {
  components: { MePopup },
  props: {
    popupTitle: {
      type: String,
      required: true,
      default: '',
    },
    id: {
      type: Number,
    },
  },
  data() {
    return {
      isClear: true,
      oldPassword: '',
      newPassword: '',
      newPassword1: '',
    };
  },
  mounted() {
    this.$nextTick(() => {
      const $oldInput = this.$refs.oldInput.$refs.input;
      const $pwdInput = this.$refs.pwdInput.$refs.input;
      const $input = this.$refs.chatInput.$refs.input;
      listenKeyboard($oldInput);
      listenKeyboard($pwdInput);
      listenKeyboard($input);
    });
  },
  methods: {
    getPassword() {
      const { oldPassword, newPassword, newPassword1 } = this;
      const flag = this.contrastPassword(oldPassword, newPassword, newPassword1);
      this.$refs.popup.hide();
      if (flag) {
        if (this.popupTitle === '修改登录密码' && this.id === 0) {
          this.updaLoginPassword(oldPassword, newPassword);
        }
        if (this.popupTitle === '修改资金密码' && this.id === 1) {
          this.updataMoneyPassword(oldPassword, newPassword);
        }
      } else {
        showToast('填写密码不正确');
        this.cleanValue();
      }
    },
    contrastPassword(oldPassword, newPassword, newPassword1) {
      if (oldPassword && newPassword && newPassword1 && newPassword === newPassword1) {
        return true;
      }
      return false;
    },
    showPopup() {
      this.$refs.popup.show();
      this.cleanValue();
    },
    updaLoginPassword(oldPassword, newPassword) {
      Req.updataUserPassword({ oldPassword, newPassword })
        .then(({ status, result, error }) => {
          if (status) {
            showToast(result);
            // this.$router.replace('/login');
          } else {
            showToast(error);
          }
          this.$RefreshButton.hide();
          this.cleanValue();
        })
        .catch(() => {
          showToast('网络异常，请刷新');
          this.$nextTick(() => {
            this.$RefreshButton.show({ el: '.money-content' });
          });
          this.cleanValue();
        });
    },
    updataMoneyPassword(oldPassword, newPassword) {
      Req.UpdateMoneyPassword({ oldPassword, newPassword })
        .then(({ status, result, error }) => {
          if (status) {
            showToast(result);
          } else {
            showToast(error);
          }
          this.$RefreshButton.hide();
          this.cleanValue();
        })
        .catch(() => {
          showToast('网络异常，请刷新');
          this.$nextTick(() => {
            this.$RefreshButton.show({ el: '.money-content' });
          });
          this.cleanValue();
        });
    },
    cleanValue() {
      this.oldPassword = '';
      this.newPassword = '';
      this.newPassword1 = '';
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
