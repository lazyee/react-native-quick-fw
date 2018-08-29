import React, {Component} from 'react';

import {View} from "react-native";

export default class LoadingView extends Component{
    constructor(props){
        super(props)
    }


    render(){
        return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <ActivityIndicator
                animating={true}
                size="small"
            />
        </View>
    }
}