import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import IconButton from '../../../components/IconButton';
import { icons } from '../../../constants';

const Home = () => {
  const router = useRouter();
  function getGreeting() {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 15) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  }

  return (
    <SafeAreaView className="h-full">
      <View className="w-full h-full px-4">
        <View className="px-6">
          <Text
            className='text-3xl font-semibold'
            style={{ fontFamily: 'Montserrat_700Bold', color: '#0D7C66' }}
          >
            {getGreeting()}{'\n'}CampusCart Admin!
          </Text>
        </View>

        <View className="flex-1 flex-row flex-wrap gap-12 mt-36 items-center justify-center">
          <IconButton image={icons.sell} title="Sell Items" handlePress={() => router.push('/(tabs)/home/buyandsellhome')} otherStyle="w-36" />
          <IconButton image={icons.lost} title="Lost Items" handlePress={() => router.push('/(tabs)/home/losthome')} otherStyle="w-36" />
          <IconButton image={icons.found} title="Found Items" handlePress={() => router.push('/(tabs)/home/foundhome')} otherStyle="w-36" />
          <IconButton image={icons.house} title="Boarding Houses" handlePress={() => router.push('/(tabs)/home/bordinghouseshome')} otherStyle="w-36" />
        </View>

        
      </View>

    </SafeAreaView>
  );
};

export default Home;
