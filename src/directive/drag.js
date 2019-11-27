import Vue from 'vue';

Vue.directive('drag', {
  inserted(el) {
    el.onmousedown = (e) => {
      // const disx = e.pageX - el.offsetLeft;
      const disy = e.pageY - el.offsetTop;
      el.onmousemove = (e) => {
        // el.style.left = `${e.pageX - disx}px`;
        let offsetTop = e.pageY - disy;
        if (offsetTop <= 50) {
          offsetTop = 50;
        }
        if (offsetTop >= e.clientY) {
          offsetTop = e.clientY;
        }
        el.style.top = `${offsetTop}px`;
      };
      document.onmouseup = () => {
        document.onmousemove = document.onmouseup = null;
      };
    };
  },
});
