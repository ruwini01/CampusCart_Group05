import { TouchableOpacity } from 'react-native'
import React from 'react'
import { Text } from 'react-native'

const EditButton = ({ handlePress, containerStyles, textStyles, isLoading, fontStyle, text }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-[#b23232] rounded-lg min-h-14 w-44 justify-center items-center mt-20 ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
      disabled={isLoading}
    >
      <Text className={`text-white font-semibold text-lg ${textStyles}`} style={{ fontFamily: `${fontStyle}` }}>{text}</Text>
    </TouchableOpacity>
  )
}


export default EditButton
