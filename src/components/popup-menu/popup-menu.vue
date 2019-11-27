<template>
  <me-popup ref="chatPopup" title="聊天室">
    <div slot="content">
      <room-menu
        :room-list="roomList"
        @on-toggle-room="hide"
        v-on="$listeners"
      />
    </div>
    <div class="link" slot="footer">
      <div
        class="item footer"
        @click="goPage(item.name)"
        v-for="item in footerLinks"
        :key="item.title"
      >
        <font-awesome-icon :icon="item.icon" />
        <p class="text">{{ item.title }}</p>
      </div>
    </div>
  </me-popup>
</template>
<script>
import MePopup from '../popup';
import RoomMenu from '../room-menu';

export default {
  components: { MePopup, RoomMenu },
  props: {
    roomList: {
      type: Array,
      required: true,
      default: () => [],
    },
    footerLinks: {
      type: Array,
      default: () => [
        {
          name: 'hall', title: '大厅', icon: 'home',
        },
        {
          name: 'me', title: '个人中心', icon: 'user',
        },
        {
          name: 'load', title: '刷新', icon: 'redo-alt',
        },
      ],
    },
  },
  methods: {
    hide() {
      this.$refs.chatPopup.hide();
    },
    show() {
      this.$refs.chatPopup.show();
    },
    goPage(name) {
      this.hide();
      switch (name) {
        case 'load':
          this.refresh();
          break;
        default:
          this.$router.push({ name });
          break;
      }
    },
    refresh() {
      window.location.reload();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
@import "./popup-menu.scss";
</style>
