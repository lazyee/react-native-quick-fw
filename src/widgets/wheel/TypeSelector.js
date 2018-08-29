'use strict';
import React, {Component} from 'react';
import {Animated, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {isIphoneX} from "react-native-iphone-x-helper";
import Wheel from '../../widgets/wheel/Wheel';
import PropsType from 'prop-types'
import { mainColor} from "../../constraint/Colors";

const defaultTop = Platform.OS === 'android' ? ((Platform.Version >= 21) ? 0 : 25) : 0;
const topValue = 44;

const {width, height} = Dimensions.get('window');
const navigatorH = 64; // navigator height
const [aWidth, aHeight] = [width, height/3];
const [left, top] = [0, 0];
const [middleLeft] = [(width - aWidth) / 2, (height - aHeight) / 2 - navigatorH];
export default class TypeSelector extends Component {
    static propTypes = {
        province: PropsType.string,
        city: PropsType.string,
        street: PropsType.string,
        onValueChange: PropsType.func,
        onCancelPress: PropsType.func,
        onSurePress: PropsType.func,
        ...View.propTypes
    };

    constructor(props) {
        super(props);

        this.signTypeSelectedIndex = 0;
        this.state = {
            offset: new Animated.Value(0),
            opacity: new Animated.Value(0),
            hide: true,

        };
    }

    //选择
    onSurePress() {
        if(!this.state.hide) this.out();
        this.props.onSurePress && this.props.onSurePress(this.getChooseIndex())
    }

    getChooseIndex() {

        // return this.state.signTypeList[this.signTypeSelectedIndex];
        return this.signTypeSelectedIndex;
    }

    //显示动画
    in() {
        Animated.parallel([
            Animated.timing(this.state.opacity, {duration: 450, toValue: 0.8}),
            Animated.timing(this.state.offset, {duration: 450, toValue: 1}),
        ]).start();
    }

    //隐藏动画
    out(){
        Animated.parallel([
            Animated.timing(this.state.opacity, {duration: 300, toValue: 0}),
            Animated.timing(this.state.offset, {duration: 300, toValue: 0}),
        ]).start();
        setTimeout(() => this.setState({hide: true}), 300);
    }

    //取消
    dismiss() {
        if(!this.state.hide) this.out();
    }

    show(signTypeList) {
        if(this.state.hide) this.setState({hide: false,signTypeList,}, this.in);
    }
    render() {
        let content = this.state.hide ? null :
            ( <View style={styles.container}>
                <Animated.View style={styles.mask}>
                    <Text style={styles.mask} onPress={this.dismiss.bind(this)}/>
                </Animated.View>

                <Animated.View style={[styles.tip, {
                    transform: [{
                        translateY: this.state.offset.interpolate({
                            inputRange: [0, 1],
                            outputRange: [height, (height - aHeight - (isIphoneX() ? topValue : defaultTop))]
                        }),
                    }]
                }]}>
                    <View style={styles.topView}>
                        <TouchableOpacity
                            onPress={() => this.dismiss()}>
                            <Text style={{color: mainColor, paddingHorizontal: 10}}>取消</Text>
                        </TouchableOpacity>
                        <Text style={{color: 'black', fontSize: 16}}>类型选择</Text>
                        <TouchableOpacity
                            onPress={() => this.onSurePress()}>
                            <Text style={{color: mainColor, paddingHorizontal: 10}}>确定</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {this.renderWheel()}
                    </View>
                </Animated.View>
            </View>);
        return content;
    }

    renderWheel() {

            return <Wheel
                style={styles.wheelStyle}
                itemStyle={styles.wheelText}
                onChange={(index) => {
                    this.signTypeSelectedIndex = index;
                }}
                holeLine={2}
                index={this.signTypeSelectedIndex}
                items={this.state.signTypeList}
            />
    }

}

const styles = StyleSheet.create({
    container: {
        position:"absolute",
        width:width,
        height:height,
        left:left,
        top:top,
        elevation: 5,
    },
    mask: {
        justifyContent:"center",
        backgroundColor:"#383838",
        opacity:0.3,
        position:"absolute",
        width:width,
        height:height,
        left:left,
        top:top,
    },
    tip: {
        width:aWidth,
        height:aHeight,
        left:middleLeft,
    },
    topView: {
        height: 40,
        width:aWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        backgroundColor:"#fff",
    },
    wheelStyle: {
        flex: 1,
    },
    wheelText:{
        marginVertical:10,
        textAlign: 'center',
        fontSize: 18,
        color: mainColor
    }
});