import React, {Component} from 'react';
import {configureStore} from './config/ReduerConfig';
import {Provider} from 'react-redux';
import AppWithNavigationState, {initAppNavigator} from './components/routers/AppWithNavigationState';
import {PersistGate} from "../node_modules/redux-persist/es/integration/react";
import {updateHttpConfig} from "./app/LRequest";

let storeConfig = null;

export default class App extends Component {
    constructor(props) {
        super(props);
        console.log('=======');
        console.log(this.props);
        console.log('=======');

        updateHttpConfig(props);
        // if(!this.props.token){
        //     initAppNavigator('Login');//此方法必须最先调用，否则路由配置会出问题
        // }else{
        initAppNavigator(props.initialPage);//此方法必须最先调用，否则路由配置会出问题
        // }
        storeConfig = configureStore();

        this.state = {
            store: storeConfig.store,
        };
    }


    render() {

        return (
            <Provider store={this.state.store}>
                <PersistGate persistor={storeConfig.persistor}>
                <AppWithNavigationState/>
                </PersistGate>
            </Provider>
        )
    }
}

