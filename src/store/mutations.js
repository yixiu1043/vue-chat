/* eslint-disable no-param-reassign */
import * as types from './mutation-types';

const mutations = {
  [types.SET_LOGIN](state, isLogged) {
    state.isLogged = isLogged;
  },
  [types.SET_TOKEN](state, token) {
    state.token = token;
  },
  [types.ADD_CHAT_LIST](state, chatDetails) {
    state.chatList.push(chatDetails);
  },
  [types.SET_CHAT_LIST](state, list) {
    state.chatList = list;
  },
  [types.SET_CHATCLOUD_CONNECT](state, bool) {
    state.isChatCloudConnected = bool;
  },
  [types.SET_LOTTERY_LAST_OPEN](state, { type, issue, openNumber }) {
    state.lotteryLastOpen = { type, issue, openNumber };
  },
  [types.UPDATE_USER_INFO](state, userInfo) {
    state.userInfo = userInfo;
  },
  [types.SET_LOTTERY_LIST](state, list) {
    state.lotteryList = [...list];
  },
  [types.SET_CHATROOM_LIST](state, list) {
    state.chatRoomList = [...list];
  },
  [types.SET_CHATROOM_USER_NUMS](state, count) {
    state.userTotalNums = count;
  },
  [types.SET_DOMAIN_SETTING](state, obj) {
    state.domainSetting = obj;
  },
  [types.SET_GLOBAL_CONFIG](state, obj) {
    state.globalConfig = obj;
  },
  [types.SET_PC](state, isPc) {
    state.isPC = isPc;
  },
  [types.SET_LOTTERY_INFO](state, lotteryInfo) {
    state.lotteryInfo = { ...lotteryInfo };
  },
  [types.SET_SEND_CHAT_TIME](state, sendChatTime) {
    state.sendChatTime = { ...sendChatTime };
  },
};

export default mutations;
