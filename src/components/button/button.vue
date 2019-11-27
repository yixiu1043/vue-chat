<template>
  <div class="btn-box" @click="changeAnimate" :class="animateName">
    <slot></slot>
  </div>
</template>
<script>
export default {
  data() {
    return {
      animateName: '',
      timer: null,
    };
  },
  methods: {
    changeAnimate() {
      this.animateName = 'fadeOut';
      this.timer = setTimeout(() => {
        this.animateName = '';
        clearTimeout(this.timer);
      }, 100);
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/animate.scss";

.btn-box {
  width: 100%;
  font-size: px2rem(14px);
  border-radius: px2rem(4px);
  text-align: center;
  border: unset;
  outline: unset;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: px2rem(41px);
  height: px2rem(41px);
}
</style>
