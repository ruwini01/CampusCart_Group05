import { View, Text , Image } from 'react-native'
import React from 'react'

const Card = ({image, name, price, days}) => {
  return (
    
    <View className="w-44 h-56 rounded-lg bg-white shadow-inner relative">

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

          <Text className="font-extralight text-sm absolute bottom-1 right-1">{days}</Text>
      </View>
 
  )
}

export default Card
