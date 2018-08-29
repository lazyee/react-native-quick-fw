import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

import {isIphoneX} from "react-native-iphone-x-helper";

const width = Dimensions.get('window').width;

export default class IPhoneXBottom extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {style} = this.props;
        return (
            isIphoneX() ?
                <View style={[styles.defaultStyle, style]}/> : null
        )
    }
}

const styles = StyleSheet.create({
    defaultStyle: {
        height: 34,
        width: width,
        backgroundColor: 'white'
    }
});