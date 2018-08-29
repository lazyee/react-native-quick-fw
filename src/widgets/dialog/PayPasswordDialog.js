import React, {Component} from 'react';
import {Animated, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {mainBackgroundColor, placeholderTextColor, titleTextColor} from "../../constraint/Colors";
import {ic_cancelPay_cross} from "../../constraint/Image";
import XImage from "../XImage";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "../../common/AppUtil";
import InputNumberView from "../InputNumberView";

const {width} = Dimensions.get('window');

export default class PayPasswordDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            offset: new Animated.Value(0),
            opacity: new Animated.Value(0),
            hide: true,
            password: [],
        };

        this.isAnimPlaying = false;
    }

    static defaultProps = {
        onPasswordInputEnd: undefined
    };


    //显示动画
    in() {
        this.isAnimPlaying = true;
        Animated.parallel([
            Animated.timing(this.state.opacity,
                {
                    duration: 450,
                    toValue: 0.5,
                }
            ),
            Animated.timing(this.state.offset,
                {
                    duration: 450,
                    toValue: 1,
                }
            )
        ]).start();


        setTimeout(() => {this.isAnimPlaying = false}, 300);
    }

    //隐藏动画
    out() {
        this.isAnimPlaying = true;
        Animated.parallel([
            Animated.timing(this.state.opacity,
                {
                    duration: 300,
                    toValue: 0,
                }
            ),
            Animated.timing(this.state.offset,
                {
                    duration: 300,
                    toValue: 0,
                }
            )
        ]).start();

        setTimeout(() => {
            this.isAnimPlaying = false;
            this.setState({hide: true});
        },300);
    }

    //取消
    dismiss() {
        if (!this.state.hide) {
            this.out();
        }
    }


    show() {
        if (this.state.hide) {
            this.setState({hide: false,password: []}, this.in);
        }
    }

    render() {
        let content = this.state.hide ? null : (<View style={[styles.container,]}>
                <Animated.View style={[styles.mask, {opacity: this.state.opacity}]}>
                    <Text style={styles.mask} onPress={this.dismiss.bind(this)}/>
                </Animated.View>
                <Animated.View style={[{
                    transform: [{
                        translateY: this.state.offset.interpolate({
                            inputRange: [0, 1],
                            outputRange: [SCREEN_HEIGHT, (SCREEN_HEIGHT - 366 - (Platform.OS === 'android' ? 20 : 0))]
                        }),
                    }]
                }]}>
                    <View style={{backgroundColor: 'white'}}>
                        <View style={{flexDirection: 'row', padding: 20}}>
                            <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}}
                                              onPress={() => this.dismiss()}>
                                <XImage source={ic_cancelPay_cross}
                                        style={{width: 15, height: 15}}/>
                            </TouchableOpacity>
                            <Text
                                style={{
                                    flex: 1,
                                    fontSize: 18,
                                    color: titleTextColor,
                                    textAlign: 'center'
                                }}>请输入支付密码</Text>
                        </View>
                        <View style={{
                            marginLeft: 20,
                            marginRight: 20,
                            backgroundColor: placeholderTextColor,
                            height: 0.5
                        }}/>
                        <View style={{margin: 25, justifyContent: 'center', alignItems: 'center'}}>
                            <View style={styles.itemView}>
                                {[1, 2, 3, 4, 5, 6].map((item, index) => {
                                    let value = this.state.password.length > index ? titleTextColor : '#00000000';

                                    return <View
                                        key={index}
                                        style={[styles.txtView, {
                                            marginRight: (index === 5 ? 0 : 0.5),
                                            borderTopLeftRadius: (index === 0) ? 5 : 0,
                                            borderBottomLeftRadius: (index === 0) ? 5 : 0,
                                            borderTopRightRadius: (index === 5) ? 5 : 0,
                                            borderBottomRightRadius: (index === 5) ? 5 : 0,
                                        }]}>
                                        <View style={{
                                            width: 12,
                                            height: 12,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 6,
                                            backgroundColor: value
                                        }}/>
                                    </View>
                                })}
                            </View>
                        </View>
                        <InputNumberView
                            inputNumberFunc={password => {
                                if(this.isAnimPlaying)return;
                                let result = this.state.password;
                                if(result.length < 6){
                                    result.push(password);
                                    this.setState({password: result});
                                }


                                if (result.length === 6) {
                                    setTimeout(() => {
                                        if (this.props.onPasswordInputEnd) {
                                            this.props.onPasswordInputEnd(result.join(''))
                                        }
                                        this.dismiss();
                                        this.setState({password: []})
                                    }, 100);

                                }

                            }}
                            onDelFunc={() => {
                                let result = this.state.password;
                                result.pop();
                                this.setState({
                                    password: result
                                });
                            }}
                            onClearFunc={() => {
                                this.setState({
                                    password: []
                                })

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
    container: {
        position: "absolute",
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        left: 0,
        top: 0,
        elevation: 5,
    },
    mask: {
        justifyContent: "center",
        backgroundColor: "#000000",
        opacity: 0.5,
        position: "absolute",
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        left: 0,
        top: 0,
    },
    itemView: {
        borderRadius: 5,
        flexDirection: 'row',
        height: 50,
        backgroundColor: 'white',
        borderColor: placeholderTextColor,
        borderWidth: 0.5
    },
    txtView: {
        marginTop: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: mainBackgroundColor,
        height: 48,
        width: 48,
    },
});