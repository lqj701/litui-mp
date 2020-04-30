// 实用工具

function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

function toDecimal(count, num) {
  let divisor = 1;
  let reserveNum = '0';

  switch (num) {
    case 0:
      divisor = 1;
      break;
    case 1:
      divisor = 10;
      reserveNum = '0';
      break;
    case 2:
      divisor = 100;
      reserveNum = '00';
      break;
    case 3:
      divisor = 1000;
      reserveNum = '000';
      break;
    default:
      divisor = 1;
      break;
  }

  let result = Math.floor(count * divisor) / divisor;

  if (result.toString().indexOf('.') < 0) {
    result = `${result}.${reserveNum}`;
  }

  return result;
}


export function formatTime(date) {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()

  const t1 = [year, month, day].map(formatNumber).join('-')
  const t2 = [hour, minute].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function findLast(list, conditionFn) {
  let result

  for (let i = list.length - 1; i >= 0; i -= 1) {
    if (conditionFn(list[i])) {
      result = list[i]
      break
    }
  }

  return result
}

export function numberUpperFormat(count, num = 1) {
  /**
 * 格式化数字规范，五位以下显示绝对数值；
 * 大于等于5位显示“X.X万”，保留一位小数，向下取整；
 * 大于等于9位显示“X.X亿”，保留一位小数，向下取整。
 */
  const TEN_THOUSAND = 10000;
  const A_HUNDRED_MILLION = 100000000;
  const toNumber = parseFloat(count);
  // if (window.isNaN(toNumber)) return toNumber;
  const tenThousand = toNumber / TEN_THOUSAND;
  const aHundredMillion = toNumber / A_HUNDRED_MILLION;
  let result = 0;

  if (toNumber < TEN_THOUSAND) {
    result = toNumber;
  } else if (toNumber >= A_HUNDRED_MILLION) {
    result = `${toDecimal(aHundredMillion, num)} 亿`;
  } else {
    result = `${toDecimal(tenThousand, num)} 万`;
  }

  return result;
}