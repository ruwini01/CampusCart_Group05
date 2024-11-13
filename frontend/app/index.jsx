import { Text, View } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';

const Index = () => {
  return (
    <View className='flex-1 items-center justify-center bg-[#0D7C66]'>
      <Image
        source={require('../assets/images/logo.png')}
        style={{ width: 200, height: 200 }}
        transition={1000}
      />
    </View>
  );
};

export default Index;
