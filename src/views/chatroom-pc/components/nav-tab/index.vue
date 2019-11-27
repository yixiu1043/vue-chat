<template>
  <ul class="nav-tab" :style="style">
    <li
      v-for="(item, index) in list"
      :key="item.title"
      :class="activeClass === index ? 'active' : ''"
      @click="navContent(index, item.tab)"
    >
      <font-awesome-icon :icon="item.icon" class="icon" />
      <span>{{ item.title }}</span>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
    },
    navType: {
      type: String,
    },
  },
  computed: {
    style() {
      if (this.navType === 'left') {
        return { justifyContent: 'space-around' };
      }
      return { justifyContent: 'flex-start' };
    },
  },
  data() {
    return {
      activeClass: 0,
    };
  },
  methods: {
    navContent(index, tab) {
      this.activeClass = index;
      this.$emit('on-change-tab', tab);
    },
  },

};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";

.nav-tab {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 46px;
  font-size: 14px;
  line-height: 42px;
  display: flex;
  flex-direction: row;
  color: $black;
  @include prefixer-value(user-select, none, webkit moz o ms);

  li {
    cursor: pointer;
    padding: 0 10px;
    margin-left: 10px;
    position: relative;
    overflow: hidden;
    height: 100%;
  }
  li:hover {
    color: $red;
  }

  .active {
    color: $red;
  }
  .active::before {
    content: "";
    position: absolute;
    top: calc(100% - 4px);
    left: 0;
    z-index: 1;
    width: 100%;
    height: 2px;
    border-bottom: 2px solid $red;
    animation: leftMove 1s;
  }
}
@keyframes leftMove {
  to {
    transform: translateX(0);
  }
  from {
    transform: translateX(-100%);
  }
}
</style>
