import React, {Component} from 'react';
import {
    Modal,
    Platform,
    ProgressBarAndroid,
    ActivityIndicator,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';


class LoadingDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            isCanceledOnTouchOutside: true,
        };
    }

    show(isCanceledOnTouchOutside = true,) {
        this.setState({
            modalVisible: true,
            isCanceledOnTouchOutside: isCanceledOnTouchOutside,
        });
    }

    dismiss() {
        this.setState({modalVisible: false});
    }

    getLoadingView() {
        if (Platform.OS === 'android') {
            return (
                <ProgressBarAndroid
                    style={{
                        height: 40,
                    }}
                    styleAttr="Inverse"
                />
            );
        } else {
            return (
                <ActivityIndicator
                    animating={true}
                    size="large"
                />
            );
        }
    }

    render() {
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                onRequestClose={() => {}}
                visible={this.state.modalVisible}
            >
                <TouchableWithoutFeedback
                    onPress={this.state.isCanceledOnTouchOutside?() => this.dismiss():null}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,.5)',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <TouchableWithoutFeedback>
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 10,
                                width: '50%',
                                backgroundColor: 'white',
                                borderRadius: 10,
                                height: 80
                            }}>
                                {this.getLoadingView()}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }
}


module.exports = LoadingDialog;