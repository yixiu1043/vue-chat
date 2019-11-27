<template>
  <div class="history-body">
    <me-head title="订单详情" />
    <Nav @on-change-nav="changeNav" ref="Nav" :activeClass="activeClass" />
    <history-list
      :listType="listType"
      :guessDataList="guessDataList"
      :recordDataList="recordDataList"
      @on-detail="showDetail"
      @on-delete="onDeleteOrder"
      ref="historyList"
    />
    <me-popup ref="betDetailModal" :footer="false" title="投注信息">
      <div class="collection-modal" slot="content">
        <bet-details :detailData="detailData" />
      </div>
    </me-popup>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { MessageBox } from 'mint-ui';
import MeHead from '@/components/head';
import Nav from './nav/index';
import Scroll from '@/components/scroll';
import HistoryList from './history-list/index';
import { showToast } from '@/service/helper';
import Req from '@/api/request';
import MePopup from '@/components/popup';
import BetDetails from '../bet-details';
import UserService from '@/service/user';

export default {
  name: 'history',
  components: {
    MeHead,
    Nav,
    Scroll,
    HistoryList,
    MePopup,
    BetDetails,
  },
  data() {
    return {
      guessDataList: [],
      recordDataList: [],
      listType: 'GuessList',
      list: [],
      isLoadMore: true,
      page: 1,
      detailData: {},
      activeClass: 0,
    };
  },
  created() {
    this.$nextTick(() => {
      this.$loading.show({ el: '.list-body' });
      this.getOrderRecord(1, '否');
    });
  },
  computed: {
    ...mapState({
      isPC: state => state.isPC,
    }),
  },
  methods: {
    getOrderRecord(page, status) {
      this.isLoadMore = true;
      return Req.getOrderRecord(page, status)
        .then((data) => {
          if (page === 1) {
            this.guessDataList = [];
            this.recordDataList = [];
          }
          if (!data.status) {
            showToast(data.error);
          }
          if (status === '是') {
            data.result.forEach((element) => {
              Object.assign(element, {
                colorClass: this.setColor(element.profit_amount * 1),
                isShowDelete: false,
              });
              this.recordDataList.push(element);
            });
          }
          if (status === '否') {
            data.result.forEach((item) => {
              Object.assign(item, { isShowDelete: true });
              this.guessDataList.push(item);
            });
          }
          this.$loading.hide();
          this.$RefreshButton.hide();
          return Promise.resolve(data.result);
        })
        .catch(() => {
          this.$loading.hide();
          showToast('网络异常，请刷新');
          this.$nextTick(() => {
            this.$RefreshButton.show({ el: '.list-body' });
          });
        });
    },
    setColor(count) {
      if (count > 0) {
        return 'green';
      }
      if (count < 0) {
        return 'red';
      }
      if (count === 0) {
        return 'gray';
      }
      return null;
    },
    loading() {
      this.$nextTick(() => {
        this.$loading.show({ el: '.list-body' });
      });
    },
    showDetail(data) {
      this.detailData = data;
      this.$refs.betDetailModal.show();
    },
    onDeleteOrder(order_id) {
      if (this.$root.isPC) {
        const flag = window.confirm('确认撤销该订单？');
        if (flag) {
          this.deleteOrderApi(order_id);
        }
      } else {
        MessageBox.confirm('确认撤销该订单？')
          .then(() => {
            this.deleteOrderApi(order_id);
          });
      }
    },
    deleteOrderApi(order_id) {
      Req.deleteOrder(order_id)
        .then(({ status, result, error }) => {
          if (status) {
            showToast(result);
            UserService.updateUserInfo();
            this.getOrderRecord(1, '否');
            this.getOrderRecord(1, '是');
          } else {
            showToast(error);
          }
        })
        .catch(() => {
          showToast('网络异常，请稍后');
        });
    },
    changeNav(data) {
      this.activeClass = data.index;
      this.listType = data.name;
      this.loading();
      this.$refs.historyList.$data.isAddData = true;
      this.$refs.historyList.resetPage();
      switch (data.index) {
        case 1:
          this.getOrderRecord(1, '是');
          break;
        case 2:
          this.getOrderRecord(1, '是');
          this.getOrderRecord(1, '否');
          break;
        default:
          this.getOrderRecord(1, '否');
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";

$w: 100%;
$h: 100%;

.history-body {
  width: $w;
  height: $h;
}

.loading-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: px2rem(50px);

  .loading {
    height: inherit;
  }
}
</style>
