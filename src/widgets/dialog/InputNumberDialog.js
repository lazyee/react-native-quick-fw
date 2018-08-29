import React, {Component} from 'react';
import {Animated, StyleSheet,Platform, Text, TouchableOpacity, View} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "../../common/AppUtil";
import InputNumberView from "../InputNumberView";

export default class InputNumberDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            offset: new Animated.Value(0),
            hide: true,
        };
    }

    static defaultProps={
        inputNumberFunc:undefined,
        onDelFunc:undefined,
        onClearFunc:undefined,
        onDismiss:undefined,
    };

    //显示动画
    in() {
        Animated.parallel([
            Animated.timing(this.state.offset,
                {
                    duration: 300,
                    toValue: 1,
                }
            )
        ]).start();
    }

    //隐藏动画
    out() {
        Animated.parallel([
            Animated.timing(this.state.offset,
                {
                    duration: 300,
                    toValue: 0,
                }
            )
        ]).start();

        setTimeout(() => this.setState({hide: true}), 300);
    }

    //取消
    dismiss() {
        console.log('dismiss');
        if (!this.state.hide) {
            this.out();
            if(this.props.onDismiss){
                this.props.onDismiss();
            }
        }
    }


    show() {
        if (this.state.hide) {
            this.setState({hide: false,}, this.in);

        }
    }

    render() {
        let {inputNumberFunc,onDelFunc,onClearFunc} = this.props;

        let content = this.state.hide ? null : (<View style={[styles.container,]}>
                <Text onPress={this.dismiss.bind(this)} style={[styles.mask,Platform.OS === 'android'?null:{backgroundColor:'#00000000'}]} />
                <Animated.View style={[{
                    transform: [{
                        translateY: this.state.offset.interpolate({
                            inputRange: [0, 1],
                            outputRange: [SCREEN_HEIGHT, SCREEN_HEIGHT - 200 - (Platform.OS === 'android'?20:0)]
                        }),
                    }]
                }]}>
                    <View style={{backgroundColor:'white'}}>
                        <InputNumberView
                            inputNumberFunc={password=>{
                                if (inputNumberFunc) {
                                    inputNumberFunc(password)
                                }
                            }}
                             onDelFunc={()=>{
                                 if(onDelFunc){
                                     onDelFunc();
                                 }
                             }}
                            onClearFunc={()=>{
                                console.warn('onClearFunc');
                                if(onClearFunc){
                                    onClearFunc();
                                }
                            }}
                        />
                    </View>
                </Animated.View>
            </View>
        );

        return content;
    }
}

const styles = StyleSheet.create({
        container:{
        position: "absolute",
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        left: 0,
        top: 0,
    },
    mask: {
        justifyContent: "center",
        position: "absolute",
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        left: 0,
        top: 0,
    },
});