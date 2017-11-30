import {combineActions, createActions, createAction, handleActions} from 'redux-actions';

let defaultState = {
    user:
        {
            sex: '未知性别'
        }
};
export const {saveUser, clearUser} = createActions({
    SAVE_USER: user => user,
    CLEAR_USER: (user) => {},

});

const reducer = handleActions({
    SAVE_USER: (state, action) => ({...state, user:action.payload}),
    CLEAR_USER: (state, action) => ({...state, user: null}),
}, defaultState);

export default reducer;