<template>
  <div
    :class="[{ pc: $root.isPC }, 'msg-wrapper']"
    v-if="Object.keys(data).length"
  >
    <div class="user-avatar user-select-one">
      <img
        :src="data.avatar"
        class="img"
        ondragstart="return false"
        @click="clickAvatar(data.sentUser, data.sentUserId)"
        :style="imgStyle"
      />
    </div>
    <div class="msg-content">
      <div class="time user-select-one">
        <span>{{ $day(data.sentTime * 1).format("HH:mm:ss") }}</span>
        <span>{{ data.sentUser }}</span>
      </div>
      <div class="text font-12px" :style="{ backgroundColor: color }">
        <p class="triangle" :style="{ borderRightColor: color }"></p>
        <!--下注訊息-->
        <bet-msg
          v-if="isUserBet"
          :lottery-data="lotteryData"
          :msg="data.msg"
          key="兼容pc端聊天记录"
          @on-follow-bet="onFollowBet"
        />
        <!--系統訊息-->
        <p v-else :style="style">
          {{ data.msg }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BetMsg from './bet-msg';

export default {
  components: { BetMsg },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    color: {
      type: String,
      default: '#ffb',
    },
    lotteryData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
    }),
    isUserBet() {
      const { msgType } = this.data;
      if (msgType === 'user_bet') {
        return true;
      }
      return false;
    },
    style() {
      const { msg } = this.data;
      if (msg.length >= 16) {
        return { whiteSpace: 'pre-line' };
      }
      return '';
    },
    imgStyle() {
      if (this.$root.isPC && this.userInfo.isAdmin) {
        return { cursor: 'pointer' };
      }
      return {};
    },
  },
  filters: {
    getPlanDate(str) {
      // 取奖期（取奖期后三位）
      if (typeof str === 'string') {
        return str.substring(str.length - 3, str.length);
      }
      return null;
    },
    sliceArray(arr) {
      // 去掉第一个数据
      if (arr instanceof Array) {
        return arr.slice(1, arr.length);
      }
      return null;
    },
  },
  methods: {
    clickMessage(message) {
      this.$emit('on-click-message', message);
    },
    clickAvatar(sentUser, sentUserId) {
      this.$emit('on-click-avatar', sentUser, sentUserId);
    },
    onFollowBet(data) {
      this.$emit('on-follow-bet', data);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./msg.scss";
@import "./msg-pc.scss";

.msg-wrapper {
  justify-content: flex-start;
  margin-bottom: 15px;

  .msg-content {
    align-items: flex-start;
    padding-left: px2rem(8px);

    .text {
      box-shadow: px2rem(1px) px2rem(1px) px2rem(3px) $chatroom_msg_boxshadow;

      .triangle {
        left: px2rem(-10px);
      }
    }
  }
}

.msg-wrapper.pc {
  justify-content: flex-start;
  padding-bottom: 20px;
  .msg-content {
    align-items: flex-start;
    padding-left: 8px;

    .text {
      box-shadow: 1px 1px 3px $chatroom_msg_boxshadow;

      .triangle {
        left: -10px;
      }
    }
  }
}
</style>
