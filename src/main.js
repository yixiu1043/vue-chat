import Vue from 'vue';
import MintUI from 'mint-ui';
import dayjs from 'dayjs';
import axios from 'axios';
import App from './app.vue';
import router from './router';
import store from './store';
import Loading from '@/plugins/loading';
import Tip from '@/plugins/tip';
import mixins from '@/mixins/root';
import { isPC } from '@/lib/device';
import '@/directive';
import './lib/font-awesome';
import 'mint-ui/lib/style.css';
import FAB from '@/components/fab/fab';
import FABItem from '@/components/fab/fab-item';
import FABCantainer from '@/components/fab/fab-cantainer';
import RefreshButton from './plugins/refreshButton';

Vue.prototype.$day = dayjs;
Vue.prototype.$axios = axios;

Vue.use(MintUI);
Vue.use(Loading);
Vue.use(Tip);
Vue.use(RefreshButton);

Vue.component(FAB.name, FAB);
Vue.component(FABItem.name, FABItem);
Vue.component(FABCantainer.name, FABCantainer);
Vue.config.productionTip = false;

// 設置平台
store.commit('SET_PC', isPC());

const vm = new Vue({
  el: '#app',
  router,
  store,
  mixins: [mixins],
  render: h => h(App),
});

export default vm;
