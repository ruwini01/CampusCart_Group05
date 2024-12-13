import { View, Text } from 'react-native'
import React from 'react'
import LanguageSelector from '../../../components/LanguageSelector';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
const Settings = () => {
  return (
    <View>
      <View>
      <Text className="font-semibold text-xl mt-6">Settings</Text>
      <LanguageSelector />
      <ThemeSwitcher />
    </View>

    </View>
  )
}

export default Settings