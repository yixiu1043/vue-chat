<template>
  <main>
    <router-view />

    <tab :tabs="tabs" />

    <mt-popup
      v-model="servicePopup"
      position="bottom"
      class="service-popup-warpper"
    >
      <div class="service-popup-inner">
        <div class="header">
          <font-awesome-icon icon="headset" class="service-icon" />
          <span class="text">联系客服:{{ globalConfig.kefu_phone }}</span>
          <span class="exit-icon">
            <font-awesome-icon icon="times" @click="servicePopup = false" />
          </span>
        </div>
        <div class="content">
          <span class="text">
            客服QQ号:
            <span class="red-font">{{ globalConfig.kefu_qq }}</span>
          </span>
          <mt-button size="small" @click="goCustomServece"
            >立即咨询客服</mt-button
          >
        </div>
      </div>
    </mt-popup>
  </main>
</template>

<script>
import { mapState } from 'vuex';
import Tab from '@/components/tab';

export default {
  components: { Tab },
  data() {
    return {
      servicePopup: false,
      tabs: [
        {
          name: 'hall',
          title: '大厅',
          icon: 'home',
          path: '/hall',
          click: () => {
            this.$router.replace('/hall');
          },
        },
        {
          name: 'service',
          title: '客服',
          icon: 'headset',
          click: () => {
            this.servicePopup = true;
          },
        },
        {
          name: 'me',
          title: '个人中心',
          icon: 'user',
          path: '/me',
          click: () => {
            this.$router.replace('/me');
          },
        },
      ],
    };
  },
  computed: {
    ...mapState({
      isGuide: state => state.isGuide,
      globalConfig: state => state.globalConfig,
    }),
  },
  methods: {
    goCustomServece() {
      window.location.href = this.globalConfig.kefu_url;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/compass.scss";
@import "../styles/color.scss";

main {
  width: 100%;
  height: 100%;

  .service-popup-warpper {
    width: 100%;
    overflow: hidden;
    border-top-right-radius: px2rem(5px);
    border-top-left-radius: px2rem(5px);

    .service-popup-inner {
      width: 100%;

      .header {
        display: flex;
        height: px2rem(30px);
        padding: 0 px2rem(5px);
        color: $white;
        background-color: $theme;
        border-bottom: 1px solid $border_color;
        align-items: center;

        .service-icon {
          flex: 1;
        }

        .text {
          font-weight: bold;
          flex: 9;
        }

        .exit-icon {
          width: px2rem(20px);
          height: px2rem(20px);
          overflow: hidden;
          line-height: px2rem(20px);
          color: #f5f5f5;
          text-align: center;
          border-radius: 50%;
        }
      }

      .content {
        display: flex;
        height: px2rem(180px);
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .text {
          margin-bottom: px2rem(10px);
        }
      }
    }
  }
}
</style>
