<template>
  <transition name="slide">
    <div class="detail">
      <me-head :title="promotions.title" />
      <div class="scroll">
        <ul>
          <!-- <li>
            <span>活动标题:</span>
            <span>{{ promotions.title }}</span>
          </li> -->
          <li>
            <span>活动时间:</span>
            <span>{{ promotions.active_time }}</span>
          </li>
          <li>
            <span>活动对象:</span>
            <span>{{ promotions.active_object }}</span>
          </li>
          <li class="img-box">
            <img
              :src="promotions.big_pic_url"
              alt=""
              v-lazy="promotions.big_pic_url"
              @click="clickImg(promotions.big_pic_url)"
              ondragstart="return false"
            />
          </li>
        </ul>
        <big-image :imgSrc="imgSrc" ref="bigImage" />
      </div>
    </div>
  </transition>
</template>
<script>
import MeHead from '@/components/head';
import Scroll from '@/components/scroll';
import SettingStorage from '@/storage/setting';
import BigImage from '@/components/bigImage/index.vue';

export default {
  name: 'discount-details',
  components: {
    MeHead,
    Scroll,
    BigImage,
  },
  data() {
    return {
      imgSrc: '',
    };
  },
  computed: {
    promotions() {
      if (!this.$route.params.promotions) {
        return SettingStorage.getPromotion();
      }
      return this.$route.params.promotions;
    },
    isPC() {
      return this.$store.state.isPC;
    },
  },
  methods: {
    clickImg(src) {
      if (this.isPC) {
        return;
      }
      this.$refs.bigImage.show();
      this.imgSrc = src;
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
  transform: translate3d(100%, 0, 0);
}

.detail {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: $white;
  z-index: 1;
}

.scroll {
  @include prefixer-value(height, calc(100% - 3.125rem), webkit moz o ms);

  overflow: auto;
  user-select: text;
}

ul {
  width: 100%;

  li {
    display: flex;
    width: 96%;
    min-height: px2rem(25px);
    margin: 2%;
    line-height: px2rem(25px);
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    span:first-child {
      width: 23%;
      font-weight: 700;
    }

    span:last-child {
      width: 77%;
      font-size: px2rem(14px);
      text-align: left;
      word-break: break-all;
      word-wrap: break-word;
    }

    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
