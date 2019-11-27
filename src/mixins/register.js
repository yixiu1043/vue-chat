import { listenKeyboard } from '@/lib/device';
import Scroll from '@/components/scroll';
import UserService from '@/service/user';
import { showToast } from '@/service/helper';
import BackgroundAnimation from '@/components/backgroundAnimation';
import MeButton from '@/components/button';
import { appConfig } from '@/config';

export default {
  name: 'register',
  components: {
    Scroll,
    BackgroundAnimation,
    MeButton,
  },
  data() {
    return {
      username: {
        value: '',
        state: '',
      },
      password: {
        value: '',
        state: '',
      },
      password_confirm: {
        value: '',
        state: '',
      },
      mobile: {
        value: '',
        state: '',
      },
      sms_code: {
        value: '',
        state: '',
      },
      userup_number: {
        value: '',
        state: '',
      },
      input_require: {
        need_email: false,
        need_phone: false,
        need_weixin: false,
      },
      smsCodeCountDown: 60,
      allowSendSmsCode: true,
    };
  },
  computed: {
    codeBtnText() {
      return this.allowSendSmsCode ? '获取验证码' : `${this.smsCodeCountDown}秒后重发`;
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.resetForm());
  },
  mounted() {
    this.$nextTick(() => {
      const $inputs = document.querySelectorAll('.register input');
      for (let index = 0; index < $inputs.length; index++) {
        const element = $inputs[index];
        listenKeyboard(element);
      }
    });
  },
  methods: {
    getContactConfig() {
      UserService.getContactConfig()
        .then((data) => {
          this.input_require.need_email = data.need_email;
          this.input_require.need_phone = data.need_phone;
          this.input_require.need_weixin = data.need_weixin;
        })
        .catch(() => {
          setTimeout(() => {
            this.getContactConfig();
          }, 3000);
        });
    },
    resetForm() {
      this.getContactConfig();
      const keys = ['username', 'password', 'password_confirm', 'mobile', 'userup_number', 'sms_code'];
      for (let i = 0; i < keys.length; i++) {
        this[keys[i]].value = '';
        this[keys[i]].state = '';
      }
    },
    redirect(path) {
      this.$router.push(path);
    },
    sendSmsCode() {
      if (/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(this.mobile.value)) {
        this.mobile.state = 'success';
      } else {
        this.mobile.state = 'error';
        showToast('手机号码不正确');
        return;
      }

      UserService.sendMobileCode(this.mobile.value)
        .then((result) => {
          if (!result) {
            this.mobile.state = 'error';
            return;
          }
          this.allowSendSmsCode = false;
          this.smsCodeCountDown = 60;
          this.timer = setInterval(() => {
            this.smsCodeCountDown--;
            if (this.smsCodeCountDown <= 0) {
              this.allowSendSmsCode = true;
              clearInterval(this.timer);
            }
          }, 1000);
        });
    },
    validation() {
      try {
        if (/^[a-zA-Z0-9]{4,10}$/.test(this.username.value)) {
          this.username.state = 'success';
        } else {
          this.username.state = 'error';
          throw new Error('用户名為4-20个英文字母或数字');
        }

        if (/^[a-zA-Z0-9]{6,10}$/.test(this.password.value)) {
          this.password.state = 'success';
        } else {
          this.password.state = 'error';
          throw new Error('密码為6-20个英文字母或数字');
        }

        if (this.password_confirm.value === this.password.value) {
          this.password_confirm.state = 'success';
        } else {
          this.password_confirm.state = 'error';
          throw new Error('确认密码错误');
        }

        if (/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(this.mobile.value)) {
          this.mobile.state = 'success';
        } else {
          this.mobile.state = 'error';
          throw new Error('手机号码不正确');
        }

        if (this.input_require.need_phone && this.sms_code.value === '') {
          this.sms_code.state = 'error';
          throw new Error('验证码不能为空');
        } else {
          this.sms_code.state = 'success';
        }
        return true;
      } catch (e) {
        showToast(e.message);
        return false;
      }
    },
    register() {
      if (!this.validation()) {
        return;
      }

      UserService.register({
        user_id: this.username.value,
        password: this.password.value,
        mobile: this.mobile.value,
        userup_number: this.userup_number.value,
        mobile_code: this.sms_code.value,
      })
        .then((res) => {
          if (res) {
            // 自動登入後進行跳轉....
            UserService.login(this.username.value, this.password.value)
              .then((result) => {
                if (result) {
                  if (this.$root.isPC) {
                    const { roomId, roomName } = UserService.doRedirect();
                    this.$router.push({
                      name: 'chatroom-pc',
                      query: {
                        roomId,
                        roomName,
                      },
                    });
                  } else {
                    this.$router.push('/userinfo');
                  }
                }
              });
          }
        });
    },
  },
};
