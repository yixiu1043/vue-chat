<template functional>
  <div>
    <template v-for="item in chatList">
      <user-msg
        :key="item.messageId"
        :data="item"
        v-on="$listeners"
        v-if="userMsgType.includes(item.msgType)"
        :color="color[item.msgType]"
      />
      <sys-msg
        :key="item.messageId"
        :data="item"
        v-if="sysMsgType.includes(item.msgType)"
        :color="color[item.msgType]"
        v-on="$listeners"
        v-bind="$attrs"
        :lottery-data="lotteryData"
      />
    </template>
  </div>
</template>
<script>
import UserMsg from './components/user-msg';
import SysMsg from './components/sys-msg';

export default {
  components: {
    UserMsg,
    SysMsg,
  },
  props: {
    chatList: {
      type: Array,
      required: true,
      default: () => [],
    },
    userMsgType: {
      type: Array,
      required: true,
      default: () => [],
    },
    sysMsgType: {
      type: Array,
      required: true,
      default: () => [],
    },
    color: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    lotteryData: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
