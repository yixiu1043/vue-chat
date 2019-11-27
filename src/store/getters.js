const getters = {
  getChatList: (state) => {
    if (state.chatList.length > 50) {
      const list = state.chatList;
      list.shift();
      return list;
    }
    return state.chatList;
  },
};

export default getters;
