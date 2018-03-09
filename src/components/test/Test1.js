import React,{Component} from 'react';
import {
    View,
    Text,
    Image
}from 'react-native';

import {exampleLocalImage} from "../../constraint/Image";
import {connect} from 'react-redux';
import {saveUser} from '../../reducers/UserReducer';
import {goto} from '../../reducers/RouterReducer';
import TestUserForRedux2 from './Test2';

class TestUser extends Component{
    constructor(props){
        super(props);
    }

    render() {
        const {dispatch,sex} = this.props;
        console.log('第一个界面>' + JSON.stringify(this.props.navigation));
        return (
            <View>
                <Text>界面1</Text>
                <Text style={{marginTop:10}} onPress={()=>dispatch(saveUser({sex:'女'}))}>你可以点击这里改变你的性别</Text>
                <Text>当前性别:{sex}</Text>

                <Text style={{marginTop:30}} onPress={()=>dispatch(goto('Home2',{name:'ljj'}))}>点击测试路由跳转</Text>
                <Text style={{marginTop:10}} onPress={()=>dispatch(this.asyncFun())}>点击测试thunk情况下的异步函数</Text>
            </View>
        );
    }

    /**
     * test redux-thunk中间件
     * @returns {function(*)}
     */
    asyncFun =()=>{
        return (dispatch)=> {
            setTimeout(()=>dispatch(saveUser({sex: '男'})), 2000);
        }
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



