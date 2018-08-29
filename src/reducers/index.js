import UserReducer from './UserReducer';
import {getRouterReducer} from './RouterReducer';
import CacheReducer from './CacheReducer';

export function getReducer() {
    return {
        userStore: UserReducer,
        nav:getRouterReducer(),
        cacheStore:CacheReducer,
    }
};