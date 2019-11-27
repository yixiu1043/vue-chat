<template>
  <div class="float-tab user-select-one">
    <ul class="menu">
      <li
        v-for="tab in tabs"
        :key="tab.name"
        class="tab-item"
        @click.stop="onClickTab(tab.name)"
      >
        <span class="icon">
          <font-awesome-icon :icon="tab.icon" />
        </span>
        <span class="text">{{ tab.title }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      isShow: false,
      tabList: [
        {
          name: 'toggle-bet', title: '隐藏下注', icon: 'eye-slash',
        },
      ],
      isShowBet: true,
    };
  },
  computed: {
    ...mapState({
      chatRoomList: state => state.chatRoomList,
      userInfo: state => state.userInfo,
    }),
    tabs() {
      if (this.userInfo.isAdmin) {
        return [...this.tabList, {
          name: 'block-list', title: '禁言名单', icon: 'comment-slash',
        }];
      }
      return this.tabList;
    },
  },
  methods: {
    onClickTab(tabName) {
      switch (tabName) {
        case 'toggle-bet':
          if (this.tabs[0].title === '隐藏下注') {
            this.tabs[0].title = '显示下注';
            this.tabs[0].icon = 'eye';
            this.isShowBet = true;
          } else {
            this.tabs[0].title = '隐藏下注';
            this.tabs[0].icon = 'eye-slash';
            this.isShowBet = false;
          }
          this.$emit('on-click-tab', { name: tabName, dataState: this.isShowBet });
          break;
        default:
          this.$emit('on-click-tab', { name: tabName });
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/color.scss";

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}

.float-tab {
  position: absolute;
  top: 46px;
  right: 0;
  font-size: 13px;

  .init {
    width: 120px;
    height: 70px;
    position: absolute;
    top: 0;
    right: 0;
    background: url(../../../../assets/pc/instruction.png);
    background-size: 100% auto;
    background-position: 0 64%;
    z-index: 1;
    font-size: 16px;
    text-align: center;
    letter-spacing: 2px;
    transform: perspective(500px) rotateY(-15deg);
    transition: 0.5s;
    overflow: hidden;
    color: white;

    span {
      width: 120px;
      height: 35px;
      position: absolute;
      top: 20px;
      left: 0;
      line-height: 35px;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 1);
    }
  }

  .init:hover {
    transform: perspective(500px) rotateY(15deg);
  }

  .init::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, transparent, white, transparent);
    left: -100%;
    transition: 0.5s;
  }

  .init:hover::before {
    left: 100%;
  }

  .menu {
    position: absolute;
    top: 200px;
    right: 0;
    width: 100px;
    height: 130px;

    .tab-item {
      position: absolute;
      width: 100%;
      left: 60px;
      box-sizing: border-box;
      height: 35px;
      line-height: 35px;
      cursor: pointer;
      background-color: $primary_white;
      overflow: hidden;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      padding: 0 5px;
      border: 1px solid $border_color;
      border-right: unset;
      transition: left 0.5s;
      z-index: 1;

      span.icon {
        display: inline-block;
        width: 30px;
        text-align: center;
      }
    }
    .tab-item:nth-child(1) {
      top: 0;
    }
    .tab-item:nth-child(2) {
      top: 45px;
    }

    .tab-item:nth-child(3) {
      top: 90px;
    }

    .tab-item:hover {
      left: 0;
    }
  }

  /* .game-dropdown-list {
    position: absolute;
    top: 70px;
    right: 5px;
    text-align: center;
    background-color: $primary_white;
    border-radius: 3px;
    box-shadow: -1px 1px 3px 1px rgba(0, 0, 0, 0.2);
    z-index: 1;

    li.game-dropdown-list-item {
      width: 130px;
      height: 46px;
      padding: 5px;
      line-height: 46px;
      cursor: pointer;
      border-bottom: 1px solid $pc_border;

      &:last-child {
        border-bottom: unset;
      }

      img {
        width: 40px;
        height: 40px;
        background: url("../../../../assets/hall/icon_bg.png");
        border-radius: 5px;
      }

      span.game-name {
        display: inline-block;
        width: 70px;
        vertical-align: top;

        &:hover {
          color: $red;
        }
      }
    }
  } */
}
</style>
