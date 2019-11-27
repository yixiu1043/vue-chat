<template>
  <div :class="[{ pc: $root.isPC }, 'bank-box']">
    <div class="bank-info" v-if="bankInfoItem.card_no">
      <font-awesome-icon
        icon="money-check-alt"
        color="#ffd400"
        size="2x"
        class="icon"
      />
      <div class="info">
        <div class="user-name">
          <span>{{ bankInfoItem.card_name || "" }}</span>
          <span>{{ bankInfoItem.bank_name || "" }}</span>
        </div>
        <p class="bank-id">
          <span>{{ bankInfoItem.card_no || "" }}</span>
        </p>
      </div>
    </div>
    <div class="btn-box" v-else>
      <p>请绑定银行卡</p>
      <div class="add-bank" @click="toAddBank">
        <font-awesome-icon icon="money-check" color="#ffd400" size="2x" />
        <span> 添加银行卡</span>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    bankInfoItem: {
      type: Object,
      default: {},
    },
  },
  methods: {
    toAddBank() {
      if (this.$root.isPC) {
        this.$emit('on-show-bank');
        return;
      }
      this.$router.push('/bind-bank-card');
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
$w: 100%;

.bank-box {
  width: 100%;
  /* cursor: pointer; */

  .bank-info {
    display: flex;
    width: 0.94 * $w;
    margin: px2rem(5px) 0.03 * $w;
    background-color: rgba($color: $red, $alpha: 0.9);
    border-radius: 5px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: $white;

    .icon {
      width: 30%;
      font-size: px2rem(60px);
    }

    .info {
      flex: 1;

      .user-name {
        display: flex;
        height: px2rem(40px);
        line-height: px2rem(40px);
        flex: 1;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;

        span:nth-child(1) {
          max-width: 40%;
          overflow: auto;
        }

        span:nth-child(2) {
          max-width: 60%;
          overflow: auto;
        }
      }

      .bank-id {
        width: $w;
        height: px2rem(40px);
        line-height: px2rem(40px);
        text-align: center;
      }
    }
  }

  .btn-box {
    font-size: px2rem(14px);
    text-align: center;
    p {
      line-height: px2rem(30px);
    }
    .add-bank {
      display: flex;
      width: 80%;
      height: px2rem(40px);
      margin: px2rem(5px) auto;
      font-size: px2rem(16px);
      background-color: rgba($color: $red, $alpha: 0.9);
      border-radius: px2rem(5px);
      flex-direction: row;
      justify-content: center;
      align-items: center;
      color: $white;

      span {
        margin-left: px2rem(10px);
      }
    }
  }
}

.bank-box.pc {
  width: 100%;

  .bank-info {
    display: flex;
    width: 0.94 * $w;
    margin: 5px 0.03 * $w;
    background-color: rgba($color: $red, $alpha: 0.9);
    border-radius: 5px;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .icon {
      width: 30%;
      font-size: 60px;
    }

    .info {
      font-size: 16px;
      flex: 1;

      .user-name {
        display: flex;
        height: 40px;
        line-height: 40px;
        flex: 1;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;

        span:nth-child(1) {
          max-width: 40%;
          overflow: auto;
        }

        span:nth-child(2) {
          max-width: 60%;
          overflow: auto;
        }
      }

      .bank-id {
        width: $w;
        height: 40px;
        line-height: 40px;
        text-align: center;
      }
    }
  }

  .btn-box {
    font-size: 14px;
    text-align: center;
    p {
      line-height: 30px;
    }
    .add-bank {
      display: flex;
      width: 33%;
      height: 40px;
      margin: 5px auto;
      font-size: 16px;
      background-color: rgba($color: $red, $alpha: 0.9);
      border-radius: 5px;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      /deep/.btn {
        span::before {
          color: $black;
        }
      }

      span {
        margin-left: 10px;
      }
    }
  }
}
</style>
