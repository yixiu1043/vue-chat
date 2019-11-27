<template>
  <div class="user">
    <header>
      <pc-head ref="pcHead"></pc-head>
    </header>
    <section class="pc">
      <div class="form">
        <div class="title">用户登录</div>
        <div class="inputs">
          <mt-field
            label="用户名"
            v-model="username"
            placeholder="请填写帐号"
            disableClear
          />
          <mt-field
            label="密码"
            v-model="password"
            class="mt-5px"
            type="password"
            placeholder="请填写密码"
            disableClear
            @keyup.native.enter="login"
          />
        </div>
        <div class="btns">
          <me-button class="submit-btn" @click.native="login"
            >立即登录
          </me-button>
          <div class="text">
            <span @click="$router.push('/register-pc')"
              >没有账号，点击注册！</span
            >
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
import logMixns from '@/mixins/login';
import PcHead from '../components/pc-head';

export default {
  mixins: [logMixns],
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
</style>
