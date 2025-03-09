import { View, Text, Image } from 'react-native'
import React from 'react'
import {images } from '../constants'

const NotificationBar = () => {
  return (
    <View className='clex flex-row w-full bg-white h-16 rounded-2xl items-center mb-2'>
      <View>
        <Image
         source={images.umbrella}
         className='ml-2 w-12 h-12 rounded-full'
         resizeMode='contain'/>
      </View>
      <View>
        <Text className='ml-4'>User123 just post an found umbrella</Text>
      </View>
    </View>
  )
}

export default NotificationBar