<template>
  <div :class="[{ pc: $root.isPC }, 'un-ban']">
    <div class="title bt bl br" v-if="!$root.isPC">
      <span>禁言黑名单列表</span>
    </div>
    <table class="un-ban-table bt bl bb">
      <thead>
        <tr class="stripe">
          <th class="br">用户</th>
          <!-- <th class="br">封禁时间</th> -->
          <th class="br">操作</th>
        </tr>
      </thead>
      <tbody class="bb" v-if="blackList.length">
        <tr
          v-for="(item, i) in blackList"
          :key="i"
          :class="{ stripe: i % 2 === 1 }"
        >
          <td class="bt br">{{ item.nick_name }}</td>
          <!-- <td class="bt br">{{ item.time }}</td> -->
          <td
            class="bt br"
            @click="unBanUser(item.encryt_user_id, item.nick_name)"
          >
            <span>解禁</span>
          </td>
        </tr>
      </tbody>
      <tbody class="no-data bt" v-else>
        <tr>
          <span>暂无数据</span>
        </tr>
      </tbody>
      <tfoot class="bt">
        <tr>
          <td
            :class="{
              active: activeIndex == index,
              hidden: blackList.length <= 0 && index === 2
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
  </div>
</template>
<script>
import { showToast } from '@/service/helper';

export default {
  props: {
    blackList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeIndex: 0,
      pageList: ['首页', '上一页', '下一页'],
      page: 1,
    };
  },
  methods: {
    unBanUser(userId, nickname) {
      this.$emit('un-ban', userId, nickname);
    },
    changePage(event, index) {
      if (event.target.disabled) {
        showToast('点击太频繁了');
        return;
      }
      this.activeIndex = index;
      if (index === 0) {
        this.page = 0;
      }
      if (index === 1) {
        this.page -= 1;
        if (this.page <= 0) {
          this.page = 0;
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

$second: px2rem(170px);

.center {
  height: px2rem(25px);
  line-height: px2rem(25px);
  text-align: center;
  justify-content: center;
  align-items: center;
}
.center-pc {
  height: 25px;
  line-height: 25px;
  text-align: center;
  justify-content: center;
  align-items: center;
}

tr.stripe {
  background: $table_stripe;
}

.un-ban {
  width: 100%;
  margin-top: px2rem(10px);
  overflow: scroll;
  background-color: $table_bg;
  .title {
    @extend .center;

    font-size: px2rem(12px);
  }
  table {
    display: flex;
    flex-direction: column;
    font-size: px2rem(10px);

    thead tr {
      display: flex;

      @extend .center;

      th:first-child {
        flex: 1;
      }

      th:nth-child(2) {
        width: $second;
      }

      th:last-child {
        flex: 1;
      }
    }

    tbody tr {
      display: flex;

      @extend .center;

      background-color: $table_bg;

      td:first-child {
        flex: 1;
      }

      td:nth-child(2) {
        width: $second;
      }

      td:last-child {
        flex: 1;
        color: $red;
      }
    }

    tbody.no-data tr {
      height: px2rem(35px);
      line-height: px2rem(35px);
    }

    tfoot tr {
      display: flex;
      padding: px2rem(10px) 0;

      @extend .center;

      td {
        width: px2rem(50px);
        height: px2rem(25px);
        margin-left: px2rem(5px);
        font-size: px2rem(12px);
        line-height: px2rem(25px);
        background-color: #e8eaec;
        border-radius: px2rem(3px);
      }

      td.active {
        background-color: $red;
      }

      td.hidden {
        display: none;
      }
    }
  }
}

.un-ban.pc {
  width: 100%;
  margin-top: 10px;
  overflow: scroll;
  background-color: $table_bg;
  .title {
    @extend .center-pc;

    font-size: 12px;
  }
  table {
    display: flex;
    flex-direction: column;
    font-size: 10px;

    thead tr {
      display: flex;

      @extend .center-pc;

      th:first-child {
        flex: 1;
      }

      th:nth-child(2) {
        width: $second;
      }

      th:last-child {
        flex: 1;
      }
    }

    tbody tr {
      display: flex;

      @extend .center-pc;

      background-color: $table_bg;

      td:first-child {
        flex: 1;
      }

      td:nth-child(2) {
        width: $second;
      }

      td:last-child {
        flex: 1;
        color: $red;
      }
    }

    tbody.no-data tr {
      height: 35px;
      line-height: 35px;
    }

    tfoot tr {
      display: flex;
      padding: 10px 0;
      @extend .center-pc;

      td {
        width: 50px;
        height: 25px;
        margin-left: 5px;
        font-size: 12px;
        line-height: 25px;
        background-color: #e8eaec;
        border-radius: 3px;
      }

      td.active {
        background-color: $red;
      }

      td.hidden {
        display: none;
      }
    }
  }
}
</style>
