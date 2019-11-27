<template>
  <div class="left-btn" @click="changeIcon">
    <font-awesome-icon :icon="doLiftIcon" />
  </div>
</template>
<script>
export default {
  props: {
    doLiftIcon: {
      type: String,
      required: true,
    },
  },
  methods: {
    changeIcon() {
      this.$emit('on-change-left');
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/color.scss";
@import "@/styles/compass.scss";
.left-btn {
  position: absolute;
  left: -10px;
  top: 300px;
  font-size: 15px;
  padding: 15px 10px 15px 15px;
  color: $gray;
  cursor: pointer;
}
</style>
