import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { icons } from '../constants'


const SearchInput = () => {
  return (
    <View className='flex-row items-center border-2 w-full h-14 px-4 rounded-3xl  border-[#1d816ddc]'>
      <TextInput className="flex-1 font-normal text-base mt-[-8]"/>

      <TouchableOpacity>
        <Image
          source={icons.search}
          className='w-5 h-5 mr-1'
          resizeMethod='contain'
          tintColor='#1d816ddc'
        />
      </TouchableOpacity>
    </View>
  )
}

export default SearchInput
