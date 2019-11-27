<template>
  <transition :name="'fab-item-' + $parent.fabItemAnimate">
    <div
      @touchstart="isTouched = true"
      @touchend="isTouched ? clickItem() : null"
    >
      <fab-cantainer
        class="fab-item"
        v-show="showItem"
        :style="fabItemStyle"
        :class="{ 'fab-shadow': !color }"
      >
        <div v-if="title" :style="titleStyle" class="fab-item-title">
          {{ title }}
        </div>
        <i
          v-if="$parent.iconType === 'MaterialDesign'"
          class="material-icons vue-fab-material-icons"
          :style="{
            color: color ? 'white' : '#999'
          }"
          >{{ icon }}</i
        >
        <i
          v-else
          class="vue-fab-material-icons iconfont"
          :class="icon"
          style="font-size: 10px;"
          :style="{
            color: color ? 'white' : '#999'
          }"
        >
        </i>
      </fab-cantainer>
    </div>
  </transition>
</template>

<script>
import { Timeout } from './util';

export default {
  name: 'fab-item',
  props: {
    idx: {
      type: Number,
      default: 0,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'add',
    },
    color: {
      type: String,
      default: null,
    },
    titleColor: {
      type: String,
      default: '#666',
    },
    titleBgColor: {
      type: String,
      default: 'white',
    },
  },
  computed: {
    showItem() {
      return (this.$parent.fabMenuAnimate === 'alive' || this.$parent.active) && this.$parent.hidden;
    },
    /**
       * 根据不同的动画模式处理不同的css
       */
    fabItemStyle() {
      const animateModel = {
        default: {
          top: `${this.$parent.direction === 'up' ? '-' : ''}${40 + this.idx * this.$parent.globalOptions.spacing}px`,
          transitionDelay: this.$parent.active ? `${this.idx * this.$parent.globalOptions.delay}s` : '0s',
          background: this.color ? this.color : '#FFF',
          boxShadow: this.color ? `${this.color} 0px 0px 0px 1px` : '',
        },
        alive: {
          transition: 'all .4s',
          transitionTimingFunction: 'cubic-bezier(.16,1.01,.61,1.2)',
          top: 0,
          transitionDelay: this.$parent.active ? `${this.idx * (this.$parent.globalOptions.delay / 3)}s` : '0s',
          opacity: this.$parent.active ? 1 : 0,
          background: this.color ? this.color : '#FFF',
          transform: this.$parent.active ? `translate3D(0, -${(this.idx + 1) * this.$parent.globalOptions.spacing}px, 0)` : 'translate3D(0, 0, 0)',
          zIndex: -this.idx,
        },
      };
      return animateModel[this.$parent.fabItemAnimate];
    },
    titleStyle() {
      return {
        color: this.titleColor,
        background: this.titleBgColor,
      };
    },
  },
  data() {
    return {
      isTouched: false,
    };
  },
  methods: {
    clickItem() {
      if (this.isTouched) {
        this.isTouched = false;
        this.$emit('clickItem', { idx: this.idx });
        this.handleAutoClose();
      }
    },
    async handleAutoClose() {
      if (this.$parent.clickAutoClose) {
        const timeout = new Timeout();
        await timeout.handleTimeout();
        this.$parent.active = false;
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="less" scoped>
@import "./styles/index.less";

.fab-item {
  .flex-center();
  .transition();

  position: absolute;
  cursor: pointer;
  top: -50px;
  width: 80%;
  height: 80%;
  border-radius: 50%;
  overflow: inherit;
  font-size: 0.8rem;
  border: 0.125rem solid #ece5db;
}

.fab-item-title {
  position: absolute;
  right: 4em;
  box-shadow: 0 1px 0.5px #ccc;
  padding: 2px 5px;
  font-size: 0.8em;
  min-width: 3em;
  white-space: nowrap;
  border-radius: 2px;
  text-align: center;
}
</style>
