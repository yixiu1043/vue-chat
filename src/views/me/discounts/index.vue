<template>
  <div :class="[{ pc: $root.isPC }, 'discounts']">
    <me-head title="优惠活动" />
    <scroll class="scroll" :data="promotionList" :pullup="true">
      <div class="content">
        <div
          class="promotions"
          v-for="(item, index) in promotionList"
          :key="index"
          @click="toDetail(index)"
        >
          <div class="img-box">
            <img :src="item.small_pic_url" alt="" v-lazy="item.small_pic_url" />
          </div>
          <div class="detail">
            <p>{{ item.title || "" }}</p>
            <div class="text">{{ item.profile || "" }}</div>
          </div>
        </div>
      </div>
    </scroll>
    <!-- pc详情弹窗 -->
    <me-popup
      ref="detailModal"
      width="600"
      :title="detail.title"
      :footer="false"
    >
      <div class="detail-modal-content" slot="content">
        <ul>
          <li>
            <span>活动时间:</span>
            <span>{{ detail.active_time }}</span>
          </li>
          <li>
            <span>活动对象:</span>
            <span>{{ detail.active_object }}</span>
          </li>
          <li class="img-box">
            <img :src="detail.big_pic_url" alt="" ondragstart="return false" />
          </li>
        </ul>
      </div>
    </me-popup>
  </div>
</template>
<script>
import MeHead from '@/components/head';
import MePopup from '@/components/popup';
import Scroll from '@/components/scroll';
import { showToast } from '@/service/helper';
import Req from '@/api/request';
import SettingStorage from '@/storage/setting';

export default {
  name: 'discounts',
  components: {
    MeHead,
    Scroll,
    MePopup,
  },
  data() {
    return {
      promotionList: [],
      detail: {},
    };
  },
  computed: {
    isPC() {
      return this.$store.state.isPC;
    },
  },
  created() {
    this.getPromotions();
  },
  methods: {
    getPromotions() {
      Req.getPromotions()
        .then(({ status, result, error }) => {
          if (status) {
            this.promotionList = [...result];
          } else {
            showToast(error);
          }
          this.$RefreshButton.hide();
        })
        .catch(() => {
          showToast('网络异常，请刷新');
          this.$nextTick(() => {
            this.$RefreshButton.show({ el: '.scroll' });
          });
        });
    },
    toDetail(index) {
      const { promotionList } = this;
      SettingStorage.setPromotion(promotionList[index]);
      if (this.isPC) {
        this.$refs.detailModal.show();
        this.detail = promotionList[index];
        return;
      }
      this.$router.push({
        name: 'discount-details',
        params: {
          promotions: promotionList[index],
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
@import "./index.scss";
@import "./index-pc.scss";

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
