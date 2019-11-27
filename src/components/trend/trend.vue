<template>
  <div :class="[{ pc: $root.isPC }, 'trend', 'font-12px']">
    <table class="bt bl bb">
      <thead>
        <tr class="stripe">
          <th class="br">开奖期号</th>
          <th class="br">开奖号码</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, i) in trendList"
          :key="item.issue_no"
          :class="{ stripe: i % 2 === 1 }"
        >
          <td class="bt br">{{ item.issue_no }}</td>
          <td class="bt br">
            <span
              v-for="(lottery, i) in item.openNumber"
              :key="i"
              :class="[{ pc: $root.isPC }, 'ball', 'user-select-one']"
              :style="{ background: lottery.color }"
              >{{ lottery.number }}</span
            >
          </td>
        </tr>
        <tr class="font-10px bt">
          --- 没有更多数据了 ---
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import Req from '@/api/request';
import { showToast, getBallColor } from '@/service/helper';

export default {
  data() {
    return {
      trendList: [],
    };
  },
  methods: {
    getLotteryOpenInfo({ lotteryType, count }) {
      this.$loading.show({ el: '.trend' });
      Req.getLotteryOpenInfo({ lotteryType, count })
        .then(({ result }) => {
          this.trendList = result;
          this.transformData(result, lotteryType);
          this.$loading.hide();
        }).catch((err) => {
          this.$loading.hide();
          showToast(err.response.message);
        });
    },
    transformData(array, lotteryType) {
      array.forEach((item) => {
        const newItem = item;
        const openNumber = [];
        newItem.open_number.split(',').forEach((num) => {
          const obj = {};
          obj.number = num;
          obj.color = getBallColor(lotteryType, num);
          openNumber.push(obj);
        });
        newItem.openNumber = openNumber;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";

.center {
  height: px2rem(25px);
  line-height: px2rem(25px);
  text-align: center;
  justify-content: center;
  align-items: center;
}

.ball {
  display: inline-block;
  width: px2rem(18px);
  height: px2rem(18px);
  margin: 0 px2rem(2px);
  font-weight: bold;
  line-height: px2rem(18px);
  color: $white;
  vertical-align: middle;
  border-radius: px2rem(2px);
}
.ball.pc {
  display: inline-block;
  width: 22px;
  height: 22px;
  margin: 0 2px;
  font-weight: bold;
  line-height: 22px;
  color: $white;
  vertical-align: middle;
  border-radius: 2px;
}

tr.stripe {
  background: $table_stripe;
}

.trend {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: $primary_white;

  @include prefixer(overflow-scrolling, touch, webkit moz o ms);
  @include prefixer(scroll-behavior, smooth, webkit moz o ms);

  table {
    display: flex;
    flex-direction: column;

    thead tr {
      display: flex;

      @extend .center;

      th:first-child {
        width: px2rem(100px);
      }

      th:last-child {
        flex: auto;
      }
    }

    tbody tr {
      display: flex;

      @extend .center;

      td:first-child {
        width: px2rem(100px);

        span.ball {
          @extend .ball;
        }
      }

      td:last-child {
        flex: auto;
      }
    }
  }
}

.trend.pc {
  font-size: 14px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: $primary_white;

  @include prefixer(overflow-scrolling, touch, webkit moz o ms);
  @include prefixer(scroll-behavior, smooth, webkit moz o ms);

  table {
    display: flex;
    flex-direction: column;

    thead tr {
      display: flex;
      height: 35px;
      line-height: 35px;
      text-align: center;
      justify-content: center;
      align-items: center;

      th:first-child {
        width: 120px;
      }

      th:last-child {
        flex: auto;
      }
    }

    tbody tr {
      display: flex;
      height: 35px;
      line-height: 35px;
      text-align: center;
      justify-content: center;
      align-items: center;

      td:first-child {
        width: 120px;

        span.ball {
          @extend .ball.pc;
        }
      }

      td:last-child {
        flex: auto;
      }
    }
  }
}
</style>
