/**
 * 排序數字(避免1, 10, 2...等排列)
 * @param {*} first 第一位數
 * @param {*} second 第二位數
 */
function sortNumber(first, second) {
  return first - second;
}

/**
 * ˊ陣列不重複排列組合
 * @param {*} arr 一維陣列
 * @param {*} size 排列個數
 */
function getArrange(arr, size) {
  const result = [];

  function createTree(rootArr, remainArr, sizeCount) {
    if (remainArr.length <= 0 || sizeCount === 0) {
      result.push(rootArr);
      return;
    }
    for (let i = 0; i <= remainArr.length - sizeCount; i += 1) {
      const root = remainArr[i];
      const other = remainArr.slice(i + 1);
      createTree(rootArr.concat(root), other, sizeCount - 1);
    }
  }

  createTree([], arr, size);
  return result;
}

/**
 * 判斷文字為空
 * @param {需判斷文字} str
 */
function isEmpty(str) {
  return (!str || str.length === 0);
}

/**
 * 兩個陣列不重複排列組合
 */
function twoArrayCombinate(firstArray, secondArray) {
  const result = [];
  firstArray.forEach((number) => {
    const filteredItems = secondArray.filter(item => item !== number);
    filteredItems.forEach((item) => {
      result.push(`${number} ${item}`);
    });
  });
  return result;
}

/**
 * 三陣列不重複排列組合
 * @param {*} firstArray
 * @param {*} secondArray
 * @param {*} thirdArray
 */
function threeArrayCombinate(firstArray, secondArray, thirdArray) {
  const result = [];
  const conbinateArray = twoArrayCombinate(firstArray, secondArray);
  conbinateArray.forEach((number) => {
    const filteredItems = thirdArray.filter(item => !number.split(' ').includes(item));
    filteredItems.forEach((item) => {
      result.push(`${number} ${item}`);
    });
  });
  return result;
}

/**
 * 彩種類型
 */
const LotteryClassType = Object.freeze({
  TYPE_SSC: 1,
  TYPE_11X5: 2,
  TYPE_3D: 3,
  TYPE_HK6: 4,
  TYPE_K3: 5,
  TYPE_PCEGG: 6,
  TYPE_PK10: 10,
});

/**
 * 一般彩種投注計算
 */
export const lotteryService = {

  makeBetItem(gameId, bet, amount) {
    return {
      id: gameId,
      name: bet,
      amount,
    };
  },
  /**
   * 重組投注內容
   * @param {*} lotteryClassId 彩種類型ID
   * @param {*} playName 玩法名稱
   * @param {*} playMatchType 玩法類型
   * @param {*} playDigitPanel 玩法位數
   * @param {*} betNumber 投注內容
   * @param {*} selectedRegex 投注內容驗證格式
   */
  formatBetContent(lotteryClassId, betTypeId, playId, playName, playMatchType, playDigitPanel, selectedRegex,
    betUnitAmount, betContent) {
    const formatArray = {
      status: false,
      message: '',
      betCount: 0,
      betTotalAmount: 0,
      betContent: [],
      postContent: '',
    };

    if (playMatchType === '单式' || playMatchType === '混合') {
      if (betContent.trim().length === 0) {
        formatArray.message = '号码输入不为空!';
        return formatArray;
      }
      const strs = betContent.split(/[\s,;\n]+/);
      const arr = [];
      let tmp = '';

      for (let i = 0; i < strs.length; i += 1) {
        if (playMatchType === '混合' && (strs[i] = strs[i].sortAsc()), tmp = strs[i], !eval(`/^${selectedRegex}$/`).test(tmp)) {
          formatArray.message = `第${i + 1}个号码[${tmp}]输入格式错误!`;
          return formatArray;
        }
        let number = '';
        for (let j = 0; j < tmp.length; j += 1) {
          number += tmp[j];
        }
        arr[i] = number;
      }

      formatArray.status = true;
      formatArray.betCount = arr.length;
      formatArray.betUnitAmount = betUnitAmount;
      formatArray.betTotalAmount = parseFloat(betUnitAmount) * arr.length;
      formatArray.betContent = arr;
      formatArray.postContent = JSON.stringify({
        rule_id: playId,
        bet_type_id: betTypeId,
        bet_total_count: arr.length,
        unit_price: betUnitAmount,
        bet_content: arr.join('|'),
      });
      return formatArray;
    }
    let count = 0;
    Object.keys(betContent).forEach((item) => {
      if (betContent[item] !== undefined) {
        count += betContent[item].length;
      }
    });
    if (betContent === undefined || count <= 0) {
      formatArray.message = '号码输入不为空!';
      return formatArray;
    }

    const validationResult = this.validateBetContent(lotteryClassId, playMatchType, playDigitPanel, playName, betContent);
    if (!validationResult.status) {
      formatArray.message = validationResult.message;
      return formatArray;
    }

    let formatNumber = [];
    let postContent = '';
    switch (playMatchType) {
      case '斗牛':
        formatNumber = playName === '牛牛' ? betContent.niuniu : playName === '斗牛大小单双' ? betContent.niuBigOrSmall : '';
        postContent = formatNumber.join('|');
        break;
      case '龙虎':
        formatNumber = betContent.dragonTiger;
        postContent = formatNumber.join('|');
        break;
      default:
        let combinatedNumber = '';
        if (playMatchType === '定位胆') {
          let tenThousand = '';
          let thousand = '';
          let hundred = '';
          let ten = '';
          let unit = '';
          if (betContent.tenThousand !== undefined && betContent.tenThousand.length > 0) {
            tenThousand = ` ${betContent.tenThousand.sort().join(' ')}`;
          }
          if (betContent.thousand !== undefined && betContent.thousand.length > 0) {
            thousand = ` ${betContent.thousand.sort().join(' ')}`;
          }
          if (betContent.hundred !== undefined && betContent.hundred.length > 0) {
            hundred = ` ${betContent.hundred.sort().join(' ')}`;
          }
          if (betContent.ten !== undefined && betContent.ten.length > 0) {
            ten = ` ${betContent.ten.sort().join(' ')}`;
          }
          if (betContent.unit !== undefined && betContent.unit.length > 0) {
            unit = ` ${betContent.unit.sort().join(' ')}`;
          }

          combinatedNumber = `${tenThousand},${thousand},${hundred},${ten},${unit}`;
          formatNumber.push(combinatedNumber);
          postContent = combinatedNumber;
        } else {
          if (playDigitPanel.includes('0')) {
            combinatedNumber = `${betContent.tenThousand.sort().join(' ')}`;
          }
          if (playDigitPanel.includes('1')) {
            if (combinatedNumber) {
              combinatedNumber = `${combinatedNumber},${betContent.thousand.sort().join(' ')}`;
            } else {
              combinatedNumber = `${betContent.thousand.sort().join(' ')}`;
            }
          }
          if (playDigitPanel.includes('2')) {
            if (combinatedNumber) {
              combinatedNumber = `${combinatedNumber},${betContent.hundred.sort().join(' ')}`;
            } else {
              combinatedNumber = `${betContent.hundred.sort().join(' ')}`;
            }
          }
          if (playDigitPanel.includes('3')) {
            if (combinatedNumber) {
              combinatedNumber = `${combinatedNumber},${betContent.ten.sort().join(' ')}`;
            } else {
              combinatedNumber = `${betContent.ten.sort().join(' ')}`;
            }
          }
          if (playDigitPanel.includes('4')) {
            if (combinatedNumber) {
              combinatedNumber = `${combinatedNumber},${betContent.unit.sort().join(' ')}`;
            } else {
              combinatedNumber = `${betContent.unit.sort().join(' ')}`;
            }
          }
          if (playDigitPanel.includes('5')) {
            combinatedNumber = `${betContent.group.sort().join(' ')}`;
          }
          if (playDigitPanel.includes('6')) {
            combinatedNumber = `${betContent.unfixed.sort().join(' ')}`;
          }
          formatNumber.push(combinatedNumber);
          postContent = ` ${formatNumber.join(' ')}`;
        }
        break;
    }
    const betCount = this.calculateBetCount(lotteryClassId, playMatchType, formatNumber);
    formatArray.status = true;
    formatArray.betUnitAmount = parseFloat(betUnitAmount);
    formatArray.betCount = betCount;
    formatArray.betTotalAmount = parseFloat(betUnitAmount) * betCount;
    formatArray.betContent = formatNumber;
    formatArray.postContent = JSON.stringify({
      rule_id: playId,
      bet_type_id: betTypeId,
      bet_total_count: betCount,
      unit_price: parseFloat(betUnitAmount),
      bet_content: postContent,
    });
    return formatArray;
  },

  /**
   * 檢查投注號碼
   * @param {彩種類型ID} lotteryClassId
   * @param {玩法類型} playMatchType
   * @param {玩法位數} playDigitPanel
   * @param {玩法名稱} playName
   * @param {投注內容} betContent
   */
  validateBetContent(lotteryClassId, playMatchType, playDigitPanel, playName, betContent) {
    const formatArray = {
      status: false,
      message: '',
    };

    if (betContent === undefined
      && betContent.tenThousand === undefined
      && betContent.thousand === undefined
      && betContent.hundred === undefined
      && betContent.ten === undefined
      && betContent.unit === undefined
      && betContent.group === undefined
      && betContent.unfixed === undefined
      && betContent.niuniu === undefined
      && betContent.niuBigOrSmall === undefined
      && betContent.dragonTiger === undefined) {
      formatArray.message = '请先选择号码!!';
      return formatArray;
    }

    if (playMatchType === '组六' && betContent.group.length < 3) {
      formatArray.message = '[组六]至少选择3位!';
      return formatArray;
    } if (playMatchType === '组二' && (betContent.group === undefined || betContent.group.length < 2)) {
      formatArray.message = '[组二]至少选择2位!';
      return formatArray;
    } if (playMatchType === '组三') {
      if (betContent.group === undefined) {
        formatArray.message = '[组选]请先选择号码';
        return formatArray;
      } if ((lotteryClassId === LotteryClassType.TYPE_SSC || lotteryClassId === LotteryClassType.TYPE_3D)
        && betContent.group.length < 2) {
        formatArray.message = '[组三]至少选择2位!';
        return formatArray;
      } if (betContent.group.length < 3) {
        formatArray.message = '[组三]至少选择3位!';
        return formatArray;
      }
    } else if (playMatchType !== '定位胆') {
      if (playDigitPanel.includes('0') && (betContent.tenThousand === undefined || betContent.tenThousand.length <= 0)) {
        formatArray.message = '万位号码选择不全!!';
        return formatArray;
      }
      if (playDigitPanel.includes('1') && (betContent.thousand === undefined || betContent.thousand.length <= 0)) {
        formatArray.message = '千位号码选择不全!!';
        return formatArray;
      }
      if (playDigitPanel.includes('2') && (betContent.hundred === undefined || betContent.hundred.length <= 0)) {
        formatArray.message = '百位号码选择不全!!';
        return formatArray;
      }
      if (playDigitPanel.includes('3') && (betContent.ten === undefined || betContent.ten.length <= 0)) {
        formatArray.message = '十位号码选择不全!!';
        return formatArray;
      }
      if (playDigitPanel.includes('4') && (betContent.unit === undefined || betContent.unit.length <= 0)) {
        formatArray.message = '个位号码选择不全!!';
        return formatArray;
      }
      if (playDigitPanel.includes('5') && (betContent.group === undefined || betContent.group.length <= 0)) {
        formatArray.message = '组选号码选择不全!!';
        return formatArray;
      }
      if (playDigitPanel.includes('6') && (betContent.unfixed === undefined || betContent.unfixed.length <= 0)) {
        formatArray.message = '不定位号码选择不全!!';
        return formatArray;
      }
      if (playDigitPanel.includes('7') && playName === '牛牛' && (betContent.niuniu === undefined || betContent.niuniu.length <= 0)) {
        formatArray.message = '牛牛号码选择不全!!';
        return formatArray;
      }
      if (playDigitPanel.includes('8') && playName === '斗牛大小单双' && (betContent.niuBigOrSmall === undefined || betContent.niuBigOrSmall.length <= 0)) {
        formatArray.message = '大小单双号码选择不全!!';
        return formatArray;
      }
      if (playDigitPanel.includes('9') && (betContent.dragonTiger === undefined || betContent.dragonTiger.length <= 0)) {
        formatArray.message = '龙虎和号码选择不全!!';
        return formatArray;
      }
    }

    formatArray.status = true;
    return formatArray;
  },

  /**
   * 計算投注注數
   * @param {*} lotteryClassId 彩種類型ID
   * @param {*} playMatchType 玩法類型
   * @param {*} betNumber 投注號碼
   */
  calculateBetCount(lotteryClassId, playMatchType, betNumber) {
    let count = 0;
    if (lotteryClassId === LotteryClassType.TYPE_SSC || lotteryClassId === LotteryClassType.TYPE_3D) {
      const numberArr = betNumber;
      const digitLength = numberArr[0].split(',');
      switch (playMatchType) {
        case '复式':
          count = digitLength[0].trim().split(/\s+/).length;
          for (let u = 1; u < digitLength.length; u += 1) {
            count *= digitLength[u].trim().split(/\s+/).length;
          }
          break;
        case '不定位':
        case '定位胆':
          for (let u = 0; u < digitLength.length; u += 1) {
            if (digitLength[u].trim().length > 0) {
              count += digitLength[u].trim().split(/\s+/).length;
            }
          }
          break;
        case '组六':
          count = this.computeCombinationsVariations(numberArr[0].trim().split(/\s+/).length, 6) / 6;
          break;
        case '组三':
          count = this.computeCombinationsVariations(numberArr[0].trim().split(/\s+/).length, 3) / 3;
          break;
        case '组二':
          count = this.computeCombinationsVariations(numberArr[0].trim().split(/\s+/).length, 2) / 2;
          break;
        case '混合':
          const { length } = numberArr[0].toArray().distinct().length;
          if (numberArr[0].length === 3) {
            if (length === 3) {
              count = 6;
            } else if (length === 2) {
              count = 3;
            } else if (length === 1) {
              count = 1;
            }
          } else if (numberArr[0].length === 2) {
            if (length === 2) {
              count = 2;
            } else if (length === 1) {
              count = 1;
            }
          }
          break;
        case '斗牛':
        case '龙虎':
          count = numberArr.length;
          break;
        default:
          break;
      }
    }

    if (lotteryClassId === LotteryClassType.TYPE_11X5) {
      const numberArr = betNumber[0].split(',');
      switch (playMatchType) {
        case '复式':
          if (numberArr.length === 1) {
            const r0 = numberArr[0].trim().split(/\s+/);
            count = 0;

            for (let x = 0; x < r0.length; x += 1) {
              count += 1;
            }
          }

          if (numberArr.length === 2) {
            const r0 = numberArr[0].trim().split(/\s+/);
            const r1 = numberArr[1].trim().split(/\s+/);
            count = 0;

            for (let x = 0; x < r0.length; x += 1) {
              for (let y = 0; y < r1.length; y += 1) {
                if (r0[x] !== r1[y]) {
                  count += 1;
                }
              }
            }
          }

          if (numberArr.length === 3) {
            const r0 = numberArr[0].trim().split(/\s+/);
            const r1 = numberArr[1].trim().split(/\s+/);
            const r2 = numberArr[2].trim().split(/\s+/);
            count = 0;

            for (let x = 0; x < r0.length; x += 1) {
              for (let y = 0; y < r1.length; y += 1) {
                for (let z = 0; z < r2.length; z += 1) {
                  if (r0[x] !== r1[y] && r0[x] !== r2[z] && r1[y] !== r2[z]) {
                    count += 1;
                  }
                }
              }
            }
          }
          break;
        case '单式':
          count = 1;
          break;
        case '不定位':
        case '定位胆':
          for (let u = 0; u < numberArr.length; u += 1) {
            if (numberArr[u].trim().length > 0) {
              count += numberArr[u].trim().split(/\s+/).length;
            }
          }
          break;
        case '组三':
          const r0 = numberArr[0].trim().split(/\s+/);
          const r1 = numberArr[0].trim().split(/\s+/);
          const r2 = numberArr[0].trim().split(/\s+/);
          count = 0;

          for (let x = 0; x < r0.length; x += 1) {
            for (let y = x; y < r1.length; y += 1) {
              for (let z = y; z < r2.length; z += 1) {
                if (r0[x] !== r1[y] && r0[x] !== r2[z] && r1[y] !== r2[z]) {
                  count += 1;
                }
              }
            }
          }
          break;
        case '组二':
          const numberArr0 = numberArr[0].trim().split(/\s+/);
          const numberArr1 = numberArr[0].trim().split(/\s+/);
          count = 0;
          for (let x = 0; x < numberArr0.length; x += 1) {
            for (let y = x; y < numberArr1.length; y += 1) {
              if (numberArr0[x] !== numberArr1[y]) {
                count += 1;
              }
            }
          }
          break;
        case '混合':
          const { length } = numberArr[0].toArray().distinct().length;
          if (numberArr[0].length === 3) {
            if (length === 3) {
              count = 6;
            } else if (length === 2) {
              count = 3;
            } else if (length === 1) {
              count = 1;
            }
          } else if (numberArr[0].length === 2) {
            if (length === 2) {
              count = 2;
            } else if (length === 1) {
              count = 1;
            }
          }
          break;
        default:
          break;
      }
    }
    return count;
  },

  /**
   * 計算組選注數
   * @param {*} number 下注號碼
   * @param {*} type 組選類型
   */
  computeCombinationsVariations(number, type) {
    let count = 0;
    if (type === 6) {
      if (number < 3) {
        return 0;
      }
      for (let r = 1; r <= number - 2; r += 1) {
        count += this.getSum(r);
      }
      return count * 6;
    }

    if (type === 3) {
      if (number < 2) {
        return 0;
      }
      count = this.getSum(number - 1) * 6;
    } else if (type === 2) {
      if (number < 2) {
        return 0;
      }
      count = this.getSum(number - 1) * 2;
    } else {
      return 0;
    }
    return count;
  },

  getSum(length) {
    let count = 0;
    for (let index = 1; index <= length; index += 1) {
      count += index;
    }
    return count;
  },
};

/**
 * 快三玩法類型
 */
const K3BetType = Object.freeze({
  SUM: 0,
  TWO_IDENTICAL_SINGLE: 1,
  TWO_IDENTICAL_MULTIPLE: 2,
  TWO_DIFFERENT: 3,
  THREE_DIFFERENT: 4,
  THREE_IDENTICAL_SINGLE: 5,
  THREE_IDENTICAL_ALL: 6,
  THREE_CONTINUOUS_ALL: 7,
});

export const k3Service = {
  /**
   * 計算投注結果
   * 和值: [{id:0,name:號碼,amount:0},{id:0,name:號碼,amount:0},..]
   * 二不同號: [{id:3,name:號碼,amount:0},{id:0,name:號碼,amount:0},..]
   * 三不同號 [{id:4,name:號碼,amount:0},{id:0,name:號碼,amount:0},..]
   * 三同号通选: [{id:6,name:'同号通选',amount:0}]
   * 三连号通选：[{id:7,name:'连号通选',amount:0}]
   * 返回物件{ status: 狀態, message: 錯誤訊息, betCount:注數,
   * betTotalAmount:投注總額, betContent:投注內容, postContent:POST投注格式 }
   * @param {玩法類型ID} betTypeId
   * @param {投注內容} betContent : {id : int, name: name, amount: int}
   */
  formatBetContent(betTypeId, betContent) {
    let formatArray = { status: false, message: '' };
    if (betContent.length <= 0) {
      formatArray.message = '请选择号码！！';
      return formatArray;
    }
    switch (betTypeId) {
      case K3BetType.SUM:
        formatArray = this.getSum(betContent[0]);
        break;
      case K3BetType.TWO_IDENTICAL_SINGLE:
        formatArray = this.getTwoIdenticalSingle(betContent);
        break;
      case K3BetType.TWO_IDENTICAL_MULTIPLE:
        formatArray = this.getTwoIdenticalMultiple(betContent[0]);
        break;
      case K3BetType.TWO_DIFFERENT:
        formatArray = this.getTwoDifferent(betContent[0]);
        break;
      case K3BetType.THREE_DIFFERENT:
        formatArray = this.getThreeDifferent(betContent[0]);
        break;
      case K3BetType.THREE_IDENTICAL_SINGLE:
        formatArray = this.getThreeIdenticalSingle(betContent);
        break;
      case K3BetType.THREE_IDENTICAL_ALL:
        formatArray = this.getThreeIdenticalAll(betContent);
        break;
      case K3BetType.THREE_CONTINUOUS_ALL:
        formatArray = this.getThreeContinuousAll(betContent);
        break;
      default:
        break;
    }
    return formatArray;
  },

  /**
   * 計算和值注數
   * @param {和值玩法} betContent
   */
  getSum(betContent) {
    const formatArray = {
      status: false,
      message: '',
      betCount: 0,
      betTotalAmount: 0,
      betContent: [],
      postContent: '',
    };
    let totalAmount = 0;
    const content = [];
    betContent.forEach((number) => {
      totalAmount += parseInt(number.amount, Number);
      formatArray.betContent.push(`${number.name}:${number.amount}`);
      content.push(number.name);
    });

    if (totalAmount === 0) {
      formatArray.message = '投注发生错误，请重新投注！！';
      return formatArray;
    }

    formatArray.status = true;
    formatArray.betCount = betContent.length;
    formatArray.betTotalAmount = totalAmount;
    formatArray.postContent = `${content.join(' ')}`;
    return formatArray;
  },

  /**
   * 二同號單選
   * @param {和值玩法} betContent
   */
  getTwoIdenticalSingle(betContent) {
    const formatArray = {
      status: false,
      message: '',
      betCount: 0,
      betTotalAmount: 0,
      betContent: [],
      postContent: '',
    };
    if (betContent.length !== 2) {
      formatArray.message = '号码选择不足！！';
      return formatArray;
    }

    if (betContent[0].length <= 0 || betContent[1].length <= 0) {
      formatArray.message = '号码选择不足！！';
      return formatArray;
    }

    const content = [];
    const sameNumberArray = betContent[0];
    const diffNumberArray = betContent[1];
    sameNumberArray.forEach((sameNumber) => {
      diffNumberArray.forEach((diffNumber) => {
        if (sameNumber.name === diffNumber.name) {
          return;
        }
        content.push(`${sameNumber.name}${sameNumber.name}${diffNumber.name}`);
      });
    });
    if (content.length <= 0) {
      formatArray.message = '号码选择不足！！';
      return formatArray;
    }
    const betUnitAmount = parseInt(betContent[0][0].amount, Number);

    formatArray.status = true;
    formatArray.betCount = content.length;
    formatArray.betTotalAmount = betUnitAmount * content.length;
    formatArray.betContent = content;
    formatArray.postContent = `${content.join(' ')}`;
    return formatArray;
  },

  /**
   * 二同號複選
   * @param {和值玩法} betContent
   */
  getTwoIdenticalMultiple(betContent) {
    const formatArray = {
      status: false,
      message: '',
      betCount: 0,
      betTotalAmount: 0,
      betContent: [],
      postContent: '',
    };

    const uniqueBetContent = [...new Set(betContent)];
    if (betContent.length <= 0 || uniqueBetContent.length !== betContent.length) {
      formatArray.message = '投注发生错误，请重新投注！！';
      return formatArray;
    }

    const content = [];
    betContent.forEach((number) => {
      content.push(`${number.name}${number.name}*`);
    });

    const betUnitAmount = parseInt(betContent[0].amount, Number);

    formatArray.status = true;
    formatArray.betCount = content.length;
    formatArray.betTotalAmount = betUnitAmount * content.length;
    formatArray.betContent = content;
    formatArray.postContent = `${content.join(' ')}`;
    return formatArray;
  },

  /**
   * 二不同號玩法
   * @param {投注內容} betContent
   */
  getTwoDifferent(betContent) {
    const formatArray = {
      status: false,
      message: '',
      betCount: 0,
      betTotalAmount: 0,
      betContent: [],
      postContent: '',
    };
    if (betContent.length < 2) {
      formatArray.message = '号码不足2位！！';
      return formatArray;
    }
    const uniqueBetContent = [...new Set(betContent)];
    if (betContent.length <= 0 || uniqueBetContent.length !== betContent.length) {
      formatArray.message = '投注发生错误，请重新投注！！';
      return formatArray;
    }
    const content = [];
    betContent.forEach((number) => {
      content.push(number.name);
    });
    let combinatedNumber = [];
    combinatedNumber = getArrange(content, 2);

    const betUnitAmount = parseInt(betContent[0].amount, Number);

    formatArray.status = true;
    formatArray.betCount = combinatedNumber.length;
    formatArray.betTotalAmount = betUnitAmount * combinatedNumber.length;
    formatArray.betContent = combinatedNumber;
    formatArray.postContent = `${content.join(' ')}`;
    return formatArray;
  },

  /**
   * 三不同號玩法
   * @param {投注內容} betContent
   */
  getThreeDifferent(betContent) {
    const formatArray = {
      status: false,
      message: '',
      betCount: 0,
      betTotalAmount: 0,
      betContent: [],
      postContent: '',
    };
    if (betContent.length < 3) {
      formatArray.message = '号码不足3位！！';
      return formatArray;
    }
    const uniqueBetContent = [...new Set(betContent)];
    if (betContent.length <= 0 || uniqueBetContent.length !== betContent.length) {
      formatArray.message = '投注发生错误，请重新投注！！';
      return formatArray;
    }
    const content = [];
    betContent.forEach((number) => {
      content.push(number.name);
    });
    let combinatedNumber = [];
    combinatedNumber = getArrange(content, 3);

    const betUnitAmount = parseInt(betContent[0].amount, Number);

    formatArray.status = true;
    formatArray.betCount = combinatedNumber.length;
    formatArray.betTotalAmount = betUnitAmount * combinatedNumber.length;
    formatArray.betContent = combinatedNumber;
    formatArray.postContent = `${content.join(' ')}`;
    return formatArray;
  },

  /**
   * 三同號單選
   * @param {和值玩法} betContent
   */
  getThreeIdenticalSingle(betContent) {
    const formatArray = {
      status: false,
      message: '',
      betCount: 0,
      betTotalAmount: 0,
      betContent: [],
      postContent: '',
    };

    const uniqueBetContent = [...new Set(betContent)];
    if (betContent.length <= 0 || uniqueBetContent.length !== betContent.length) {
      formatArray.message = '投注发生错误，请重新投注！！';
      return formatArray;
    }

    const content = [];
    betContent.forEach((number) => {
      content.push(`${number.name}${number.name}${number.name}`);
    });

    const betUnitAmount = parseInt(betContent[0].amount, Number);

    formatArray.status = true;
    formatArray.betCount = content.length;
    formatArray.betTotalAmount = betUnitAmount * content.length;
    formatArray.betContent = content;
    formatArray.postContent = `${content.join(' ')}`;
    return formatArray;
  },

  /**
   * 三同號通選玩法
   * @param {投注內容} betContent
   */
  getThreeIdenticalAll(betContent) {
    const formatArray = {
      status: false,
      message: '',
      betCount: 0,
      betTotalAmount: 0,
      betContent: [],
      postContent: '',
    };
    if (betContent < 1 || betContent > 1) {
      formatArray.message = '号码不足！！';
      return formatArray;
    }

    if (betContent[0].name !== '同号通选') {
      formatArray.message = '号码不正确！！';
      return formatArray;
    }

    const betUnitAmount = parseInt(betContent[0].amount, Number);
    const number = ['111', '222', '333', '444', '555', '666'];
    formatArray.status = true;
    formatArray.betCount = 1;
    formatArray.betTotalAmount = betUnitAmount;
    formatArray.betContent = number;
    formatArray.postContent = `${number.join(',')}`;

    return formatArray;
  },

  /**
   * 三連號通選玩法
   * @param {投注內容} betContent
   */
  getThreeContinuousAll(betContent) {
    const formatArray = {
      status: false,
      message: '',
      betCount: 0,
      betTotalAmount: 0,
      betContent: [],
      postContent: '',
    };
    if (betContent < 1 || betContent > 1) {
      formatArray.message = '号码不足！！';
      return formatArray;
    }

    if (betContent[0].name !== '连号通选') {
      formatArray.message = '号码不正确！！';
      return formatArray;
    }

    const betUnitAmount = parseInt(betContent[0].amount, Number);
    const number = ['123', '234', '345', '456'];
    formatArray.status = true;
    formatArray.betCount = 1;
    formatArray.betTotalAmount = betUnitAmount;
    formatArray.betContent = number;
    formatArray.postContent = `${number.join(',')}`;

    return formatArray;
  },
};

/**
 * 六合彩玩法類型
 */
const HK6BetType = Object.freeze({
  EXTRA: 1000,
  TWO_SIDE: 2000,
  CONTINUOUS_CHIP: 3000,
  ZODIAC: 4000,
  COLOR_BALL: 5000,
  ELEMENT: 6000,
  HEADTOTAIL: 7000,
});

/**
 * 六合彩彩種投注計算
 */
export const hk6Service = {
  /**
   * 組合投注內容
   * @param {*} betTypeId
   * @param {*} bet_id
   * @param {*} betContent
   * 返回物件{betCount:注數,betTotalAmount:投注總額,
   * betContent:投注內容,postContent:POST投注格式}
   */
  formatBetContent(betTypeId, betContent) {
    let formatArray = { status: false, message: '' };
    if (betContent === undefined || betContent.length <= 0) {
      formatArray.message = '请选择号码！！';
      return formatArray;
    }
    switch (betTypeId) {
      case HK6BetType.EXTRA:
        formatArray = this.getExtra(betContent);
        break;
      case HK6BetType.TWO_SIDE:
        formatArray = this.getTwoSide(betContent);
        break;
      case HK6BetType.CONTINUOUS_CHIP:
        formatArray = this.getContinuousChip(betContent);
        break;
      case HK6BetType.ZODIAC:
        formatArray = this.getZodiac(betContent);
        break;
      case HK6BetType.COLOR_BALL:
        formatArray = this.getColorBall(betContent);
        break;
      case HK6BetType.ELEMENT:
        formatArray = this.getElement(betContent);
        break;
      case HK6BetType.HEADTOTAIL:
        formatArray = this.getHeadToTail(betContent);
        break;
      default:
        break;
    }
    return formatArray;
  },

  /**
   * 特碼玩法
   * @param {投注號碼} betContent
   */
  getExtra(betContent) {
    const formatArray = {
      status: false,
      message: '',
      betCount: 0,
      betTotalAmount: 0,
      betContent: [],
      postContent: '',
    };

    let totalAmount = 0;
    const content = [];
    betContent.forEach((item) => {
      totalAmount += parseInt(item.amount, Number);
      content.push(`${item.id}|${item.name}|${item.amount}`);

      formatArray.betContent.push(`号码：${item.name}，投注：${item.amount}元`);
    });

    if (totalAmount === 0) {
      formatArray.message = '投注发生错误，请重新投注！！';
      return formatArray;
    }

    formatArray.status = true;
    formatArray.betCount = betContent.length;
    formatArray.betTotalAmount = totalAmount;
    formatArray.postContent = content.join(',');
    return formatArray;
  },

  /**
   * 兩面玩法
   * @param {投注號碼} betContent
   */
  getTwoSide(betContent) {
    const formatArray = {
      status: false,
      message: '',
      betCount: 0,
      betTotalAmount: 0,
      betContent: [],
      postContent: '',
    };

    let totalAmount = 0;

    const content = [];
    betContent.forEach((item) => {
      totalAmount += parseFloat(item.amount);
      const betId = parseInt(item.id.toString().slice(0, 2), Number);
      let id = '';
      switch (betId) {
        case 27:
          id = '7';
          break;
        case 20:
          id = '0';
          break;
        case 21:
          id = '1';
          break;
        case 22:
          id = '2';
          break;
        case 23:
          id = '3';
          break;
        case 24:
          id = '4';
          break;
        case 25:
          id = '5';
          break;
        case 26:
          id = '6';
          break;
        default:
          formatArray.message = '投注发生错误，请重新投注！！';
          return formatArray;
      }
      content.push(`${id}|${item.id}|${item.amount}`);
      formatArray.betContent.push(`号码：${item.name}，投注：${item.amount}`);
    });

    if (totalAmount === 0) {
      formatArray.message = '投注发生错误，请重新投注！！';
      return formatArray;
    }

    formatArray.status = true;
    formatArray.betCount = betContent.length;
    formatArray.betTotalAmount = totalAmount;
    formatArray.postContent = content.join(',');
    return formatArray;
  },

  /**
   * 連碼玩法
   * @param {投注號碼} betContent
   */
  getContinuousChip(betContent) {
    const formatArray = {
      status: false,
      message: '',
      betCount: 0,
      betTotalAmount: 0,
      betContent: [],
      postContent: '',
    };
    const { length } = betContent;
    if (length <= 0) {
      return { status: false, message: '号码选择不全!!' };
    }
    if (length > 10) {
      return { status: false, message: '最多只能选择10个号码' };
    }
    let combinationNumber = [];
    const { id } = betContent[0];
    switch (id) {
      case 3001:
        if (length < 4) {
          return { status: false, message: '最少选择4个号码' };
        }
        combinationNumber = getArrange(betContent, 4);
        break;
      case 3002:
      case 3003:
        if (length < 3) {
          return { status: false, message: '最少选择3个号码' };
        }
        combinationNumber = getArrange(betContent, 3);
        break;
      case 3004:
      case 3005:
      case 3006:
        if (length < 2) {
          return { status: false, message: '最少选择2个号码' };
        }
        combinationNumber = getArrange(betContent, 2);
        break;
      default:
        break;
    }

    const totalAmount = parseInt(betContent[0].amount, Number) * combinationNumber.length;
    let content = '';
    betContent.forEach((element) => {
      content === '' ? content = `${element.name}` : content = `${content} ${element.name}`;
    });

    if (totalAmount === 0) {
      formatArray.message = '投注发生错误，请重新投注！！';
      return formatArray;
    }
    combinationNumber.forEach((numbers) => {
      const number = [];
      numbers.forEach((item) => {
        number.push(item.name);
      });
      formatArray.betContent.push(number.join(','));
    });
    formatArray.status = true;
    formatArray.betCount = combinationNumber.length;
    formatArray.betTotalAmount = totalAmount;
    formatArray.postContent = `9|${id}|${content}`;
    return formatArray;
  },

  /**
   * 生肖玩法
   * @param {玩法ID} bet_id
   * @param {投注號碼} betContent
   */
  getZodiac(betContent) {
    const formatArray = {
      status: false,
      betCount: 0,
      betTotalAmount: 0,
      betContent: [],
      postContent: '',
    };

    const betId = betContent[0].id;
    const { betName } = betContent[0];
    const content = [];
    switch (betId) {
      case 4100:
      case 4200:
      case 4300:
        const postContent = [];
        betContent.forEach((item) => {
          formatArray.betCount += 1;
          formatArray.betTotalAmount += item.amount;
          content.push(`${item.number} : ${item.amount} 元`);
          postContent.push(`${0}|${item.name}|${item.amount}`);
        });
        formatArray.betContent = content;
        formatArray.postContent = postContent.join(',');
        break;
      case 4400:
        if (betContent.length < 2) {
          return { status: false, message: '至少选择2个生肖' };
        }

        if (betContent.length > 11) {
          return { status: false, message: '最多只能选择11个生肖!' };
        }

        betContent.forEach((item) => {
          formatArray.betContent.push(`${item.name}`);
        });

        formatArray.betCount = 1;
        formatArray.betTotalAmount = parseFloat(betContent[0].amount);
        formatArray.postContent = `${betName}|${betId}|${formatArray.betContent.join(' ')}`;
        break;
      case 4401:
      case 4501:
        if (betContent.length < 2) {
          return { status: false, message: '至少选择2个生肖' };
        }

        if (betContent.length > 6) {
          return { status: false, message: '最多只能选择6个生肖!' };
        }

        betContent.forEach((item) => {
          content.push(`${item.name}`);
        });

        const conbination = getArrange(content, 2);
        formatArray.betContent = conbination.join(' ');
        formatArray.betCount = formatArray.betContent.length;
        formatArray.betTotalAmount = parseFloat(betContent[0].amount) * formatArray.betContent.length;
        formatArray.postContent = `${betName}|${betId}|${content.join(' ')}`;
        break;
      case 4402:
      case 4502:
        if (betContent.length < 3) {
          return { status: false, message: '至少选择3个生肖' };
        }
        if (betContent.length > 6) {
          return { status: false, message: '最多只能选择6个生肖!' };
        }

        betContent.forEach((item) => {
          content.push(`${item.name}`);
        });

        formatArray.betContent = getArrange(content, 3);
        formatArray.betCount = formatArray.betContent.length;
        formatArray.betTotalAmount = parseFloat(betContent[0].amount) * formatArray.betContent.length;
        formatArray.postContent = `${betName}|${betId}|${content.join(' ')}`;
        break;
      case 4403:
      case 4503:
        if (betContent.length < 4) {
          return { status: false, message: '至少选择4个生肖' };
        }
        if (betContent.length > 6) {
          return { status: false, message: '最多只能选择6个生肖!' };
        }
        betContent.forEach((item) => {
          content.push(`${item.name}`);
        });

        formatArray.betContent = getArrange(content, 4);
        formatArray.betCount = formatArray.betContent.length;
        formatArray.betTotalAmount = parseFloat(betContent[0].amount) * formatArray.betContent.length;
        formatArray.postContent = `${betName}|${betId}|${content.join(' ')}`;
        break;
      case 4404:
      case 4504:
        if (betContent.length < 5) {
          return { status: false, message: '至少选择5个生肖' };
        }
        if (betContent.length > 6) {
          return { status: false, message: '最多只能选择6个生肖!' };
        }
        betContent.forEach((item) => {
          content.push(`${item.name}`);
        });

        formatArray.betContent = getArrange(content, 5);
        formatArray.betCount = formatArray.betContent.length;
        formatArray.betTotalAmount = parseFloat(betContent[0].amount) * formatArray.betContent.length;
        formatArray.postContent = `${betName}|${betId}|${content.join(' ')}`;
        break;
      default:
        break;
    }
    formatArray.status = true;
    return formatArray;
  },

  /**
   * 色波玩法
   * @param {投注號碼} betContent
   */
  getColorBall(betContent) {
    const formatArray = {
      status: false,
      betCount: 0,
      betTotalAmount: 0,
      betContent: [],
      postContent: '',
    };
    const content = [];
    betContent.forEach((element) => {
      formatArray.betCount += 1;
      formatArray.betTotalAmount += parseFloat(element.amount);
      formatArray.betContent.push(`${element.name}:${element.amount} 元`);
      content.push(`0|${element.id}|${element.amount}`);
    });
    formatArray.status = true;
    formatArray.postContent = content.join(',');
    return formatArray;
  },

  /**
   * 五行玩法
   * @param {投注號碼} betContent
   */
  getElement(betContent) {
    const formatArray = {
      status: false,
      betCount: 0,
      betTotalAmount: 0,
      betContent: [],
      postContent: '',
    };
    const content = [];
    betContent.forEach((element) => {
      formatArray.betCount += 1;
      formatArray.betTotalAmount += parseFloat(element.amount);
      formatArray.betContent.push(`号码：${element.name}，投注：${element.amount}元`);
      content.push(`0|${element.id}|${element.amount}`);
    });
    formatArray.status = true;
    formatArray.postContent = content.join(',');
    return formatArray;
  },

  /**
   * 頭尾玩法
   * @param {投注號碼} betContent
   */
  getHeadToTail(betContent) {
    const formatArray = {
      status: false,
      betCount: 0,
      betTotalAmount: 0,
      betContent: [],
      postContent: '',
    };
    const content = [];
    let digit = 0;
    betContent.forEach((element) => {
      formatArray.betCount += 1;
      formatArray.betTotalAmount += parseFloat(element.amount);
      switch (element.id) {
        case 7701:
        case 7702:
        case 7703:
        case 7704:
        case 7705:
        case 7001:
        case 7002:
        case 7003:
        case 7004:
        case 7005:
        case 7006:
        case 7007:
        case 7008:
        case 7009:
        case 7010:
          digit = 0;
          break;
        case 7101:
        case 7102:
        case 7103:
        case 7104:
        case 7105:
        case 7106:
        case 7107:
        case 7108:
        case 7109:
        case 7110:
          digit = 1;
          break;
        case 7201:
        case 7202:
        case 7203:
        case 7204:
        case 7205:
        case 7206:
        case 7207:
        case 7208:
        case 7209:
        case 7210:
          digit = 2;
          break;
        case 7301:
        case 7302:
        case 7303:
        case 7304:
        case 7305:
        case 7306:
        case 7307:
        case 7308:
        case 7309:
        case 7310:
          digit = 3;
          break;
        case 7401:
        case 7402:
        case 7403:
        case 7404:
        case 7405:
        case 7406:
        case 7407:
        case 7408:
        case 7409:
        case 7410:
          digit = 4;
          break;
        case 7501:
        case 7502:
        case 7503:
        case 7504:
        case 7505:
        case 7506:
        case 7507:
        case 7508:
        case 7509:
        case 7510:
          digit = 5;
          break;
        case 7601:
        case 7602:
        case 7603:
        case 7604:
        case 7605:
        case 7606:
        case 7607:
        case 7608:
        case 7609:
        case 7610:
          digit = 6;
          break;
        default:
          break;
      }
      formatArray.betContent.push(`${element.name}，投注：${element.amount}元`);
      content.push(`${digit}|${element.id}|${element.amount}`);
    });

    formatArray.status = true;
    formatArray.postContent = content.join(',');
    return formatArray;
  },

  /**
   * 返回玩法列表
   * @param {1000:特正碼,2000:兩面,3000:連碼,4000:生肖,5000:色波,6000:五行,7000:頭尾數} type
   * @param {由API獲取對應號碼陣列} gameRates
   */
  getPlayArray(type, gameRates, numberArray) {
    const playArray = [];
    switch (type) {
      case '4000':
        gameRates.forEach((element) => {
          let playObj = {};

          if (element.bet_name === '合肖' || element.bet_name === '二合肖'
            || element.bet_name === '三合肖' || element.bet_name === '四合肖'
            || element.bet_name === '五合肖' || element.bet_name === '二连肖'
            || element.bet_name === '三连肖' || element.bet_name === '四连肖'
            || element.bet_name === '五连肖') {
            playObj.bet_id = element.bet_id;
            playObj.bet_name = element.bet_name;
            playObj.bet_rate = element.bet_rate;
            playObj.play_list = [];
            playArray[playObj.bet_id] = playObj;

            const number = element.bet_number.split(',');
            number.forEach((index) => {
              playObj = {};
              playObj.bet_id = element.bet_id;
              playObj.bet_name = index;
              playObj.bet_rate = 0;
              playObj.bet_number = numberArray[index];
              playArray[playObj.bet_id].play_list.push(playObj);
            });
          }

          if (element.bet_name === '特肖'
            || element.bet_name === '正肖'
            || element.bet_name === '一肖') {
            playObj.bet_id = element.bet_id;
            playObj.bet_name = element.bet_name;
            playObj.bet_rate = element.bet_rate;
            playObj.play_list = [];
            playArray[playObj.bet_id] = playObj;
          }

          if (element.bet_id >= 4101 && element.bet_id <= 4199) {
            playObj.bet_id = element.bet_id;
            playObj.bet_name = element.bet_name;
            playObj.bet_rate = element.bet_rate;
            playObj.bet_number = numberArray[element.bet_name];
            playArray[4100].play_list.push(playObj);
          } else if (element.bet_id >= 4201 && element.bet_id <= 4299) {
            playObj.bet_id = element.bet_id;
            playObj.bet_name = element.bet_name;
            playObj.bet_rate = element.bet_rate;
            playObj.bet_number = numberArray[element.bet_name];
            playArray[4200].play_list.push(playObj);
          } else if (element.bet_id >= 4301 && element.bet_id <= 4399) {
            playObj.bet_id = element.bet_id;
            playObj.bet_name = element.bet_name;
            playObj.bet_rate = element.bet_rate;
            playObj.bet_number = numberArray[element.bet_name];
            playArray[4300].play_list.push(playObj);
          }
        });
        break;
      case '7000':
        break;
      default:
        break;
    }
    return playArray.filter(n => n !== null);
  },
};

/**
 * PK10玩法類型
 */
const PK10BetType = Object.freeze({
  CHAMPION: 100,
  CHAMPION_SECOND: 200,
  FRONT_THREE: 300,
  FIX_DIGIT: 400,
  TWO_SIDE: 500,
  COMBINATION: 600,
});

/**
 * PK10彩種投注計算
 */
export const pk10Service = {

  makeBetItem(gameId, bet, amount) {
    return {
      id: gameId,
      name: bet,
      amount,
    };
  },

  /**
   * 官方投注  SSC & PK10 && K3
   * @param {*} lotteryId 彩種ID
   * @param {*} betTypeId 玩法類型ID
   * @param {*} betUnitMoney 單注金額
   * @param {*} betContent 投注號碼
   */
  officalBet(lotteryId, betTypeId, betUnitMoney, betCount, betContent) {
    if (betContent === '' || betContent === null) {
      return {
        status: false,
        message: '您还没有选择任何号码！请在选号面板选择您的号码，点击添加到投注列表！',
      };
    }

    const content = JSON.stringify({
      rule_id: betTypeId,
      bet_type_id: betTypeId,
      bet_total_count: betCount,
      unit_price: betUnitMoney,
      bet_content: betContent,
    });
    const postData = {
      lottery_id: lotteryId,
      bet_type_id: betTypeId,
      bet_count: betCount,
      bet_unit_money: betUnitMoney,
      bet_total_money: betCount * betUnitMoney,
      bet_content: content,
    };

    return {
      status: true,
      message: postData,
    };
  },

  /**
   * 依類型ID回傳投注格式
   */
  formatBetContent(betTypeId, betContent) {
    const formatArray = {
      status: false,
      message: '',
      betCount: 0,
      betTotalAmount: 0,
      betContent: [],
      postContent: '',
    };
    if (betContent.length <= 0) {
      formatArray.message = '号码选择不足！！';
      return formatArray;
    }
    let content = [];
    let postContent = '';
    let betUnitAmount = 0;
    let betCount = 0;
    switch (betTypeId) {
      case PK10BetType.CHAMPION:
      case PK10BetType.COMBINATION:
        betUnitAmount = parseInt(betContent[0].amount, Number);
        betContent[0].forEach((number) => {
          content.push(number.name);
        });
        postContent = content.join(' ');
        betCount = content.length;
        break;
      case PK10BetType.CHAMPION_SECOND:
        if (betContent[0] === undefined || betContent[0].length === 0
          || betContent[1] === undefined || betContent[1].length === 0) {
          formatArray.message = '号码选择不足！！';
          return formatArray;
        }

        betUnitAmount = parseInt(betContent[0][0].amount, Number);
        const champion = [];
        const second = [];
        betContent[0].forEach((number) => {
          champion.push(number.name);
        });
        betContent[1].forEach((number) => {
          second.push(number.name);
        });

        content = twoArrayCombinate(champion, second);
        betCount = content.length;
        postContent = `${champion.join(' ')},${second.join(' ')}`;
        break;
      case PK10BetType.FRONT_THREE:
        if (betContent[0] === undefined || betContent[0].length <= 0
          || betContent[1] === undefined || betContent[1].length <= 0
          || betContent[2] === undefined || betContent[2].length <= 0) {
          formatArray.message = '号码选择不足！！';
          return formatArray;
        }
        betUnitAmount = parseInt(betContent[0][0].amount, Number);
        const threeChampion = [];
        const threeSecond = [];
        const threeThird = [];
        betContent[0].forEach((number) => {
          threeChampion.push(number.name);
        });
        betContent[1].forEach((number) => {
          threeSecond.push(number.name);
        });
        betContent[2].forEach((number) => {
          threeThird.push(number.name);
        });

        content = threeArrayCombinate(threeChampion, threeSecond, threeThird);
        betCount = content.length;
        postContent = `${threeChampion.join(' ')},${threeSecond.join(' ')},${threeThird.join(' ')}`;
        break;
      case PK10BetType.FIX_DIGIT:
        if (betContent[0] && betContent[0].length > 0) {
          const fixedFirst = [];
          betContent[0].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            fixedFirst.push(number.name);
          });
          content.push(`第1名:${fixedFirst.map(Number).sort(sortNumber).join(',')}`);
          betCount += fixedFirst.length;
        }
        if (betContent[1] && betContent[1].length > 0) {
          const fixedSecond = [];
          betContent[1].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            fixedSecond.push(number.name);
          });
          content.push(`第2名:${fixedSecond.map(Number).sort(sortNumber).join(',')}`);
          betCount += fixedSecond.length;
        }
        if (betContent[2] && betContent[2].length > 0) {
          const fixedThird = [];
          betContent[2].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            fixedThird.push(number.name);
          });
          content.push(`第3名:${fixedThird.map(Number).sort(sortNumber).join(',')}`);
          betCount += fixedThird.length;
        }
        if (betContent[3] && betContent[3].length > 0) {
          const fixedFourth = [];
          betContent[3].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            fixedFourth.push(number.name);
          });
          content.push(`第4名:${fixedFourth.map(Number).sort(sortNumber).join(',')}`);
          betCount += fixedFourth.length;
        }
        if (betContent[4] && betContent[4].length > 0) {
          const fixedFifth = [];
          betContent[4].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            fixedFifth.push(number.name);
          });
          content.push(`第5名:${fixedFifth.map(Number).sort(sortNumber).join(',')}`);
          betCount += fixedFifth.length;
        }
        if (betContent[5] && betContent[5].length > 0) {
          const fixedSixth = [];
          betContent[5].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            fixedSixth.push(number.name);
          });
          content.push(`第6名:${fixedSixth.map(Number).sort(sortNumber).join(',')}`);
          betCount += fixedSixth.length;
        }
        if (betContent[6] && betContent[6].length > 0) {
          const fixedSeventh = [];
          betContent[6].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            fixedSeventh.push(number.name);
          });
          content.push(`第7名:${fixedSeventh.map(Number).sort(sortNumber).join(',')}`);
          betCount += fixedSeventh.length;
        }
        if (betContent[7] && betContent[7].length > 0) {
          const fixedEighth = [];
          betContent[7].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            fixedEighth.push(number.name);
          });
          content.push(`第8名:${fixedEighth.map(Number).sort(sortNumber).join(',')}`);
          betCount += fixedEighth.length;
        }
        if (betContent[8] && betContent[8].length > 0) {
          const fixedNinth = [];
          betContent[8].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            fixedNinth.push(number.name);
          });
          content.push(`第9名:${fixedNinth.map(Number).sort(sortNumber).join(',')}`);
          betCount += fixedNinth.length;
        }
        if (betContent[9] && betContent[9].length > 0) {
          const fixedTenth = [];
          betContent[9].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            fixedTenth.push(number.name);
          });
          content.push(`第10名:${fixedTenth.map(Number).sort(sortNumber).join(',')}`);
          betCount += fixedTenth.length;
        }
        if (betCount === 0) {
          formatArray.message = '号码选择不足！！';
          return formatArray;
        }
        postContent = content.join(' ');
        break;
      case PK10BetType.TWO_SIDE:
        if (betContent[0] && betContent[0].length > 0) {
          const twoSideFirst = [];
          betContent[0].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            twoSideFirst.push(number.name);
          });
          content.push(`第1名:${twoSideFirst.join(',')}`);
          betCount += twoSideFirst.length;
        }
        if (betContent[1] && betContent[1].length > 0) {
          const twoSideSecond = [];
          betContent[1].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            twoSideSecond.push(number.name);
          });
          content.push(`第2名:${twoSideSecond.join(',')}`);
          betCount += twoSideSecond.length;
        }
        if (betContent[2] && betContent[2].length > 0) {
          const twoSideThird = [];
          betContent[2].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            twoSideThird.push(number.name);
          });
          content.push(`第3名:${twoSideThird.join(',')}`);
          betCount += twoSideThird.length;
        }
        if (betContent[3] && betContent[3].length > 0) {
          const twoSideFourth = [];
          betContent[3].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            twoSideFourth.push(number.name);
          });
          content.push(`第4名:${twoSideFourth.join(',')}`);
          betCount += twoSideFourth.length;
        }
        if (betContent[4] && betContent[4].length > 0) {
          const twoSideFifth = [];
          betContent[4].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            twoSideFifth.push(number.name);
          });
          content.push(`第5名:${twoSideFifth.join(',')}`);
          betCount += twoSideFifth.length;
        }
        if (betContent[5] && betContent[5].length > 0) {
          const twoSideSixth = [];
          betContent[5].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            twoSideSixth.push(number.name);
          });
          content.push(`第6名:${twoSideSixth.join(',')}`);
          betCount += twoSideSixth.length;
        }
        if (betContent[6] && betContent[6].length > 0) {
          const twoSideSeventh = [];
          betContent[6].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            twoSideSeventh.push(number.name);
          });
          content.push(`第7名:${twoSideSeventh.join(',')}`);
          betCount += twoSideSeventh.length;
        }
        if (betContent[7] && betContent[7].length > 0) {
          const twoSideEighth = [];
          betContent[7].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            twoSideEighth.push(number.name);
          });
          content.push(`第8名:${twoSideEighth.join(',')}`);
          betCount += twoSideEighth.length;
        }
        if (betContent[8] && betContent[8].length > 0) {
          const twoSideNinth = [];
          betContent[8].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            twoSideNinth.push(number.name);
          });
          content.push(`第9名:${twoSideNinth.join(',')}`);
          betCount += twoSideNinth.length;
        }
        if (betContent[9] && betContent[9].length > 0) {
          const twoSideTenth = [];
          betContent[9].forEach((number) => {
            betUnitAmount = parseInt(number.amount, Number);
            twoSideTenth.push(number.name);
          });
          content.push(`第10名:${twoSideTenth.join(',')}`);
          betCount += twoSideTenth.length;
        }
        if (betCount === 0) {
          formatArray.message = '号码选择不足！！';
          return formatArray;
        }
        postContent = content.join(' ');
        break;
      default:
        break;
    }

    formatArray.status = true;
    formatArray.betContent = content;
    formatArray.betCount = betCount;
    formatArray.betUnitAmount = betUnitAmount;
    formatArray.betTotalAmount = betCount * betUnitAmount;
    formatArray.postContent = JSON.stringify({
      rule_id: betTypeId,
      bet_type_id: betTypeId,
      bet_total_count: content.length,
      unit_price: betUnitAmount,
      bet_content: postContent,
    });
    return formatArray;
  },
};

/**
 * PCEGG玩法類型
 */
const PCEGGBetType = Object.freeze({
  SUM: 100,
  MIX: 200,
});
export const pceggService = {
  /**
   * 計算及回傳投注格式
   * @param {類型ID} betTypeId
   * @param {投注內容} betContent
   */
  formatBetContent(betTypeId, betContent) {
    if (betContent === undefined || betContent.length <= 0) {
      return { status: false, message: '号码选择不足！！' };
    }
    let formatArray = {};
    switch (betTypeId) {
      case PCEGGBetType.SUM:
        formatArray = this.getSum(betContent);
        break;
      case PCEGGBetType.MIX:
        formatArray = this.getMix(betContent);
        break;
      default:
        break;
    }
    return formatArray;
  },

  /**
   * 和值玩法
   * @param {投注內容} betContent
   */
  getSum(betContent) {
    const formatArray = {
      status: false,
      message: '',
      betCount: 0,
      betTotalAmount: 0,
      betContent: [],
      postContent: '',
    };

    let totalAmount = 0;
    const content = [];
    betContent.forEach((number) => {
      totalAmount += parseInt(number.amount, Number);
      formatArray.betContent.push(`号码:${number.name} ${number.amount}元`);
      content.push(`${number.name}|${number.name}|${number.amount}`);
    });

    if (totalAmount === 0) {
      formatArray.message = '投注发生错误，请重新投注！！';
      return formatArray;
    }

    formatArray.status = true;
    formatArray.betCount = betContent.length;
    formatArray.betTotalAmount = totalAmount;
    formatArray.postContent = `${content.join(',')}`;
    return formatArray;
  },

  /**
   * 混合玩法
   * @param {投注內容} betContent
   */
  getMix(betContent) {
    const formatArray = {
      status: false,
      message: '',
      betCount: 0,
      betTotalAmount: 0,
      betContent: [],
      postContent: '',
    };

    let totalAmount = 0;
    const content = [];
    betContent.forEach((number) => {
      totalAmount += parseInt(number.amount, Number);
      formatArray.betContent.push(`号码:${number.name} ${number.amount}元`);
      content.push(`${number.id}|${number.name}|${number.amount}`);
    });

    if (totalAmount === 0) {
      formatArray.message = '投注发生错误，请重新投注！！';
      return formatArray;
    }

    formatArray.status = true;
    formatArray.betCount = betContent.length;
    formatArray.betTotalAmount = totalAmount;
    formatArray.postContent = `${content.join(',')}`;
    return formatArray;
  },
};

export const mobileService = {
  /**
   * 獲取手機版遊戲選單
   * @param {*} betTypeArray
   */
  getLotteryMenu(classId, betTypeArray) {
    const betTypes = [];
    switch (classId) {
      case LotteryClassType.TYPE_SSC:
      case LotteryClassType.TYPE_11X5:
      case LotteryClassType.TYPE_3D:
        betTypeArray.forEach((betType) => {
          betTypes.push({
            betTypeName: betType.bet_type_name,
            betTypeId: betType.bet_type_id,
            description: betType.description,
            plays: betType.lottery_play_list,
          });
        });
        break;
      case LotteryClassType.TYPE_HK6:
        betTypeArray.forEach((betType) => {
          betTypes.push({
            betTypeName: betType.bet_type_name,
            betTypeId: betType.bet_type_id,
            description: betType.description,
            plays: [],
          });
        });
        break;
      case LotteryClassType.TYPE_K3:
        betTypeArray.forEach((betType) => {
          betTypes.push({
            lotteryId: betType.lottery_id,
            betTypeName: betType.bet_type_name,
            betTypeId: betType.bet_type_id,
            description: betType.description,
            plays: betType.lottery_play_list,
          });
        });
        break;
      case LotteryClassType.TYPE_PK10:
      case LotteryClassType.TYPE_PCEGG:
        betTypeArray.forEach((betType) => {
          betTypes.push({
            betTypeName: betType.bet_type_name,
            betTypeId: betType.bet_type_id,
            plays: [],
          });
        });
        break;
      default:
        break;
    }
    return betTypes;
  },
};
