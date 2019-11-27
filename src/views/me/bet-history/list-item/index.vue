<template>
  <div :class="[{ pc: $root.isPC }, 'guess-detail']">
    <div class="detail" @click="goDetail(item)">
      <div class="left">
        <p>
          <span> {{ item.lottery_name }}</span>
          <span class="play-name">[{{ item.play_name }}]</span>
        </p>
        <span class="teme">{{ item.order_time }}</span>
      </div>
      <div class="right">
        <span class="status">{{ item.status_name }}</span>
        <p>
          <span>投注金额</span>
          <span>{{ item.bet_amount }}元</span>
        </p>
      </div>
    </div>
    <div class="delete" v-if="$root.isPC">
      <div v-if="item.isShowDelete" @click="onDeleteOrder(item.order_id)">
        撤单
      </div>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  methods: {
    goDetail(betData) {
      if (this.$root.isPC) {
        this.$emit('on-detail', betData);
        return;
      }
      this.$router.push({
        name: 'bet-details',
        params: {
          betData,
        },
      });
    },
    onDeleteOrder(order_id) {
      this.$emit('on-delete', order_id);
    },
  },

};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";

.guess-detail {
  border-bottom: px2rem(1px) solid $border_color;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: px2rem(5px) 0;

  .detail {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    line-height: px2rem(25px);
    padding: 0 px2rem(10px);

    .left {
      font-size: px2rem(14px);
      font-weight: 700;

      .play-name {
        color: $theme;
      }

      .teme {
        font-size: px2rem(10px);
        font-weight: 100;
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      align-items: center;
      .status {
        font-weight: 700;
        font-size: px2rem(14px);
      }

      p {
        font-size: px2rem(10px);
      }
    }
  }

  .delete {
    width: 15%;
    text-align: center;
    line-height: px2rem(50px);
    font-size: px2rem(14px);
  }
}

.guess-detail.pc {
  border-bottom: 1px solid $border_color;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 0;
  cursor: pointer;

  .detail {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    line-height: 25px;
    padding: 0 10px;

    .left {
      font-size: 14px;
      font-weight: 700;

      .play-name {
        color: $theme;
      }

      .teme {
        font-size: 10px;
        font-weight: 100;
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;

      .status {
        font-weight: 700;
        font-size: 14px;
      }

      p {
        font-size: 10px;
      }
    }
  }

  .delete {
    width: 40px;
    text-align: center;
    line-height: 50px;
    font-size: 14px;
    color: $theme;
  }
}
</style>
