<template>
  <div class="my-refresh" v-show="isShow" :style="loadStyle">
    <div class="btn" @click="doRefresh">
      <font-awesome-icon icon="redo-alt" class="btn-icon move-animation" />
      <span :style="style" class="fadeOut">点击刷新</span>
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
    style() {
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
      return `transform: scale(${scale});-webkit-transform: scale(${scale});-moz-transform: scale(${scale});-o-transform: scale(${scale});-ms-transform: scale(${scale})`;
    },
    loadStyle() {
      return {
        backgroundColor: this.color ? 'rgba(255, 255, 255,0.5)' : 'rgba(255, 255, 255,1)',
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
    doRefresh() {
      window.location.reload();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/animate.scss";

.my-refresh {
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

  .btn {
    display: flex;
    padding: px2rem(10px);
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .btn-icon {
      font-size: px2rem(30px);
      color: #e14844;
    }

    span {
      margin-top: px2rem(20px);
    }
  }
}

.move-animation {
  animation: move 1s;
}

@include prefix-keyframes(move) {
  from {
    @include prefixer-value(transform, rotate(0deg), webkit moz o ms);
  }

  to {
    @include prefixer-value(transform, rotate(360deg), webkit moz o ms);
  }
}
</style>
