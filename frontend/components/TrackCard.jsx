import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const TrackCard = ({image, name, price, handlePress}) => {
  return (
    <View className='w-44 h-56 rounded-lg bg-white shadow-inner'>
      <View>
        <Image
          source={{ uri: image }}
          className='w-44 h-28 rounded-t-lg'
        />
      </View>

      <View className='p-1'>
        <Text className='font-light text-sm'>{name}</Text>
        <Text className='font-semibold text-sm'>{price}</Text>
      </View>

      <View className='flex-1 justify-end'>
        <View className='self-end p-2'>
          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
          >
            <Text className='font-normal text-sm text-[#0D7C66]'>Track</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default TrackCard