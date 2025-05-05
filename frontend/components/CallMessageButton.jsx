import { View, Text,TouchableOpacity, Image } from 'react-native'
import React from 'react'

const CallMessageButton = ({handlePress, isLoading, image, title}) => {
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      className={`flex flex-row gap-4 bg-[#0D7C66] rounded-lg min-h-14 w-48 justify-center items-center mt-20 ${isLoading? 'opacity-50':''}`}
      disabled={isLoading}
    >
        <Image
            source={image}
            style={{width: 15, height: 15}}
        />

      <Text className={`text-white text-lg`} style={{fontFamily: 'Montserrat_700Bold'}}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CallMessageButton