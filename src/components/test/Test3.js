import React,{Component} from 'react';
import {
    View,
    Text,
    Image
}from 'react-native';

import {exampleLocalImage} from "../../constraint/Image";
import {connect} from 'react-redux';
import {saveUser} from '../../reducers/UserReducer';
import {goto,gotoAndClose,goBack} from '../../reducers/RouterReducer';

class TestUser extends Component{
    constructor(props){
        super(props);
    }

    render() {
        const {dispatch,sex} = this.props;
        console.log('第三个界面>' + JSON.stringify(this.props.navigation));
        return (
            <View>
                <Image source={exampleLocalImage} style={{width:100,height:100}}/>
                <Text style={{marginTop:10}} onPress={()=>dispatch(saveUser({sex:'女'}))}>你可以点击这里改变你的性别</Text>
                <Text>当前性别:{sex}</Text>
                <Text style={{marginTop:10}} onPress={()=>dispatch(gotoAndClose('Home4','Home2'))}>跳转第四个界面</Text>
                <Text style={{marginTop:10}} onPress={()=>dispatch(goBack())}>返回上一个界面</Text>
                <Text style={{marginTop:10}} onPress={()=>dispatch(goBack('Home'))}>返回第一个界面</Text>
                <Text onPress={()=>dispatch(goBack('Home',{aaa:'sssss'}))}>带参数返回第一个页面</Text>
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
      // nav:state.nav,
  }
};
export default connect(selector)(TestUser);



