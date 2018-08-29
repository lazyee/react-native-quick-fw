import {createActions, handleActions} from 'redux-actions';

let defaultState = {
    loadingDialog:{
        visible:false,
        isCanceledOnTouchOutside:false,
    },

    loginInvalidDialog:{
        visible:false,
        forceLogout:true,
        title:'您的登录已经失效'
    },
};
export const {
    showLoadingDialog,
    showLoginInvalidDialog,
    } = createActions({
    SHOW_LOGIN_INVALID_DIALOG:(visible = false,forceLogout = true,title='您的登录已经失效') =>({visible,forceLogout,title}),
    SHOW_LOADING_DIALOG:(visible = false,isCanceledOnTouchOutside = false)=>({visible,isCanceledOnTouchOutside}),
});

const reducer = handleActions({
    SHOW_LOGIN_INVALID_DIALOG:(state,action)=>({...state,loginInvalidDialog:action.payload}),
    SHOW_LOADING_DIALOG:(state,action)=>({...state,loadingDialog:action.payload}),
}, defaultState);

export default reducer;