import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import {Animated, Platform,} from "react-native";

import getSceneIndicesForInterpolationInputRange
    from "react-navigation/src/utils/getSceneIndicesForInterpolationInputRange";
import * as I18nManager from "react-native/Libraries/ReactNative/I18nManager";

import Test1 from "../components/test/Test1";
import Test2 from "../components/test/Test2";
import Test3 from "../components/test/Test3";
import Test4 from "../components/test/Test4";
import Main from "../components/Main";

export const routeConfig = {
    Main: {screen: Main},
    Test1: {screen: Test1},
    Test2: {screen: Test2},
    Test3: {screen: Test3},
    Test4: {screen: Test4},
};

export function getRouterConfig(initPage){

    return {
        // Store
        initialRouteName: initPage, // 默认显示界面
        navigationOptions: {  // 屏幕导航的默认选项, 也可以在组件内用 static navigationOptions 设置(会覆盖此处的设置)
            header: null,
            gesturesEnabled: false,//是否支持滑动返回手势，iOS默认支持，安卓默认关闭
        },
        // mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
        transitionConfig: () => ({//设置页面切换动画
            // screenInterpolator: AndroidTransition,
            // screenInterpolator: CardStackStyleInterpolator.forHorizontal,
            screenInterpolator: Platform.OS === 'android' ?
                AndroidTransition
                :CardStackStyleInterpolator.forHorizontal,
            transitionSpec: {
                duration: 250,
                timing: Animated.timing,
            },
        }),

        headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
        // onTransitionStart: () => {console.warn('导航栏切换开始');},
        // onTransitionEnd: () => {console.warn('导航栏切换结束');}
    };
}

const AndroidTransition = (props) => {
    const { layout, position, scene } = props;


    const interpolate = getSceneIndicesForInterpolationInputRange(props);

    if (!interpolate) return { opacity: 0 };

    const { first, last } = interpolate;
    const index = scene.index;
    const opacity = position.interpolate({
        inputRange: [first, first + 0.01, index, last - 0.01, last],
        outputRange: ([0, 1, 1, 0.85, 0]: Array<number>),
    });

    const width = layout.initWidth;
    const translateX = position.interpolate({
        inputRange: ([first, index, last]: Array<number>),
        outputRange: I18nManager.isRTL
            ? ([-width, 0, width * 0.3]: Array<number>)
            : ([width, 0, 0]: Array<number>),
    });
    const translateY = 0;

    return {
        opacity,
        transform: [{ translateX }, { translateY }],
    };
};


