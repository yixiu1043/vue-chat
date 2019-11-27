<template>
  <div :class="[{ pc: $root.isPC }, 'item']">
    <div class="head user-select-one" @click="showContent(index)">
      <span class="timer">{{ cleanTime(data.date_time) }}</span>
      <p :class="isexpand ? 'collapse' : ''">{{ data.title }}</p>
      <span>
        <font-awesome-icon icon="angle-up" class="game-icon" v-if="isexpand" />
        <font-awesome-icon icon="angle-down" class="game-icon" v-else />
      </span>
    </div>
    <transition name="slide">
      <div class="content" v-if="isexpand">
        {{ data.content }}
      </div>
    </transition>
  </div>
</template>
<script>

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isexpand: false,
    };
  },
  methods: {
    cleanTime(strTime) {
      if (!strTime) {
        return '';
      }
      return strTime.substring(0, 10);
    },
    showContent(index) {
      this.$parent.changeContent(index);
      this.isexpand = !this.isexpand;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(0, -100%, 0);
}

.item {
  width: 90%;
  margin: px2rem(3px) 0;
  overflow: hidden;
  border: 1px solid $border_color;
  border-radius: px2rem(3px);
  box-shadow: 0 1px 3px 0 $border_color;
  transition: 0.1s;
  @include prefixer-value(user-select, text, webkit moz o ms);

  .head {
    position: relative;
    z-index: 1;
    display: flex;
    width: 100%;
    height: px2rem(30px);
    padding-bottom: px2rem(5px);
    background-color: $history_bg;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    span {
      padding: 0 px2rem(5px);
      font-size: px2rem(12px);
      line-height: px2rem(30px);
      text-align: center;
    }
    span:last-child {
      color: rgba($color: #000000, $alpha: 0.3);
    }

    p {
      overflow: hidden;
      font-size: px2rem(14px);
      font-weight: 700;
      line-height: px2rem(30px);
      text-align: left;
      flex: 1;
      @include prefixer-value(display, -webkit-box, webkit moz o ms);
      @include prefixer-value(text-overflow, ellipsis, webkit moz o ms);
      @include prefixer-value(-webkit-line-clamp, 1, webkit moz o ms);
      /*! autoprefixer: off */
      @include prefixer-value(-webkit-box-orient, vertical, webkit moz o ms);
    }
  }

  .content {
    width: 98%;
    min-height: px2rem(30px);
    padding: 0 1%;
    font-size: px2rem(14px);
    line-height: px2rem(25px);
    text-align: left;
    text-indent: 2em;
    word-break: break-all;
    word-wrap: break-word;
  }
}

.item.pc {
  width: 90%;
  margin: 3px 0;
  overflow: hidden;
  border: 1px solid $border_color;
  border-radius: 3px;
  box-shadow: 0 1px 3px 0 $border_color;
  transition: 0.1s;
  @include prefixer-value(user-select, text, webkit moz o ms);

  .head {
    position: relative;
    z-index: 1;
    display: flex;
    width: 100%;
    height: 30px;
    padding-bottom: 5px;
    background-color: $history_bg;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    span {
      padding: 0 5px;
      font-size: 12px;
      line-height: 30px;
      text-align: center;
    }

    p {
      overflow: hidden;
      font-size: 14px;
      font-weight: 700;
      line-height: 30px;
      text-align: left;
      flex: 1;
      @include prefixer-value(display, -webkit-box, webkit moz o ms);
      @include prefixer-value(text-overflow, ellipsis, webkit moz o ms);
      @include prefixer-value(-webkit-line-clamp, 1, webkit moz o ms);
      /*! autoprefixer: off */
      @include prefixer-value(-webkit-box-orient, vertical, webkit moz o ms);
    }
  }

  .content {
    width: 98%;
    min-height: 30px;
    padding: 0 1%;
    font-size: 14px;
    line-height: 25px;
    text-align: left;
    text-indent: 2em;
    word-break: break-all;
    word-wrap: break-word;
  }
}

.collapse {
  color: $red;
}
.active {
  animation: move 0.3s;
}
@keyframes move {
  to {
    transform: translateY(0);
  }
  from {
    transform: translateY(100%);
  }
}
</style>
