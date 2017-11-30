import React, {Component} from 'react';
import {StackNavigator, addNavigationHelpers} from 'react-navigation';
import {connect} from 'react-redux';
import {routes, routerConfig} from '../../config/routes';
import {goBack} from '../../reducers/RouterReducer';
import {
    Platform,
    BackHandler
} from 'react-native';

export const AppNavigator = StackNavigator(routes, routerConfig);
class AppWithNavigationState extends Component {
    constructor(props) {
        super(props);

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
            <AppNavigator
                navigation={addNavigationHelpers({dispatch, state: nav})}
            />
        )
    }
}

selector = (state) => {
    return {
        nav: state.nav
    }
};
export default connect(selector)(AppWithNavigationState);
