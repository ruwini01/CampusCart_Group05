import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'

const Login = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>Login Page</Text>
          <Link href='/signup' className='text-lime-800'>Click here to SignUp</Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Login