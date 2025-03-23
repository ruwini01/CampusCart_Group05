import { View, Text,TouchableOpacity, Image } from 'react-native'
import React from 'react'

const CallMessageButton = ({handlePress, isLoading, image}) => {
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      className={`flex flex-row gap-4 bg-[#0D7C66] rounded-full h-14 w-14 justify-center items-center mt-10 ${isLoading? 'opacity-50':''}`}
      disabled={isLoading}
    >
        <Image
            source={image}
            style={{width: 20, height: 20}}
        />
    </TouchableOpacity>
  )
}

export default CallMessageButton