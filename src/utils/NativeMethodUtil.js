import {NativeModules, Platform} from 'react-native';

/**
 * 回调原生方法
 * @param model
 * @param func
 * @param params
 */
export function call2NativeMethod(model,func,params) {
    if(NativeModules[model]){
        if(NativeModules[model][func]){
            if(params){
                NativeModules[model][func](params);
            }else{
                NativeModules[model][func]();
            }

        }
    }
}

let canTap = true;
export function gotoNativePage(pageName = {android: null, ios: null},ext = {}) {
    if(NativeModules.NativeControlModule) {
        if(canTap) {
            canTap = false;
            NativeModules.NativeControlModule.gotoNativePage(Platform.OS === 'android' ? pageName.android : pageName.ios, JSON.stringify(ext));
            setTimeout(() => {
                canTap = true;
            }, 1000);
        }
    }


}

/**
 * 清除用户token
 */
export function clearNativeToken() {
    // call2NativeMethod('NativeControlModule','clearToken')
}

/**
 * 报错token到原生
 * @param token
 */
export function saveToken2Native(token) {
    // call2NativeMethod('NativeControlModule','saveToken',token)
}