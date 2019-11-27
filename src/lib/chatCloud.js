import './chatLib';
import io from 'socket.io-client';

const WS = 'https://lt.318app.com';

const { chatLib } = window;
export default class ChatCloudService {
  static start(userId, name, avatar, token) {
    chatLib.start(io, WS, {
      userId,
      name,
      avatar,
      token
    });
  }

  static close() {
    chatLib.close();
  }

  static messageReceiver(callback) {
    chatLib.messageReceiver((data) => {
      callback(data);
    });
  }

  static multiTerminalLogin(callback) {
    chatLib.multiTerminalLogin((result) => {
      callback(result);
    });
  }

  static joinRoom(roomId, callback) {
    chatLib.joinRoom(roomId, (data) => {
      callback(data);
    });
  }

  static leaveRoom(roomId, callback) {
    chatLib.leaveRoom(roomId, (data) => {
      callback(data);
    });
  }

  static sendMessage(content, callback) {
    const {
      msg, msgType,
    } = content;
    chatLib.sendMessage(msgType, msg, (data) => {
      callback(data);
    });
  }

  static login(callback) {
    chatLib.login((data) => {
      callback(data);
    });
  }

  static reconnect(callback) {
    chatLib.reconnect(callback);
  }
}
