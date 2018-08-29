import {DeviceEventEmitter} from "react-native";

export const postEventBus=(event,value)=>{
    DeviceEventEmitter.emit(event, value);
};

export const registerEventBus=(event,callback)=>{
    return DeviceEventEmitter.addListener(event,(value)=>{
        if(callback){
            callback(value);
        }
    })
};

// export const unregisterEventBus=(eventBus)=>{
//         eventBus.remove();
// };