import { View, Text, ScrollView, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'
import FormField from '../../components/FormField'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const Login = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    try {
      if (!form.username || !form.password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      setIsSubmitting(true);

      if (form.username === 'CCADMIN' && form.password === '#CampusCart05*') {
        Alert.alert('Success', 'Login Successful');
        router.replace('/home');
      } else {
        Alert.alert('Error', 'Incorrect Credentials');
      }
    } catch (error) {
      // Handle network or server errors
      Alert.alert(
        'Error',
        'Something went wrong. Please try again.'
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
          <FormField
            value={form.username.toUpperCase()}
            handleChangeText={(e) =>
              setForm({
                ...form,
                username: e,
              })
            }
            otherStyles="mt-7"
            placeholder="Username"
          />
          <FormField
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
         
          
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Login