<template>
  <transition name="slide">
    <div class="down">
      <me-head title="下载中心" />
      <Marquee :marqueeStr="marqueeStr" />
      <main class="content">
        <mt-button size="large" class="button" @click="getApkUrl"
          >下载{{ type }}版本</mt-button
        >
      </main>
    </div>
  </transition>
</template>
<script>
import { mapState } from 'vuex';
import { isPlatform } from '@/lib/device';
import MeHead from '@/components/head';
import Marquee from '@/components/marquee/index';

export default {
  name: 'downapp',
  components: {
    MeHead,
    Marquee,
  },
  data() {
    return {
      type: '',
      typeId: '',
      marqueeStr: '',
      platform: isPlatform(),
    };
  },
  computed: {
    ...mapState({
      globalConfig: state => state.globalConfig,
    }),
  },
  created() {
    this.getPlatform();
  },
  methods: {
    getApkUrl() {
      const { isIOS, isAndroid } = this.platform;
      const { android_download_url, ios_download_url } = this.globalConfig;
      if (isAndroid) {
        return android_download_url;
      }
      if (isIOS) {
        return ios_download_url;
      }
      return '';
    },
    getPlatform() {
      const { isIOS, isAndroid } = this.platform;
      if (isIOS) {
        this.type = '苹果';
        this.typeId = 31;
      }
      if (isAndroid) {
        this.type = '安卓';
        this.typeId = 41;
      }
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

.down {
  width: 100%;
  height: 100%;

  .content {
    width: 100%;
    height: 100%;
    background-image: url("../../../assets/me/download_bg.png");
    background-position: 0 px2rem(-40px);
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;

    .button {
      width: px2rem(130px);
      height: px2rem(40px);
      position: absolute;
      top: 70%;
      left: 50%;
      transform: translate(-50%, -50%);

      /deep/.mint-button--large {
        height: 100%;
      }
    }
  }
}
</style>
