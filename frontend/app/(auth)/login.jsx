import { View, Text, ScrollView, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'
import FromField from '../../components/FromField'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'


const Login = () => {
  const [form, setForm] = useState({
    regno: '',
    password: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    try {
      // Input validation
      if (!form.regno || !form.password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      setIsSubmitting(true);

      const response = await axios.post(
        'http://172.20.10.2:8080/users/login',
        {
          regno: form.regno,
          password: form.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.success) {
        //Alert.alert('Success', response.data.message);

        AsyncStorage.setItem('token', response.data.token);
        console.log('Token:', response.data.token);
        
        //set it to global state
        router.replace('/home');
      } else {
        // Show error message from server
        Alert.alert('Error', response.data.errors);
      }
    } catch (error) {
      // Handle network or server errors
      Alert.alert(
        'Error',
        error.response?.data?.errors || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView className='h-full'>
      <View className='w-full h-full px-4'>
        <Text 
          className='text-4xl font-semibold' 
          style={{fontFamily: 'Montserrat_700Bold'}}
        >
          Welcome{'\n'}Back!
        </Text>
        <View className='py-20 items-center'>
          <FromField
            value={form.regno}
            handleChangeText={(e) =>
              setForm({
                ...form,
                regno: e,
              })
            }
            otherStyles="mt-7"
            placeholder="Registration No (Ex: 2020/ICT/01)"
          />
          <FromField
            title='Password'
            value={form.password}
            handleChangeText={(e)=> setForm({
              ...form,
              password: e
            })}
            otherStyles="mt-7"
            placeholder="Password"
            secureTextEntry={true}
          />

          <Link 
            href='/resetpassword' 
            className='text-[#0D7C66] text-sm mt-2 mb-10' 
            style={{fontFamily: 'Montserrat_400Regular'}}
          >
            Forgot Password?
          </Link>

          <CustomButton
            title="Login"
            handlePress={submit}
            containerStyles="mt-7"
            fontStyle="Montserrat_600SemiBold"
            isLoading={isSubmitting}
          />
         
          <View className='flex-row mt-60'>
            <Text style={{fontFamily:'Montserrat_400Regular'}}>
              Create An Account{' '}
            </Text>
            <Link href='/signup' className='text-[#0D7C66]'>
              <Text 
                style={{fontFamily:'Montserrat_600SemiBold'}} 
                className='text-decoration-line: underline'
              >
                Sign Up
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Login