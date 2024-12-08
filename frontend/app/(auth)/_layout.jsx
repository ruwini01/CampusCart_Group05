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
          headerShown: true,
          headerStyle:{
            backgroundColor:'#0D7C66', 
          },
          headerTitle:'',
          
        }}
      />

    <Stack.Screen
        name='signup'
        options={{
          headerShown:true,
          headerStyle:{
            backgroundColor:'#0D7C66', 
          },
          headerTitle:'',
        }}
      />

      
    <Stack.Screen
        name='signupverify'
        options={{
          headerShown:true,
          headerStyle:{
            backgroundColor:'#0D7C66', 
          },
          headerTitle:'',
        }}
      />


      
    <Stack.Screen
        name='resetpassword'
        options={{
          headerShown:true,
          headerStyle:{
            backgroundColor:'#0D7C66', 
          },
          headerTitle:'',
        }}
      />
    </Stack>

    <StatusBar backgroundColor='#0D7C66' style='dark'/>
    </>
    
  )
}

export default AuthLayout