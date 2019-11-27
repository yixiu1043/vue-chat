<template>
  <div id="app" :class="[{ pc: $root.isPC }]">
    <div class="router-view">
      <keep-alive :exclude="excludeList">
        <router-view />
      </keep-alive>

      <div
        class="shoadow"
        v-show="isPopupMenuShow"
        @touchstart="down($event)"
        @touchmove.capture="move($event)"
        @click="showPopupMenu"
        id="move-div"
      >
        <img src="./assets/me/btn-happix-ufo.png" />
      </div>
      <popup-menu ref="popupMenu" :room-list="chatRoomList" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { appConfig } from './config';
import PopupMenu from '@/components/popup-menu';

export default {
  name: 'App',
  components: {
    PopupMenu,
  },
  data() {
    return {
      excludeList: appConfig.noCachePages,
      positionY: 0,
      offsetY: 0,
      changeY: 0,
    };
  },
  computed: {
    ...mapState({
      chatRoomList: state => state.chatRoomList,
    }),
    isPopupMenuShow() {
      return (!appConfig.notShowPopupMenuPages.includes(this.$route.name));
    },
  },
  methods: {
    showPopupMenu() {
      this.$refs.popupMenu.show();
    },
    down(e) {
      const moveDiv = document.querySelector('#move-div');
      this.positionY = e.touches[0].clientY;
      this.offsetY = moveDiv.offsetTop;
    },
    move(e) {
      const moveDiv = document.querySelector('#move-div');
      this.changeY = e.touches[0].clientY - this.positionY;
      let top = this.changeY + this.offsetY;
      const screenHeight = document.documentElement.clientHeight - 80;
      if (top <= 50) {
        top = 50;
      }
      if (top >= screenHeight) {
        top = screenHeight;
      }
      moveDiv.style.top = `${top}px`;
    },
  },
};
</script>

<style lang="scss">
@import "./styles/base.scss";
@import "./styles/color.scss";

html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

html {
  -webkit-tap-highlight-color: rgba(201, 224, 253, 0.8);
}

#app {
  width: 100%;
  height: 100%;
  color: #333;
}

.router-view {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.shoadow {
  position: fixed;
  right: 0;
  bottom: px2rem(70px);
  z-index: 199;
  display: flex;
  width: px2rem(70px);
  height: px2rem(70px);
  color: #fff;
  justify-content: center;
  align-items: center;

  img {
    width: auto;
    height: px2rem(50px);
  }
}

/* 设置滚动条的样式 */
#app.pc {
  ::-webkit-scrollbar {
    width: 3px;
  }

  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    box-shadow: inset006pxrgba(0, 0, 0, 0.3);
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    background: rgba($color: $theme, $alpha: 0.7);
    border-radius: 10px;
    box-shadow: inset006pxrgba(0, 0, 0, 0.5);
  }

  overflow-y: scroll;
  scrollbar-color: rgba($color: $theme, $alpha: 0.7)
    rgba($color: $theme, $alpha: 0.7);
  -moz-appearance: none !important;

  ::-moz-scrollbar[orient="vertical"] {
    width: 3px !important;
  }
}
</style>
