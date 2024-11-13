import {Text, View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import logo from '../assets/images/logo.png'

const index = () => {
  return (
    <View className='flex-1 items-center justify-center bg-[#0D7C66]'>
      
      <Image
        source={logo}
        transition={1000}
        />
      <Text className='text-white'>Welcome to CampusCart</Text>
    </View>
  )
}

export default index
