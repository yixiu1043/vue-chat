/* eslint-disable no-param-reassign */
import LoadingTemplate from './loading.vue';

const loadingPlungin = {};

loadingPlungin.install = (Vue, options) => {
  const Loading = Vue.extend(LoadingTemplate);

  const instance = new Loading();

  const loadingVM = instance.$mount().$el;

  Vue.prototype.$loading = {
    show(option) {
      // 不指定父元素的情况下，默认以body为父元素
      option = option || {};
      option.el = option.el || 'body';
      option.title = option.title || '';
      option.color = option.color || '';
      option.size = option.size || 'large';
      const parent = document.querySelector(option.el);
      parent.appendChild(loadingVM);
      parent.style.position = 'relative';
      instance.isShow = true;
      instance.color = option.color;
      instance.title = option.title;
      instance.size = option.size;
    },
    hide(option) {
      instance.isShow = false;
    },
  };
};

export default loadingPlungin;
