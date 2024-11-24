import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import IconButton from '../../components/IconButton'
import { Link } from 'expo-router'

const Home = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>Home</Text>
          {/* 3 navigation icon */}
          <Link href='./features/buy_and_sell.jsx' className='text-blue-700'><IconButton/></Link>
          <Link href='/lost_and_found_home' className='text-blue-700'><IconButton/></Link>
          <Link href='/bording_home' className='text-blue-700'><IconButton/></Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home