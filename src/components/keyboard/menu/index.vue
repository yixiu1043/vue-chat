<template>
  <div :class="[{ pc: $root.isPC }, 'menu']">
    <transition name="menu">
      <div class="product-box" v-show="isShowProduct">
        <div class="item">
          <span class="icon" @click.stop="sendEmoji">
            <font-awesome-icon icon="smile" class="font-icon" />
          </span>
          <span class="text">表情</span>
        </div>
        <div class="item">
          <span class="icon">
            <img src="../../../assets/chatroom/img.png" alt="" />
            <input type="file" class="file" @change="imgBroadcastChange" />
          </span>
          <span class="text">图片</span>
        </div>
        <!-- <div class="item" @click="sendEnvelope">
          <span class="icon">
            <img src="../../../assets/chatroom/envelope.png" alt="" />
          </span>
          <span class="text">红包</span>
        </div> -->
      </div>
    </transition>
  </div>
</template>
<script>
import { toolkit } from '@/service/helper';
import nativeTool from '@/lib/tool';

export default {
  data() {
    return {
      isShowProduct: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      toolkit.on(this.$root.$el, 'click', this.hideProduct);
    });
  },
  methods: {
    showProduct() {
      this.isShowProduct = !this.isShowProduct;
    },
    hideProduct() {
      this.isShowProduct = false;
    },
    imgBroadcastChange(e) {
      if (e && e.target.files[0]) {
        const imgFile = e.target.files[0];
        nativeTool.compressImage(imgFile, (file) => {
          this.$emit('on-send-img', file);
        });
      }
    },
    sendEnvelope() {
      if (!this.$root.isPC) {
        this.$router.push('/red-envelope');
        return;
      }
      this.$emit('on-show-envelope');
    },
    sendEmoji() {
      this.hideProduct();
      this.$emit('on-show-emoji');
    },
  },
  beforeDestroy() {
    toolkit.on(this.$root.$el, 'click');
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
//方向在bottom
.menu-enter-active,
.menu-leave-active {
  transition: all 0.3s ease;
}

.menu-enter,
.menu-leave-to {
  transform: translate3d(0, 100%, 0);
  opacity: 0;
}

.menu {
  .product-box {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: $white;
    padding: px2rem(6px);

    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: px2rem(50px);
      font-size: px2rem(12px);
      padding: px2rem(3px) px2rem(8px);

      .icon {
        width: px2rem(30px);
        height: px2rem(30px);
        padding: px2rem(12px);
        border-radius: px2rem(3px);
        border: px2rem(1px) solid $border_color;
        font-size: px2rem(22px);
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        .file {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
        }
        img {
          width: 100%;
          height: auto;
        }
        .font-icon {
          font-size: px2rem(32px);
          color: $light_black;
        }
      }
      .text {
        margin-top: px2rem(5px);
      }
    }
  }
}
.menu.pc {
  .product-box {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: $white;
    padding: 6px;

    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 50px;
      font-size: 12px;
      padding: 3px8px;

      .icon {
        width: 30px;
        height: 30px;
        padding: 12px;
        border-radius: 3px;
        border: 1px solid $border_color;
        font-size: 22px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        .file {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
        }
        img {
          width: 100%;
          height: auto;
        }
        .font-icon {
          font-size: 32px;
          color: $light_black;
        }
      }
      .text {
        margin-top: 5px;
      }
    }
  }
}
</style>
