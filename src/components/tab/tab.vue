<template>
  <div class="tab">
    <div
      class="tab-item"
      :class="{ active: $route.path === tab.path }"
      v-for="tab in tabs"
      :key="tab.name"
      @click="tab.click"
    >
      <div class="tab-inner">
        <font-awesome-icon :icon="tab.icon" />
        <span>{{ tab.title }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tabs: {
      type: Array,
      required: true,
      defalut: () => [],
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/compass.scss";
@import "../../styles/color.scss";

.tab {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  display: flex;
  padding: px2rem(4.5px) 0;
  font-size: px2rem(14px);
  background: $page_tab_bg;
  background: -moz-linear-gradient(top, #744c90, rgba(34, 17, 87, 1));
  background:
    -webkit-gradient(
      linear,
      0 0,
      0 bottom,
      from(#744c90),
      to(rgba(34, 17, 87, 1))
    );
  background: -o-linear-gradient(top, #744c90, rgba(34, 17, 87, 1));
  border-top: 1px solid $page_tab_border;
  justify-content: center;
  align-items: center;

  .tab-item {
    height: 100%;
    color: $page_tab_inactive;
    flex: 1;

    .tab-inner {
      display: flex;
      height: px2rem(40px);
      flex-direction: column;
      justify-content: center;
      align-items: center;

      span {
        margin-top: px2rem(8px);
      }
    }
  }

  .tab-item.active {
    color: $page_tab_active;
  }
}
</style>
