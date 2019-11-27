import Vue from 'vue';

Vue.directive('preventReClick', {
  inserted(el, binding) {
    const element = el;
    element.addEventListener('click', () => {
      if (!element.disabled) {
        element.disabled = true;
        setTimeout(() => {
          element.disabled = false;
        }, binding.value || 2000);
      }
    });
  },
});
