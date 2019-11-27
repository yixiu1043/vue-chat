/**
 * 為了向下相容舊版api的格式轉換方法
 */
export default class LegacyService {
  /**
   * 將postContent包裝成舊api能支持的格式
   * @param gameType
   * @param playType
   * @param resultInfo
   * @returns {*}
   */
  static filter = (gameType, playType, resultInfo) => {
    if (!resultInfo.postContent) {
      return false;
    }
    const temp = { ...resultInfo };
    switch (gameType) {
      case 1:
      case 13:
      case 17:
        // eslint-disable-next-line no-case-declarations
        const postContent = JSON.parse(resultInfo.postContent).bet_content;
        temp.playType = LegacyService.sscLegacyBetContent(playType, postContent).playType;
        temp.postContent = LegacyService.sscLegacyBetContent(playType, postContent).postContent;
        return temp;
      case 20:
        temp.playType = playType;
        temp.postContent = JSON.parse(resultInfo.postContent).bet_content;
        return temp;
      case 21:
        temp.playType = LegacyService.k3LegacyBetContent(playType, resultInfo.postContent).playType;
        temp.postContent = LegacyService.k3LegacyBetContent(playType, resultInfo.postContent).postContent;
        return temp;
      case 28:
        temp.playType = playType;
        temp.postContent = JSON.parse(resultInfo.postContent).bet_content;
        return temp;
      case 19:
        temp.playType = LegacyService.pcddLegacyBetContent(playType, resultInfo.postContent).playType;
        temp.postContent = LegacyService.pcddLegacyBetContent(playType, resultInfo.postContent).postContent;
        return temp;
      default:
        temp.playType = playType;
        temp.postContent = resultInfo.postContent;
        return temp;
    }
  }

  /**
   * pc蛋蛋下注格式轉換向下相容
   * @param playType
   * @param postContent
   * @returns {null}
   */
  static k3LegacyBetContent = (playType, postContent) => {
    const obj = {};
    switch (playType) {
      case 1:
        obj.postContent = postContent;
        obj.playType = playType;
        return obj;
      default:
        obj.postContent = postContent;
        obj.playType = playType;
        return obj;
    }
  }

  /**
   * 時時彩注格式轉換向下相容
   * @param playType
   * @param postContent
   * @returns {null}
   */
  static sscLegacyBetContent = (playType, postContent) => {
    const config = {
      29: 79,
      32: 22,
      21: 17,
      23: 15,
      25: 18,
      27: 16,
    };

    const obj = {};
    switch (playType) {
      case 29:
      case 32:
      case 21:
      case 23:
      case 25:
      case 27:
        obj.postContent = postContent.split(' ').join('');
        obj.playType = config[playType];
        return obj;
      default:
        obj.postContent = postContent;
        obj.playType = playType;
        return obj;
    }
  }

  /**
   * 時時彩注格式轉換向下相容
   * @param playType
   * @param postContent
   * @returns {null}
   */
  static pcddLegacyBetContent = (playType, postContent) => {
    const obj = {};
    switch (playType) {
      case 100:
      case 200:
        obj.postContent = postContent;
        obj.playType = 1000;
        return obj;
      default:
        obj.postContent = postContent;
        obj.playType = playType;
        return obj;
    }
  }
}
