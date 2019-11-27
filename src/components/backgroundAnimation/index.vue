<template>
  <ul class="bg-bubbles">
    <li v-for="i in 10" :key="i * 1992" :style="style"></li>
  </ul>
</template>
<script>
export default {
  props: {
    formRadian: {
      type: String,
      default: '0px',
    },
    bgColor: {
      type: String,
      default: '175, 238, 238',
    },
    bgOpacity: {
      type: String,
      default: '0.13',
    },
  },
  computed: {
    style() {
      return { borderRadius: this.formRadian, backgroundColor: `rgba(${this.bgColor},${this.bgOpacity})` };
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";

.bg-bubbles {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  li {
    position: absolute;
    bottom: px2rem(-160px);
    width: px2rem(40px);
    height: px2rem(40px);
    list-style: none;
    animation: square 10s infinite;
    transition-timing-function: linear;

    &:nth-child(1) {
      left: 10%;
    }

    &:nth-child(2) {
      left: 20%;
      width: px2rem(90px);
      height: px2rem(90px);
      animation-delay: 2s;
      animation-duration: 7s;
    }

    &:nth-child(3) {
      left: 25%;
      animation-delay: 4s;
    }

    &:nth-child(4) {
      left: 40%;
      width: px2rem(60px);
      height: px2rem(60px);
      background-color: rgba(255, 255, 255, 0.3);
      animation-duration: 8s;
    }

    &:nth-child(5) {
      left: 70%;
    }

    &:nth-child(6) {
      left: 80%;
      width: px2rem(45px);
      height: px2rem(45px);
      background-color: rgba(255, 255, 255, 0.2);
      animation-delay: 3s;
    }

    &:nth-child(7) {
      left: 32%;
      width: px2rem(50px);
      height: px2rem(50px);
      animation-delay: 2s;
    }

    &:nth-child(8) {
      left: 55%;
      width: px2rem(20px);
      height: px2rem(20px);
      animation-delay: 4s;
      animation-duration: 15s;
    }

    &:nth-child(9) {
      left: 25%;
      width: px2rem(10px);
      height: px2rem(10px);
      background-color: rgba(255, 255, 255, 0.3);
      animation-delay: 2s;
      animation-duration: 12s;
    }

    &:nth-child(10) {
      left: 85%;
      width: px2rem(70px);
      height: px2rem(70px);
      animation-delay: 5s;
    }
  }

  @keyframes square {
    0% {
      opacity: 0.5;

      @include prefixer-value(
        transform,
        translateY(0) rotate(45deg),
        webkit moz o ms
      );
    }

    25% {
      opacity: 0.75;

      @include prefixer-value(
        transform,
        translateY(-400px) rotate(90deg),
        webkit moz o ms
      );
    }

    50% {
      opacity: 1;

      @include prefixer-value(
        transform,
        translateY(-600px) rotate(135deg),
        webkit moz o ms
      );
    }

    100% {
      opacity: 0;

      @include prefixer-value(
        transform,
        translateY(-1000px) rotate(180deg),
        webkit moz o ms
      );
    }
  }
}
</style>
