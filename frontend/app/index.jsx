import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'react-native';
import { useRouter, useNavigation } from 'expo-router'; 

const Index = () => {
  const router = useRouter(); 
  const navigation = useNavigation(); 

  useEffect(() => {

    const startRedirectTimer = () => {
      const timer = setTimeout(() => {
        router.push('/login'); 
      }, 1500);

      return timer; 
    };


    let timer = startRedirectTimer(); 
    const unsubscribe = navigation.addListener('focus', () => {
      clearTimeout(timer); 
      timer = startRedirectTimer(); 
    });

    return () => {
      clearTimeout(timer); 
      unsubscribe(); 
    };
  }, [router, navigation]);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0D7C66' }}>
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className='bg-[#0D7C66] w-full items-center justify-center h-full px-4'>
          <Image
            source={require('../assets/images/logo.png')}
            style={{ width: 250, height: 250 }}
            transition={1000}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#0D7C66' style='light' />
    </SafeAreaView>
  );
};

export default Index;
