import {Platform} from 'react-native';

const HEADER = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

const POST = {
    method: 'POST'
};

const GET = {
    method: 'GET'
};

/**
 * POST请求
 * @param requestUrl
 * @param requestData
 * @constructor
 */
export function post(requestUrl, requestData) {
    return request(requestUrl, POST.method, requestData);
}

/**
 * GET请求
 * @param requestUrl
 * @param requestData
 * @constructor
 */
export function get(requestUrl, requestData) {
    return request(requestUrl, GET.method, requestData);
}

/**
 * 请求
 * @param requestUrl
 * @param requestMethod
 * @param requestData
 */
export function request(requestUrl, requestMethod, requestData) {
    console.log(`REQUEST:==============================>
                 URL:   ${requestUrl}
                 METHOD:${requestMethod}
                 HEADER:${JSON.stringify(HEADER)}
                 BODY:  ${JSON.stringify(requestData)}`);
    return new Promise((resolve, reject) => {
        fetch(requestUrl, {
            method: requestMethod,
            headers: HEADER,
            body: JSON.stringify(requestData)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then((responseData) => {
                //这里可以加入对状态值的处理
                resolve(responseData);
                return responseData;
            })
            .catch((e) => {
                reject(e);
                console.log('请求发生异常:' + e.message)
            });
    });
}