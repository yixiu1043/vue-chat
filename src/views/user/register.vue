<template>
  <transition name="slide">
    <div class="register white-font">
      <Scroll class="scroll">
        <div class="info-box">
          <header>
            <font-awesome-icon icon="user-plus" size="3x" />
            <span class="text">用户注册</span>
          </header>
          <section>
            <div class="inputs">
              <mt-field
                v-model="username.value"
                :state="username.state"
                :attr="{ maxlength: 20 }"
                placeholder="请填写帐号"
                disableClear
              />
              <div class="pwd">
                <div class="hint" v-show="isTooltip === 1">
                  请输入6-20个英文字母或数字
                </div>
                <mt-field
                  v-model="password.value"
                  :state="password.state"
                  type="password"
                  :attr="{ maxlength: 20 }"
                  class="mt-5px"
                  placeholder="请输入密码"
                  disableClear
                  @focus.native.capture="isTooltip = 1"
                  @blur.native.capture="isTooltip = -1"
                />
              </div>
              <div class="pwd">
                <div class="hint" v-show="isTooltip === 2">
                  请输入6-20个英文字母或数字
                </div>
                <mt-field
                  v-model="password_confirm.value"
                  :state="password_confirm.state"
                  type="password"
                  :attr="{ maxlength: 20 }"
                  class="mt-5px"
                  placeholder="请重新输入密码"
                  disableClear
                  @focus.native.capture="isTooltip = 2"
                  @blur.native.capture="isTooltip = -2"
                />
              </div>
              <mt-field
                v-model="mobile.value"
                :state="mobile.state"
                :attr="{ maxlength: 11 }"
                type="tel"
                class="mt-5px"
                placeholder="请填入常用手机号码"
                disableClear
              />
              <div class="sms" v-if="input_require.need_phone">
                <mt-field
                  style="flex:2;"
                  v-model="sms_code.value"
                  :state="sms_code.state"
                  placeholder="短信验证码"
                />
                <mt-button
                  @click="sendSmsCode()"
                  :disabled="!allowSendSmsCode"
                  style="flex:1;"
                  class="submit-btn sms_send_btn"
                >
                  {{ codeBtnText }}
                </mt-button>
              </div>
              <mt-field
                v-model="userup_number.value"
                :state="userup_number.state"
                class="userup_number mt-5px"
                placeholder="邀请码(选填)"
                disableClear
                @keyup.native.enter="register"
              />
            </div>
            <div class="btns">
              <me-button class="submit-btn" @click.native="register"
                >立即注册
              </me-button>
              <div class="text font-12px"></div>
              <me-button class="back-btn" @click.native="redirect('/login')">
                返回登录
              </me-button>
            </div>
          </section>
        </div>
      </Scroll>
      <BackgroundAnimation
        bgColor="255,165,0"
        formRadian="20px"
        bgOpacity="0.2"
      />
    </div>
  </transition>
</template>

<script>
import regMixins from '@/mixins/register';
import Scroll from '@/components/scroll';
import BackgroundAnimation from '@/components/backgroundAnimation/index';
import MeButton from '@/components/button';

export default {
  name: 'register',
  mixins: [regMixins],
  components: {
    Scroll,
    BackgroundAnimation,
    MeButton,
  },
  data() {
    return {
      isTooltip: false,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "./user.scss";
@import "./user-pc.scss";

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}

.sms_send_btn {
  flex: 1 1 0%;
  margin: 0 0 0 1rem;
  background-color: transparent;
  color: white;
  font-size: 14px;
  border: 1px solid white !important;
  min-width: 48px;
}

.sms {
  margin-top: 0.3rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pwd {
  width: 100%;
  position: relative;

  .hint {
    padding: px2rem(2px) px2rem(4px);
    line-height: px2rem(10px);
    text-align: center;
    position: absolute;
    left: 0;
    top: px2rem(-14px);
    background-color: black;
    border-radius: px2rem(2px);
    font-size: px2rem(8px);
  }

  .hint::before {
    content: "";
    position: absolute;
    left: 50%;
    bottom: px2rem(-8px);
    border-width: px2rem(4px);
    border-color: black transparent transparent transparent;
    border-style: solid;
    z-index: 10;
  }
}
</style>
