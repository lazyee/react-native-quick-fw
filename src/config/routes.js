import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import {
    Animated,
} from "react-native";

import Index from '../components/test/TestUserForRedux';
import Index2 from '../components/test/TestUserForRedux2';
import Index3 from '../components/test/TestUserForRedux3';

export const routes = {
    Home: {screen: Index},
    Home2: {screen: Index2},
    Home3: {screen: Index3},
};

export const routerConfig =
    {
        initialRouteName: 'Home', // 默认显示界面
        navigationOptions: {  // 屏幕导航的默认选项, 也可以在组件内用 static navigationOptions 设置(会覆盖此处的设置)
            header: null,
            cardStack: {
                gesturesEnabled: false
            },
        },
        // mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
        transitionConfig: () => ({//设置页面切换动画
            screenInterpolator: CardStackStyleInterpolator.forHorizontal,
            transitionSpec: {
                duration: 250,
                timing: Animated.timing,
            },
        }),

        headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
        onTransitionStart: () => {console.log('导航栏切换开始');},
        onTransitionEnd: () => {console.log('导航栏切换结束');}
    };
