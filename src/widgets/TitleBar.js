import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Platform,
    Image,
    TouchableOpacity,
} from 'react-native';

import {
    whiteBackIco,
    blackBackIco,
    shareIco
} from '../constraint/Image';

const {width} = Dimensions.get('window');

class TitleBar extends Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        title: "标题",
        onlyTitle: false,
        hideRight: true,
        isWhiteBackIco:false,
        customBarStyle: {},
        customBarTextStyle: {},
        clickRightIcoCallback:null
    };

    /**
     * 返回上一个界面
     * @private
     */
    _goBack() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    render() {
        let backImage = this.props.isWhiteBackIco?(
            <Image source={{uri:whiteBackIco}} style={styles.backIco}/>
        ):(
            <Image source={{uri:blackBackIco}} style={styles.backIco}/>
        );
        let title = this.props.onlyTitle ? null : (
            <TouchableOpacity
                onPress={() => this._goBack()}>
                <View style={styles.back}>
                    {backImage}
                </View>
            </TouchableOpacity>
        );
        let titleRight = (this.props.onlyTitle || this.props.hideRight) ? null : (
            <View style={styles.rightLayout}>
                <TouchableOpacity
                    style={styles.back}
                    onPress={this.props.clickRightIcoCallback}>
                        <Image source={{uri:shareIco}} style={styles.backIco}/>
                </TouchableOpacity>
            </View>
        );

        return (
            <View style={[styles.header, this.props.customBarStyle]}>
                <View style={styles.titleLayout}>
                    <Text style={[styles.titleText, this.props.customBarTextStyle]}>{this.props.title}</Text>
                </View>
                {title}
                {titleRight}
            </View>
        );
    }
}

const titleBarHeight = 45;
const topValue = 44;
const styles = StyleSheet.create({
    header: {
        paddingTop: Platform.OS === 'android' ? 0 : topValue,
        height: Platform.OS === 'android' ? titleBarHeight : (topValue + titleBarHeight),
        flexDirection: 'row',
        position: 'relative',
        backgroundColor: 'white',
    },
    back: {
        width: titleBarHeight,
        height: titleBarHeight,
        padding: 15,
    },
    backIco: {
        width: 15,
        height: 15,
        resizeMode:'contain',
    },
    titleLayout: {
        top: Platform.OS === 'android' ? 0 : topValue,
        position: 'absolute',
        height: titleBarHeight,
        width: width,
        justifyContent: 'center',

    },
    titleText: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
    },
    rightLayout: {
        top: Platform.OS === 'android' ? 0 : topValue,
        right: 0,
        width: 60,
        left:width-45,
        position: 'absolute',
        height: titleBarHeight,
        justifyContent: 'center',
    },
    rightText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 15,
    }
});

module.exports = TitleBar;