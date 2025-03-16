import { View, Text, Image } from 'react-native';
import React from 'react';
import { images } from '../constants';

const NotificationBar = ({ image, title, text, time }) => {
  return (
    <View className="flex flex-row w-full bg-white h-20 rounded-2xl items-center justify-between mb-[-18]  px-2">
      <View className="flex-row items-center flex-1">
        <Image
          source={image ? { uri: image } : images.umbrella}
          className="w-12 h-12 rounded-full"
          resizeMode="contain"
        />
        <View className="ml-3 flex-1">
          <Text className="font-bold text-base">{title}</Text>
          <Text className="text-sm text-gray-600 mr-2" numberOfLines={2}>
            {text}
          </Text>
        </View>
      </View>
      <View>
        <Text className="text-xs text-gray-400">{time}</Text>
      </View>
    </View>
  );
};

export default NotificationBar;
