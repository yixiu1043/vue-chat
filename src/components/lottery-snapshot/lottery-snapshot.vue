<template functional>
  <div :class="[{ pc: $root.isPC }, 'lottery-snapshot', 'user-select-one']">
    <div class="lottery-icon">
      <img
        v-if="lotteryData.code"
        :src="require(`../../assets/hall/icon_${lotteryData.code}.png`)"
        ondragstart="return false"
      />
    </div>
    <div class="crrent-last-con">
      <div class="crrent-info">
        <div class="lottery-name">{{ lotteryData.name }}：</div>
        <div class="issue">{{ lotteryData.issue }}期</div>
      </div>
      <div class="last-info">
        <div class="title">
          <span>上期：</span>
        </div>
        <div class="ball-wrapper" v-if="lotteryData.number">
          <span
            class="ball"
            :style="{ backgroundColor: ball.color }"
            v-for="(ball, i) in lotteryData.number"
            :key="i"
          >
            {{ ball.number }}
          </span>
        </div>
      </div>
    </div>
    <template v-if="lotteryData.locked">
      <div class="lock-counter">
        <div class="title">封盘中</div>
        <div class="red-font">{{ lotteryData.timer }}</div>
      </div>
    </template>
    <template v-else>
      <div class="open-counter">
        <!-- <div class="title" v-if="$root.isPC">距开奖时间</div> -->
        <div class="title">下注中</div>
        <div class="green-font">{{ lotteryData.timer }}</div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    lotteryData: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
@import "./lottery-snapshot.scss";
@import "./lottery-snapshot-pc.scss";
</style>
