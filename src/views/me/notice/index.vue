<template>
  <div class="notice">
    <me-head title="系统公告" />
    <div class="scroll">
      <div class="list-body">
        <notice-item
          v-for="(item, index) in noticeList"
          :key="item.id + item.content"
          :data="item"
          ref="notice"
          :index="index"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { showToast } from '@/service/helper';
import Req from '@/api/request';
import NoticeItem from './notice-item/index';
import MeHead from '@/components/head';

export default {
  components: { MeHead, NoticeItem },
  data() {
    return {
      noticeList: [],
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.getNews());
  },
  created() {
    this.getNews();
    this.$nextTick(() => {
      this.$loading.show({ el: '.scroll' });
    });
  },
  beforeRouteLeave(to, from, next) {
    this.changeContent();
    next();
  },
  methods: {
    getNews() {
      Req.getNews()
        .then(({ status, result, error }) => {
          this.$loading.hide();
          if (status) {
            this.noticeList = [...result];
          } else {
            showToast(error);
          }
          this.$RefreshButton.hide();
        })
        .catch(() => {
          this.$loading.hide();
          showToast('网络异常,请点击刷新');
          this.$nextTick(() => {
            this.$RefreshButton.show({ el: '.scroll' });
          });
        });
    },
    changeContent(index) {
      const list = this.$refs.notice;
      list.forEach((item, i) => {
        if (i !== index) {
          Object.assign(item.$data, { isexpand: false });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";

.notice {
  width: 100%;
  height: 100%;
}

.scroll {
  @include prefixer-value(height, calc(100% - 2.5rem), webkit moz o ms);

  overflow: auto;
  user-select: text;
}

.list-body {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
}
</style>
