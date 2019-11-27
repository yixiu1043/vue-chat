import Req from '@/api/request';
import store from '../store';
import UserService from './user';
import LegacyService from './legacy';
import ChatService from './chat';
import { appConfig } from '@/config';
import { hideLoading, showLoading, showToast } from './helper';
import {
  lotteryService as regularAccountant,
  pk10Service, k3Service, pceggService,
} from './accountant';

export default class LotteryService {
  /**
   * 获取彩票列表
   * @param lotteryId
   * @returns {Promise<AxiosPromise<any> | never>}
   */
  static getLotteryList() {
    return Req.getLotteryList()
      .then(({ result }) => {
        const lotteryList = LotteryService.getLotteryWhiteList(result);
        store.commit('SET_LOTTERY_LIST', lotteryList);
      })
      .catch(() => {
        showToast('网络异常');
        setTimeout(() => {
          LotteryService.getLotteryList();
        }, 1000);
      });
  }

  /**
   * 取得最新一筆下注資訊
   * @param lotteryId
   * @returns {Promise<AxiosPromise<any> | never>}
   */
  static getCurrentLotteryInfo = lotteryId => (
    Req.getCurrentLotteryInfo(lotteryId)
      .then((data) => {
        // token過期強制登出
        if (!data.status) {
          UserService.forceLogout();
          return false;
        }

        return data;
      })
  );

  /**
   * 新增下注
   * @param data
   * @returns {Promise<any | never | never>}
   */
  static addOrder = (data) => {
    showLoading('投注中...');
    return Req.addOrder(LotteryService.makeOrderData(data))
      .then((res) => {
        hideLoading();
        if (!res.status) {
          showToast(res.error);
          return false;
        }
        showToast(res.result);
        UserService.updateUserInfo();
        return true;
      });
  };

  /**
   * 獲取下注訊息字串
   * @param gameType
   * @param playType
   * @param betList
   * @param amount
   * @returns {string} 猜冠亚军/冠军:123|亚军:78/100
   */
  static getAddOrderMessage(gameName, issue, gameType, playType, betList, amount) {
    const { name, keys } = LotteryService.getPlayObject(gameType, playType);
    let str = '';
    if (keys && keys.length > 0) {
      keys.forEach((k, i) => {
        const key = Object.keys(k)[0];
        const value = betList[i];
        if (String(value)) {
          str += `${key}:${value}|`;
        }
      });
      str = str.substring(0, str.length - 1);
    }
    return `${gameName}/${issue}/${name}/${str}/${amount}`;
  }

  static getPlayObject(gameType, playType) {
    const keyboard = require('json-loader!yaml-loader!../yml/keyboard.yml');
    let obj = '';
    keyboard.game_type.forEach((game) => {
      if (game.type === gameType) {
        game.bet_type.forEach((bet) => {
          bet.play.forEach((play) => {
            if (play.rule_id === playType) {
              obj = play;
            }
          });
          return null;
        });
      }
    });
    return obj;
  }

  /**
   * 檢測並整理下注資料
   * @param data
   * @returns {*}
   */
  static makeOrderData = data => ({
    bet_content: data.bet_content,
    bet_count: data.bet_count ? String(data.bet_count) : '',
    issue_no: data.issue_no ? String(data.issue_no) : '',
    lottery_id: data.lottery_id ? String(data.lottery_id) : '',
    play_type_id: data.play_type_id ? String(data.play_type_id) : '',
    unit_price: data.unit_price ? String(data.unit_price) : '',
  });

  /**
   * 計算pk10類的下注數
   * @param betList
   * @param betType
   */
  static pk10BetCounter = (betList, betType, betAmount) => {
    const totalArray = JSON.parse(JSON.stringify(
      betList,
    ));

    betList.forEach((betArray, index) => {
      totalArray[index] = betArray.map(
        bet => regularAccountant.makeBetItem(betType, bet, betAmount),
      );
    });

    return pk10Service.formatBetContent(betType, totalArray);
  };

  /**
   * 計算k3類的下注數
   * @param betList
   * @param betType
   */
  static k3BetCounter = (betList, betType, betAmount) => {
    const totalArray = JSON.parse(JSON.stringify(
      betList,
    ));

    betList.forEach((betArray, index) => {
      totalArray[index] = betArray.map(
        bet => regularAccountant.makeBetItem(betType, bet, betAmount),
      );
    });

    return k3Service.formatBetContent(betType, totalArray);
  };

  /**
   * 計算pcdd類的下注數
   * @param betList
   * @param betType
   */
  static pcddBetCounter = (betList, betType, betAmount) => {
    const totalArray = JSON.parse(JSON.stringify(
      betList,
    ));

    betList.forEach((betArray, index) => {
      totalArray[index] = betArray.map(
        bet => regularAccountant.makeBetItem(betType, bet, betAmount),
      );
    });
    return pceggService.formatBetContent(betType, totalArray[0]);
  };

  /**
   * 計算時時採類的注數
   * @param betList
   * @param gameType
   * @param betType
   * @param playType
   * @param gameName
   * @param betName
   * @param playName
   * @param betAmount
   * @returns {*|*|*|*|*|*|*}
   */
  static sscBetCounter = (betList, gameType, betType, playType, gameName, betName, playName, betAmount) => {
    const totalArray = JSON.parse(JSON.stringify(
      betList,
    ));

    betList.forEach((betArray, index) => {
      totalArray[index] = betArray.map(
        bet => regularAccountant.makeBetItem(betType, bet, betAmount),
      );
    });

    // 取出玩法配置
    const playConfig = require('json-loader!yaml-loader!../yml/play.yml');
    const {
      playMatchType,
      playDigitPanel,
      selectedRegex,
      betContentKey,
    } = playConfig[gameName][betName][playName];

    // 组装传给formatBetContent方法的betContent的参数数据
    const betContent = {};
    betContentKey.forEach((item, index) => {
      betContent[item] = [...betList[index]];
    });

    // NOTE formatBetContent传参的问题，要和阿亮沟通
    return regularAccountant.formatBetContent(
      1,
      betType,
      playType,
      playName,
      playMatchType,
      playDigitPanel,
      selectedRegex,
      betAmount,
      betContent,
    );
  };

  /**
     * 獲取彩票白名單
     * @param list
     */
  static getLotteryWhiteList = (list) => {
    // 白名單顯示彩種： 重慶時時彩。幸運飛艇，北京pk10，广西快三，分分彩,五分彩
    const whiteList = appConfig.lotteryWhiteList;
    const lotteryList = [];
    whiteList.forEach((id) => {
      list.forEach((res) => {
        if (id === res.lottery_id) {
          lotteryList.push(res);
        }
      });
    });
    return lotteryList;
  };

  /**
   * 通过下注字串进行下注
   * @param {*} text
   */
  static betByMessage(text) {
    // 猜冠亚军/冠军:123|亚军:78/100
    if (!(/\/+/.test(text))) {
      throw new Error('不包含1个 / ');
    }

    if (!(/:{1}/.test(text))) {
      throw new Error('不包含1个 : ');
    }

    const [gameName, issue, playName, betStr, betAmount] = text.split('/');
    const {
      game_type, bet_type, play_type,
      game_name, bet_name, play_name,
      ballKeys,
    } = LotteryService.getPlayConfigByBetMsg(gameName, playName);

    const betList = LotteryService.getBetListByBetMsg(betStr, ballKeys);

    const resultInfo = LotteryService.betCounter(
      game_type, bet_type, play_type, betList, game_name, bet_name, play_name, +betAmount,
    );

    const { betCount, postContent, playType } = resultInfo;
    return LotteryService.addOrderByBetMsg(
      issue, game_name, game_type, playType,
      postContent, +betAmount, betCount, text,
    );
  }

  /**
   * 解析下注字符串转换成betList
   * @param {*} betStr
   */
  static getBetListByBetMsg(betStr, ballKeys) {
    // ['冠军:123','亚军:78']
    const betList = [];
    const playList = betStr.split('|');
    ballKeys.forEach((ball, index) => {
      betList[index] = [];
      playList.forEach((play) => {
        const [key, value] = play.split(':'); // ['冠军','1,2,3']
        if (!value) {
          throw new Error('解析冒号错误');
        }
        if (Object.keys(ball)[0] === key) {
          const bet = value.split(','); // [1, 2, 3]
          betList[index] = bet;
        }
      });
    });
    return betList;
  }

  /**
   * 解析下注字符串获取bet_type_id , play_type_id和玩法配置
   * @param {*} keyboardData
   * @param {*} playName
   */
  static getPlayConfigByBetMsg(gameName, playName) {
    // 从keyboardData取出玩法配置 [ {冠军: [] },{ 亚军: [] }]
    const keyboard = require('json-loader!yaml-loader!../yml/keyboard.yml');
    let [game_type, game_name, bet_type, play_type, bet_name, play_name, ballKeys] = ['', '', '', '', '', '', ''];

    keyboard.game_type.forEach((game) => {
      if (game.name === gameName) {
        game_type = game.type;
        game_name = game.name;
        game.bet_type.forEach((bet) => {
          bet.play.forEach((play) => {
            if (play.name === playName) {
              bet_type = bet.type;
              bet_name = bet.name;
              play_type = play.rule_id;
              play_name = play.name;
              ballKeys = play.keys;
            }
          });
        });
      }
    });

    return {
      game_type,
      bet_type,
      play_type,
      game_name,
      bet_name,
      play_name,
      ballKeys,
    };
  }

  /**
   * 获得下注结果
   * @param {*} gameType
   * @param {*} betType
   * @param {*} playType
   * @param {*} betList
   * @param {*} gameName
   * @param {*} betName
   * @param {*} playName
   * @param {*} betAmount
   */
  static betCounter(gameType, betType, playType, betList, gameName, betName, playName, betAmount) {
    let resultInfo = {};
    switch (gameType) {
      case 1:
      case 13:
      case 17:
        // 計算出下注結果
        // NOTE LegacyService用来转换playType与手机app一致，做向下兼容的
        resultInfo = LegacyService.filter(
          gameType,
          playType,
          LotteryService.sscBetCounter(
            betList,
            gameType,
            betType,
            playType,
            gameName,
            betName,
            playName,
            betAmount,
          ),
        );
        break;
      case 20:
        resultInfo = LegacyService.filter(
          gameType,
          playType,
          LotteryService.pk10BetCounter(
            betList,
            betType,
            betAmount,
          ),
        );
        break;
      case 21:
        resultInfo = LegacyService.filter(
          gameType,
          playType,
          LotteryService.k3BetCounter(
            betList,
            betType,
            betAmount,
          ),
        );
        break;
      case 28:
        resultInfo = LegacyService.filter(
          gameType,
          playType,
          LotteryService.pk10BetCounter(
            betList,
            betType,
            betAmount,
          ),
        );
        break;
      case 19:
        resultInfo = LegacyService.filter(
          gameType,
          playType,
          LotteryService.pcddBetCounter(
            betList,
            betType,
            betAmount,
          ),
        );
        break;
      default:
        break;
    }

    return resultInfo;
  }

  /**
   * 发送下注字符串进行投注
   * @param {*} issue
   * @param {*} gameType
   * @param {*} playType
   * @param {*} postContent
   * @param {*} betAmount
   * @param {*} betCount
   * @param {*} betList
   * @param {*} totalAmount
   */
  static addOrderByBetMsg(issue, gameName, gameType, playType, postContent, betAmount, betCount, betMessage) {
    return LotteryService.addOrder({
      issue_no: issue,
      lottery_id: gameType,
      play_type_id: playType,
      bet_content: postContent,
      unit_price: betAmount,
      bet_count: betCount,
    })
      .then((result) => {
        if (result) {
          const { avatar, nick_name } = store.state.userInfo;
          const betSuccessMsg = LotteryService.transformBetMessage(betMessage);

          // 向聊天室发送广播消息
          ChatService.sendPersonMessage({
            msgType: 'user_bet',
            msg: betMessage,
            avatar,
            sentUser: nick_name,
          }, () => {
            // 向聊天室发送投注成功消息，本人可见
            ChatService.sendPrivateMessage('bet', betSuccessMsg, appConfig.systemAvatar, '系统消息');
          });
        }
      });
  }

  /**
   * 转换下注字串成下注成功格式的字串
   * @param {*} betMessage
   * @param {*} totalAmount
   * @returns
   */
  static transformBetMessage(betMessage) {
    const [gameName, issue, play_name, betStr, totalAmount] = betMessage.split('/');
    const betItem = betStr.replace(/:/g, '：').split('|');
    // 组装消息格式
    let msg = '恭喜您，投注成功！\n';
    msg += `彩种：${gameName}\n`;
    msg += `期号：${issue}\n`;
    msg += `金额：${totalAmount}\n`;
    msg += `玩法：${play_name}\n`;
    betItem.forEach((item) => {
      msg += `${item}\n`;
    });

    return msg;
  }
}
