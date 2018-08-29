import {Dimensions, Platform} from 'react-native';


export function isIPhone5(){
    return Platform.OS === 'ios' && Dimensions.get('window').width === 320
}
const {height,width} = Dimensions.get('window');
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;


export function isTrue(param) {
    return param === 'Y';
}

export function getNavigationParams(props,key) {
    if(props){
        if(props[key]){
            return props[key]
        } else if(props.navigation){
            if(props.navigation.state){
                if(props.navigation.state.params){
                    if(props.navigation.state.params[key]){
                        return props.navigation.state.params[key];
                    }
                    return undefined;
                }
                return undefined;
            }
            return undefined;
        }
        return undefined;
    }

    return undefined;
}



