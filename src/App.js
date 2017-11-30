import React, {Component} from 'react';
import {configureStore} from './app/Store';
import {Provider} from 'react-redux';
import AppWithNavigationState from './components/routers/AppWithNavigationState';
import {PersistGate} from "../node_modules/redux-persist/es/integration/react";

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
                <PersistGate persistor={persistor}>
                <AppWithNavigationState/>
                </PersistGate>
            </Provider>
        )
    }
}

