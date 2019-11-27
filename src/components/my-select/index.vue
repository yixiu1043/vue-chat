<template>
  <div v-if="isBank" class="sele">
    <ul>
      <li v-for="item in bankList" :key="item" @click="setBank(item)">
        {{ item }}
      </li>
    </ul>
    <div class="shadow" @click="hide"></div>
  </div>
</template>
<script>
export default {
  props: {
    bankList: {
      type: Array,
      required: true,
    },
    isBank: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    setBank(data) {
      this.$emit('on-set-bank', data);
    },
    hide() {
      this.$emit('on-hide');
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/color.scss";
.sele {
  width: 74%;
  height: 200px;
  position: absolute;
  top: 50px;
  right: 0;
  color: black;
  z-index: 3;
  overflow: auto;
  text-align: left;
  text-indent: 20px;
  font-size: 14px;
  background-color: white;
  ul {
    width: 100%;
    height: 200px;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 3;
    li {
      width: 100%;
      height: 40px;
      box-sizing: border-box;
      line-height: 40px;
      border: 1px solid $border_color;
      min-width: 90%;
    }
  }
}
.shadow {
  width: 100%;
  height: 100%;
  background-color: transparent;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
}
</style>
