import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import '../global.css';
import { NavigationContainer } from '@react-navigation/native';

const RootLayout = () => {
  return (
    <>
    <Stack>
      <Stack.Screen name='index' options={{headerShown:false}}/>
      <Stack.Screen name='(auth)' options={{headerShown:false}}/>
      <Stack.Screen name='(tabs)' options={{headerShown:false}}/>
    </Stack>
    </>
  )
}

export default RootLayout

const styles = StyleSheet.create({})