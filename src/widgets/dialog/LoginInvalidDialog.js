import React, {Component} from 'react';
import {Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { mainColor} from "../../constraint/Colors";
import connect from "react-redux/es/connect/connect";
import {showLoginInvalidDialog} from "../../reducers/CacheReducer";
import {SCREEN_WIDTH} from "../../utils/AppUtil";
import {gotoAndClose} from "../../reducers/RouterReducer";
import {clearUser} from "../../reducers/UserReducer";
import {clearNativeToken} from "../../utils/NativeMethodUtil";

const {width} = Dimensions.get('window');
class LoginInvalidDialog extends Component {
    constructor(props) {
        super(props);
    }


    componentWillReceiveProps(nextProps) {
    }

    render() {
        let {visible,title,forceLogout} = this.props.loginInvalidDialog;
        return (

                <Modal
                    transparent={true}
                    visible={visible}
                    animationType={'fade'}
                    onRequestClose={() => {}}>
                    <TouchableOpacity style={styles.container} activeOpacity={1}>
                        {this.renderDialog(title,forceLogout)}
                    </TouchableOpacity>
                </Modal>

        );
    }

    renderDialog() {
        return (
            <View
                style={styles.modalStyle}>
                <View style={styles.itemP}>
                    <Text style={{
                        flex: 1,
                        color:mainColor,
                        textAlign: 'center',
                        fontSize: 15,
                        fontWeight: 'bold',
                    }}
                          numberOfLines={2}>您的账号登录已过期，请重新登录</Text>
                </View>

                <View style={{width: SCREEN_WIDTH * 0.7, height: 0.5, backgroundColor: mainColor}}/>

                <View style={{flexDirection: 'row'}}>

                    <TouchableOpacity
                        style={styles.buttonStyle}
                        activeOpacity={0.7}
                        onPress={() => {
                            clearNativeToken();
                            this.props.dispatch(clearUser());
                            // this.props.dispatch(gotoAndClose('Login',[]));
                            this.props.dispatch(showLoginInvalidDialog(false));
                        }}>
                        <Text style={styles.confirmTextStyle}>
                            确定
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalStyle: {
        backgroundColor: '#ffffff',
        width:SCREEN_WIDTH*0.75,
        borderWidth: 0.5,
        borderColor: mainColor,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    itemP: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal:5,
        paddingVertical:20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    buttonStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40
    },
    confirmTextStyle: {
        fontSize: 16,
        color: '#FF8A00'
    },
    cancelTextStyle: {
        fontSize: 16,
        color: '#999999'
    }
});
selector = (state) => {
    return {
        loginInvalidDialog:state.cacheStore.loginInvalidDialog,

    }
};
export default connect(selector)(LoginInvalidDialog)