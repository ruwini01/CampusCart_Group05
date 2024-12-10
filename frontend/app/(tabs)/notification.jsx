import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import NotificationBar from '../../components/NotificationBar'

const Notification = () => {
  return (
    <SafeAreaView>
      <Text className=" mx-6 font-semibold text-xl">Notification</Text>
      <ScrollView>
        <View className='px-6 my-6'>
          <NotificationBar/>
          <NotificationBar/>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Notification