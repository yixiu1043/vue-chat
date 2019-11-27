"use strict";

function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties (target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass (Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty (obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ChatLib =
  /*#__PURE__*/
  function () {
    function ChatLib () {
      _classCallCheck(this, ChatLib);

      _defineProperty(this, "token", null);

      _defineProperty(this, "socket", null);

      _defineProperty(this, "host", null);

      _defineProperty(this, "io", null);

      _defineProperty(this, "option", null);
    }

    _createClass(ChatLib, [{
      key: "start",

      /**
       * 数据返回格式：
       * {
       *     data:{} || null,
       *     msg:"string",
       *     status:1
       * }
       * 10000    错误，方法不可调用
       * 1001     错误，token验证失败
       */

      /**
       * 连接websocket
       * @param io Socket.IO client 对象
       * @param requestUrl 请求地址
       * @param queryParams //{key:value}形式穿参
       */
      value: function start (io, requestUrl, queryParams) {
        this.host = requestUrl;
        this.io = io;
        this.option = queryParams;
        this.socket = io(this.host, {
          transports: ['websocket'],
          query: queryParams
        });
      }
      /**
       * 登录成功
       * @param callback
       */

    }, {
      key: "login",
      value: function login (callback) {
        var _this = this;

        this.socket.on('login', function (data) {
          _this.token = data.data.token;
          callback(data);
        });
      }
      /**
       * 接收消息
       * @param callback
       */

    }, {
      key: "messageReceiver",
      value: function messageReceiver (callback) {
        this.socket.on('message', function (data) {
          callback(data);
        });
      }
      /**
       * 多端登录
       * @param callback
       */

    }, {
      key: "multiTerminalLogin",
      value: function multiTerminalLogin (callback) {
        this.socket.on('multi_terminal_login', function (data) {
          callback(data);
        });
      }
      /**
       * 傳送訊息
       * @param msgType   消息类型
       * @param msg       消息内容
       * @param callback
       */

    }, {
      key: "sendMessage",
      value: function sendMessage (msgType, msg, callback) {
        this.socket.emit('message', {
          token: this.token,
          msgType: msgType,
          msg: msg,
          sentTime: Date.now()
        });
        var currentUser = '';
        this.socket.on('message', function (data) {
          var sentUser = data.sentUser;

          if (currentUser !== sentUser) {
            callback(data);
          }

          currentUser = sentUser;
        });
      }
      /**
       * 加入房间
       * @param room      房间id
       * @param callback
       */

    }, {
      key: "joinRoom",
      value: function joinRoom (room, callback) {
        this.socket.emit('joinRoom', {
          token: this.token,
          room: room
        });
        this.socket.on('joinRoom', function (data) {
          callback(data);
        });
      }
      /**
       * 离开房间
       * @param room      房间id
       * @param callback
       */

    }, {
      key: "leaveRoom",
      value: function leaveRoom (room, callback) {
        this.socket.emit('leaveRoom', {
          token: this.token,
          room: room
        });
        this.socket.on('leaveRoom', function (data) {
          callback(data);
        });
      }
      /**
       * 关闭连接
       */

    }, {
      key: "close",
      value: function close () {
        this.socket.close();
      }
      /**
       * 重连
       * @param callback
       */

    }, {
      key: "reconnect",
      value: function reconnect (callback) {
        this.socket.close();
        this.socket = this.io(this.host, this.option);
        this.socket.on('connect', function () {
          callback();
        });
      }
    }]);

    return ChatLib;
  }();

window.chatLib = new ChatLib();
