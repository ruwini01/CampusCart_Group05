import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { useState } from 'react';

const NumEntry = ({value, handleChangeText}) => {

  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`flex-row items-center text-center border-2 w-14 h-14 px-4 rounded-2xl bg-[#e4e4e4] 
      ${isFocused ? 'border-[#0D7C66]' : 'border-[#bababa]'}`}
    >
      <TextInput
        className="flex-1 font-semibold text-base"
        style={{ fontFamily: 'Montserrat_500Medium' }}
        value={value}
        onChangeText={handleChangeText}
        maxLength={1}
      />
    </View>
  )
}

export default NumEntry