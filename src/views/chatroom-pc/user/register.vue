<template>
  <div class="user">
    <header>
      <pc-head ref="pcHead"></pc-head>
    </header>
    <section class="pc">
      <div class="form">
        <div class="title">用户注册</div>
        <div class="inputs">
          <mt-field
            label="用户名"
            v-model="username.value"
            :state="username.state"
            :attr="{ maxlength: 20 }"
            placeholder="请填写帐号"
            disableClear
          />
          <mt-field
            label="密码"
            v-model="password.value"
            :state="password.state"
            type="password"
            :attr="{ maxlength: 20 }"
            placeholder="请输入密码"
            disableClear
          />
          <mt-field
            label="确认密码"
            v-model="password_confirm.value"
            :state="password_confirm.state"
            type="password"
            :attr="{ maxlength: 20 }"
            placeholder="请重新输入密码"
            disableClear
          />
          <mt-field
            label="手机号码"
            v-model="mobile.value"
            :state="mobile.state"
            :attr="{ maxlength: 11 }"
            type="tel"
            placeholder="请填入常用手机号码"
            disableClear
          />
          <mt-field
            v-if="input_require.need_phone"
            label="短信验证码"
            style="flex:2;"
            v-model="sms_code.value"
            :state="sms_code.state"
            placeholder="短信验证码"
          >
            <mt-button
              @click="sendSmsCode()"
              :disabled="!allowSendSmsCode"
              style="flex:1;"
              class="submit-btn sms_send_btn"
            >
              {{ codeBtnText }}
            </mt-button>
          </mt-field>
          <mt-field
            label="邀请码"
            v-model="userup_number.value"
            :state="userup_number.state"
            class="userup_number"
            placeholder="邀请码"
            disableClear
            @keyup.native.enter="register"
          />
        </div>
        <div class="btns">
          <me-button class="submit-btn" @click.native="register"
            >立即注册
          </me-button>
          <div class="text">
            <span @click="$router.push('/login-pc')">已有账号，点击登录！</span>
          </div>
        </div>
      </div>
    </section>
    <footer>
      <p>Copyright © 凤凰国际 版权所有 2008-2020</p>
    </footer>
  </div>
</template>
<script>
import regMixins from '@/mixins/register';
import PcHead from '../components/pc-head';

export default {
  mixins: [regMixins],
  components: {
    PcHead,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/color.scss";
@import "./user.scss";

.sms_send_btn {
  flex: 1 1 0%;
  margin: 0 0 0 1rem;
  background-color: transparent;
  font-size: 14px;
  border: 1px solid #c0c0c0 !important;
  min-width: 48px;
}

.sms {
  margin-top: 0.3rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
