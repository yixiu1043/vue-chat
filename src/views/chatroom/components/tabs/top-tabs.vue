<template>
  <div class="top-tabs" :class="theme">
    <div class="user-avatar">
      <router-link to="/me">
        <img :src="imgStr || userInfo.avatar" />
      </router-link>
    </div>
    <div class="others">
      <div class="tab-item-wrapper">
        <span @click="onSelectChatroom">
          {{ chatroomTitle }}
        </span>
        <span class="icon">
          <font-awesome-icon icon="angle-down" />
        </span>
      </div>
      <div class="user-info">
        <span>
          <!-- <span>昵称:</span> -->
          <span class="text-ellipsis">{{
            chageNickName || userInfo.nick_name
          }}</span>
        </span>
        <span class="balance ml-5px">
          <span>余额:</span>
          <span class="special number">{{
            (userInfo.total_amount * 1).toFixed(2) || 0
          }}</span>
        </span>
        <span class="frozen ml-5px">
          <span>冻结金额:</span>
          <span class="special number">{{
            (userInfo.frozen_amount * 1).toFixed(2) || 0
          }}</span>
        </span>
        <span class="online ml-5px">
          在线:
          <span class="special number">{{
            userTotalNums + randomNumber || 0
          }}</span
          >人
        </span>
      </div>
    </div>
    <div class="top-menu" @click.stop="onShwoTab">
      <span>
        <font-awesome-icon icon="bars" />
      </span>
      <div class="menu-box">
        <transition name="menutop">
          <div class="top-select-menu" v-if="isShow">
            <span
              class="item"
              v-for="tab in tabs"
              :key="tab.name"
              @click="onChangeTab(tab.name)"
              >{{ tab.title }}</span
            >
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import UserService from '@/service/user';
import { toolkit } from '@/service/helper';

export default {
  props: {
    tabs: {
      type: Array,
      required: true,
      default: () => [],
    },
    theme: {
      type: String,
      default: 'light',
    },
    chatroomTitle: {
      type: String,
      default: 'light',
    },
  },
  data() {
    return {
      imgStr: '',
      chageNickName: '',
      randomNumber: '',
      timer: null,
      isShow: false,
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      userTotalNums: state => state.userTotalNums,
    }),
  },
  mounted() {
    this.$nextTick(() => {
      toolkit.on(this.$root.$el, 'click', this.hideTabMenu);
    });
  },
  beforeDestroy() {
    toolkit.on(this.$root.$el, 'click');
  },
  methods: {
    onChangeTab(tab) {
      this.$emit('on-change-tab', tab);
    },
    hideTabMenu() {
      this.isShow = false;
    },
    onShwoTab() {
      this.isShow = !this.isShow;
    },
    onSelectChatroom() {
      this.$emit('on-select-chatroom');
    },
    getPeopleNumber() {
      clearInterval(this.timer);
      this.randomNumber = UserService.getPeriod().num;
      this.timer = setInterval(() => {
        this.randomNumber = UserService.getPeriod().num;
      }, UserService.getPeriod().time * 1000);
    },
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
//方向在top
.menutop-enter-active,
.menutop-leave-active {
  transition: all 0.3s ease;
}

.menutop-enter,
.menutop-leave-to {
  transform: translate3d(0, -100%, 0);
  opacity: 0;
}

.top-tabs.light {
  .special {
    color: $yellow;
  }

  .tab-item-inner {
    background: $chatroom_tab_bg;
    box-shadow: 0 0 0 1px $gray;
  }
}

.top-tabs.dark {
  .user-info {
    color: $white;
  }

  .special {
    color: $yellow;
  }

  .tab-item-inner {
    /* background: $light_black; */
    box-shadow: 0 0 0 1px $light_black;
  }
}

.top-tabs {
  display: flex;
  height: px2rem(50px);
  padding: px2rem(8px) px2rem(4px) 0;
  font-size: px2rem(10px);
  justify-content: flex-start;
  align-items: center;
  background: $red;
  // box-shadow: 0px 0px 4px 0px $light_black;

  .user-avatar {
    width: px2rem(44px);
    height: px2rem(44px);
    background: url(../../../../assets/avatar/default.png) no-repeat;
    background-size: px2rem(44px) auto;
    border-radius: 50%;

    img {
      width: 100%;
      height: auto;
      border-radius: 50%;
      box-shadow: 0 0 0 1px #bec1ca;
    }
  }

  .others {
    margin-left: px2rem(8px);
    flex: 1;

    .tab-item-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: px2rem(14px);
    }

    .user-info {
      height: px2rem(20px);
      padding-top: px2rem(5px);
      line-height: px2rem(20px);

      span {
        display: inline-block;
        vertical-align: middle;
      }

      .text-ellipsis {
        max-width: px2rem(50px);
        min-width: px2rem(20px);
      }

      .balance,
      .frozen {
        .number {
          font-weight: bold;
        }
      }

      .online {
        .number {
          font-weight: bold;
        }
      }
    }
  }

  .top-menu {
    width: px2rem(44px);
    height: px2rem(44px);
    text-align: center;
    line-height: px2rem(44px);
    font-size: px2rem(16px);
    position: relative;

    .menu-box {
      position: absolute;
      top: px2rem(47px);
      right: 0;
      z-index: 2;
      overflow: hidden;

      .top-select-menu {
        width: px2rem(60px);
        padding: px2rem(5px);
        display: flex;
        flex-direction: column;
        background-color: $chatroom_tab_border;
        font-size: px2rem(10px);
        border-radius: px2rem(3px);

        .item {
          line-height: px2rem(18px);
          background-color: $border_color;
          border-radius: px2rem(5px);
          padding: px2rem(5px);
          border: px2rem(2px) solid $white;
          margin-top: px2rem(2px);
        }
      }
    }
  }
}
</style>
