import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';
import store from '@/store';
import { showToast } from '@/service/helper';
import UserStorage from '@/storage/user';
import SettingService from '@/service/setting';
import SettingStorage from '@/storage/setting';
import UserService from '@/service/user';

Vue.use(Router);

const router = new Router({
  routes,
  mode: 'hash',
});

// 登录和注册页路由的name
const signRoutes = ['login', 'register', 'login-pc', 'register-pc'];

router.beforeEach((to, from, next) => {
  const token = UserStorage.getToken();

  if (!token && !signRoutes.includes(to.name)) {
    // 未登录且要跳转的页面不是登录页/注册页
    showToast('请先登入');
    if (store.state.isPC) {
      next({ name: 'login-pc' });
      return;
    }
    next({ name: 'login' });
  } else if (!token && signRoutes.includes(to.name)) {
    // 未登陆且要跳转的页面是登录页/注册页
    next();
  } else if (token && signRoutes.includes(to.name)) {
    // 已登录且要跳转的页面是登录页/注册页
    if (store.state.isPC) {
      next({ name: 'chatroom-pc' });
      return;
    }
    next({ name: 'hall' });
  } else {
    // 已登录且要跳转的页面不是登录页/注册页

    // TODO 從api檢查有無過期，更新會員資料
    store.commit('SET_TOKEN', token);
    store.commit('SET_LOGIN', true);

    if (!SettingStorage.getDomain()) {
      SettingService.getDomainSetting()
        .then(() => next());
    }

    // 如果本地無使用者資料，則從遠端獲取
    if (!UserStorage.getUserInfo()) {
      if (!store.state.isPC) {
        UserStorage.setToken('');
        next({ name: 'login' });
      }
    }

    if (store.state.isPC && to.name !== 'chatroom-pc' && !to.path.includes('404')) {
      if (to.name === 'chatroom') {
        const { roomId, roomName } = UserService.doRedirect();
        const ChatroomInof = {
          roomId,
          roomName,
          user_id: UserStorage.getUserInfo().user_id,
        };
        UserStorage.setChatroomInof(ChatroomInof);
        next({
          name: 'chatroom-pc',
          query: {
            roomId,
            roomName,
          },
        });
        return;
      }
      next('/404');
    } else if (!store.state.isPC && to.name !== 'chatroom' && !to.path.includes('404')) {
      if (to.name === 'chatroom-pc') {
        const { roomId, roomName } = UserService.doRedirect();
        next({
          name: 'chatroom',
          query: {
            roomId,
            roomName,
          },
        });
        return;
      }
      next();
    } else {
      next();
    }
  }
});
window.onblur = () => {
  document.title = '凤凰国际欢迎您';
};

router.afterEach((to) => {
  window.scrollTo(0, 0);
  window.document.title = to.meta.title;
  window.onfocus = () => {
    document.title = to.meta.title;
  };
});

export default router;
