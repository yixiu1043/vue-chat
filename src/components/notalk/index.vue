<template>
  <me-popup
    ref="popup"
    title="禁言用户"
    v-on="$listeners"
    :class="[{ pc: $root.isPC }]"
  >
    <div class="no-talk-popup" slot="content">
      <font-awesome-icon icon="exclamation-circle" class="icon" />
      <span>您确定要禁言</span>
      <span class="username">{{ noTalkUser }}</span>
      <span>吗？</span>
    </div>
  </me-popup>
</template>
<script>
import MePopup from '@/components/popup';

export default {
  components: {
    MePopup,
  },
  props: {
    noTalkUser: {
      type: String,
      required: true,
    },
  },
  methods: {
    show() {
      this.$refs.popup.show();
    },
    hide() {
      this.$refs.popup.hide();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/color.scss";
@import "@/styles/compass.scss";
.no-talk-popup {
  text-align: center;
  .icon,
  .username {
    color: $purple;
  }
}
/deep/.mint-popup.pc {
  border-radius: 5px;
  overflow: hidden;
  background-color: transparent;
  .no-talk-popup {
    text-align: center;
    font-size: 14px;
    .icon,
    .username {
      color: $purple;
    }
  }
  .modal-content {
    font-size: 14px;
    .close {
      position: absolute;
      right: 5px;
      top: 5px;
      width: 30px;
      height: 31px;
      line-height: 31px;
      text-align: center;
      cursor: pointer;
    }
    .header {
      background-color: $red;
      padding: 12px 16px;
      text-align: center;
      box-sizing: border-box;
      color: $white;
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
