<template>
  <mt-popup v-model="isShow" pop-transition="popup-fade" :modal="modal">
    <div :style="style" :class="[{ pc: $root.isPC }, 'modal-content']">
      <div class="close" @click="hide">
        <slot name="close" v-if="$slots.close"></slot>
        <font-awesome-icon color="#fff" icon="times" v-else />
      </div>
      <div class="header" v-if="header">
        <slot name="header" v-if="$slots.header"></slot>
        <header v-else>{{ title }}</header>
      </div>
      <div class="body">
        <slot name="content"></slot>
      </div>
      <div class="footer" v-if="footer">
        <slot name="footer" v-if="$slots.footer"></slot>
        <div v-else class="btns">
          <me-button v-if="cancelButton" class="cancel" @click.native="cancel"
            >取消
          </me-button>
          <me-button class="confirm" @click.native="confirm">确定 </me-button>
        </div>
      </div>
    </div>
  </mt-popup>
</template>
<script>
import MeButton from '@/components/button';

export default {
  props: {
    title: {
      type: String,
      default: '温馨提示',
    },
    cancelButton: {
      type: Boolean,
      default: true,
    },
    footer: {
      type: Boolean,
      default: true,
    },
    header: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: '#333',
    },
    width: {
      type: [String, Number],
      default: 320,
    },
    modal: {
      type: Boolean,
      default: true,
    },
  },
  components: { MeButton },
  data() {
    return {
      isShow: false,
    };
  },
  computed: {
    style() {
      return {
        width: `${this.width / 16}rem`,
      };
    },
  },
  methods: {
    hide() {
      this.isShow = false;
      this.$emit('on-close');
    },
    show() {
      this.isShow = true;
    },
    confirm() {
      this.hide();
      this.$emit('on-confirm');
    },
    cancel() {
      this.hide();
      this.$emit('on-cancel');
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";

.mint-popup {
  border-radius: px2rem(5px);
  overflow: hidden;
  background-color: transparent;

  .modal-content {
    .close {
      position: absolute;
      right: px2rem(5px);
      top: px2rem(5px);
      width: px2rem(30px);
      height: px2rem(31px);
      line-height: px2rem(31px);
      text-align: center;
      cursor: pointer;
    }
    .header {
      background-color: $red;
      padding: px2rem(12px) px2rem(16px);
      text-align: center;
      box-sizing: border-box;
      color: $white;
    }
    .body {
      min-height: px2rem(60px);
      padding: px2rem(16px);
      box-sizing: border-box;
      background-color: $white;
      color: $black;
    }
    .footer {
      padding: px2rem(12px) px2rem(16px);
      box-sizing: border-box;
      border-top: 1px solid $border_color;
      background-color: $white;
      .btns {
        display: flex;
        justify-content: center;
        align-items: center;
        .button {
          width: px2rem(80px);
          height: px2rem(30px);
          line-height: px2rem(30px);
          text-align: center;
          color: $white;
          border-radius: px2rem(3px);
          font-size: px2rem(14px);
          cursor: pointer;
        }
        .confirm {
          @extend .button;
          background-color: $green;
        }

        .cancel {
          @extend .button;
          margin-right: px2rem(30px);
          background-color: $gray;
        }
      }
    }
  }

  .modal-content.pc {
    .close {
      position: absolute;
      right: 5px;
      top: 5px;
      width: 30px;
      height: 31px;
      line-height: 31px;
      font-size: 16px;
      text-align: center;
      cursor: pointer;
    }
    .header {
      background-color: $red;
      padding: 12px 16px;
      text-align: center;
      box-sizing: border-box;
      color: $white;
      font-size: 14px;
    }
    .body {
      min-height: 60px;
      padding: 16px;
      box-sizing: border-box;
      background-color: $white;
      color: $black;
    }
    .footer {
      padding: 12px 16px;
      box-sizing: border-box;
      border-top: 1px solid $border_color;
      background-color: $white;
      .btns {
        display: flex;
        justify-content: center;
        align-items: center;
        .button {
          width: 80px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          color: $white;
          border-radius: 3px;
          font-size: 14px;
          cursor: pointer;
        }
        .confirm {
          @extend .button;
          background-color: $green;
        }

        .cancel {
          @extend .button;
          margin-right: 30px;
          background-color: $gray;
        }
      }
    }
  }
}
</style>
