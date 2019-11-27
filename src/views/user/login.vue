<template>
  <transition name="slide">
    <div class="login white-font">
      <scroll class="scroll">
        <div class="info-box">
          <header>
            <font-awesome-icon icon="user" size="3x" />
            <span class="text">用户登录</span>
          </header>
          <section>
            <div class="inputs">
              <mt-field
                v-model="username"
                placeholder="请填写帐号"
                disableClear
              />
              <mt-field
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
              <div class="text font-12px" @click="showToast">
                忘记密码?
              </div>
              <me-button
                class="back-btn"
                @click.native="$router.push('/register')"
                >注册账户
              </me-button>
            </div>
          </section>
        </div>
      </scroll>
      <background-animation
        bgColor="255,165,0"
        formRadian="20px"
        bgOpacity="0.2"
      />
    </div>
  </transition>
</template>

<script>
import BackgroundAnimation from '@/components/backgroundAnimation';
import Scroll from '@/components/scroll';
import logMixns from '@/mixins/login';
import { showToast } from '@/service/helper';

export default {
  name: 'login',
  mixins: [logMixns],
  components: {
    Scroll,
    BackgroundAnimation,
  },
  methods: {
    showToast() {
      showToast('请联系在线客服人员取回！');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./user.scss";

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(-100%, 0, 0);
}
</style>
