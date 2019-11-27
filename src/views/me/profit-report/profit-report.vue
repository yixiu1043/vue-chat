<template>
  <div :class="[{ pc: $root.isPC }, 'profit']">
    <me-head title="盈亏报表"> </me-head>
    <main class="content-box">
      <ul class="content">
        <li>
          <p>
            <span>账号: </span>
            <span class="text-ellipsis"> {{ userInfo.user_id || "" }}</span>
          </p>
          <date-picker
            v-model="date"
            value-type="format"
            @change="onDateChange"
            :clearable="false"
            :editable="false"
            width="150"
          ></date-picker>
        </li>
        <li>
          <span>充值:</span>
          <span>{{ betData.deposit_amount || 0 }}</span>
        </li>
        <li>
          <span>现提:</span>
          <span>{{ betData.withdrawal_amount || 0 }}</span>
        </li>
        <li>
          <span>投注:</span>
          <span>{{ betData.bet_amount || 0 }}</span>
        </li>
        <li>
          <span>中奖:</span>
          <span>{{ betData.win_amount || 0 }}</span>
        </li>
        <li>
          <span>返点:</span>
          <span>{{ betData.commission_amount || 0 }}</span>
        </li>
        <li>
          <span>彩金:</span>
          <span>{{ betData.caijin_amount || 0 }}</span>
        </li>
      </ul>
    </main>
  </div>
</template>
<script>
import DatePicker from 'vue2-datepicker';
import MeHead from '@/components/head';
import { showToast } from '@/service/helper';
import Req from '@/api/request';

export default {
  name: 'profit-report',
  components: {
    MeHead,
    DatePicker,
  },
  data() {
    return {
      date: '',
      betData: {},
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  created() {
    this.$nextTick(() => {
      this.date = this.$day().format('YYYY-MM-DD');
      this.getMoneyReportByDate(this.date);
    });
  },
  methods: {
    onDateChange(date) {
      this.getMoneyReportByDate(date);
    },
    getMoneyReportByDate(date) {
      this.$loading.show({ el: '.content-box', size: 'medium' });
      const { user_id } = this.userInfo;
      Req.getMoneyReport({ user_id, date })
        .then(({ status, result, error }) => {
          if (status) {
            this.betData = { ...result };
          } else {
            showToast(error);
          }
          this.$loading.hide();
          this.$RefreshButton.hide();
        })
        .catch(() => {
          this.$loading.hide();
          showToast('网络异常，请刷新');
          this.$nextTick(() => {
            this.$RefreshButton.show({ el: '.content-box' });
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
@import "@/styles/class.scss";
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}

.profit {
  .content-box {
    padding: 0 px2rem(20px);

    .content {
      /deep/.mx-input {
        box-shadow: unset;
        border: none;
      }

      li {
        font-size: px2rem(16px);
        border-bottom: 1px solid $border_color;
        line-height: 50px;

        span:nth-child(2) {
          margin-left: px2rem(5px);
        }
      }
      li:nth-child(1) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .text-ellipsis {
          display: inline-block;
          width: px2rem(80px);
          vertical-align: top;
        }
      }
    }
  }
}

.profit.pc {
  .content-box {
    padding: 0 20px;

    .content {
      /deep/.mx-input {
        box-shadow: unset;
        border: none;
        cursor: pointer;
      }

      li {
        line-height: 50px;
        font-size: 16px;
        border-bottom: 1px solid $border_color;

        span:nth-child(2) {
          margin-left: 5px;
        }
      }

      li:nth-child(1) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .text-ellipsis {
          display: inline-block;
          width: 80px;
          vertical-align: top;
        }
      }
    }
  }
}
</style>
