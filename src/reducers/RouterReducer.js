import {createAction, combineActions, handleActions} from 'redux-actions';
import {AppNavigator} from '../components/routers/AppWithNavigationState';
import {NavigationActions} from 'react-navigation';

let defaultState = AppNavigator.router.getStateForAction({routeName: 'Home'});

const BACK = 'Navigation/BACK';
const INIT = 'Navigation/INIT';
const NAVIGATE = 'Navigation/NAVIGATE';
const RESET = 'Navigation/RESET';
const SET_PARAMS = 'Navigation/SET_PARAMS';
const URI = 'Navigation/URI';
const GOTO_AND_CLOSE = "GOTO_AND_CLOSE";//跳转并且关闭某些历史界面

export const goto = createAction(NAVIGATE, (routeName, params) => {
    return NavigationActions.navigate({routeName: routeName, params: params})
});
export const goBack = createAction(BACK, (routeName,params) => {
    console.log('====>', routeName);
    if (routeName) {
        if(params){
            return {routeName: routeName, params: params};
        }
        if(typeof routeName === 'object' && routeName){
            params = routeName;
            return {params: params};
        }
        return {routeName: routeName};
    } else {
        return NavigationActions.back();
    }
});
export const init = createAction(INIT);
export const reset = createAction(RESET);
export const setParams = createAction(SET_PARAMS);
export const uri = createAction(URI);

/**
 * 跳转并且关闭某些历史界面
 */
export const gotoAndClose = createAction(GOTO_AND_CLOSE, (targetRouteName, closeTargetRouteName, params) => {
    if (!closeTargetRouteName) {//如果不存在关闭的页面，直接走跳转逻辑
        return NavigationActions.navigate({routeName: targetRouteName, params: params})
    } else {
        return {targetRouteName, closeTargetRouteName, params};
    }
});

const reducer = handleActions({
    [combineActions(goto, goBack, init, reset, setParams, uri,gotoAndClose)]: (state, action) => {
        let payload = action.payload;
        switch (action.type){
            case BACK:{
                if(!payload)break;
                if(payload.routeName && payload.params){
                    return _goBackToTargetRouteWithParams(state,payload.routeName,payload.params);
                }
                if (payload.routeName) {
                    return _goBackToTargetRoute(state, payload.routeName);
                }

                if (payload.params) {
                    return _goBackToTargetRouteWithParams(state,'', payload.params);
                }
            }
            break;
            case GOTO_AND_CLOSE:
                let {targetRouteName, closeTargetRouteName, params} = payload;
                return _gotoAndClose(state, targetRouteName, closeTargetRouteName, params);
            default:
                action = action.payload;
                break;
        }
        const newState = AppNavigator.router.getStateForAction(action, state);
        return newState || state;
    }
}, defaultState);

/**
 * 返回第一个匹配的界面，匹配的页面后面的页面将会被已移除
 * @param state
 * @param routeName
 * @returns {*}
 */
_goBackToTargetRoute = (state, routeName) => {
    let newState = Object.assign({},state);
    let routes = [];
    for (let i = 0; i < newState.routes.length; i++) {
        let item = newState.routes[i];
        routes.push(item);
        if (item.routeName === routeName) {
            // {"index":1,"routes":[{"routeName":"Home","key":"Init-id-1511938008610-0"},{"params":{"name":"ljj"},"key":"id-1511938008610-1","routeName":"Home2"}]}
            return {index: i, routes};
        }
    }
    return newState;
};

/**
 * 返回第一个匹配的界面，匹配的页面后面的页面将会被已移除,带参数输入，实际执行的是reset方法
 * @param state
 * @param routeName
 * @param params
 * @private
 */
_goBackToTargetRouteWithParams = (state,routeName,params)=>{
    let tempState = _goBackToTargetRoute(state,routeName);
    if(routeName === ''){
        tempState.index = tempState.index - 1;
    }
    let actions = [];
    tempState.routes.map((item,index) =>{
        if(index === (tempState.index)){
            actions.push(NavigationActions.navigate({routeName: item.routeName, params: params}));
        }else if(index !== tempState.routes.length - 1){
            actions.push(NavigationActions.navigate({routeName:item.routeName}))
        }
    });

    let resetAction = NavigationActions.reset({
        index: tempState.index,
        actions: actions
    });

    return AppNavigator.router.getStateForAction(resetAction, tempState);
};

/**
 * 跳转新的页面并且关闭指定页面和之后的页面
 * @param state
 * @param targetRouteName
 * @param closeTargetRouteName
 * @param params
 * @returns {{}}
 */
_gotoAndClose = (state, targetRouteName, closeTargetRouteName, params) => {
    let tempState = Object.assign({},state);
    let routeActions = [];
    for (let i = 0; i < tempState.routes.length; i++) {
        let item = tempState.routes[i];
        if (item.routeName === closeTargetRouteName) break;
        routeActions.push(NavigationActions.navigate(item));
    }

    routeActions.push(NavigationActions.navigate({routeName: targetRouteName,params: params}));
    let routeIndex = routeActions.length - 1>0?routeActions.length - 1:0;
    let resetAction = NavigationActions.reset({
        index: routeIndex,
        actions: routeActions
    });
    return AppNavigator.router.getStateForAction(resetAction, tempState);
};

export default reducer;
