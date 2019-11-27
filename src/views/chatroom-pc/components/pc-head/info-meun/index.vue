<template>
  <div class="user-info">
    <div class="user" @click="show">
      <div class="img">
        <img
          class="icon"
          :src="userInfo.avatar"
          alt=""
          ondragstart="return false"
        />
      </div>
      <div class="info">
        <span>欢迎您:</span>
        <span>{{ userInfo.nick_name }}</span>
      </div>
    </div>
    <p class="boundary"></p>
    <div class="sign-out user-select-one" @click="logout">
      <font-awesome-icon icon="sign-out-alt" class="faicon" />
      <div class="mt-5px">退出</div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import UserService from '@/service/user';
import ChatService from '@/service/chat';
import UserStorage from '@/storage/user';

export default {
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
    }),
  },
  methods: {
    show() {
      this.$emit('on-show');
    },
    logout() {
      this.setChatroomInof();
      window.location.reload();
      UserService.logout(() => {
        this.$router.push('/login-pc');
        ChatService.disconnect();
      });
    },
    setChatroomInof() {
      const { roomId, roomName } = this.$route.query;
      const ChatroomInof = {
        roomId,
        roomName,
        user_id: UserStorage.getUserInfo().user_id,
      };
      UserStorage.setChatroomInof(ChatroomInof);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/color.scss";
@import "@/styles/compass.scss";
@import "@/styles/animate.scss";

.user-info {
  display: flex;
  float: right;
  padding-right: 30px;
  font-size: 12px;
  color: $white;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .user {
    display: flex;
    margin-top: 5px;
    cursor: pointer;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: url("../../../../../assets/avatar/default.png") no-repeat;
      background-size: 100% auto;
      transition: 0.3s;

      .icon {
        border-radius: 50%;
        width: 100%;
        height: auto;
        vertical-align: middle;
        box-shadow: -1px 1px 3px 2px rgba(0, 0, 0, 0.2);
      }
    }

    .info {
      display: flex;
      line-height: 30px;
      text-align: center;
      flex-direction: column;
      justify-content: center;

      span {
        width: 80px;
        height: 25px;
        overflow: hidden;
        @include prefixer-value(display, -webkit-box, webkit moz o ms);
        @include prefixer-value(text-overflow, ellipsis, webkit moz o ms);
        @include prefixer-value(-webkit-line-clamp, 1, webkit moz o ms);
        /*! autoprefixer: off */
        @include prefixer-value(-webkit-box-orient, vertical, webkit moz o ms);
      }
    }
  }

  .boundary {
    width: 0;
    height: 40px;
    border: 1px solid $border_color;
    opacity: 0.1;
    margin-top: 5px;
  }

  .sign-out {
    display: flex;
    margin-left: 10px;
    color: $yellow;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-top: 5px;

    .faicon {
      font-size: 20px;
    }

    span {
      line-height: 25px;
    }
  }
  .sign-out:hover {
    color: $white;
  }
}
</style>
