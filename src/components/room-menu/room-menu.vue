<template>
  <div :class="[{ pc: $root.isPC }, 'room-menu']">
    <div
      class="item"
      :class="{ active: room.name === currentRoom }"
      v-for="(room, index) in chatRoomList"
      :key="room.id"
      @click="toggleChatRoom(room, index)"
    >
      <img class="icon" :src="require(`../../assets/hall/${room.id}.png`)" />
      <span class="text">{{ room.name }}</span>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import UserStorage from '@/storage/user';
import { showToast } from '@/service/helper';

export default {
  computed: {
    ...mapState({
      chatRoomList: state => state.chatRoomList,
      userInfo: state => state.userInfo,
    }),
    currentRoom() {
      return this.$route.query.roomName;
    },
  },
  methods: {
    toggleChatRoom(roomData, index) {
      const chatroomTypeLenght = this.userInfo.chatrooms.length;
      /**
       * 获取权限
       * chatrooms：允许进入房间的列表,
       * type:array
       * 1：初级聊天室
       * 2：初级、高级都可以;
      */
      const flag = index + 1 <= chatroomTypeLenght;
      this.$emit('on-toggle-room', roomData, flag);
      if (flag) {
        this.$router.replace({
          name: this.$root.isPC ? 'chatroom-pc' : 'chatroom',
          query: {
            roomId: roomData.id,
            roomName: roomData.name,
          },
        });
        UserStorage.setChatroomInof({
          roomId: roomData.id,
          roomName: roomData.name,
          user_id: UserStorage.getUserInfo().user_id,
        });
        return;
      }
      showToast('您暂时不能进入该聊天室');
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";

.room-menu {
  padding: px2rem(10px);
  font-size: px2rem(13px);
  .current-room {
    text-align: center;
  }
  .item {
    width: 80%;
    height: px2rem(38px);
    line-height: px2rem(38px);
    margin: auto;
    background: url(../../assets/hall/icon_bg.png) no-repeat center / cover;
    border-radius: px2rem(5px);
    margin-top: px2rem(10px);
    color: $white;
    transition: box-shadow 0.3s;
    text-indent: px2rem(20px);

    img.icon {
      width: px2rem(30px);
      height: px2rem(30px);
      vertical-align: middle;
    }
    span.text {
      vertical-align: middle;
      padding-left: px2rem(20px);
    }
  }
  .item.active {
    box-shadow: 0 0 px2rem(2px) 2px $primary_gray;
  }
}

.room-menu.pc {
  padding: 10px;
  font-size: 13px;

  .item {
    width: 140px;
    height: 38px;
    line-height: 38px;
    background: url(../../assets/hall/icon_bg.png) no-repeat center / cover;
    border-radius: 5px;
    margin-top: 10px;
    color: $white;
    cursor: pointer;
    transition: box-shadow 0.3s;
    text-indent: unset;

    img.icon {
      width: 30px;
      height: 30px;
      vertical-align: middle;
    }
    span.text {
      vertical-align: middle;
      padding-left: 10px;
    }
  }
  .item.active {
    box-shadow: 0 0 2px 2px $primary_gray;
  }

  .item:hover {
    box-shadow: 0 0 2px 2px $primary_gray;
  }
}
</style>
