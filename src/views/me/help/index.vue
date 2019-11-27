<template>
  <div class="help">
    <iframe :src="globalConfig.help_url" class="iframe" @load="loaded"></iframe>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { showLoading, hideLoading } from '@/service/helper';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      globalConfig: state => state.globalConfig,
    }),
  },
  created() {
    showLoading('加载中，请稍后');
  },
  methods: {
    loaded() {
      hideLoading();
    },
  },
};
</script>
<style lang="scss" scoped>
.help {
  width: 100%;
  height: 100%;

  .iframe {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
