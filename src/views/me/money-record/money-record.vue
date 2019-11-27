<template>
  <section
    :class="[
      { nodata: isNoDataBg },
      { pc: $root.isPC },
      'money-record',
      'user-select-one'
    ]"
  >
    <me-head title="资金明细" />
    <Scroll
      ref="scroll"
      class="scroll"
      :data="recordList"
      :pullup="true"
      @scroll-end="loadMore"
    >
      <div class="content">
        <div class="card" v-for="item in recordList" :key="item.order_id">
          <div class="card-header">订单编号：{{ item.order_id }}</div>
          <div class="card-content">
            <table>
              <caption>
                <span>交易时间：{{ item.date_time }}</span>
              </caption>
              <thead>
                <tr class="flex-box">
                  <th class="flex-1 br bb">交易类型</th>
                  <th class="flex-1 br bb">账变金额</th>
                  <th class="flex-1 bb">可用金额</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <td>{{ item.memo }}</td>
                </tr>
              </tfoot>
              <tbody>
                <tr class="flex-box">
                  <td class="flex-1 br bb red-font font-bold">
                    {{ item.money_from }}
                  </td>
                  <td class="flex-1 br bb red-font font-bold">
                    {{ item.order_amount }}
                  </td>
                  <td class="flex-1 bb red-font font-bold">
                    {{ item.balance }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Scroll>
    <div class="loading-wrapper">
      <div class="loading"></div>
    </div>
  </section>
</template>
<script>
import MeHead from '@/components/head';
import Req from '@/api/request';
import Scroll from '@/components/scroll';
import { showToast, toolkit } from '@/service/helper';

export default {
  name: 'money-record',
  components: { MeHead, Scroll },
  data() {
    return {
      recordList: [],
      page: 1,
      isLoadMore: true,
      isNoDataBg: false,
    };
  },
  created() {
    this.$nextTick(() => {
      this.$loading.show({ el: '.scroll' });
      this.recordList = [];
      this.getMoneyRecord();
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
      if (this.$root.isPC) {
        this.$refs.scroll.disable();
      }
    },
    getMoneyRecord() {
      Req.getMoneyRecord(this.page)
        .then(({ result }) => {
          if (!result.length) {
            this.isLoadMore = false;
            if (!this.$root.isPC) {
              this.$tip.bottom('暂无更多内容！');
            }
            this.$loading.hide();
          } else {
            this.recordList = [...this.recordList, ...result];
            this.isNoDataBg = false;
          }
          if (!this.isLoadMore && !this.recordList.length) {
            this.isNoDataBg = true;
          }
          this.$loading.hide();
          this.$RefreshButton.hide();
        })
        .catch(() => {
          this.$loading.hide();
          showToast('网络异常，请刷新');
          this.$nextTick(() => {
            this.$RefreshButton.show({ el: '.scroll' });
          });
        });
    },
    loadMore() {
      if (this.isLoadMore) {
        this.page += 1;
        this.$loading.show({ el: '.loading', title: '加载中', size: 'small' });
        this.getMoneyRecord();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
@import "./money-record.scss";
@import "./money-record-pc.scss";
</style>
