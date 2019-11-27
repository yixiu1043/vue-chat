<template>
  <div :class="[{ pc: $root.isPC }, 'page404']">
    <div class="content404">
      <img class="img-404" src="../../assets/404.png" alt="" />
      <p class="tip-title">哎呀亲...你访问的页面出错了！</p>
      <p class="tip-subtitle">你输入的网址有误或者链接已经过期。</p>
      <div class="back-home">
        <span class="button" @click="goBack">返回大厅</span>
      </div>
    </div>
  </div>
</template>
<script>
import UserService from '@/service/user';

export default {
  methods: {
    goBack() {
      if (this.$root.isPC) {
        const { roomId, roomName } = UserService.doRedirect();
        this.$router.replace({
          name: 'chatroom-pc',
          query: {
            roomId,
            roomName,
          },
        });
      } else {
        this.$router.replace('/hall');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/color.scss";
@import "@/styles/compass.scss";
@import "./404.scss";
@import "./404-pc.scss";
</style>
