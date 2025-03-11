import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LanguageSelector from '../../../components/LanguageSelector';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import CustomButton from '../../../components/CustomButton';
import { useGlobalContext } from '../../../context/GlobalProvider';
import { Alert } from 'react-native';

const Settings = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setIsLogged, setUser } = useGlobalContext();

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout canceled'),
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              setIsSubmitting(true);
  
              // Clear token from AsyncStorage
              await AsyncStorage.removeItem('token');
  
              // Clear user data from global context
              setIsLogged(false);
              setUser(null);
  
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Logout error:', error);
            } finally {
              setIsSubmitting(false);
            }
          },
          style: 'destructive', // Adds a distinct style for the Logout button
        },
      ],
      { cancelable: true } // Allows dismissal by tapping outside the alert
    );
  };
  

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text className="font-semibold text-xl m-6">Settings</Text>
        <View>
          <LanguageSelector />
          <ThemeSwitcher />
        </View>
      </ScrollView>
      {/* Logout button at the bottom */}
      <View className="absolute bottom-5 left-0 right-0 items-center">
        <CustomButton
          title="Logout"
          handlePress={handleLogout}
          containerStyles="mt-7"
          fontStyle="Montserrat_600SemiBold"
          isLoading={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
};

export default Settings;