<template>
  <Scroll class="scroll">
    <div class="me">
      <div class="header">
        <header class="header-box">
          <div
            class="user-info font-12px white-font"
            @click="doPage('userinfo')"
          >
            <div class="avatar">
              <img :src="imgStr ? imgStr : userInfo.avatar" />
            </div>
            <div class="account">
              <div>
                昵称：{{ chageNickName ? chageNickName : userInfo.nick_name }}
              </div>
              <div>ID: {{ userInfo.user_id }}</div>
            </div>
          </div>
          <div class="user-balance font-12px yellow-font">
            <div class="item">
              <span>￥:{{ userInfo.total_amount || 0 }}</span>
              <span>余额</span>
            </div>
            <div class="item">
              <span>￥:{{ userInfo.frozen_amount || 0 }}</span>
              <span>冻结金额</span>
            </div>
          </div>
        </header>
      </div>
      <div class="entry">
        <div
          class="entry-item"
          v-for="entry in entryList"
          :key="entry.name"
          @click="doWhat(entry.name, entry.path)"
        >
          <font-awesome-icon
            :icon="entry.icon"
            :color="entry.color"
            size="3x"
          />
          <span class="font-12px">{{ entry.title }}</span>
        </div>
      </div>
    </div>

    <Popup
      color="#fffffb"
      width="200"
      height="200"
      ref="popup"
      :title="popupTitle"
    >
      <div class="content" slot="content">客服微信</div>
    </Popup>
  </Scroll>
</template>

<script>
import { mapState } from 'vuex';
import Popup from '@/components/popup';
import UserService from '@/service/user';
import ChatService from '@/service/chat';
import Scroll from '@/components/scroll';

export default {
  name: 'me',
  components: { Scroll, Popup },
  data() {
    return {
      entryList: [
        {
          name: 'money-record',
          title: '资金明细',
          path: '/money-record',
          icon: 'file-invoice-dollar',
          color: '#efc944',
        },
        {
          name: 'withdraw',
          title: '提现',
          path: '/withdraw',
          icon: 'hand-holding-usd',
          color: '#6eceee',
        },
        {
          name: 'recharge',
          title: '充值',
          path: '/recharge',
          icon: 'coins',
          color: '#f89f69',
        },
        {
          name: 'bet-history',
          title: '投注记录',
          path: '/bet-history',
          icon: 'list-ol',
          color: '#98ca69',
        },
        {
          name: 'discounts',
          title: '优惠活动',
          path: '/discounts',
          icon: 'ad',
          color: '#ad58e9',
        },
        {
          name: 'security-center',
          title: '安全中心',
          path: '/security-center',
          icon: 'unlock',
          color: '#f15b6c',
        },
        {
          name: 'profit-report',
          title: '盈亏报表',
          path: '/profit-report',
          icon: 'chart-line',
          color: '#efc944',
        },
        {
          name: 'notice',
          title: '系统公告',
          path: '/notice',
          icon: 'bullhorn',
          color: '#f3715c',
        },
        // {
        //   name: 'help',
        //   title: '帮助中心',
        //   path: '/help',
        //   icon: 'question',
        //   color: '#50b7c1',
        // },
        {
          name: 'signOut',
          title: '退出系统',
          path: '/signOut',
          icon: 'sign-out-alt',
          color: '#f06e57',
        },
      ],
      popupTitle: '',
      headerAnimationClass: '',
      rechargeUrlData: '',
      chageNickName: '',
      imgStr: '',
      positionX: 0,
      positionY: 0,
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
    }),
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.updateUserInfo());
  },
  methods: {
    updateUserInfo() {
      UserService.updateUserInfo().then(() => {
        const { nick_name, avatar } = this.userInfo;
        this.chageNickName = nick_name;
        this.imgStr = avatar;
      });
    },
    logout() {
      UserService.logout(() => {
        if (!this.$root.isPC) {
          this.$tip('登出成功!');
        }
        this.doPage('login');
        ChatService.disconnect();
      });
    },
    doWhat(name) {
      switch (name) {
        case 'signOut':
          this.logout();
          break;
        default:
          this.doPage(name);
          break;
      }
    },
    doPage(name) {
      this.$router.push(`/${name}`);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
@import "./me.scss";
</style>
