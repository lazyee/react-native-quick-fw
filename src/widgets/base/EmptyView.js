import React, {Component} from 'react';

import {Image, Text, View} from "react-native";
import {ic_empty_logo} from "../../constraint/Image";

export default class EmptyView extends Component{
    constructor(props){
        super(props)
    }

    static defaultProps = {
        message: '目前暂无数据噢！'
    }

    render(){
        let {message} = this.props;
        return <View style={{
            // flex:1,
            height:500,
            // justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Image source={ic_empty_logo} style={{width:140,height:140,marginTop:60}}/>
            <Text style={{fontSize:14,color:'#999999',marginTop:10}}>{message}</Text>
        </View>
    }
}