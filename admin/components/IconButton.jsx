import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const IconButton = ({image, title, width, otherStyle, handlePress}) => {
  return (
    <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
    >
    <View className={`${otherStyle} bg-[#cacacacb] h-32 rounded-xl border-b-2 border-b-[#9c9c9c73] justify-center items-center gap-3`}>
      <Image
        source={image}
        className='w-11 h-11'
        resizeMode='contain'
        tintColor='#0D7C66'
      />
      <Text className='text-[#0D7C66] text-center' style={{fontFamily:'Montserrat_600SemiBold'}}>{title}</Text>
    </View>
    </TouchableOpacity>
  )
}

export default IconButton