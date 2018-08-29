import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';

import {isIphoneX} from "react-native-iphone-x-helper";
import {SCREEN_WIDTH} from "../../utils/AppUtil";

export default class IPhoneXTop extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {style} = this.props;
        return (
            <View style={[styles.top, style]}/>
        )
    }
}

const styles = StyleSheet.create({
    top: {
        height: Platform.OS === 'android'?0:(isIphoneX()?44:20),
        width: SCREEN_WIDTH,
        // backgroundColor: 'white'
    }
});