<template>
  <me-popup ref="popup" title="禁言黑名单列表" :footer="false">
    <div class="collection-modal" slot="content">
      <UnBan v-on="$listeners" ref="unban" v-bind="$attrs" />
    </div>
  </me-popup>
</template>
<script>
import MePopup from '@/components/popup';
import UnBan from '@/components/un-ban';

export default {
  components: {
    MePopup,
    UnBan,
  },
  methods: {
    show() {
      this.$refs.popup.show();
    },
    hide() {
      this.$refs.popup.hide();
    },
  },

};
</script>
<style lang="scss" scoped>
</style>
