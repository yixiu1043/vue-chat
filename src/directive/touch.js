/* eslint-disable no-new */
/* eslint-disable no-underscore-dangle */
/**
 * 处理 移动设备上的 点击、长按、左右上下滑动 事件
 *
 * =========================================
 * 导出了7个自定义指令：
 *  v-tap： tap点击事件
 *  v-swipe： swipe滑动事件
 *  v-swipeleft： swipeleft左滑事件
 *  v-swiperight： swiperight右滑事件
 *  v-swipedown： swipedown下滑
 *  v-swipeup： swipeup上滑
 *  v-longtap： longtap长按
 * =========================================
 *
 * =========================================
 * 包含四个参数
 * stop 阻止冒泡
 * prevent 阻止默认事件
 * self 只当在 event.target 是当前元素自身时触发处理函数
 * once 执行一次后解绑
 *
 * @example v-tap.stop.prevent.self.once
 *
 *事件绑定有两种方式
 * @example
 *  1. v-tap="showDialog" 绑定一个方法对象
 *  2. v-tap="{fn:click123, param1:1, param2:2, param3:{aaa:'123'} ...}"
 *      绑定一个JSON字面量，fn是执行的方法，后边的是需要传递的参数
 *事件回调参数
 * @param 第一个参数是event，事件对象
 * @param 第二个参数是 binding.value，也就是v-tap=""双引号中的部分（
 *         如示例2，第二个参数就是 {fn:click123, param1:1, param2:2, param3:{aaa:'123'} ...}）
 * =========================================
 *
 * @update
 *  1. 根据MUI进行了滑动事件的判断修正
 *  2. 根据TouchEvent修正了点击位置的判断
 *
 */

import Vue from 'vue';

/**
 * vue上点击事件处理类
 */
class VueTouch {
  /**
   * @param el
   * @param binding
   * @param type
   */
  constructor(el, binding, type) {
    const that = this;

    that.obj = el;
    that.binding = binding;
    that.touchType = type;

    that.firstTouchPosition = { x: 0, y: 0 };
    that.firstTouchTime = 0;
    that.callBack = typeof (binding.value) === 'object' ? binding.value.fn : binding.value;

    that.moved = false;
    that.leaved = false;
    that.longTouched = false;

    // 事件监听回调集合
    const _listener = Object.create(null);

    // 事件方法
    const _listen = _type => (e) => {
      const {
        stop, prevent, self, once,
      } = that.binding.modifiers;

      // 配置判断
      if (stop) {
        e.stopPropagation();
      }
      if (prevent) {
        e.preventDefault();
      }
      if (once) {
        that.obj.removeEventListener(`touch${_type}`, _listener[_type]);
      }
      if (self && e.target !== e.currentTarget) {
        return;
      }

      that[_type](e);
    };

    _listener.start = _listen('start');
    _listener.end = _listen('end');
    _listener.move = _listen('move');

    this.obj.addEventListener('touchstart', _listener.start, false);
    this.obj.addEventListener('touchend', _listener.end, false);
    this.obj.addEventListener('touchmove', _listener.move, false);
  }

  start(e) {
    const that = this;

    // 初始化点击状态
    that.moved = false;
    that.leaved = false;
    that.longTouched = false;

    that.firstTouchPosition = that.getMultiCenter(e.changedTouches);
    that.firstTouchTime = e.timeStamp;
    that.timer = setTimeout((() => {
      if (!that.leaved && !that.moved) {
        if (that.touchType === 'longtap') {
          that.callBack(e, that.binding.value);
        }
        that.longTouched = true;
      }
    }), 1000);
  }

  end(e) {
    const that = this;

    const { x, y } = that.getMultiCenter(e.changedTouches);
    const _disX = x - that.firstTouchPosition.x;
    const _disY = y - that.firstTouchPosition.y;
    const _dis = Math.sqrt(_disX * _disX + _disY * _disY);
    const _timeDis = e.timeStamp - that.firstTouchTime;

    clearTimeout(that.timer);

    const _angle = this.getAngle(_disX, _disY);

    if (_dis > 18 && _timeDis < 300) {
      if (that.touchType === 'swipe') {
        that.callBack(e, that.binding.value);
      }
      if (_angle >= 60 && _angle <= 120) {
        if (that.touchType === 'swipedown') {
          that.callBack(e, that.binding.value);
        }
      }
      if (_angle <= -60 && _angle >= -120) {
        if (that.touchType === 'swipeup') {
          that.callBack(e, that.binding.value);
        }
      }
      if (_angle <= 20 && _angle >= -20) {
        if (that.touchType === 'swipeleft') {
          that.callBack(e, that.binding.value);
        }
      }
      if ((_angle <= -160 && _angle > -180) || (_angle >= 160 && _angle <= 180)) {
        if (that.touchType === 'swiperight') {
          that.callBack(e, that.binding.value);
        }
      }
    } else if (!that.longTouched && !that.moved) {
      if (that.touchType === 'tap') {
        that.callBack(that, that.binding.value);
      }
      that.leaved = true;
    }
  }

  move() {
    this.moved = true;
  }

  /**
   * 获取点击集合的中心坐标
   * @param touches touch对象集合
   * @return {{x: number, y: number}}
   */
  getMultiCenter(touches) {
    const that = this;
    let x = 0;
    let y = 0;

    const _length = touches.length;

    for (let i = 0; i < _length; i++) {
      x += touches[i].pageX;
      y += touches[i].pageY;
    }

    return {
      x: Math.round(x / _length),
      y: Math.round(y / _length),
    };
  }

  getAngle(disX, disY) {
    const that = this;

    if (typeof disX !== 'number' || typeof disY !== 'number') { return 45; }

    return Math.atan2(disY, disX) * 180 / Math.PI;
  }
}


Vue.directive('tap', {
  bind(el, binding) {
    new VueTouch(el, binding, 'tap');
  },
});
Vue.directive('swipe', {
  bind(el, binding) {
    new VueTouch(el, binding, 'swipe');
  },
});
Vue.directive('swipeleft', {
  bind(el, binding) {
    new VueTouch(el, binding, 'swipeleft');
  },
});
Vue.directive('swiperight', {
  bind(el, binding) {
    new VueTouch(el, binding, 'swiperight');
  },
});
Vue.directive('swipedown', {
  bind(el, binding) {
    new VueTouch(el, binding, 'swipedown');
  },
});
Vue.directive('swipeup', {
  bind(el, binding) {
    new VueTouch(el, binding, 'swipeup');
  },
});
Vue.directive('longtap', {
  bind(el, binding) {
    new VueTouch(el, binding, 'longtap');
  },
});
