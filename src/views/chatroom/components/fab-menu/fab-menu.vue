<template>
  <div
    class="left-tabs"
    id="fab-menu"
    @touchstart="down($event)"
    @touchend="up($event)"
    @touchmove.capture="move($event)"
  >
    <vue-fab
      icon="菜单"
      activeIcon="关闭"
      mainBtnColor="#f3704b"
      :direction="top > screenHeight / 2 ? 'up' : 'down'"
      ref="vueFab"
    >
      <fab-item
        v-for="(value, index) in tabs"
        :idx="index"
        :key="index"
        :icon="value.title"
        :color="value.color"
        @click.native="onChangeTab(value.name)"
        @clickItem="onChangeTab(value.name)"
      />
    </vue-fab>
  </div>
</template>

<script>

export default {
  props: {
    tabs: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      top: document.documentElement.clientHeight,
      screenHeight: document.documentElement.clientHeight,
      isDarkBtn: true,
      tabName: '',
      isMove: false,
    };
  },
  methods: {
    onChangeTab(tab) {
      this.tabName = tab;
      this.$emit('on-change-tab', tab);
    },
    changeTheme(tab) {
      this.isDarkBtn = !this.isDarkBtn;
      this.$emit('on-change-tab', tab);
    },
    up() {
      if (this.isMove) {
        this.isMove = false;
      } else {
        this.$refs.vueFab.openMenu();
      }
    },
    down(e) {
      e.preventDefault();
      const moveDiv = document.querySelector('#fab-menu');
      this.positionY = e.touches[0].clientY;
      this.offsetY = moveDiv.offsetTop;
    },
    move(e) {
      e.preventDefault();
      const moveDiv = document.querySelector('#fab-menu');
      this.changeY = e.touches[0].clientY - this.positionY;
      this.top = this.changeY + this.offsetY;
      const screenHeight = document.documentElement.clientHeight - 100;

      if (this.top <= 50) {
        this.top = 50;
      }
      if (this.top >= screenHeight) {
        this.top = screenHeight;
      }
      if (Math.abs(this.changeY) > 5) {
        moveDiv.style.top = `${this.top}px`;
        this.isMove = true;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.left-tabs {
  z-index: 190;
  position: fixed;
  right: 15%;
  bottom: 45%;
}
</style>
