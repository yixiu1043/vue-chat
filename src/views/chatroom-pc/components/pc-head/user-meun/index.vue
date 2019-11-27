<template>
  <div class="user-meun">
    <span @click="goPage('/login-pc')">登录</span>
    <span @click="goPage('/register-pc')">注册</span>
  </div>
</template>
<script>
export default {
  methods: {
    goPage(path) {
      this.$router.push(path);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/color.scss";

.user-meun {
  float: right;
  padding-right: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;

  span {
    width: 70px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    margin-top: 15px;
    margin-left: 15px;
    margin-right: 10px;
    border-radius: 2px;
    cursor: pointer;
  }

  span:nth-child(1) {
    background-color: $green;
  }

  span:nth-child(2) {
    background-color: $blue;
  }
}
</style>
