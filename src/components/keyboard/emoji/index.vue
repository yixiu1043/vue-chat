<template>
  <div :class="[{ pc: $root.isPC }, 'emoji-box']">
    <transition name="menu">
      <div
        class="swipe-box"
        v-show="isShowEmoji"
        @mousedown.stop="changeDown"
        @mouseup.stop="changeUp"
      >
        <mt-swipe :auto="0" ref="Swipe" @change="handleChange">
          <mt-swipe-item v-for="n in pageNumber" :key="n">
            <ul class="content">
              <li
                v-for="item in emojiItemList"
                :key="item.url"
                @click.stop="sendEmoji(item.emojiId)"
              >
                <img :src="item.url" alt="" />
              </li>
            </ul>
          </mt-swipe-item>
        </mt-swipe>
      </div>
    </transition>
  </div>
</template>
<script>
import { clearTimeout, setTimeout } from 'timers';
import { toolkit } from '@/service/helper';
import { emojiList } from '@/mock';

export default {
  data() {
    return {
      isShowEmoji: false,
      imgList: emojiList,
      onePageEmojiList: [],
      swipePageIndex: 0,
      pageEmojiNumber: 24,
      downX: 0,
      upX: 0,
      isHideFlag: true,
      timer: null,
    };
  },
  computed: {
    pageNumber() {
      return Math.ceil(emojiList.length / this.pageEmojiNumber);
    },
    emojiItemList() {
      const start = this.pageEmojiNumber * this.swipePageIndex;
      const end = this.pageEmojiNumber * (this.swipePageIndex + 1);
      return this.imgList.slice(start, end);
    },
  },
  mounted() {
    this.$nextTick(() => {
      toolkit.on(this.$root.$el, 'click', this.hideEmoji);
    });
  },
  methods: {
    handleChange(index) {
      this.swipePageIndex = index;
    },
    showEmoji() {
      this.isShowEmoji = true;
    },
    hideEmoji() {
      if (this.isHideFlag) {
        this.isShowEmoji = false;
      }
    },
    next() {
      this.$refs.Swipe.next();
    },
    prev() {
      this.$refs.Swipe.prev();
    },
    sendEmoji(data) {
      this.$emit('on-add-emoji', `${data}`);
    },
    changeDown(e) {
      this.downX = e.pageX;
      this.isHideFlag = false;
    },
    changeUp(e) {
      this.upX = e.clientX;
      const moveDistance = this.downX - this.upX;
      if (moveDistance > 80) {
        this.next();
      }
      if (moveDistance < -80) {
        this.prev();
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.isHideFlag = true;
      }, 500);
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

.emoji-box {
  .swipe-box {
    background-color: $white;
    height: px2rem(120px);

    .content {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-content: flex-start;
      padding: px2rem(6px);

      li {
        width: 12.5%;
        height: px2rem(30px);
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          /* padding: px2rem(3px); */
          width: px2rem(24px);
          height: auto;
          vertical-align: middle;
        }
      }
    }
  }
}
.emoji-box.pc {
  .swipe-box {
    background-color: $white;
    height: 120px;

    .content {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-content: flex-start;
      padding: 6px;

      li {
        width: 12.5%;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          /* padding: 3px) */
          width: 24px;
          height: auto;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
