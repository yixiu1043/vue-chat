<template>
  <ul :class="[{ pc: $root.isPC }, 'nav']">
    <li
      :class="activeClass === index ? 'active' : ''"
      v-for="(item, index) in navList"
      :key="index"
      @click="navContent(index, item.name)"
      v-preventReClick="1000"
    >
      <span>{{ item.title }}</span>
    </li>
  </ul>
</template>
<script>

export default {
  props: {
    activeClass: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      navList: [
        {
          title: '等待开奖',
          name: 'GuessList',
        },
        {
          title: '已结算订单',
          name: 'RecordList',
        },
        {
          title: '全部订单',
          name: 'AllList',
        },
      ],
      pages: 1,
    };
  },
  methods: {
    navContent(index, name) {
      this.$emit('on-change-nav', { index, name });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
$w: 100%;
$h: 100%;

.nav {
  width: $w;
  height: px2rem(40px);
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  li {
    width: 0.3322 * $w;
    height: $h;
    text-align: center;
    line-height: px2rem(40px);
    background-color: $history_bg;
    font-size: px2rem(14px);
    font-weight: 700;
    word-break: break-all;
    color: $history_color;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  li:nth-child(1) {
    border-left: none;
  }

  .active {
    color: $red;
  }
  .active::before {
    content: "";
    position: absolute;
    @include prefixer-value(top, calc(100% - 3px), webkit moz o ms);
    left: 0;
    z-index: 1;
    width: 100%;
    height: 1px;
    border-bottom: 2px solid $red;
    @include prefixer-value(animation, leftMove 1s, webkit moz o ms);
  }
  @at-root {
    @include prefix-keyframes(leftMove) {
      to {
        @include prefixer(transform, translateX(0), webkit moz o ms);
      }
      from {
        @include prefixer(transform, translateX(-100%), webkit moz o ms);
      }
    }
  }
}

.nav.pc {
  width: $w;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  li {
    width: 0.3322 * $w;
    height: $h;
    text-align: center;
    line-height: 40px;
    background-color: $history_bg;
    font-size: 14px;
    font-weight: 700;
    word-break: break-all;
    color: $history_color;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  li:nth-child(1) {
    border-left: none;
  }

  .active {
    color: $red;
  }
  .active::before {
    content: "";
    position: absolute;
    top: calc(100% - 3px);
    left: 0;
    z-index: 1;
    width: 100%;
    height: 1px;
    border-bottom: 2px solid $red;
    animation: leftMove 1s;
  }
  @keyframes leftMove {
    to {
      transform: translateX(0);
    }
    from {
      transform: translateX(-100%);
    }
  }
}
</style>
