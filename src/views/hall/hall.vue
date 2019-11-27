<template>
  <div class="hall">
    <header class="header font-10px white-font">
      <div class="user-avatar">
        <img :src="imgStr ? imgStr : userInfo.avatar" />
      </div>
      <div class="user-info">
        <div>{{ chageNickName ? chageNickName : userInfo.nick_name }}</div>
        <div class="yellow-font">
          余额: {{ userInfo.total_amount || 0 }}
          <font-awesome-icon
            icon="redo-alt"
            rotation="90"
            :spin="isIconSpin"
            @click="updateUserInfo"
          />
        </div>
        <div class="yellow-font">
          冻结金额: {{ userInfo.frozen_amount || 0 }}
        </div>
      </div>
      <!-- <div class="down-btn red-font" @click="toDownApp">
        <span>
          <font-awesome-icon icon="download" class="move-animation" />
        </span>
        <span>下载APP</span>
      </div> -->
    </header>
    <div class="hall-scroll">
      <scroll class="scroll-wrapper" :data="chatRoomList">
        <!-- <ul class="scroll-inner">
          <router-link
            v-for="room in chatRoomList"
            :to="{
              path: '/chatroom',
              query: {
                roomId: room.id,
                roomName: room.name
              }
            }"
            tag="li"
            :key="room.id"
            class="lottery-item white-font"
          >
            <span class="lottery-icon">
              <img :src="require(`../../assets/hall/${room.id}.png`)" />
            </span>
            <span class="lottery-name">{{ room.name }}</span>
          </router-link>

          <li class="lottery-item white-font">
            <span class="ml-5px">
              <font-awesome-icon icon="ellipsis-h" size="lg" />
            </span>
            <span class="lottery-name">更多聊天室，敬请期待</span>
          </li>
        </ul> -->
        <ul class="select-lottery">
          <li
            v-for="link in lotteryList"
            :key="link.lottery_id"
            @click.stop="
              changeLottery(
                link.lottery_id,
                link.lottery_name,
                link.lottery_code
              )
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
          </li>
        </ul>
      </scroll>
    </div>
    <background-animation formRadian="50px" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Scroll from '@/components/scroll';
import BackgroundAnimation from '@/components/backgroundAnimation';
import UserService from '@/service/user';
import LotterySelect from '@/components/lottery-select';
import UserStorage from '@/storage/user';

export default {
  name: 'hall',
  components: {
    Scroll,
    BackgroundAnimation,
    LotterySelect,
  },
  data() {
    return {
      isIconSpin: false,
      chageNickName: '',
      imgStr: '',
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      chatRoomList: state => state.chatRoomList,
      lotteryList: state => state.lotteryList,
    }),
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.updateUserInfo();
    });
  },
  created() { },
  methods: {
    ...mapMutations({
      setLotteryInfo: 'SET_LOTTERY_INFO',
    }),
    updateUserInfo() {
      this.isIconSpin = true;
      UserService.updateUserInfo()
        .then(() => {
          const { nick_name, avatar } = this.userInfo;
          this.chageNickName = nick_name;
          this.imgStr = avatar;
          this.isIconSpin = false;
        }).catch(() => {
          this.isIconSpin = false;
        });
    },
    toDownApp() {
      this.$router.push('/downapp');
    },
    changeLottery(lotteryId, lotteryName, lotteryCode) {
      const { roomId, roomName } = UserService.doRedirect();
      this.setLotteryInfo({
        lotteryId,
        lotteryName,
        lotteryCode: lotteryCode.toLowerCase(),
      });
      UserStorage.setChatroomInof({
        roomId,
        roomName,
        user_id: UserStorage.getUserInfo().user_id,
      });
      this.$router.replace({
        name: 'chatroom',
        query: {
          roomId,
          roomName,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
@import "./hall.scss";
</style>
