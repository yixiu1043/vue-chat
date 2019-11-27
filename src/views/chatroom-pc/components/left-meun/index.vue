<template>
  <div class="left-meun user-select-one">
    <nav-tab @on-change-tab="onChangeTopTab" v-bind="$attrs" navType="left" />
    <div class="content">
      <ul class="list" v-show="leftTabView === 'adminList'">
        <li
          class="clear"
          v-for="item in adminList"
          :key="item.title"
          @click="onChangeAdminTab(item)"
        >
          <img
            class="icon"
            src="../../../../assets/pc/def-hd.gif"
            alt=""
            ondragstart="return false"
          />
          <span>{{ item.title }}</span>
        </li>
      </ul>
      <ul class="list" v-show="leftTabView === 'userList'">
        <li
          class="clear"
          v-for="(item, index) in userList"
          :key="item.name"
          :class="activeClass === index ? 'active' : ''"
          @click="onChangeUserTab(item.name, index)"
        >
          <font-awesome-icon
            :icon="item.icon"
            :color="item.color"
            class="icon"
          />
          <span>{{ item.title }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import NavTab from '../nav-tab/index';
import { popupWindow } from '@/service/helper';

export default {
  props: {
    adminList: {
      type: Array,
      required: true,
      default: [],
    },
    userList: {
      type: Array,
      required: true,
      default: [],
    },
  },
  components: {
    NavTab,
  },
  data() {
    return {
      leftTabView: 'adminList',
      activeClass: 0,
    };
  },
  computed: {
    ...mapState({
      globalConfig: state => state.globalConfig,
    }),
  },
  methods: {
    onChangeTopTab(tab) {
      this.leftTabView = tab;
    },
    onChangeUserTab(name, index) {
      this.activeClass = index;
      this.$emit('on-change-user-tab', name);
    },
    onChangeAdminTab() {
      popupWindow(this.globalConfig.kefu_url, '_blank', 850, 650);
    },
  },
};
</script>
<style lang="scss">
@import "@/styles/color.scss";

.left-meun {
  width: 100%;
  height: 100%;
  position: relative;

  .content {
    position: absolute;
    top: 46px;
    left: 0;
    width: 100%;

    ul.list {
      font-size: 14px;
      cursor: pointer;

      li {
        padding: 10px 0 10px 25px;
        line-height: 26px;

        &:hover {
          color: $red;
          background-color: $primary_white;
        }

        .icon {
          float: left;
          width: 26px;
          height: 26px;
          vertical-align: middle;
          border-radius: 50%;
        }

        span {
          float: left;
          padding-left: 10px;
        }

        &.active {
          color: $red;
          background-color: $primary_white;
        }
      }
    }
  }
}
</style>
