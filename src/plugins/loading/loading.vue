<template>
  <div class="my-loading" v-show="isShow" :style="wrapperStyle">
    <div class="inner" :style="innerStyle">
      <div class="load-effect">
        <span
          v-for="ball in 8"
          :key="ball"
          :style="{ backgroudColor: color }"
        ></span>
      </div>
      <p class="title" v-if="title" :style="{ color: color }">{{ title }}</p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShow: false,
      title: '',
      color: '',
      size: '',
    };
  },
  computed: {
    innerStyle() {
      let scale;
      switch (this.size) {
        case 'medium':
          scale = 0.8;
          break;
        case 'small':
          scale = 0.5;
          break;
        default:
          scale = 1;
          break;
      }
      return `transform: scale(${scale});`;
    },
    wrapperStyle() {
      return {
        backgroundColor: this.color ? this.color : 'rgba(255, 255, 255,1)',
      };
    },
  },
  methods: {
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/color.scss";
@import "../../styles/compass.scss";

.my-loading {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;

  .inner {
    z-index: 100;
    text-align: center;

    .load-effect {
      position: relative;
      width: px2rem(100px);
      height: px2rem(100px);

      @include prefixer(transform, scale(0.25), webkit moz o ms);
    }

    .load-effect span {
      position: absolute;
      display: inline-block;
      width: px2rem(16px);
      height: px2rem(16px);
      background: $black;
      border-radius: 50%;

      @include prefixer(animation, load 1.04s ease infinite, webkit moz o ms);

      @at-root {
        @include prefix-keyframes(load) {
          0% {
            opacity: 1;

            @include prefixer(transform, scale(1.2), webkit moz o ms);
          }

          100% {
            opacity: 0.2;

            @include prefixer(transform, scale(0.3), webkit moz o ms);
          }
        }
      }
    }

    .load-effect span:nth-child(1) {
      top: 50%;
      left: 0;
      margin-top: px2rem(-8px);

      @include prefixer(animation-delay, 0.13s, webkit moz o ms);
    }

    .load-effect span:nth-child(2) {
      top: px2rem(14px);
      left: px2rem(14px);

      @include prefixer(animation-delay, 0.26s, webkit moz o ms);
    }

    .load-effect span:nth-child(3) {
      top: 0;
      left: 50%;
      margin-left: px2rem(-8px);

      @include prefixer(animation-delay, 0.39s, webkit moz o ms);
    }

    .load-effect span:nth-child(4) {
      top: px2rem(14px);
      right: px2rem(14px);

      @include prefixer(animation-delay, 0.52s, webkit moz o ms);
    }

    .load-effect span:nth-child(5) {
      top: 50%;
      right: 0;
      margin-top: px2rem(-8px);

      @include prefixer(animation-delay, 0.65s, webkit moz o ms);
    }

    .load-effect span:nth-child(6) {
      right: px2rem(14px);
      bottom: px2rem(14px);

      @include prefixer(animation-delay, 0.78s, webkit moz o ms);
    }

    .load-effect span:nth-child(7) {
      bottom: 0;
      left: 50%;
      margin-left: px2rem(-8px);

      @include prefixer(animation-delay, 0.91s, webkit moz o ms);
    }

    .load-effect span:nth-child(8) {
      bottom: px2rem(14px);
      left: px2rem(14px);

      @include prefixer(animation-delay, 1.04s, webkit moz o ms);
    }

    .title {
      margin-top: px2rem(-30px);
      font-size: px2rem(12px);
      line-height: px2rem(20px);
      color: $black;
    }
  }
}
</style>
