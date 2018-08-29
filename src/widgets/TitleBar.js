import React, {Component} from 'react';
import {Image, NativeModules, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';

import {backIco, shareIco} from '../constraint/Image';
import {connect} from 'react-redux';
import {mainColor} from '../constraint/Colors';
import {goBack} from '../reducers/RouterReducer';
import {SCREEN_WIDTH} from "../utils/AppUtil";
import IPhoneXTop from "./iphonex/IPhoneXTop";


class TitleBar extends Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        title: "标题",
        onlyTitle: false,
        hideRight: true,
        hideLeft: false,
        showShadow:true,
        customBarStyle: {},
        customBarTextStyle: {},
        customRightView: null,
        customLeftView: null,
        onBackViewClick: null,//function
        onRightViewClick: null,//function
        statusBarBackgroundColor:'black',
        statusBarStyle:Platform.OS === 'android'?'light-content':'dark-content'
    };

    render() {
        const {customLeftView,dispatch,showShadow, onBackViewClick, onRightViewClick} = this.props;
        let leftView = (this.props.hideLeft || this.props.onlyTitle) ? <View style={styles.leftViewLayout}/> : (

            <View style={styles.leftViewLayout}>

                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.icoLayout}
                    onPress={() => {
                        if (onBackViewClick) {
                            onBackViewClick();
                        } else {
                            let {nav, dispatch} = this.props;
                            if (nav.index === 0) {
                                if(NativeModules.NativeControlModule){
                                    NativeModules.NativeControlModule.finish();
                                }
                            }
                            dispatch(goBack());
                        }
                    }}>
                    {customLeftView?customLeftView():<Image source={backIco} style={styles.backIco}/>}
                </TouchableOpacity>
            </View>
        );
        let rightView = (this.props.onlyTitle || this.props.hideRight) ? <View style={styles.rightViewLayout}/> : (
            <View style={styles.rightViewLayout}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.icoLayout}
                    onPress={onRightViewClick}>
                    {
                        this.props.customRightView ? this.props.customRightView() : (
                            <Image source={{uri: shareIco}} style={styles.backIco}/>
                        )
                    }
                </TouchableOpacity>
            </View>
        );

        const backgroundColor  = this.props.customBarStyle.backgroundColor;
        const backgroundColorStyle = backgroundColor?{backgroundColor}:{};

        return (
            <View style={[styles.header,(showShadow?styles.shadow:null),this.props.style,this.props.customBarStyle]}>
                <StatusBar
                    backgroundColor={this.props.statusBarBackgroundColor}
                    translucent={false}
                    barStyle={this.props.statusBarStyle}
                />
                <IPhoneXTop style={backgroundColorStyle?backgroundColorStyle:{}}/>
                <View style={styles.content}>

                    <View style={styles.titleLayout}>
                        <Text numberOfLines={1} style={[styles.titleText, this.props.customBarTextStyle]}>{this.props.title}</Text>
                    </View>
                    {leftView}
                    {rightView}
                </View>
            </View>

        );
    }
}

const titleBarHeight = 45;
const styles = StyleSheet.create({
    header: {
        backgroundColor: 'white',
        // borderBottomWidth:0.5,
        // borderBottomColor:line,

    },
    shadow:{
        shadowColor:'gray',
        shadowOffset:{height:2,width:2},
        shadowRadius:3,
        shadowOpacity:0.2,
        elevation: 3,
    },

    content: {
        flexDirection: 'row',
    },
    icoLayout: {

        height: titleBarHeight,
        padding: 10,
        justifyContent: 'center',
        alignItems:'center',
    },
    backIco: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    titleLayout: {
        height: titleBarHeight,
        width: SCREEN_WIDTH - titleBarHeight * 2,
        justifyContent: 'center',
        flex:1,

    },
    titleText: {
        color: mainColor,
        fontSize: 17,
        textAlign: 'center',
    },
    leftViewLayout: {
        position:'absolute',
        width: titleBarHeight,
        height: titleBarHeight,
        justifyContent: 'center',
    },
    rightViewLayout: {
        position:'absolute',
        right:0,
        // width: titleBarHeight,
        height: titleBarHeight,
        justifyContent: 'center',
    },
    rightText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 15,
    }
});

selector=(state)=>{
  return {
      nav:state.nav
  }
};
export default connect(selector)(TitleBar);