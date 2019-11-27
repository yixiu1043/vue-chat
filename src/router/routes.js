import Main from '@/views/main';
import Login from '@/views/user/login';
import Register from '@/views/user/register.vue';
import BetHistory from '@/views/me/bet-history';
import BetDetails from '@/views/me/bet-details';
import MoneyRecord from '@/views/me/money-record';
import ProfitReport from '@/views/me/profit-report';
import Userinfo from '@/views/me/userinfo';
import SecurityCenter from '@/views/me/security-center';
import Bank from '@/views/me/bank';
import BindBankCard from '@/views/me/bind-bank-card';
import Withdraw from '@/views/me/withdraw';
import DownApp from '@/views/me/downapp';
import Discounts from '@/views/me/discounts';
import DiscountDetails from '@/views/me/discount-details';
import Recharge from '@/views/me/recharge';
import Notice from '@/views/me/notice';
// import Trend from '@/views/Trend';
// import Help from '@/views/me/help';
import store from '@/store';
import { isPC } from '@/lib/device';
import { appConfig } from '@/config';

// chatroom pc
import LoginPC from '@/views/chatroom-pc/user/login';
import RegisterPC from '@/views/chatroom-pc/user/register';

export default [
  {
    path: '/',
    component: Main,
    redirect: () => {
      if (isPC()) {
        return {
          name: 'chatroom-pc',
          query: appConfig.defaultRoomInfo,
        };
      }
      return '/hall';
    },
    children: [
      {
        name: 'hall',
        path: 'hall',
        meta: {
          title: '游戏大厅',
        },
        component: () => import('@/views/hall'),
      },
      {
        name: 'me',
        path: 'me',
        meta: {
          title: '个人中心',
        },
        component: () => import('@/views/me'),
      },
    ],
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '用户登录',
    },
    component: Login,
  },
  {
    name: 'register',
    path: '/register',
    meta: {
      title: '用户注册',
    },
    component: Register,
  },
  {
    name: 'login-pc',
    path: '/login-pc',
    meta: {
      title: '用户登录',
    },
    component: LoginPC,
  },
  {
    name: 'register-pc',
    path: '/register-pc',
    meta: {
      title: '用户注册',
    },
    component: RegisterPC,
  },
  {
    name: 'chatroom',
    path: '/chatroom',
    meta: {
      title: '聊天室',
    },
    component: () => import('@/views/chatroom'),
  },
  {
    name: 'money-record',
    path: '/money-record',
    meta: {
      title: '资金明细',
    },
    component: MoneyRecord,
  },
  {
    name: 'bet-history',
    path: '/bet-history',
    meta: {
      title: '投注记录',
    },
    component: BetHistory,
  },
  {
    name: 'bet-details',
    path: '/bet-details',
    meta: {
      title: '投注信息',
    },
    component: BetDetails,
  },
  {
    name: 'profit-report',
    path: '/profit-report',
    meta: {
      title: '盈亏报表',
    },
    component: ProfitReport,
  },
  {
    name: 'userinfo',
    path: '/userinfo',
    meta: {
      title: '用户信息',
    },
    component: Userinfo,
  },
  {
    name: 'security-center',
    path: '/security-center',
    meta: {
      title: '安全中心',
    },
    component: SecurityCenter,
  },
  {
    name: 'bank',
    path: '/bank',
    meta: {
      title: '银行卡管理',
    },
    component: Bank,
  },
  {
    name: 'bind-bank-card',
    path: '/bind-bank-card',
    meta: {
      title: '绑定银行卡',
    },
    component: BindBankCard,
  },
  {
    name: 'withdraw',
    path: '/withdraw',
    meta: {
      title: '提款管理',
    },
    component: Withdraw,
  },
  {
    name: 'downapp',
    path: '/downapp',
    meta: {
      title: '下载APP',
    },
    component: DownApp,
  },
  {
    name: 'discounts',
    path: '/discounts',
    meta: {
      title: '优惠活动',
    },
    component: Discounts,
  },
  {
    name: 'discount-details',
    path: '/discount-details',
    meta: {
      title: '优惠活动详情',
    },
    component: DiscountDetails,
  },
  {
    name: 'recharge',
    path: '/recharge',
    meta: {
      title: '充值中心',
    },
    component: Recharge,
  },
  {
    name: 'notice',
    path: '/notice',
    meta: {
      title: '系统公告',
    },
    component: Notice,
  },
  {
    name: 'chatroom-pc',
    path: '/chatroom-pc',
    meta: {
      title: '聊天室-PC端',
    },
    component: () => import('@/views/chatroom-pc'),
    beforeEnter: (to, from, next) => {
      if (!store.state.isPC) {
        next({
          name: 'chatroom',
          query: appConfig.defaultRoomInfo,
        });
        return;
      }
      next();
    },
  },
  {
    path: '/trend',
    name: 'trend',
    meta: {
      title: '走势',
    },
    component: () => import('@/views/trend'),
  },
  {
    path: '/red-envelope',
    name: 'red-envelope',
    meta: {
      title: '发红包',
    },
    component: () => import('@/views/red-envelope'),
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '404',
    },
    component: () => import('@/views/404/404.vue'),
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      title: '404',
    },
    component: () => import('@/views/404/404.vue'),
  },
];
