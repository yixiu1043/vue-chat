<template>
  <div
    class="back-top"
    :style="styles"
    v-show="isBackTop"
    @click.stop="backTop"
  >
    <font-awesome-icon icon="arrow-circle-up" :color="color" />
  </div>
</template>
<script>
import { toolkit } from '@/service/helper';

export default {
  props: {
    container: {
      type: null,
      default: () => document.documentElement || document.body,
    },
    height: {
      type: Number,
      default: 40,
    },
    bottom: {
      type: Number,
      default: 30,
    },
    right: {
      type: Number,
      default: 10,
    },
    color: {
      type: String,
      default: '#4caf50',
    },
    duration: {
      type: Number,
      default: 1000,
    },
  },
  data() {
    return {
      isBackTop: false,
    };
  },
  computed: {
    containerEl() {
      if (this.container === document.documentElement || this.container === document.body) {
        return document.documentElement || document.body;
      }
      return document.querySelector(this.container);
    },
    styles() {
      return {
        bottom: `${this.bottom}px`,
        right: `${this.right}px`,
      };
    },
  },
  mounted() {
    this.$nextTick(() => {
      toolkit.on(this.containerEl, 'resize', this.handleScroll);
      toolkit.on(this.containerEl, 'scroll', this.handleScroll);
    });
  },
  beforeDestroy() {
    toolkit.off(this.containerEl, 'scroll', this.handleScroll);
    toolkit.off(this.containerEl, 'resize', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isBackTop = this.containerEl.scrollTop >= this.height;
    },
    backTop() {
      const target = typeof this.container === 'string' ? this.containerEl : (document.documentElement || document.body);
      const sTop = target.scrollTop;
      toolkit.scrollTop(this.containerEl, sTop, 0, this.duration);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/compass.scss";
@import "../../styles/color.scss";

.back-top {
  position: absolute;
  font-size: px2rem(20px);
}
</style>
