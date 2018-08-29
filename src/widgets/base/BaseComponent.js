import React, {Component} from 'react';


export default class BaseComponent extends Component{

    constructor(props){
        super(props);
        this.isPageResume = true;
    }

    /**
     * 判断界面是否从其他界面返回的，使用的是android开发的onResume概念
     * 在componentWillReceiveProps(nextProps)中使用
     * @param nextProps
     * @returns {boolean}
     */
    isResume(nextProps){
        let nowRouterName = nextProps.navigation.state.routeName;
        if(nextProps.nav){
            if(nowRouterName === nextProps.nav.routes[nextProps.nav.index].routeName){
                if(this.isPageResume){
                    return false;
                }else{
                    this.isPageResume = true;
                }
            }else{
                this.isPageResume = false;
            }
        }
        return this.isPageResume;
    }
}

