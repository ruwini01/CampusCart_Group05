import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const Card = ({image, name, price, days}) => {
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
          <Text className='font-semibold text-sm'>Rs.{price}</Text>
        </View>

        <View className='items-end p-1 pt-10'>
          <Text className='font-extralight text-sm'>{days}</Text>
        </View>

      </View>
 
  )
}

export default Card
