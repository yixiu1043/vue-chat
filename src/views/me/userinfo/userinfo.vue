<template>
  <transition name="slide">
    <div :class="[{ pc: $root.isPC }, 'userinfo']">
      <me-head title="个人中心" />
      <ul class="detail">
        <li @click="onClickAvatar">
          <span class="left-con">头像</span>
          <p class="middle-con img">
            <span class="img-box">
              <img :src="userInfo.avatar" alt="" ondragstart="return false" />
            </span>
          </p>
          <font-awesome-icon
            icon="angle-right"
            color="#867892"
            class="right-con"
          />
        </li>
        <li @click="onClickName(userInfo.nick_name)">
          <span class="left-con">昵称</span>
          <span class="middle-con">{{ userInfo.nick_name }}</span>
          <font-awesome-icon
            icon="angle-right"
            color="#867892"
            class="right-con"
          />
        </li>
        <li>
          <span class="left-con">ID</span>
          <span class="middle-con">{{ userInfo.user_id }}</span>
          <span class="right-con"></span>
        </li>
        <li>
          <span class="left-con">余额</span>
          <span class="middle-con">{{ userInfo.total_amount }}</span>
          <span class="right-con"></span>
        </li>
        <li>
          <span class="left-con">彩票返点</span>
          <span class="middle-con">{{ userInfo.frozen_amount || 0 }}</span>
          <span class="right-con"></span>
        </li>
      </ul>
      <me-popup
        ref="namePopup"
        class="name-popup-el"
        title="请设定您的新昵称"
        @on-confirm="setUserNickName"
        @on-close="onCloseNamePopup"
        key="name-popup"
        :class="{ shadow: $root.isPC }"
        :modal="$root.isPC ? false : true"
      >
        <div class="name-popup" slot="content">
          <mt-field
            label="旧昵称"
            v-model="oldName"
            :disableClear="true"
            disabled
          ></mt-field>
          <mt-field
            label="新昵称"
            placeholder="请输入新昵称"
            v-model="newName"
            :disableClear="true"
            ref="chatInput"
          >
            <font-awesome-icon
              @click="setRandomName"
              :icon="iconType"
              size="lg"
            />
          </mt-field>
        </div>
      </me-popup>

      <me-popup
        ref="avatarPopup"
        title="请选择下面的个性头像吧"
        :footer="false"
        key="avatar-popup"
        :class="{ shadow: $root.isPC }"
        :modal="$root.isPC ? false : true"
      >
        <div class="avatar-popup" slot="content">
          <mt-navbar v-model="selected">
            <mt-tab-item
              :id="classitem.id"
              v-for="classitem in iconclass"
              :key="classitem.id"
              class="tab-item"
              >{{ classitem.name }}</mt-tab-item
            >
          </mt-navbar>
          <div class="white-blank"></div>
          <mt-tab-container v-model="selected">
            <mt-tab-container-item
              :id="classitem.id"
              v-for="classitem in iconclass"
              :key="classitem.id * 10"
            >
              <div
                class="avatar-icon"
                @click="setUserAvatar(classitem.type, item.id)"
                v-for="item in classitem.iconlist"
                :key="item.img"
              >
                <img :src="item.img" ondragstart="return false" />
              </div>
            </mt-tab-container-item>
          </mt-tab-container>
        </div>
      </me-popup>
    </div>
  </transition>
</template>
<script>
import { mapState } from 'vuex';
import MeHead from '@/components/head';
import MePopup from '@/components/popup';
import { randomName, avatarList } from '@/mock';
import { randomNumber, showToast } from '@/service/helper';
import UserService from '@/service/user';
import { listenKeyboard } from '@/lib/device';

export default {
  name: 'userinfo',
  components: {
    MeHead,
    MePopup,
  },
  data() {
    return {
      oldName: '',
      newName: '',
      iconType: 'dice-six',
      selected: 1,
      iconclass: avatarList,
      firstSignIn: false,
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
    }),
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name === 'register') {
        vm.onClickName('未设定');
        vm.firstSignIn = true;
      }
    });
  },
  mounted() {
    this.$nextTick(() => {
      const $input = this.$refs.chatInput.$refs.input;
      listenKeyboard($input);
    });
  },
  methods: {
    onCloseNamePopup() {
      if (this.firstSignIn) {
        this.onClickAvatar();
      }
    },
    onClickAvatar() {
      this.$refs.avatarPopup.show();
    },
    onClickName(name) {
      this.oldName = name;
      this.newName = '';
      this.$refs.namePopup.show();
    },
    setRandomName() {
      const randomIcon = ['dice-six', 'dice-five', 'dice-four', 'dice-three', 'dice-two', 'dice-one'];
      const iconIndex = randomNumber(0, randomIcon.length);
      this.iconType = randomIcon[iconIndex];
      const nameIndex = randomNumber(0, randomName.length);
      this.newName = randomName[nameIndex];
    },
    setUserNickName() {
      if (!this.newName) {
        showToast('新昵称不能为空');
        return;
      }
      UserService.setUserNickName(this.newName)
        .then(() => {
          this.$refs.namePopup.hide();
          this.newName = '';
        });
    },
    setUserAvatar(type, id) {
      const avatar = `/images/avatar/${type}-${id}.jpg`;
      UserService.setUserAvatar(avatar)
        .then(() => {
          this.$refs.avatarPopup.hide();
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
@import "@/styles/animate.scss";
</style>
