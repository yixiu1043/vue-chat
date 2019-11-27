<template>
  <div class="pc-head user-select-one">
    <div class="logo">
      <img
        src="../../../../assets/pc/logo.png"
        alt=""
        ondragstart="return false"
        @click="reload"
      />
    </div>
    <nav>
      <div class="collection" @click="$refs.collectionModal.show()">
        <font-awesome-icon icon="star" />
        <span>收藏</span>
      </div>
      <div class="do-chatroom" v-if="isLogged">
        <font-awesome-icon icon="mobile-alt" />
        <!-- <span>手机聊天室</span> -->
        <vue-qrcode class="code" :value="getDomain" :options="{ width: 200 }" />
      </div>

      <div class="chatroom" @click.stop="roomMenuShow" v-if="isLogged">
        <div class="init">
          <span class="text">{{ currentRoom }}</span>
          <span class="icon">
            <font-awesome-icon icon="angle-up" v-if="isShow" />
            <font-awesome-icon icon="angle-down" v-else />
          </span>
        </div>
        <div class="menu">
          <transition name="slide">
            <div
              class="game-dropdown-list"
              v-show="isShow"
              @click="roomMenuHide"
            >
              <room-menu v-on="$listeners" />
            </div>
          </transition>
        </div>
      </div>
    </nav>

    <user-meun v-if="!isLogged" key="未登录时显示" />

    <info-meun v-else @on-show="$refs.userModal.show()" key="登录后显示" />

    <me-popup :cancel-button="false" ref="collectionModal">
      <div class="collection-modal" slot="content">
        <font-awesome-icon icon="exclamation-circle" class="icon" />
        <span>请按Ctrl+D加入收藏</span>
      </div>
    </me-popup>

    <me-popup ref="userModal" :footer="false" title="个人中心" width="450">
      <div class="userinfo-modal" slot="content">
        <user-info />
      </div>
    </me-popup>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import MePopup from '@/components/popup';
import UserInfo from '@/views/me/userinfo';
import UserMeun from './user-meun/index';
import InfoMeun from './info-meun/index';
import RoomMenu from '@/components/room-menu';
import { toolkit } from '@/service/helper';

export default {
  components: {
    MePopup,
    UserInfo,
    UserMeun,
    InfoMeun,
    VueQrcode,
    RoomMenu,
  },
  data() {
    return {
      isShow: false,
    };
  },
  computed: {
    ...mapState({
      chatRoomList: state => state.chatRoomList,
      isLogged: state => state.isLogged,
    }),
    getDomain: () => window.location.hostname,
    currentRoom() {
      return this.$route.query.roomName;
    },
  },
  mounted() {
    this.$nextTick(() => {
      toolkit.on(this.$root.$el, 'click', this.roomMenuHide);
    });
  },
  beforeDestroy() {
    toolkit.on(this.$root.$el, 'click');
  },
  methods: {
    roomMenuHide(e) {
      if (e) {
        e.stopPropagation();
      }
      this.isShow = false;
    },
    goPage(path) {
      this.$router.push(path);
    },
    reload() {
      window.location.reload();
    },
    roomMenuShow() {
      this.isShow = !this.isShow;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(0, -100%, 0);
}
</style>
