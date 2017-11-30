import React,{Component} from 'react';
import {
    View,
    Text,
    Image
}from 'react-native';

import {exampleLocalImage} from "../../constraint/Image";
import {connect} from 'react-redux';
import {saveUser} from '../../reducers/UserReducer';
import {goto,goBack} from '../../reducers/RouterReducer';



class TestUser extends Component{
    constructor(props){
        super(props);
    }

    render() {
        const {dispatch,sex} = this.props;
        // console.log('第二个界面>' + JSON.stringify(this.props.navigation));
        // console.log('第二个界面>' + JSON.stringify(this.props.navigation.dispatch));
        return (
            <View>
                <Image source={exampleLocalImage} style={{width:100,height:100}}/>
                <Text style={{marginTop:100}} onPress={()=>dispatch(saveUser({sex:'女'}))}>你可以点击这里改变你的性别</Text>
                <Text>当前性别:{sex}</Text>
                <Text onPress={()=>dispatch(goto('Home3'))}>跳转到第三个页面</Text>
                <Text onPress={()=>dispatch(goBack())}>点击返回上一个页面</Text>
            </View>
        );
    }
}

/**
 * 声明在store tree 需要获取那部分数据
 * @param state
 * @returns {{text: string}}
 */
selector = (state) =>{
  return {
      sex:state.userStore.user.sex,
  }
};
export default connect(selector)(TestUser);



