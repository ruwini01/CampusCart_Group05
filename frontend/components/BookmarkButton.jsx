import { TouchableOpacity, Image, View } from 'react-native';
import React from 'react';
import { icons } from '../constants';

const BookmarkButton = ({ isBookmarked, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View 
        className={`w-12 h-12 justify-center items-center ${
          isBookmarked ?  'border-2 border-green-500' : 'bg-green-500'
        }`}
      >
        <Image 
          source={icons.bookmark}
          className="w-8 h-8"
          resizeMode="contain"
          style={{ tintColor: isBookmarked ?  '#0D7C66' : '#ffffff'}}
        />
      </View>
    </TouchableOpacity>
  );
};

export default BookmarkButton;