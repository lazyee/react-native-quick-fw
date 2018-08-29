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
import TypeSelector from "../../widgets/wheel/TypeSelector";
import IPhoneXTop from "../../widgets/iphonex/IPhoneXTop";

class TestUser extends Component{
    constructor(props){
        super(props);
    }

    render() {
        const {dispatch,sex} = this.props;
        console.log('第一个界面>' + JSON.stringify(this.props.navigation));
        return (
            <View>
                <IPhoneXTop/>
                <Text>界面1</Text>
                <Text style={{marginTop:10}} onPress={()=>{
                    this.typeSelector.show(['111','2222'])
                }}>点击弹出选择器</Text>

                <Text style={{marginTop:30}} onPress={()=>dispatch(goto('Test2',{name:'ljj'}))}>点击测试路由跳转</Text>
                <Text style={{marginTop:10}} onPress={()=>dispatch(this.asyncFun())}>点击测试thunk情况下的异步函数</Text>

                <TypeSelector
                    ref={f=>this.typeSelector=f}

                />
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



