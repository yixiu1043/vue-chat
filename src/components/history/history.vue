<template>
  <div :class="[{ pc: $root.isPC }, 'history']">
    <Tables
      class="unbill-table"
      :table="unbillTable"
      @on-delete="onDeleteOrder"
    />
    <Tables
      class="bill-table"
      :table="billedTable"
      @on-page-change="onPageChange"
    />
  </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
import Tables from './table';
import { showToast } from '@/service/helper';
import Req from '@/api/request';
import UserService from '@/service/user';

export default {
  components: { Tables },
  data() {
    return {
      billedTable: {
        type: 'billed',
        title: '今日投注',
        data: [],
      },
      unbillTable: {
        type: 'unbill',
        title: '未结算投注',
        data: [],
      },
    };
  },
  methods: {
    init() {
      return Promise.all([
        this.getOrderRecord(1, '否'),
        this.getOrderRecord(1, '是'),
      ]);
    },
    getOrderRecord(page, status) {
      this.$loading.show({ el: '.bill-table' });
      return Req.getOrderRecord(page, status)
        .then(({ result }) => {
          if (status === '是') {
            this.billedTable.data = result;
          }
          if (status === '否') {
            this.unbillTable.data = result;
          }
          this.$loading.hide();
          return Promise.resolve(result);
        })
        .catch(() => {
          showToast('网络异常，请稍后');
        });
    },
    onPageChange(page) {
      this.getOrderRecord(page, '是');
    },
    onDeleteOrder(order_id) {
      MessageBox.confirm('确认撤销该订单？')
        .then(() => {
          Req.deleteOrder(order_id)
            .then(({ status, result, error }) => {
              if (status) {
                showToast(result);
                const index = this.unbillTable.data.findIndex(item => item.order_id === order_id);
                this.unbillTable.data.splice(index, 1);
                UserService.updateUserInfo();
              } else {
                showToast(error);
              }
            })
            .catch(() => {
              showToast('网络异常，请稍后');
            });
        });
    },
  },
};
</script>

<style>
.history {
  width: 100%;
  height: 100%;
  overflow: scroll;
}

.history.pc {
  width: 100%;
  overflow: scroll;
}
</style>
