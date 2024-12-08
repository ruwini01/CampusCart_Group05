import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TrackCard from '../../../components/TrackCard'
import { router } from 'expo-router'

const Home = () => {

  const navigatePage = 
      () => 
    { 
        router.push('/(tabs)/bookmark/trackpost');
    }

  return (
    <SafeAreaView>
      <Text className="mx-6 font-semibold text-xl mb-6">Saved Posts</Text>
    <ScrollView>
      <View className='mx-6'>
        <TrackCard handlePress={navigatePage}/>
      </View>
    </ScrollView>
  </SafeAreaView>

  )
}

export default Home