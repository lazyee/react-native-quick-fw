import {Platform} from 'react-native';
import {showLoadingDialog, showLoginInvalidDialog} from "../reducers/CacheReducer";



const STATUS_SUCCESS = 200;
const STATUS_SIGN_ERROR = 402; //签名错误
const STATUS_TOKEN_INVALID = 401;//token失效
const STATUS_ERROR = 462; //参数校验错误

// export const api_product = 'https://api.newmall.ejiamall.cn/api/';
export const api_test = 'https://hs.pusai.net';
export const api_local = 'http://192.168.2.100:8180/api/';

let dispatch = null;
let host = api_test;
let phone_imei = '';
let version = '1.0.0';
let timeout = 30 * 1000;

const HEADER = {
    'Accept': 'application/json',
    // 'Content-Type': 'application/json;charset=UTF-8',
    'Content-Type': 'application/x-www-form-urlencoded',
};

const POST = {
    method: 'POST'
};

const GET = {
    method: 'GET'
};

const DELETE = {
    method: 'DELETE'
};

/**
 * 更新接口配置
 * @param appConfig
 */
export function updateHttpConfig(appConfig) {
    if (appConfig.host) {

        host = appConfig.host;
        // if (host.indexOf('newmall') !== -1) {
        // host = host.replace('https://', 'http://');
        // host = host.replace('http://', 'https://');//将正式环境升级为ssl
        // }
        phone_imei = appConfig.phone_imei;
        version = appConfig.version;
    }
}

export function setToken(token) {
    Object.assign(HEADER,{token:token})
}

export function clearToken() {
    delete HEADER.token;
}

/**
 * 配置dispatch
 * @param dispatchFunc
 */
export function configDispatchFunc(dispatchFunc) {
    dispatch = dispatchFunc;
}

export function getHost() {
    return host;
}

/**
 * 可以传入多个参数
 * @param objs
 * @returns {phone_imei: string, version: string, platform: string}
 */
function getRequestObj(...objs) {
    let params = {
        phone_imei: phone_imei,
        version: version,
        OS: Platform.OS,
    };
    objs.map((item, index) => Object.assign(params, item));
    // Object.assign(params,{token:'MDAwMDAwNTcxNTQzMTM1'})
    return params;
}

//获取统一错误提示
export function getRequestFailTip(responseJson) {
    if (!__DEV__) {
        if (responseJson) {
            return `${responseJson.msg}`;
        } else {
            return `请求发生异常`;
        }
    } else {
        if (responseJson) {
            return `${responseJson.msg},状态码(${responseJson.rtnCode})`;
        } else {
            return `请求发生异常,状态码(unknown)`;
        }
    }
}


/**
 * POST请求
 * @param requestUrl
 * @param requestData
 * @param showLoadingDialog
 * @constructor
 */
export function post(requestUrl, requestData = {}, showLoadingDialog = false) {
    return request(requestUrl, POST.method, requestData, showLoadingDialog);
}


/**
 * GET请求
 * @param requestUrl
 * @param requestData
 * @param isShowLoadingDialog
 * @constructor
 */
export function get(requestUrl, requestData = {}, isShowLoadingDialog = false) {
    return request(requestUrl, GET.method, requestData, isShowLoadingDialog);
}


/**
 * DELETE请求
 * @param requestUrl
 * @param requestData
 * @param isShowLoadingDialog
 * @constructor
 */
export function del(requestUrl, requestData = {}, isShowLoadingDialog = false) {
    return request(requestUrl, DELETE.method, requestData, isShowLoadingDialog);
}


/**
 * 请求
 * @param requestUrl
 * @param requestMethod
 * @param requestData
 * @param isShowLoadingDialog
 */
export function request(requestUrl, requestMethod, requestData, isShowLoadingDialog) {

    requestData = getRequestObj(requestData);
    //检查空值，并删除空属性
    requestData = checkParams(requestData);
    console.log(`REQUEST:==============================>
                 URL:   ${host + requestUrl}
                 METHOD:${requestMethod}
                 HEADER:${JSON.stringify(HEADER)}
                 BODY:  ${JSON.stringify(requestData)}`);


    let fetch = new Promise((resolve, reject) => {
        if (isShowLoadingDialog) {
            controlLoadingDialog(true);
            setTimeout(() => {
                doFetch(resolve, reject, requestUrl, requestMethod, requestData, isShowLoadingDialog)
            }, 500);
        } else {
            doFetch(resolve, reject, requestUrl, requestMethod, requestData);
        }
    });

    return Promise.race([
        fetch,
        new Promise((resolve, reject) => {
            setTimeout(() => {
                if (isShowLoadingDialog) {
                    controlLoadingDialog(false);
                }
                reject({message: '请求超时,请稍后再试'});
            }, timeout);
        })
    ]);
}

function doFetch(resolve, reject, requestUrl, requestMethod, requestData, isShowLoadingDialog) {

    let body = '';

    for (let key in requestData) {
        body += body?'&':'';
        body +=  key + '=' + requestData[key];
    }

    let entity = {
        method: requestMethod,
        headers: HEADER,
    };

    if(requestMethod === POST.method){
        Object.assign(entity,{body:body});
    }else if(requestMethod === GET.method || requestMethod === DELETE.method){
        requestUrl += '?' + body;
    }


    fetch(host + requestUrl, entity)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
        }).then((responseData) => {
        if (isShowLoadingDialog) controlLoadingDialog(false);
        if(checkTokenValid(getStatusCode(responseData))){
            resolve(responseData);
        }else{
            controlTokenInvalidDialog(true);
            reject(responseData);
        }
        console.log("RESPONSE:==============================>", responseData);
        return responseData;

    }).catch((e) => {
        if (isShowLoadingDialog) controlLoadingDialog(false);
        reject(e);
        console.log("responseException:==============================>" + e.message)
    });
}

/**
 * 控制loadingDialog的显示
 * @param isShowLoadingDialog
 */
function controlLoadingDialog(isShowLoadingDialog) {
    if (dispatch) {
        dispatch(showLoadingDialog(isShowLoadingDialog));
    }
}
function controlTokenInvalidDialog(isShowLoadingDialog) {
    if (dispatch) {
        dispatch(showLoginInvalidDialog(isShowLoadingDialog));
    }
}

/**
 * 检查属性是否是null or undefined，是则删除该属性
 * @param params
 */
function checkParams(params) {
    for (let key in params) {
        const value = params[key];
        if (value === null || value === undefined) {
            delete params[key];
        }
    }
    return params;
}

function getStatusCode(response){
    if(response){
        if(response.rtnCode){
            return response.rtnCode;
        }
    }

    return -1;
}

function checkTokenValid(code) {
    if(code === STATUS_TOKEN_INVALID || code === 406){
        return false
    }
    return true;
}

export function isSuccess(response) {
    return response && response.rtnCode === STATUS_SUCCESS;
}

export function isTokenInvalid(response) {
    return response && response.rtnCode === STATUS_TOKEN_INVALID;
}