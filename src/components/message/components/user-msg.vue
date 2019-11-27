<template>
  <div
    :class="[{ pc: $root.isPC }, 'msg-wrapper']"
    v-if="Object.keys(data).length"
  >
    <div class="msg-content">
      <div class="time">
        <span>{{ data.sentUser }}</span>
        <span>{{ $day(data.sentTime).format("HH:mm:ss") }}</span>
      </div>
      <div class="text font-12px" :style="{ backgroundColor: color }">
        <p class="triangle" :style="{ borderLeftColor: color }"></p>
        <!-- 用户消息 -->
        <template v-if="data.msgType === 'me'">
          <p>{{ data.msg }}</p>
        </template>
        <!-- 用户图片 -->
        <template v-if="data.msgType === 'me_img'">
          <img
            :src="data.msg"
            alt=""
            class="user-img"
            @click="pcShowImage(data.msg)"
          />
        </template>
        <!-- 用户表情 -->
        <template v-if="data.msgType === 'me_emoji'">
          <div class="emoji-box">
            <span v-for="(imgUrl, index) in emojiList" :key="imgUrl + index">
              <img
                :src="`/static/emoji/${imgUrl}.png`"
                alt=""
                class="user-emoji"
              />
            </span>
          </div>
        </template>
      </div>
    </div>
    <div class="user-avatar user-select-one">
      <img :src="data.avatar" class="img" ondragstart="return false" />
    </div>
  </div>
</template>
<script>

export default {
  props: {
    data: {
      type: Object,
      required: true,
      default: () => { },
    },
    color: {
      type: String,
      default: '#fff',
    },
  },
  computed: {
    emojiList() {
      return this.splitStr(this.data.msg);
    },
  },
  methods: {
    splitStr(str) {
      const arr = [];
      if (str) {
        str.split(';').forEach((element) => {
          arr.push(element.substr(1));
        });
        return arr;
      }
      return [];
    },
    pcShowImage(url) {
      this.$emit('on-show-image', url);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./msg.scss";
@import "./msg-pc.scss";

.msg-wrapper {
  justify-content: flex-end;

  .msg-content {
    align-items: flex-end;
    padding-right: px2rem(8px);
    padding-bottom: px2rem(8px);

    .text {
      box-shadow: px2rem(-1px) px2rem(1px) px2rem(3px) $chatroom_msg_boxshadow;
      overflow: hidden;

      .triangle {
        right: px2rem(-10px);
      }
      .user-img {
        max-width: px2rem(200px);
        height: auto;
      }
      .emoji-box {
        max-width: px2rem(210px);
        min-width: px2rem(30px);
        padding-top: px2rem(5px);
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        align-content: flex-start;

        span {
          width: px2rem(24px);
          height: px2rem(24px);
          padding: px2rem(1px);

          .user-emoji {
            width: px2rem(22px);
            height: auto;
          }
        }
      }
    }
  }
}

.msg-wrapper.pc {
  justify-content: flex-end;

  .msg-content {
    align-items: flex-end;
    padding-right: 8px;

    .text {
      box-shadow: -1px 1px 3px $chatroom_msg_boxshadow;
      overflow: hidden;

      .triangle {
        right: -10px;
      }
      .user-img {
        max-width: 400px;
        height: auto;
      }
      .emoji-box {
        max-width: 210px;
        min-width: 30px;
        padding-top: 5px;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        align-content: flex-start;

        span {
          width: 24px;
          height: 24px;
          padding: 1px;

          .user-emoji {
            width: 22px;
            height: auto;
          }
        }
      }
    }
  }
}
</style>
