<template>
  <mt-header :title="title" :style="style" class="user-select-one">
    <div slot="left" @click="goBack">
      <mt-button icon="back">{{ leftIconText }}</mt-button>
    </div>
    <div slot="right">
      <slot name="right"></slot>
    </div>
  </mt-header>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    leftIconText: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#E14844',
    },
    fixed: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    style() {
      return { backgroundColor: this.color };
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/compass.scss";
@import "../../styles/color.scss";

/deep/.mint-header {
  font-size: px2rem(14px);
  height: px2rem(40px);
  background-color: $theme;

  .mintui {
    font-size: px2rem(16px);
  }
}
</style>
