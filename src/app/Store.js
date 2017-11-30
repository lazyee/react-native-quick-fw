import {persistStore, persistCombineReducers,} from 'redux-persist'
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import storage from 'redux-persist/es/storage' // default: localStorage if web, AsyncStorage if react-native
import reducers from '../reducers/index' // where reducers is an object of reducers

//白名单 在这里添加的reducers的state都将加入Store存储
const whiteList = [
    'userStore'
];

//缓存配置
const config = {
    key: 'root',
    storage,
    whitelist: whiteList,
};

export function configureStore() {
    let store = createStore(
        persistCombineReducers(config, reducers),
        applyMiddleware(thunk),
    );
    let persistor = persistStore(store);
    return {persistor, store}
}
