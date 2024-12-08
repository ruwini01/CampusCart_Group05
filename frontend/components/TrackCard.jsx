import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const TrackCard = ({image, name, price, days, handlePress}) => {
  return (
    
      <View className='w-44 h-56 rounded-lg bg-white shadow-inner'>

        <View>
        <Image
          source={image}
          className='w-44 h-28 rounded-t-lg'
        />
        </View>

        <View className='p-1'>
          <Text className='font-light text-sm'>{name}</Text>
          <Text className='font-semibold text-sm'>Rs.{price}</Text>
        </View>

      <View className='flex flex-row gap-16'>
        <View className='p-1 pt-10 '>
          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
          >
            <Text className='font-extralight text-sm color-[#0D7C66]'>Track</Text>
          </TouchableOpacity>
        </View>

        <View className='p-1 pt-10'>
          <Text className='font-extralight text-sm'>{days} days ago</Text>
        </View>
        </View>
      </View>
 
  )
}

export default TrackCard
