<template>
  <div :class="[{ right: pcRight }, { pc: isShowPc }, 'lottery-popup-warpper']">
    <transition :name="lotteryName">
      <div class="link" v-show="lotteryPopup">
        <div
          class="item"
          v-for="link in lotteryLinks"
          :key="link.lottery_id"
          @click.stop="
            changeLottery(link.lottery_id, link.lottery_name, link.lottery_code)
          "
        >
          <div class="chatroom-icon">
            <img
              :src="
                require(`../../assets/hall/icon_${link.lottery_code.toLowerCase()}.png`)
              "
            />
          </div>
          <p class="text">{{ link.lottery_name }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { toolkit } from '@/service/helper';

export default {
  props: {
    lotteryLinks: {
      type: Array,
      required: true,
      default: () => [],
    },
    position: {
      type: String,
      default: 'bottom',
    },
  },
  data() {
    return {
      lotteryPopup: false,
    };
  },
  computed: {
    isShowPc() {
      if (this.position === 'right') {
        return false;
      }
      return true;
    },
    pcRight() {
      if (this.position !== 'right') {
        return false;
      }
      return true;
    },
    lotteryName() {
      if (this.position === 'bottom') {
        return 'lotterybottom';
      }
      if (this.position === 'right') {
        return 'lotteryright';
      }
      return 'lotterytop';
    },
  },
  mounted() {
    this.$nextTick(() => {
      toolkit.on(this.$root.$el, 'click', this.hide);
    });
  },
  beforeDestroy() {
    toolkit.on(this.$root.$el, 'click');
  },
  methods: {
    hide(e) {
      if (e) {
        e.stopPropagation();
      }
      this.lotteryPopup = false;
    },
    show() {
      this.lotteryPopup = true;
    },
    changeLottery(lotteryId, lotteryName, lotteryCode) {
      this.$emit('on-change-lottery', lotteryId, lotteryName, lotteryCode.toLowerCase());
      this.hide();
    },
    changeLotteryState() {
      this.lotteryPopup = !this.lotteryPopup;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
@import "./lottery-select.scss";
@import "./lottery-select-pc.scss";
@import "./lottery-select-pc-right.scss";
//方向在bottom
.lotterybottom-enter-active,
.lotterybottom-leave-active {
  transition: all 0.3s ease;
}

.lotterybottom-enter,
.lotterybottom-leave-to {
  transform: translate3d(0, 100%, 0);
  opacity: 0;
}
//方向在top
.lotterytop-enter-active,
.lotterytop-leave-active {
  transition: all 0.3s ease;
}

.lotterytop-enter,
.lotterytop-leave-to {
  transform: translate3d(0, -100%, 0);
  opacity: 0;
}
//方向在right
.lotteryright-enter-active,
.lotteryright-leave-active {
  transition: all 0.3s ease;
}

.lotteryright-enter,
.lotteryright-leave-to {
  transform: translate3d(100%, 0, 0);
  opacity: 0;
}
</style>
