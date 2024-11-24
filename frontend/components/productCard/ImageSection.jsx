import React from 'react';
import { Image, View } from 'react-native';

const ImageSection = ({ imageSource }) => {
    return (
        <View className="w-full h-80 rounded-xl overflow-hidden shadow-lg">
            <Image
                source={imageSource}
                resizeMode="cover"
                className="w-full h-full"
            />
        </View>
    );
};

export default ImageSection;
