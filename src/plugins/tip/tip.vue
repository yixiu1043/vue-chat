<template>
  <div v-show="show" class="my-tip" :style="style" :class="className">
    {{ text }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      text: '',
      type: '',
      width: '',
      className: '',
    };
  },
  computed: {
    style() {
      return {
        bottom: this.type === 'bottom' ? 0 : 'unset',
        top: this.type === 'top' ? 0 : 'unset',
        width: this.width,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/color.scss";
@import "../../styles/compass.scss";
@import "../../styles/animate.scss";

.my-tip {
  position: fixed;
  background-color: $black;
  color: $white;
  height: px2rem(40px);
  line-height: px2rem(40px);
  text-align: center;
  z-index: 100;
  opacity: 0.85;
}
</style>
