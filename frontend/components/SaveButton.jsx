import { TouchableOpacity } from 'react-native'
import React from 'react'
import { Text } from 'react-native'

const SaveButton = ({handlePress, containerStyles, textStyles, isLoading, fontStyle}) => {
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-[#0D7C66] rounded-lg min-h-14 w-36 justify-center items-center mt-20 ${containerStyles} ${isLoading? 'opacity-50':''}`}
      disabled={isLoading}
    >
      <Text className={`text-white font-semibold text-lg ${textStyles}`} style={{fontFamily: `${fontStyle}`}}>Save</Text>
    </TouchableOpacity>
  )
}

export default SaveButton
