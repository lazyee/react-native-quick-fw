import React, {Component} from 'react';
import {
    View,
} from 'react-native';
import {configureStore} from './app/Store';
import {Provider} from 'react-redux';
import TestUser from './components/test/TestUserForRedux';
import AppWithNavigationState from './components/routers/AppWithNavigationState';

const {persistor, store} = configureStore();

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            store: store,
        };
    }


    render() {

        return (
            <Provider store={this.state.store}>
                <AppWithNavigationState/>
            </Provider>
        )
    }
}

