import {MessageBox, Message} from 'element-ui';
import store from '@/store/index';
import router from '@/router/router';
import validator from 'el-form-validator';

/**
 * 将请求的参数转换为 form data
 * @param params
 * @returns {FormData}
 */
export const paramsToFormData = (params) => {
    let formData = new FormData();
    for (let k in params) {
        if (params[k] === undefined) {
            continue;
        }
        formData.append(k, params[k]);
    }
    return formData;
};

/**
 * 处理http返回的结果
 * @param res
 * @param showSuccess = true
 * @param successMsg = undefined
 * @param errorMsg
 * @returns {Promise<any>}
 */
export const handelHttpResponseResult = (res, showSuccess = false, successMsg = undefined, errorMsg = undefined) => {
    return new Promise((resolve, reject) => {
        try {
            if (res.data.code === 200) {
                if (showSuccess === true) Message.success(successMsg ? successMsg : res.data.msg);
                resolve(res.data);
            } else {
                if (errorMsg !== false) {
                    if (res.data.msg.indexOf('storeId') !== -1) {
                        toSelectStorePage();
                    } else {
                        Message.error(res.data.msg);
                    }
                }
                reject(res.data);
            }
        } catch (e) {
            if (errorMsg !== false) Message.error('处理结果失败');
            reject(res.data);
        }
    });
};

/**
 * 跳转到选择店铺的页面
 */
export const toSelectStorePage = () => {
    router.replace({name: 'SelectStore'});
    Message.error('请选择店铺');
};


/**
 * 操作确认提示
 * @param message
 * @param customClass
 * @returns {Promise<MessageBoxData>}
 */
export const actionConfirm = (message, customClass = '') => {
    return MessageBox.confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass
    });
};

/**
 * 获取Object的长度
 * @param object
 * @returns {number}
 */
export const objectLength = (object) => {
    let length = 0;
    for (let i in object) length++;
    return length;
};

/**
 * 转换价格为分
 * @param price
 * @returns {number}
 */
export const formatPrice = (price) => {
    return accMul(price, 100);
};

/**
 * 将分的价格 转换为带小数的元价格
 * @param price
 * @returns {number}
 */
export const priceFormat = (price) => {
    price = parseFloat(price / 100);
    if (isNaN(price)) return 0;
    return price;
};

let countDecimals = (num) => {
    let len = 0;
    try {
        num = Number(num);
        let str = num.toString().toUpperCase();
        if (str.split('E').length === 2) { // scientific notation
            let isDecimal = false;
            if (str.split('.').length === 2) {
                str = str.split('.')[1];
                if (parseInt(str.split('E')[0]) !== 0) {
                    isDecimal = true;
                }
            }
            let x = str.split('E');
            if (isDecimal) {
                len = x[0].length;
            }
            len -= parseInt(x[1]);
        } else if (str.split('.').length === 2) { // decimal
            if (parseInt(str.split('.')[1]) !== 0) {
                len = str.split('.')[1].length;
            }
        }
    } catch (e) {
        throw e;
    } finally {
        if (isNaN(len) || len < 0) {
            len = 0;
        }
        return len;
    }
};

let convertToInt = (num) => {
    num = Number(num);
    let newNum = num;
    let times = countDecimals(num);
    let temp_num = num.toString().toUpperCase();
    if (temp_num.split('E').length === 2) {
        newNum = Math.round(num * Math.pow(10, times));
    } else {
        newNum = Number(temp_num.replace('.', ''));
    }
    return newNum;
};

let accMul = (num1, num2) => {
    num1 = Number(num1);
    num2 = Number(num2);
    let times = 0, s1 = num1.toString(), s2 = num2.toString();
    try {
        times += countDecimals(s1);
    } catch (e) {
    }
    try {
        times += countDecimals(s2);
    } catch (e) {
    }
    let result = convertToInt(s1) * convertToInt(s2) / Math.pow(10, times);
    return getCorrectResult('mul', num1, num2, result);
    // return result;
};

let getCorrectResult = (type, num1, num2, result) => {
    let temp_result = 0;
    switch (type) {
        case 'add':
            temp_result = num1 + num2;
            break;
        case 'sub':
            temp_result = num1 - num2;
            break;
        case 'div':
            temp_result = num1 / num2;
            break;
        case 'mul':
            temp_result = num1 * num2;
            break;
    }
    if (Math.abs(result - temp_result) > 1) {
        return temp_result;
    }
    return result;
};

/**
 * 检查角色id
 * @param ids
 * @returns {boolean}
 */
const checkRole = (ids) => {
    if (ids === undefined) return true;
    let role = store.getters.role;
    if (typeof ids === 'string')
        return ids === role.roleID;

    return ids.indexOf(role.roleID) !== -1;
};

/**
 * 检查角色store id
 *
 * @param storeId
 * @returns {boolean}
 */
const checkStore = (storeId) => {
    let role = store.getters.role;
    if (role.stores === null) return false;
    if (role.stores.indexOf('all') !== -1) return true;
    return role.stores.indexOf(storeId) !== -1;
};

/**
 * 检查用户拥有的权限
 *
 * @param key
 * @param perms {Array}
 * @returns {boolean}
 */
const checkPermission = (key, perms) => {
    if (!key || !perms) return true;
    let permission = store.getters.permission;
    if (!permission || permission.length <= 0) return false;
    let hasPerms = hasPermission(permission.all, ['all']);
    if (hasPerms) return hasPerms;
    if (typeof key === 'string') {
        if (!permission[key] || !permission[key].length) return false;
        return hasPermission(permission[key], perms);
    } else {
        hasPerms = false;
        key.forEach((item) => {
            if (hasPermission(permission[item], perms)) {
                hasPerms = true;
            }
        });
        return hasPerms;
    }
};

function hasPermission(data, perms) {
    let hasPerms = false;
    if (!data || !data.length) return false;
    // console.info(data, perms);
    data.forEach((item) => {
        if (perms.indexOf(item) !== -1) {
            hasPerms = true;
        }
    });
    return hasPerms;
}

/**
 * 检查用户角色的 scope
 * @param scope
 * @returns {boolean}
 */
export const checkRoleScope = (scope) => {
    let role = store.getters.role;
    return role.roleScope === scope;
};

/**
 * 检查用户的角色 level
 *
 * @param level
 * @returns {boolean}
 */
export const checkRoleLevel = (level) => {
    let role = store.getters.role;
    return role.roleLevel === level;
};

export const exportCsv = (obj, filename) => {
    let title = obj.title;
    let titleForKey = obj.titleForKey;
    let data = obj.data;
    let str = [];
    str.push(obj.title.join(',') + '\n');
    for (let i = 0; i < data.length; i++) {
        let temp = [];
        for (let j = 0; j < titleForKey.length; j++) {
            temp.push(data[i][titleForKey[j]]);
        }
        str.push(temp.join(',') + '\n');
    }
    let content = '\uFEFF' + str.join('');
    let blob = new Blob([content], {type: 'text/plain'});
    let downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};

/**
 * 克隆
 */
export const deepClone = (obj) => {
    let result = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                result[key] = deepClone(obj[key]); //递归复制
            } else {
                result[key] = obj[key];
            }
        }
    }
    return result;
};

/**
 * 转换query的参数为整数
 *
 * @param params
 * @param keys
 */
export const conversionRouterParamsToInteger = (params, keys = []) => {
    keys.forEach(key => {
        if (params[key] !== undefined) params[key] = parseInt(params[key]);
    });
    return params;
};

/**
 * 将值转换为Boolean
 * @param value
 * @returns {boolean|undefined}
 */
export const valueToBoolean = (value) => {
    switch (value) {
        case undefined:
            return undefined;
        case 'true':
        case '1':
        case 'on':
        case 'yes':
        case 1:
        case true:
            return true;
        case 'no':
        case 'false':
        case '0':
        case 'off':
        case 0:
        case false:
            return false;
        default:
            return undefined;
    }
};

/**
 * 异步下载文件Handel
 *
 * @param data
 * @param fileName
 */
export const xhrDownloadFileHandel = (data, fileName) => {
    if (data.code !== undefined) {
        Message.error(data.msg);
        return;
    }
    const blob = new Blob([data]);
    const eLink = document.createElement('a');
    if ('download' in eLink) { // 非IE下载
        eLink.download = fileName;
        eLink.style.display = 'none';
        eLink.href = URL.createObjectURL(blob);
        document.body.appendChild(eLink);
        eLink.click();
        URL.revokeObjectURL(eLink.href); // 释放URL 对象
        // document.body.removeChild(eLink);
    } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName);
    }
};

export const generateFormRule = (message, rules, required = true) => {
    return [
        {
            required,
            message
        }, {
            rules,
            validator: validator.verification
        }
    ]
};

export const timestampToUnix = (timestamp) => {
    return parseInt(timestamp / 1000)
};

export const unixToTimestamp = (unix) => {
    return parseInt(unix * 1000)
};

export default {
    paramsToFormData,
    handelHttpResponseResult,
    actionConfirm,
    objectLength,
    formatPrice,
    priceFormat,
    priceToInteger: formatPrice, // Alias
    integerToPrice: priceFormat, // Alias
    checkRole,
    checkStore,
    checkPermission,
    toSelectStorePage,
    exportCsv,
    deepClone,
    checkRoleScope,
    checkRoleLevel,
    conversionRouterParamsToInteger,
    valueToBoolean,
    xhrDownloadFileHandel,
    generateFormRule,
    unixToTimestamp,
    timestampToUnix
};
