import Base64 from "./Base64Util";
import MD5 from "./MD5Util";
import accounting from "accounting";

export function checkPhone(phone) {
    let reg_tel = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    return reg_tel.test(phone);
}

export function hidePhone(phone){
    if(checkPhone(phone)){
        return phone.substr(0,3) + '****' + phone.substr(7,4);
    }
}

export function hideName(name) {
    return name;
}

/**
 * 替换输入的除数字外的其他字符
 * @param input
 * @returns {*|XML|string|void}
 */
export function formatInputNumber(input) {
    return input.replace(/[^0-9]/,'');
}

/**
 * 检查输入的是否是数字0-9
 * @param input
 * @returns {boolean}
 */
export function checkInputIsNumber(input) {
    let reg = /^[0-9]*$/;
    return reg.test(input);
}

/**
 * 检查输入的是数字或者是浮点数
 * @param input
 * @returns {boolean}
 */
export function checkInputIsFloatNumber(input) {
    let reg = /^[0-9.]*$/;
    return reg.test(input);
}

/**
 * 检查输入的是否为邮箱
 * @param input
 * @returns {boolean}
 */
export function checkInputEmail(input) {
    let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return reg.test(input);
}

export function checkInputEmoji(input) {
    //正则表达式
    let reg = /^[A-Za-z0-9\u4e00-\u9fa5（）—：:"'_()+@,.，。、=\s]*$/;
    //获取输入框中的值
    //判断输入框中有内容
    if(!reg.test(input))return true;
    return false;
}

//单纯中文、数字、字母
export function checkInputLegal(input) {
    //正则表达式
    let reg = /^[A-Za-z0-9\u4e00-\u9fa5]*$/;
    //获取输入框中的值
    //判断输入框中有内容
    if(!reg.test(input))return true;
    return false;
}

/**
 * 替换空格
 * @param str
 * @returns {*|XML|string|void}
 */
export function replaceBlank(str) {
    if(typeof str ==='string'){
        return str.replace(/\s+/g,'');
    }
    return str;
}

export function checkInputMoney(money) {
    if (!money) return '';
    money = String(money).replace(/[^0-9.]/,'');

    // text = text.replace(/[^\d.]/g, "");
    // //必须保证第一位为数字而不是.
    // text = text.replace(/^\./g, "");
    // //保证只有出现一个.而没有多个.
    // text = text.replace(/\.{2,}/g, ".");
    // //保证.只出现一次，而不能出现两次以上
    // text = text.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    money = money.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
    money = money.replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    return money;
}

export function checkInputPassword(password) {
    if (!password) return '';
    password = String(password);
    return password.replace(/^\./g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '');
}

/*
    js由毫秒数得到年月日
   使用： (new Date(data[i].creationTime)).Format("yyyy-MM-dd")
 */
export function getDateTime(milliSeconds, fmt = 'yyyy-MM-dd') { //author: meizz
// export function getDateTime(milliSeconds, fmt = 'yyyy-MM-dd hh:mm:ss') { //author: meizz
    let date = new Date(milliSeconds);
    let o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * 格式化钱，增加千分位,保留两位小数
 * @param money
 * @param hasSymbol
 */
export function formatMoney(money,hasSymbol = true ,precision = 2,thousand = ',') {

    let newMoney = String(money);

    let pointIndex = newMoney.indexOf('.');
    if(pointIndex>-1 && (newMoney.length - 1 - pointIndex > 2)){//存在小数点,且多余两位
        newMoney = newMoney.substr(0,pointIndex +3);
    }
    return accounting.formatMoney(newMoney, hasSymbol?'￥':'', precision, thousand, '.');

}

export function encryption(str) {

    let staticStr = 'com.newmall.cn';
    let base = new Base64();

    let result = base.encode(str);
    let result2 = base.encode(staticStr);
    let byte1 = str2Bytes(result);
    let byte2 = str2Bytes(result2);

    let resultStr = base.encode(byte2String([...byte1, ...byte2]));

    return MD5(resultStr);
}

/**
 * 字符串转byte
 */
function str2Bytes(str) {
    let bytes = [];
    let len, c;
    len = str.length;
    for (let i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
        } else {
            bytes.push(c & 0xFF);
        }
    }

    return bytes;
}

/**
 * byte转字符串
 */
function byte2String(arr) {
    let str = '',
        _arr = arr;
    for (let i = 0; i < _arr.length; i++) {
        let one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
        if (v && one.length === 8) {
            let bytesLength = v[0].length;
            let store = _arr[i].toString(2).slice(7 - bytesLength);
            for (let st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            str += String.fromCharCode(_arr[i]);
        }
    }
    return str;
}