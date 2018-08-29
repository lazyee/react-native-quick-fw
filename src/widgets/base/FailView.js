import React, {Component} from 'react';

import {Image, Text, TouchableOpacity, View} from "react-native";
import {ic_fail} from "../../constraint/Image";

export default class FailView extends Component{
    constructor(props){
        super(props)
    }

    static defaultProps = {
        callback:undefined,//点击按钮回调
    }

    render(){
        let {callback} = this.props;
        return <View style={{
            flex:1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Image source={ic_fail} style={{width:80,height:80}}/>
            <Text style={{fontSize:14,color:'#333333',marginTop:10}}>页面加载失败</Text>
            <Text style={{fontSize:12,color:'#999999',marginTop:10}}>重新加载吧</Text>

            <TouchableOpacity
                activeOpacity={0.7}
                accessible={true}
                onPress={() => {
                    if(callback){
                        callback();
                    }
                }}
            >
                <View style={{
                    marginTop:10,
                    borderColor: '#CCCCCC',
                    borderWidth: 1,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{fontSize:12,color:'#333333'}}>重新加载</Text>

                </View>
            </TouchableOpacity>
        </View>
    }
}