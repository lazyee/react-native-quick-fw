import React, {Component} from 'react';
import {TabBarBottom, TabNavigator} from "react-navigation";
import {
    ic_index_tab1,
    ic_index_tab1_selected,
    ic_index_tab2,
    ic_index_tab2_selected,
    ic_index_tab3,
    ic_index_tab3_selected,
    ic_index_tab4,
    ic_index_tab4_selected,
} from '../constraint/Image';
import {mainBackgroundColor, mainColor} from "../constraint/Colors";
import { Platform, StatusBar,Image, View} from "react-native";
import {connect} from "react-redux";
import {goto} from "../reducers/RouterReducer";
import {setToken} from "../app/LRequest";
import Test1 from "./test/Test1";
import Test4 from "./test/Test4";
import Test3 from "./test/Test3";
import Test2 from "./test/Test2";

let token = undefined;
let dispatch = undefined;
let globalTabIndex = 0;
class Main extends Component {

    constructor(props){
        super(props);

        this.stackIndex = 0;
        setToken(this.props.token);
    }

    componentDidMount() {
        token = this.props.token;
        dispatch = this.props.dispatch;
        globalTabIndex = this.refs.tab.state.nav.index;
        let {initialRouteName} = this.props.navigation.state.params?this.props.navigation.state.params:{undefined};
        if(initialRouteName){
            this.switchTab(initialRouteName);
        }
    }

    componentWillReceiveProps(nextProps) {
        token = nextProps.token;
        let stackIndex = nextProps.nav.index;
        let tabIndex = this.refs.tab.state.nav.index;
        console.log(stackIndex,tabIndex,token);
        //可以获取tab的点击
        if(stackIndex === 0 && tabIndex === 3){

        }if(stackIndex !== 0){
        }
    }


    /**
     * 切换到指定界面
     * @param tabName
     */
    switchTab(tabName) {
        this.refs.tab._navigation.navigate(tabName);
    }

    render() {
        token = this.props.token;
        return (
            <View style={{flex: 1}}>
                <StatusBar
                    backgroundColor={'black'}
                    translucent={false}
                    barStyle={Platform.OS === 'android'?'light-content':'dark-content'}/>
                <Tab ref='tab'/>
                {/*{this.props.shoppingCartProductTotalCount === 0 ? null : (*/}
                    {/*<View style={{*/}
                        {/*bottom: 30 + (isIphoneX() ? 35 : 0),*/}
                        {/*right: SCREEN_WIDTH / 4 + SCREEN_WIDTH / 14,*/}
                        {/*position: 'absolute',*/}
                        {/*borderRadius: 7.5,*/}
                        {/*paddingLeft: 3,*/}
                        {/*paddingRight: 3,*/}
                        {/*minWidth: 15,*/}
                        {/*minHeight: 15,*/}
                        {/*alignItems: 'center',*/}
                        {/*justifyContent: 'center',*/}
                        {/*backgroundColor: mainColor,*/}
                    {/*}}>*/}
                        {/*<Text style={{*/}
                            {/*color: 'white',*/}
                            {/*fontSize: 10,*/}
                            {/*backgroundColor: '#00000000',*/}
                        {/*}}>{this.props.shoppingCartProductTotalCount}</Text>*/}
                    {/*</View>*/}
                {/*)}*/}
            </View>

        );
    }
}

class TabBarItem extends Component {


    constructor(props) {
        super(props);
    }

    static defaultProps = {
        focused: false,
        normalImage: NaN,
        selectedImage: NaN,
    };

    static propTypes = {
        tintColor: React.PropTypes.string,
        focused: React.PropTypes.bool,
        normalImage: React.PropTypes.number,
        selectedImage: React.PropTypes.number,
    };

    render() {
        return (
            <View style={{width: 26, height: 26}}>

                <Image source={ this.props.focused ? this.props.selectedImage : this.props.normalImage }
                       style={ {width: 26, height: 26} }/>
            </View>
        );
    }
}

judgeTabState = ({scene, jumpToIndex}) => {

    if (!token) {//点击tab 拦截，如果有些是需要登录的，未登录则跳转到登录界面
        globalTabIndex = scene.index;
        jumpToIndex(scene.index);
    }else {
        dispatch(goto('Login'));
    }
};

const TabNavigatorConfigs = {
        initialRouteName: 'Index',
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        lazy: true,
        swipeEnabled: false,
        animationEnabled: false,
        backBehavior: 'none',
        tabBarOptions: {
            activeTintColor: mainColor,
            inactiveTintColor: '#2c2c2c',
            style: {backgroundColor: '#ffffff',borderTopWidth:1,borderTopColor:mainBackgroundColor},
            labelStyle: {
                fontSize: 11, // 文字大小
            },
        }
    };



const TabRouteConfigs = {
    Index: {
        screen: Test1,
        navigationOptions: ({navigation}) => ({
            tabBarLabel: '主页',
            tabBarIcon: ({focused, tintColor}) => (
                <TabBarItem
                    tintColor={tintColor}
                    focused={focused}
                    normalImage={ic_index_tab1}
                    selectedImage={ic_index_tab1_selected}
                />
            ),
        }),
    },
    Team: {
        screen: Test2,
        navigationOptions: {
            tabBarLabel: '分类',
            tabBarIcon: ({focused, tintColor}) => (
                <TabBarItem
                    tintColor={tintColor}
                    focused={focused}
                    normalImage={ic_index_tab2}
                    selectedImage={ic_index_tab2_selected}
                />
            ),
            tabBarOnPress: (({scene, jumpToIndex}) => {
                judgeTabState({scene, jumpToIndex});
            }),
        },
    },
    Personal: {
        screen: Test3,
        navigationOptions: {
            tabBarLabel: '购物车',
            tabBarIcon: ({focused, tintColor}) => (
                <TabBarItem
                    tintColor={tintColor}
                    focused={focused}
                    normalImage={ic_index_tab3}
                    selectedImage={ic_index_tab3_selected}
                />
            ),
            tabBarOnPress: (({scene, jumpToIndex}) => {
                judgeTabState({scene, jumpToIndex});
            }),
        },
    },
    Mine: {
        screen: Test4,
        navigationOptions: {
            tabBarLabel: '我的',
            tabBarIcon: ({focused, tintColor}) => (
                <TabBarItem
                    tintColor={tintColor}
                    focused={focused}
                    normalImage={ic_index_tab4}
                    selectedImage={ic_index_tab4_selected}
                />
            ),
            tabBarOnPress: (({scene, jumpToIndex}) => {
                judgeTabState({scene, jumpToIndex});
            }),
        },
    },
};

const Tab = TabNavigator(TabRouteConfigs, TabNavigatorConfigs);


selector = (state) => {
    return {
        token: state.userStore.token,
        nav: state.nav,
    }
};
export default connect(selector)(Main);