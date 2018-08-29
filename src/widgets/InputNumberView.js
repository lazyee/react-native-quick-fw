import React, {Component} from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from 'react-native';
import {mainBackgroundColor, placeholderTextColor, titleTextColor} from "../constraint/Colors";
import {ic_pay_delete_cross} from "../constraint/Image";
import {encryption} from "../common/StringUtil";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "../common/AppUtil";
import XImage from "./XImage";

const {width} = Dimensions.get('window');

export default class InputNumberView extends Component {

    constructor(props) {
        super(props);
    }

    static defaultProps={
        inputNumberFunc:undefined,
        onDelFunc:undefined,
        onClearFunc:undefined,
    };

    render() {

        let data = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "清空", "0", " "];
        let {inputNumberFunc,onDelFunc,onClearFunc} = this.props;
        return <View>
                    <FlatList data={data}
                      scrollEnabled={false}
                      showsHorizontalScrollIndicator={false}
                      numColumns={3}
                      keyExtractor={(item, index) => index}
                      renderItem={({item, index}) => index !== 11 ? (<View>
                              <View style={{
                                  backgroundColor: placeholderTextColor,
                                  height: 0.5,
                                  width: width / 3
                              }}/>
                              <TouchableHighlight
                                  underlayColor={mainBackgroundColor}
                                  style={{
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      width: width / 3,
                                      height: 50,
                                      borderRightWidth: 0.5,
                                      borderColor: placeholderTextColor,
                                      backgroundColor: (index === 9 || index === 11) ? mainBackgroundColor : 'white'
                                  }}
                                  onPress={() => {
                                      if (index !== 9) {
                                          if(inputNumberFunc){
                                              inputNumberFunc(item)
                                          }
                                      }
                                      else {

                                          if(onClearFunc){
                                              onClearFunc();
                                          }
                                      }

                                  }}
                                  key={index}>
                                  <Text style={{
                                      fontSize: index === 9 ? 15 : 25,
                                      color: titleTextColor,
                                  }}>{item}</Text>
                              </TouchableHighlight>
                          </View>)
                          :
                          (<View>
                              <View style={{
                                  backgroundColor: placeholderTextColor,
                                  height: 0.5,
                                  width: width / 3
                              }}/>
                              <TouchableOpacity
                                  style={{
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      width: width / 3,
                                      height: 50,
                                      borderColor: placeholderTextColor,
                                      backgroundColor: (index === 9 || index === 11) ? mainBackgroundColor : 'white'
                                  }}
                                  key={index}
                                  activeOpacity={0.7}
                                  onPress={() => {
                                      if(onDelFunc){
                                          onDelFunc();
                                      }
                                  }}>
                                  <XImage source={ic_pay_delete_cross}
                                          resizeMode={Image.resizeMode.contain}
                                          style={{
                                              width: 20,
                                              height: 20,
                                          }}/>
                              </TouchableOpacity>
                          </View>)
                      }
            />
        </View>
    }

}