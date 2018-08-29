import React, {Component} from 'react';
import {addNavigationHelpers, StackNavigator} from 'react-navigation';
import {connect} from 'react-redux';
import {getRouterConfig, routeConfig} from '../../config/RouteConfig';
import {goBack} from '../../reducers/RouterReducer';
import {BackHandler, Platform, View} from 'react-native';
import LoadingDialog from "../../widgets/dialog/LoadingDialog";
import {configDispatchFunc} from "../../app/LRequest";
import LoginInvalidDialog from "../../widgets/dialog/LoginInvalidDialog";


let AppNavigator = null;
// let AppNavigator = StackNavigator(routeConfig, getRouterConfig(getInitPage('123')));

export function initAppNavigator(initialPage) {
    AppNavigator = StackNavigator(routeConfig, getRouterConfig(initialPage));
}

export function getStateForAction(action,state){
    action = AppNavigator.router.getStateForAction(action,state);
    return action;
}

class AppWithNavigationState extends Component {
    constructor(props) {
        super(props);
        configDispatchFunc(this.props.dispatch);
    }

    componentDidMount() {
        if(Platform.OS === 'android'){
            BackHandler.addEventListener('hardwareBackPress', () => {
                    let {nav, dispatch} = this.props;
                    if (nav.index === 0) {
                        return false;
                    } else {
                        this.props.dispatch(goBack());
                        return true;
                    }
                }
            );
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress',()=>{});
        }
    }

    render() {
        const {nav, dispatch} = this.props;

        return (
            <View style={{flex:1}}>
                <LoginInvalidDialog/>
                <LoadingDialog/>
                <AppNavigator navigation={addNavigationHelpers({dispatch, state: nav})}/>
            </View>

        )
    }
}

selector = (state) => {
    return {
        nav: state.nav,
    }
};
export default connect(selector)(AppWithNavigationState);
