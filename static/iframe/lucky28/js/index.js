//按下试玩按钮
function mDown (t) {
  $("#tryBtn").css("transform", "scale(0.8)")
}
//松开试玩按钮
function mUp (t) {
  $("#tryBtn").css("transform", "scale(1)")
}
//使开奖的位置上移
function add (t) {
  $("#kaiUl").find("li").css("margin-top", t + "px")
}
//使开奖的位置下移
function sub (t) {
  $("#kaiUl").find("li").css("margin-top", -t + "px")
}
//渲染头部三个中奖号码
//t [1,2,3],数组，中奖号码；
function headCode (t) {
  $(".numShow").empty();
  var n = t, e = "";
  $(n).each(function () {
    e += "<li>" + ("" == this ? 0 : this) + "</li>"
  }),
    $(".numShow").append(e)
}
//渲染中间三个中奖号码
function kaiCode (t) {
  $("#kaiUl").find("li").empty();
  var n = t,
    e = "";
  $("#kaiUl").find("li").each(function (t) {
    e = "<span class='num" + ("" == n[t] ? 0 : n[t]) + "'></span>",
      $(this).append(e)
  })
}
//添加类名 动画，停止动画
function defCode (t) {
  $("#kaiUl").find("li").empty();
  var n = t, e = "";
  $("#kaiUl").find("li").each(function (t) {
    e = "<span class='rotOnce num" + n[t] + "'></span>",
      $(this).append(e)
  })
}
//试玩一次动画，去掉了
function tryStopAnimate (t) {
  // bgMusic();
  pcEgg.bressBG();
  kaiCode(t);
  setTimeout(function () {
    defCode(pcEgg.getKaiCode());
    setTimeout(function () {
      pcEgg.floatFun();
      isTry = !1
    }, 3e3)
  }, 3e3)
}

//停止动画
//t:中奖号码，数组；
function stopAnimate (t) {
  clearInterval(animateId.chgRoateNum);
  // bgMusic();
  pcEgg.bressBG();
  defCode(t);
  $("#hourtxt").show();
  $("#opening").hide();
  setTimeout(function () {
    pcEgg.floatFun();
    isTry = !1
  }, 3e3)
}

//背景音乐，去掉了
function bgMusic () {
  audioType = "b";
  pcEgg.sound.play("audioidBg");
  pcEgg.sound.stop("audioidKai");
}
//开始音乐，去掉了
function kaiMusic () {
  audioType = "r";
  pcEgg.sound.play("audioidKai");
  pcEgg.sound.stop("audioidBg");
}
//创造一个随机数
function createNum (t, n) {
  var e = n - t, i = Math.random();
  return t + Math.round(i * e)
}

var pcEgg = {},
  isTry = !1,
  ifopen = !1,
  audioType = "b",
  animateId = {},
  timer = null;

//按钮事件，去掉
$(function () {
  $(".loading").fadeOut(1e3, function () { });
  $("#soundBth").on("click", function () {
    // "soundsOn" == $("#soundBth").attr("class") ? ($("#soundBth").removeClass("soundsOn").addClass("soundsOff"), pcEgg.sound.stop("audioidKai"), pcEgg.sound.stop("audioidBg")) : ($("#soundBth").removeClass("soundsOff").addClass("soundsOn"), "b" == audioType ? (pcEgg.sound.play("audioidBg"), pcEgg.sound.stop("audioidKai")) : (pcEgg.sound.play("audioidKai"), pcEgg.sound.stop("audioidBg")))
  });
  $("#tryBtn").on("click", function () {
    // if (isTry) return $(".jzCheck").show(),
    //   setTimeout(function () {
    //     $(".jzCheck").hide()
    //   }, 1e3);
    // !1;
    // isTry = !0;
    // pcEgg.tryKaiFun();
  })
});
//开始视频，无；
pcEgg.startVid = function (t) {
  pcEgg.bressBG();
  $("#hourtxt").show();
  $("#opening").hide();
  // bgMusic(),
  pcEgg.Data(t);
  pcEgg.floatFun();
};

function cutTimeNumber (str) {
  let num = str.substring(str.length - 3);
  if (num.substring(0, 1) == '0') {
    if (num.substring(1, 1) == '0') {
      return num.substring(2) * 1;
    }
    return num.substring(1) * 1;
  } else {
    return num * 1;
  }
}
//入口函数
var flag1 = null;
var flag2 = null;
pcEgg.stopVid = function (animateData) {
  let flag = getData('upLotteryData');
  let arr = null;
  if (flag && flag.type == 'lucky28' && cutTimeNumber(flag.time) + 1 >= cutTimeNumber(getData('animationData').periodicalTime)) {
    flag1 = false;
    arr = strToArr(flag.upLottery);
  } else {
    flag1 = true;
    arr = animateData.numArr;
  }
  // kaiCode(arr)
  stopAnimate(arr);
  $("#hourtxt").show();
  $("#opening").hide();
  pcEgg.Data(animateData);
  isTry = !1
};
//判断是否有中奖号码
function testLotteryNumber (lotteryNumber) {
  if (lotteryNumber.length == 0) {
    return false;
  }
  return true;
}
//初始数据
//t:所有数据；
pcEgg.Data = function (t) {
  $("#nextIssue").text(t.nextIssue);//下一奖期
  // $("#drawTime").text(t.drawTime.split(" ")[1]);//下一期开奖时间
  if (testLotteryNumber(t.numArr)) {
    //有奖号
    headCode(t.numArr);//注入头部中奖号码
    kaiCode(t.numArr);//注入动画开奖号码
    flag2 = false;
  } else {
    //无奖号
    flag2 = true;
    let title = ['请', '稍', '候'];
    headCode(title);//注入头部中奖号码
    // kaiCode(['请', '稍', '后']);//注入动画开奖号码
    if (flag2 && flag1) {
      // $("#kaiUl").find("li").each(function (index) {
      //   $(this).text(t.nextLotteryNumber.split(',')[index]);
      // })
      place(t.nextLotteryNumber);
    }
  }
  pcEgg.cutTime(t);//注入数据模型
  // pcEgg.cutTime(pcEgg.getSecond(t.drawTime) - pcEgg.getSecond(t.serverTime));//注入倒计时
};
//显示内容函数
function place (arr) {
  $("#kaiUl").find("li").each(function (index) {
    $(this).text(arr.split(',')[index]);
  })
}

//开始让中间号码下移动画
pcEgg.floatFun = function () {
  var t = 0;
  animateId.floatInt = setInterval(function () {
    sub();
    (t += 1) >= 0 && t <= 20 ? (add(t), 20 == t && (t = -20)) : sub(t);
  }, 50)
};

//清除定时器
pcEgg.clearFloatint = function () {
  clearInterval(animateId.floatInt)
};

//开始动画
pcEgg.startRoate = function (data) {
  let numArr = data.numArr;
  let stopTimer = null;
  clearTimeout(stopTimer);
  kaiCode(pcEgg.createArr());
  // kaiMusic();
  pcEgg.bressBG();//灯光背景变化
  animateId.chgRoateNum = setInterval(function () {
    kaiCode(pcEgg.createArr());
    $("#kaiUl").find("li").find("span").addClass("Rotation");//添加类名动画
  }, 300);
  stopTimer = setTimeout(function () {
    stopAnimate(numArr);
    clearTimeout(stopTimer);
  }, data.animationDuration);
};

//停止动画
pcEgg.stopRoate = function () {
  clearInterval(animateId.chgRoateNum);
  $("#kaiUl").find("li").find("span").removeClass("Rotation");//移除类名动画
};

//试玩一下开奖，去掉了
pcEgg.tryKaiFun = function () {
  void 0 != animateId.floatInt && clearInterval(animateId.floatInt);
  setTimeout(function () {
    pcEgg.startRoate();
    setTimeout(function () {
      var t = pcEgg.createArr();
      pcEgg.stopRoate();
      tryStopAnimate(t);
    }, 4e3)
  }, 1e3)
};

//获取开奖号码
pcEgg.getKaiCode = function () {
  var t = [];
  $("#kaiNum").find("li").each(function () {
    t.push($(this).text())
  });
  return t
};
// //计算倒计时时间；
// pcEgg.getSecond = function (t) {
//   console.log(t);
//   var n = t.split(" ")[1].split(":");
//   let e = n[0], i = n[1], a = n[2];
//   let o = 3600 * (e = e < 10 ? e.substring(e.length - 1, e.length) : e) + 60 * (i = i < 10 ? i.substring(i.length - 1, i.length) : i) + 1 * (a = a < 10 ? a.substring(a.length - 1, a.length) : a);
//   return o;
// };

//倒计时
//data:所有数据
//t:倒计时时间，单位秒
pcEgg.cutTime = function (data) {
  if (testLotteryNumber(data.numArr)) {
    //有奖号
    haveLotteryAnimateFormat(data);
  } else {
    //无奖号
    noLotteryFormatAnimate(data);
  }
};

//有奖格式动画，直接倒计时
function haveLotteryAnimateFormat (data) {
  null != timer && clearInterval(timer);
  let t = data.marketCountDownTime
  timer = setInterval(function () {
    if (t >= 1) {
      t -= 1;
      var e = Math.floor(t / 3600), i = Math.floor(t / 60 % 60), a = Math.floor(t % 60), o = "";
      if (o = (e < 10 ? "0" + e : e) + " : ", o = o + "" + (i < 10 ? "0" + i : i) + " : " + (a < 10 ? "0" + a : a), $("#hourtxt").text(o), t < 10) {
        var s = $(".linelist").find("li");
        $(s).eq(t).addClass("redli");
      }
    } else {
      clearInterval(timer);
      $("#hourtxt").hide();
      $("#opening").css("display", "block");
      clearInterval(animateId.floatInt);
      pcEgg.startRoate(data);//开始动画
      //从新开始请求数据
      // setTimeout(pubmethod.doAjax(n.issue, n.lotCode, n.type, !1), "500")
    }
  }, 1e3)
}
//无奖格式动画，倒计时完后进入封盘时间
function noLotteryFormatAnimate (data) {
  null != timer && clearInterval(timer);
  let t = data.marketCountDownTime//售卖时间
  let lockCountDownTime = data.lockCountDownTime;//封盘时间倒计时，单位s
  timer = setInterval(function () {
    t -= 1;
    let num = t + lockCountDownTime;//总时间
    if (t >= 0) {
      changeTime(t);
    } else if (num < lockCountDownTime && num >= 0) {
      changeTime(num);
      $(".init").css("display", "block");//封盘出现
      place('请, 稍, 候');
    } else {
      place('请, 稍, 候');
      $(".init").css("display", "block");//封盘出现
    }
  }, 1e3)
}
//改变时间
function changeTime (t) {
  var e = Math.floor(t / 3600), i = Math.floor(t / 60 % 60), a = Math.floor(t % 60), o = "";
  if (o = (e < 10 ? "0" + e : e) + " : ", o = o + "" + (i < 10 ? "0" + i : i) + " : " + (a < 10 ? "0" + a : a), $("#hourtxt").text(o), t < 10) {
    var s = $(".linelist").find("li");
    $(s).eq(t).addClass("redli");
  }
}


//清除定时器；
pcEgg.clearTime = function () {
  clearInterval(timer)
};

//开始播放音乐和禁止播放音乐
pcEgg.sound = {
  play: function (t) {
    // "soundsOn" == $("#soundBth").attr("class") && document.getElementById(t).play()
  },
  stop: function (t) {
    // document.getElementById(t).pause()
  }
};
//随机创造一个数组,让中间显示开奖号码的动画的时候，显示不同的数组切换；
pcEgg.createArr = function () {
  for (var t = [], n = 0; n < 3; n++) {
    var e = createNum(0, 9);
    if (0 != n) for (var i = 0, a = t.length - 1; i < t.length; i++) {
      if (e == t[i]) {
        n--;
        break
      }
      if (i == a) {
        t.push(e);
        break
      }
    } else t.push(e)
  }
  return t
};

//中间中奖号码动画时的灯光变化
pcEgg.bressBG = function (t) {
  var n = 1, e = !1;
  void 0 != animateId.bressBG && clearInterval(animateId.bressBG);
  void 0 == t && (t = 80);
  var i = setInterval(function () {
    $("#light").find("li").stop().animate({
      opacity: "0." + n
    }, t);
    e ? (n -= 1) < 1 && (e = !1) : (n += 1) > 8 && (e = !0);
  }, t);
  animateId.bressBG = i
};

pcEgg.pcFillData = function (t, n, e) {
  $("#nextIssue").text(t);
  // $("#drawTime").text(n);
  headCode(e);
};