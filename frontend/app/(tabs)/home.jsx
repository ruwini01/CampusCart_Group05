import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import IconButton from '../../components/IconButton'
import { Link } from 'expo-router'
import SearchInput from '../../components/SearchInput'
import Buy_and_sell from '../features/buy_and_sell.jsx';
import Lost_and_found from '../features/lost_and_found.jsx';
import Boarding_accommodation from '../features/boarding_accommodation.jsx';

const Home = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>Home</Text>
          {/* 3 navigation icon */}
          <Link href='/features/buy_and_sell' className='text-blue-700'><Buy_and_sell/></Link>
          <Link href='/features/lost_and_found' className='text-blue-700'><Lost_and_found/></Link>
          <Link href='/features/boarding_accommodation' className='text-blue-700'><Boarding_accommodation/></Link>
          <SearchInput/>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home