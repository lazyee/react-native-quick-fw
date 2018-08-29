import {combineActions, createActions, createAction, handleActions} from 'redux-actions';

let defaultState = {
    user:{}
};
export const {saveUser, clearUser} = createActions({
    SAVE_USER: user => user,
    CLEAR_USER: (user) => {},

});

const reducer = handleActions({
    SAVE_USER: (state, action) => ({...state, user:action.payload}),
    CLEAR_USER: (state, action) => ({...state, user:{}}),
}, defaultState);

export default reducer;