import {PixelRatio} from 'react-native';

export const pt2px = pt=>PixelRatio.getPixelSizeForLayoutSize(pt);
export const px2pt = px=>PixelRatio.roundToNearestPixel(px);