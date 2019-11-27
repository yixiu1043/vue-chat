/* eslint-disable no-param-reassign */
import RefreshButton from './index.vue';

const refreshPlungin = {};

refreshPlungin.install = (Vue, options) => {
  const Refresh = Vue.extend(RefreshButton);

  const RefreshInstance = new Refresh();

  const refreshVM = RefreshInstance.$mount().$el;

  Vue.prototype.$RefreshButton = {
    show(option) {
      // 不指定父元素的情况下，默认以body为父元素
      option = option || {};
      option.el = option.el || 'body';
      option.title = option.title || '';
      option.color = option.color || '';
      option.size = option.size || 'large';
      const parent = document.querySelector(option.el);
      parent.appendChild(refreshVM);
      parent.style.position = 'relative';
      RefreshInstance.isShow = true;
      RefreshInstance.color = option.color;
      RefreshInstance.title = option.title;
      RefreshInstance.size = option.size;
    },
    hide(option) {
      RefreshInstance.isShow = false;
    },
  };
};

export default refreshPlungin;
