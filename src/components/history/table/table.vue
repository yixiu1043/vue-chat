<template>
  <table :class="[{ pc: $root.isPC }, 'table bt bl bb']">
    <caption class="title bb">
      <span>{{ table.title }}</span>
    </caption>
    <thead>
      <tr class="stripe">
        <th class="br">期号</th>
        <th class="br">彩种</th>
        <th class="br">玩法</th>
        <th class="br">内容</th>
        <th class="br">金额</th>
        <th class="br">时间</th>
        <th class="br" v-if="table.type === 'unbill'">操作</th>
        <th class="br" v-if="table.type === 'billed'">结果</th>
      </tr>
    </thead>
    <tbody v-if="table.data.length" key="有下注记录">
      <tr
        v-for="(item, i) in table.data"
        :key="item.order_id"
        :class="{ stripe: i % 2 === 1 }"
      >
        <td class="bt br">{{ item.issue_no | slice(3) }}</td>
        <td class="bt br">{{ item.lottery_name }}</td>
        <td class="bt br">{{ item.play_name }}</td>
        <td
          class="bt br text-ellipsis blue-font"
          @click="showBetDetails(item.bet_number)"
        >
          {{ item.bet_number }}
        </td>
        <td class="bt br">{{ item.bet_amount }}</td>
        <td class="bt br">{{ item.order_time | slice(8) }}</td>
        <td
          class="bt br red-font"
          v-if="table.type === 'unbill'"
          @click="deleteOrder(item.order_id)"
        >
          撤销
        </td>
        <td
          class="bt br"
          v-if="table.type === 'billed'"
          :class="item.profit_amount | className"
        >
          {{ item.profit_amount }}
        </td>
      </tr>
    </tbody>
    <tbody class="red-font no-data" v-else key="无下注记录">
      <tr class="bt br">
        <td>暂无记录</td>
      </tr>
    </tbody>
    <tfoot class="bt" v-if="table.type === 'billed'">
      <tr>
        <td
          :class="{
            active: activeIndex == index,
            hidden: table.data.length <= 0 && index === 2
          }"
          v-for="(item, index) in pageList"
          :key="index"
          @click="changePage($event, index)"
          v-preventReClick="2000"
        >
          {{ item }}
        </td>
      </tr>
    </tfoot>
  </table>
</template>
<script>
import { showToast } from '@/service/helper';

export default {
  props: {
    table: {
      type: Object,
      required: true,
      default: () => {
      },
    },
  },
  data() {
    return {
      activeIndex: 0,
      pageList: ['首页', '上一页', '下一页'],
      page: 1,
    };
  },
  filters: {
    slice(str, num) {
      return str.substring(str.length - num);
    },
    className(amount) {
      if (amount > 0) {
        return 'green-font';
      }
      if (amount < 0) {
        return 'red-font';
      }
      if (amount === 0) {
        return 'gray-font';
      }
      return '';
    },
  },
  methods: {
    showBetDetails(content) {
      showToast(content, '', 'toast-middle');
    },
    deleteOrder(order_id) {
      this.$emit('on-delete', order_id);
    },
    changePage(event, index) {
      if (event.target.disabled) {
        showToast('点击太频繁了');
        return;
      }
      this.activeIndex = index;
      if (index === 0) {
        this.page = 1;
      }
      if (index === 1) {
        this.page -= 1;
        if (this.page <= 1) {
          this.page = 1;
        }
      }
      if (index === 2) {
        this.page += 1;
      }
      this.$emit('on-page-change', this.page);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
@import "./index.scss";
@import "./index-pc.scss";

$first: px2rem(30px);
$sixth: px2rem(30px);

.center {
  justify-content: center;
  align-items: center;
  text-align: center;
  height: px2rem(25px);
  line-height: px2rem(25px);
}

tr.stripe {
  background: $table_stripe;
}
</style>
