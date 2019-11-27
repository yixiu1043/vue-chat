<template>
  <mt-popup v-model="isShow" :class="[{ pc: $root.isPC }, 'pop']">
    <div class="box">
      <div class="big-img" @click="hide">
        <img
          :src="bigImgUlr"
          alt=""
          ondragstart="return false"
          :style="style"
        />
      </div>
      <mt-range v-model="rangeValue" :step="10" class="range" />
    </div>
  </mt-popup>
</template>
<script>
export default {
  props: {
    bigImgUlr: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isShow: false,
      rangeValue: 0,
    };
  },
  computed: {
    style() {
      return { width: `${this.rangeValue + 100}%` };
    },
  },
  methods: {
    hide() {
      this.isShow = false;
      this.rangeValue = 20;
    },
    show() {
      this.isShow = true;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
.pop {
  max-width: 86%;
  border-radius: px2rem(10px);
  transform: translate(-50%, -50%);

  .box {
    width: 98%;
    height: 100%;
    padding: 1%;
    overflow: hidden;

    .big-img {
      height: 100%;
      width: 100%;
      background-color: $white;
      border-radius: 3px;
      overflow: auto;

      img {
        width: 100%;
        height: auto;
      }
    }
  }
  .range {
    position: absolute;
    bottom: px2rem(-20px);
    left: px2rem(5px);
    z-index: 1;
    width: 94%;
    height: px2rem(10px);
    text-align: center;

    @include prefixer-value(transition, 0.3s, webkit moz o ms);

    /deep/.mt-range-thumb {
      top: px2rem(-10px);
      background-color: rgba(0, 0, 0, 0.6);
    }
  }
}

.pop.pc {
  max-width: 60%;
  border-radius: px2rem(10px);
  transform: translate(-50%, -50%);

  .box {
    width: 98%;
    height: 100%;
    padding: 1%;
    overflow: hidden;

    .big-img {
      background-color: $white;
      border-radius: 3px;
      border-radius: px2rem(10px);
      overflow: auto;

      img {
        height: auto;
        max-height: 400px;
      }
    }
  }
  .range {
    position: absolute;
    bottom: -20px;
    left: 5px;
    z-index: 1;
    width: 100%;
    height: 10px;
    text-align: center;

    @include prefixer-value(transition, 0.3s, webkit moz o ms);

    /deep/.mt-range-thumb {
      top: -10px;
      background-color: rgba(0, 0, 0, 0.6);
    }
  }
}
</style>
