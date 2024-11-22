import { Stack } from 'expo-router'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

const AuthLayout = () => {
  return (
    <>
    <Stack>
      <Stack.Screen
        name='login'
        options={{
          headerShown:false
        }}
      />

    <Stack.Screen
        name='signup'
        options={{
          headerShown:false
        }}
      />
    </Stack>
    </>
    
  )
}

export default AuthLayout