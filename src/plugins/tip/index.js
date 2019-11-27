/* eslint-disable no-param-reassign */
import TipTemplate from './tip.vue';

const Tip = {};

let tipTimer = null;

// 默认配置
const defaultOption = {
  type: 'top',
  duration: '1500',
  width: '100%',
};

Tip.install = (Vue, options) => {
  const TipTmp = Vue.extend(TipTemplate);

  const tipInstance = new TipTmp();

  const tipVM = tipInstance.$mount().$el;

  document.body.appendChild(tipVM);

  /**
   * tip方法
   * @param {string} text 提示文本
   * @param {object|string} config 配置参数
   */
  Vue.prototype.$tip = (text, config) => {
    const option = {};
    Object.assign(option, defaultOption, options);

    if (config instanceof Object && !Array.isArray(config)) {
      Object.assign(option, config);
    }

    if (typeof config === 'string' && config) {
      option.type = config;
    }

    if (tipTimer) {
      clearTimeout(tipTimer);
      tipInstance.show = false;
    }

    tipInstance.show = true;
    tipInstance.text = text;
    tipInstance.type = option.type;
    tipInstance.width = option.width;
    if (option.type === 'bottom') {
      tipInstance.className = 'slideInUp';
    }
    if (option.type === 'top') {
      tipInstance.className = 'slideInDown';
    }
    if (this.type === 'center') {
      tipInstance.className = 'fadeIn';
    }

    tipTimer = setTimeout(() => {
      tipInstance.className = 'fadeOut';
      tipInstance.show = false;
    }, option.duration);
  };

  ['bottom', 'center', 'top'].forEach((type) => {
    Vue.prototype.$tip[type] = (text, config = { type }) => Vue.prototype.$tip(text, config);
  });
};

export default Tip;
