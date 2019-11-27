<template>
  <transition name="slide">
    <div :class="[{ pc: $root.isPC }, 'trend-box', 'font-12px']">
      <header>
        <span class="icon-back" @click="goBack" v-if="!$root.isPC">
          <font-awesome-icon icon="chevron-left" />
        </span>
        <div class="select" @click.stop="showPopup">
          <span>{{ lotteryName }}</span>
          <span v-if="!$root.isPC">
            <font-awesome-icon
              icon="angle-down"
              class="game-icon"
              v-if="isShowLottery"
            />
            <font-awesome-icon icon="angle-up" class="game-icon" v-else />
          </span>
        </div>
        <span class="icon-menu" v-if="$root.isPC" @click.stop="showPopup">
          <font-awesome-icon icon="bars" />
        </span>
      </header>
      <main>
        <div class="select-lottery">
          <lottery-select
            :lottery-links="lotteryList"
            ref="lotterySelect"
            @on-change-lottery="changeLottery"
            :position="$root.isPC ? 'right' : 'top'"
          />
        </div>
        <b-scroll ref="scroll" class="b-scroll" :data="trendList.concat([1])">
          <div class="trend font-12px">
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
        </b-scroll>
      </main>
    </div>
  </transition>
</template>
<script>
import Req from '@/api/request';
import BScroll from '@/components/scroll';
import { showToast, getBallColor } from '@/service/helper';
import LotterySelect from '@/components/lottery-select';
import SettingStorage from '@/storage/setting';
import UserService from '@/service/user';
import UserStorage from '@/storage/user';

export default {
  components: {
    BScroll,
    LotterySelect,
  },
  props: {
    lotteryLinks: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      trendList: [],
      lotteryName: '重庆时时彩',
      lotteryType: '1',
      isShowLottery: true,
    };
  },
  computed: {
    lotteryList() {
      if (this.$root.isPC) {
        return this.lotteryLinks;
      }
      return SettingStorage.getLotteryList();
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.getLotteryOpenInfo({ lotteryType: vm.lotteryType });
    });
  },
  methods: {
    goBack() {
      const { roomId, roomName } = UserService.doRedirect();
      UserStorage.setChatroomInof({
        roomId,
        roomName,
        user_id: UserStorage.getUserInfo().user_id,
      });
      this.$router.push({
        name: 'chatroom',
        query: {
          roomId,
          roomName,
        },
      });
    },
    getLotteryOpenInfo({ lotteryType, count = 30 }) {
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
    showPopup() {
      this.isShowLottery = !this.isShowLottery;
      this.$refs.lotterySelect.changeLotteryState();
    },
    changeLottery(lotteryType, lotteryName) {
      this.lotteryName = lotteryName;
      this.getLotteryOpenInfo({
        lotteryType,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/compass.scss";
@import "@/styles/color.scss";
@import "./trend.scss";
@import "./trend-pc.scss";

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(-100%, 0, 0);
}

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
</style>
