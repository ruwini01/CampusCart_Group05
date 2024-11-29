import { Stack } from 'expo-router'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

const FeatureLayout = () => {
  return (
    <>
    <Stack>
      <Stack.Screen
        name='boarding_accommodation'
        options={{
          headerShown:false
        }}
      />

    <Stack.Screen
        name='buy_and_sell'
        options={{
          headerShown:false
        }}
      />

    <Stack.Screen
        name='lost_and_found'
        options={{
          headerShown:false
        }}
      />

<Stack.Screen
        name='home'
        options={{
          headerShown:false
        }}
      />
    </Stack>
    </>
    
  )
}

export default FeatureLayout