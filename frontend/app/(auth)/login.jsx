import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'
import FromField from '../../components/FromField'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'

const Login = () => {

  const [form, setForm] = useState({
    email:'',
    password:'',
  })

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = ()=>{
    if(form.email === 'test@gmail.com' && form.password === '123'){
      router.replace('/home')
    }
  }

  return (
    
    <SafeAreaView className='h-full'>
        <View className='w-full h-full px-4'>
          <Text className='text-4xl font-semibold' style={{fontFamily: 'Montserrat_700Bold'}}>Welcome{'\n'}Back!</Text>
          <View className='py-20 items-center'>
          <FromField
            title='Email'
            value={form.email}
            handleChangeText={(e)=> setForm({...form,
              email:e
            })}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder="Email"
          />

          <FromField
            title='Password'
            value={form.password}
            handleChangeText={(e)=> setForm({...form,
              password:e
            })}
            otherStyles="mt-7"
            placeholder="Password"
            secureTextEntry={true}
          />

          <Link href='/resetpassword' className='text-[#0D7C66] text-sm mt-2 mb-10' style={{fontFamily: 'Montserrat_400Regular'}}>Fogot Password?</Link>

          <CustomButton
            title="Login"
            handlePress={submit}
            containerStyles="mt-7"
            fontStyle="Montserrat_600SemiBold"
            isLoading={isSubmitting}
          />
         
         <View className='flex-row mt-60'>
          <Text style={{fontFamily:'Montserrat_400Regular'}}>Create An Account </Text>
          <Link href='/signup' className='text-[#0D7C66]'><Text style={{fontFamily:'Montserrat_600SemiBold'}} className='text-decoration-line: underline'>Sign Up</Text></Link>
          </View>
          </View>
        </View>

    </SafeAreaView>
  )
}

export default Login