<template>
  <div :class="[{ pc: $root.isPC }, 'detail']">
    <div>
      <me-head title="投注信息" />
    </div>
    <div class="main">
      <section class="top">
        <p class="title">{{ betData.lottery_name }}</p>
        <div>
          <span>第{{ betData.issue_no }}期</span>
          <span>{{ betData.status_name }}</span>
        </div>
      </section>
      <p class="title">订单内容</p>
      <ul class="mid">
        <li>
          <span>订单编号:</span><span>{{ betData.order_id }}</span>
        </li>
        <li>
          <span>开奖号码:</span><span>{{ betData.open_number }}</span>
        </li>
        <li>
          <span>中奖赔率:</span><span>{{ betData.bonus }}</span>
        </li>
        <li>
          <span>中奖金额:</span><span>{{ betData.win_amount }}</span>
        </li>
      </ul>
      <p class="title">订单信息</p>
      <ul class="footer">
        <li>
          <span>投注号码:</span><span>{{ betData.bet_number }}</span>
        </li>
        <li>
          <span>投注类型:</span><span>{{ betData.play_name }}</span>
        </li>
        <li>
          <span>投注信息:</span>
          <span>{{ betData.bet_count }}注{{ betData.unit_price }}元</span>
        </li>
        <li>
          <span>投注总额:</span>
          <span>{{ betData.bet_amount }}元</span>
        </li>
        <li>
          <span>投注时间:</span><span>{{ betData.order_time }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import MeHead from '@/components/head';

export default {
  name: 'bet-details',
  components: {
    MeHead,
  },
  props: {
    detailData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    betData() {
      if (this.$root.isPC) {
        return this.detailData || {};
      }
      return this.$route.params.betData || {};
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
@import "./index.scss";
@import "./index-pc.scss";
</style>
