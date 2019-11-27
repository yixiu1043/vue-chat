<template>
  <transition name="fade">
    <div class="img-view" @click.capture="show" v-if="isShowBigImage">
      <div class="btn" @click="hide">
        <font-awesome-icon icon="times" color="#000" class="icon" size="2x" />
      </div>
      <mt-range v-model="rangeValue" :step="10" class="range"> </mt-range>
      <div class="img" @click="hide">
        <img :src="imgSrc" :style="style" @touchmove.native.capture="move" />
      </div>
    </div>
  </transition>
</template>
<script>
import $ from 'jquery';

export default {
  props: ['imgSrc'],
  data() {
    return {
      isShowBigImage: false,
      rangeValue: 20,
      timer: null,
    };
  },
  computed: {
    style() {
      return { width: `${this.rangeValue + 150}%` };
    },
  },
  methods: {
    show() {
      this.isShowBigImage = true;
    },
    hide() {
      this.rangeValue = 20;
      this.isShowBigImage = false;
    },
    move() {
      $('.btn').css('opacity', 0.6);
      $('.range').css('opacity', 0.6);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        $('.btn').css('opacity', 0);
        $('.range').css('opacity', 0);
        clearTimeout(this.timer);
      }, 1500);
    },
  },
  destroyed() {
    clearTimeout(this.timer);
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/compass.scss";

.fade-enter-active,
.fade-leave-active {
  transform: translate3d(0, 0, 0);
  transition: all 0.2s linear;
}

.fade-enter,
.fade-leave-active {
  transform: translate3d(100%, -100%, 0);
}

.img-view {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1111;
  width: 100%;
  height: 100%;
  background-color: #000;
}

.btn {
  position: absolute;
  top: px2rem(-50px);
  right: px2rem(-50px);
  z-index: 1;
  width: px2rem(110px);
  height: px2rem(110px);
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  opacity: 0;

  @include prefixer-value(transition, 0.3s, webkit moz o ms);

  .icon {
    position: absolute;
    top: px2rem(60px);
    left: px2rem(25px);
    color: #d3d7d4;
  }
}

.range {
  position: absolute;
  bottom: px2rem(60px);
  left: px2rem(5px);
  z-index: 1;
  width: 94%;
  height: px2rem(10px);
  text-align: center;
  opacity: 0;

  @include prefixer-value(transition, 0.3s, webkit moz o ms);

  /deep/.mt-range-thumb {
    top: px2rem(-10px);
    background-color: rgba(0, 0, 0, 0.6);
  }
}

.img-view .img {
  width: 100%;
  height: 100%;
  overflow: auto;

  img {
    height: auto;
  }
}
</style>
