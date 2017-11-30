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

export const goto = createAction(NAVIGATE,(routeName,params)=> NavigationActions.navigate({routeName: routeName,params:params}));
export const goBack = createAction(BACK,(routeName)=>{
    if(routeName){
        return {routeName: routeName};
    }else{
        return NavigationActions.back();
    }
});
export const init = createAction(INIT);
export const reset = createAction(RESET);
export const setParams = createAction(SET_PARAMS);
export const uri = createAction(URI);

const reducer = handleActions({
    [combineActions(goto, goBack,init,reset,setParams,uri)]: (state, action) => {
        if(action.payload){
            if(action.type === BACK){
                let routes = [];
                for(let i = 0;i<state.routes.length;i++) {
                    let item = state.routes[i];
                    routes.push(item);
                    if (item.routeName === action.payload.routeName) {
                        // {"index":1,"routes":[{"routeName":"Home","key":"Init-id-1511938008610-0"},{"params":{"name":"ljj"},"key":"id-1511938008610-1","routeName":"Home2"}]}
                        return {index:i,routes};
                    }
                }
            }else{
                action = action.payload;
            }
        }
        const newState = AppNavigator.router.getStateForAction(action, state);
        return newState || state;
    }
}, defaultState);

export default reducer;
