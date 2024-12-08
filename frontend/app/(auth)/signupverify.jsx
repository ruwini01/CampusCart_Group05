import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'
import FromField from '../../components/FromField'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import NumEntry from '../../components/NumEntry'

const SignUpVerify = () => {

  const [form, setForm] = useState({
    email:'',
    password:'',
  })

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = ()=>{
    
      router.replace('/home')
    
  }

  return (
    
    <SafeAreaView className='h-full'>
        <View className='w-full h-full px-4'>
          <Text className='text-4xl font-semibold' style={{fontFamily: 'Montserrat_700Bold'}}>Verify Your{'\n'}Email</Text>
          <View className='py-20 items-center'>
          
         
          <Text style={{fontFamily:'Montserrat_400Regular'}} className='px-5 text-center'>Enter the Verification code that we sent to your email.
          Not your email?
          <Link href='/signup' className='text-[#0D7C66]'><Text style={{fontFamily:'Montserrat_600SemiBold'}}> Change</Text></Link> </Text>
          
          <View className='flex-row my-20 gap-8'>
            <NumEntry/>
            <NumEntry/>
            <NumEntry/>
            <NumEntry/>
          </View>
          <CustomButton
            title="Verify"
            handlePress={submit}
            containerStyles="mt-7"
            fontStyle="Montserrat_600SemiBold"
            isLoading={isSubmitting}
          />
         
         
          </View>
        </View>

    </SafeAreaView>
  )
}

export default SignUpVerify