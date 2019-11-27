<template>
  <div class="list-body user-select-one" :class="isDataBg" :style="bgStyle">
    <scroll
      class="scroll"
      :data="guessDataList.concat(recordDataList)"
      ref="scroll"
      :pullup="true"
      @scroll-end="addList"
    >
      <div class="item">
        <ListItem
          v-for="(item, index) in list"
          :key="index"
          :item="item"
          v-on="$listeners"
        />
      </div>
      <div class="refresh-btn" @click="addListByBtn" v-if="isShowBtn">
        <font-awesome-icon
          icon="sync-alt"
          class="btn-icon"
          :class="isAddData ? 'move-animation' : ''"
        />
        <span class="fadeOut" v-if="isAddData" key="还有数据时显示"
          >点击加载更多</span
        >
        <span class="fadeOut" v-else key="暂无数据时显示">暂时无更多</span>
      </div>
    </scroll>
    <div class="loading-wrapper" v-if="!$root.isPC">
      <div class="loading"></div>
    </div>
  </div>
</template>
<script>
import ListItem from '../list-item/index';
import Scroll from '@/components/scroll';
import {
  toolkit, showToast, hideLoading,
} from '@/service/helper';

export default {
  components: {
    ListItem,
    Scroll,
  },
  props: {
    guessDataList: {
      type: Array,
      required: true,
      default: [],
    },
    recordDataList: {
      type: Array,
      required: true,
      default: [],
    },
    listType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      page: 1,
      isAddData: true,
    };
  },
  computed: {
    isPC() {
      return this.$store.state.isPC;
    },
    isShowBtn() {
      if (this.isPC && this.list.length > 8) {
        return true;
      }
      return false;
    },
    list() {
      if (this.listType === 'GuessList') {
        return [...this.guessDataList] || [];
      }
      if (this.listType === 'RecordList') {
        return [...this.recordDataList] || [];
      }
      if (this.listType === 'AllList') {
        return [...this.guessDataList, ...this.recordDataList] || [];
      }
      return [];
    },
    isDataBg() {
      if (this.listType === 'GuessList' && !this.guessDataList.length) {
        return 'nodata';
      }
      if (this.listType === 'RecordList' && !this.recordDataList.length) {
        return 'noplace';
      }
      if (this.listType === 'AllList' && !this.list.length) {
        return 'noplace';
      }
      return '';
    },
    bgStyle() {
      if (this.isPC) {
        if (this.isDataBg === 'nodata') {
          return { backgroundSize: '50% auto' };
        }
        return { backgroundSize: '15% auto' };
      }
      if (this.isDataBg === 'nodata') {
        return { backgroundSize: '100% auto' };
      }
      return { backgroundSize: '35% auto' };
    },
  },
  created() {
    this.$nextTick(() => {
      if (this.$root.isPC) {
        toolkit.off(this.$refs.scroll.$el, 'scroll', this.handleScroll);
      }
    });
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$root.isPC) {
        toolkit.on(this.$refs.scroll.$el, 'scroll', this.handleScroll);
      }
    });
  },
  beforeDestroy() {
    if (this.$root.isPC) {
      toolkit.off(this.$refs.scroll.$el, 'scroll', this.handleScroll);
    }
  },
  methods: {
    handleScroll(evt) {
      const { scrollHeight, scrollTop, clientHeight } = evt.target;
      if (Math.ceil(clientHeight + scrollTop) >= scrollHeight) {
        this.loadMore();
      }
      if (this.isPC) {
        this.$refs.scroll.disable();
      }
    },
    resetPage() {
      this.page = 1;
    },
    addList() {
      if (!this.isPC) {
        this.loadMore();
      }
    },
    addListByBtn() {
      if (this.isAddData) {
        this.loadMore();
      }
    },
    loadMore() {
      this.loadShow();
      this.page += 1;
      if (this.listType === 'GuessList') {
        this.$parent.getOrderRecord(this.page, '否')
          .then((res) => {
            if (res.length <= 0) {
              this.isAddData = false;
              showToast('没有更多内容了');
            }
            hideLoading();
          });
      }
      if (this.listType === 'RecordList') {
        this.$parent.getOrderRecord(this.page, '是')
          .then((res) => {
            if (res.length <= 0) {
              this.isAddData = false;
              showToast('没有更多内容了');
            }
            hideLoading();
          });
      }
      if (this.listType === 'AllList') {
        this.$parent.getOrderRecord(this.page, '否');
        this.$parent.getOrderRecord(this.page, '是')
          .then((res) => {
            if (res.length <= 0) {
              this.isAddData = false;
              showToast('没有更多内容了');
            }
            hideLoading();
          });
      }
    },
    loadShow() {
      this.$loading.show({
        el: '.loading',
        title: '加载中',
        size: 'small',
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
@import "@/styles/animate.scss";

.list-body {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;

  @include prefixer-value(height, calc(100% - 90px), webkit moz o ms);

  .scroll {
    width: 100%;
    @include prefixer-value(height, 100%, webkit moz o ms);
    overflow: auto;
    @include prefixer-value(scroll-behavior, smooth, webkit moz o ms);

    .item {
      width: 100%;
      padding-bottom: 50px;
    }
  }
}
.refresh-btn {
  color: $border_color;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  margin-bottom: 20px;
  line-height: 40px;
}

.nodata {
  background-image: url(../../../../assets/me/nodata.png);
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: 100% auto;
}

.noplace {
  background-image: url(../../../../assets/me/noplace.png);
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: 35% auto;
}
.move-animation {
  animation: move 2s infinite;
}

@include prefix-keyframes(move) {
  from {
    @include prefixer-value(transform, rotate(0deg), webkit moz o ms);
  }

  to {
    @include prefixer-value(transform, rotate(360deg), webkit moz o ms);
  }
}
.loading-wrapper {
  position: absolute;
  left: 50%;
  bottom: px2rem(20px);
  z-index: 9999;
}
</style>
