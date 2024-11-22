import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'

const SignUp = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>SignUp Page</Text>
          <Link href='/login' className='text-lime-800'>Click here to Login</Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp