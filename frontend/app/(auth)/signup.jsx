import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import FromField from '../../components/FromField';
import CustomButton from '../../components/CustomButton';
import { Alert } from 'react-native';
import axios from 'axios';

const SignUp = () => {
  const [form, setForm] = useState({
    email: '',
    regno: '',
    password: '',
    confirmpassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    try {
      // Input validation
      if (!form.email || !form.regno || !form.password || !form.confirmpassword) {
        Alert.alert('Error', 'Please Fill All the Fields');
        return;
      }
      
      if (form.password !== form.confirmpassword) {
        Alert.alert('Error', 'Password and Confirm Password Do Not Match');
        return;
      }

      setIsSubmitting(true);

      // Check if registration number exists
      const regnocheckResponse = await axios.post(
        'http://172.20.10.2:8080/users/signup/regnocheck',
        {
          regno: form.regno,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      );

      if (regnocheckResponse.data.success) {
        // If regno check passes, proceed to verification page
        router.push({
          pathname: '/signupverify',
          params: { 
            regno: form.regno,
            email: form.email,
            password: form.password
          }
        });
      } else {
        Alert.alert('Error', regnocheckResponse.data.errors);
      }
    } catch (error) {
      // Handle network or server errors
      Alert.alert('Error', error.response?.data?.errors || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <View className="w-full h-full px-4">
        <Text
          className="text-4xl font-semibold"
          style={{ fontFamily: 'Montserrat_700Bold' }}
        >
          Create an{'\n'}Account
        </Text>
        <View className="py-8 items-center">
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
            value={form.email}
            handleChangeText={(e) =>
              setForm({
                ...form,
                email: e,
              })
            }
            otherStyles="mt-7"
            placeholder="Email"
          />
          
          <FromField
            value={form.password}
            handleChangeText={(e) =>
              setForm({
                ...form,
                password: e,
              })
            }
            otherStyles="mt-7"
            placeholder="Password"
            secureTextEntry={true} 
          />

          <FromField
            value={form.confirmpassword}
            handleChangeText={(e) =>
              setForm({
                ...form,
                confirmpassword: e,
              })
            }
            otherStyles="mt-7"
            placeholder="Confirm Password"
            secureTextEntry={true} 
          />

          <Text
            className="text-sm mt-2 mb-10 pr-10 px-6"
            style={{
              fontFamily: 'Montserrat_400Regular',
              textAlign: 'left',
              width: '100%',
            }}
          >
            By clicking the{' '}
            <Text className="text-[#0D7C66]">Create Account</Text> button, you agree
            to the public offer
          </Text>

          <CustomButton
            title="Create Account"
            handlePress={submit}
            containerStyles="mt-7"
            fontStyle="Montserrat_600SemiBold"
            isLoading={isSubmitting}
          />

          <View className="flex-row mt-28">
            <Text style={{ fontFamily: 'Montserrat_400Regular' }}>
              I Already Have an Account{' '}
            </Text>
            <Link href="/login" className="text-[#0D7C66]">
              <Text
                style={{ fontFamily: 'Montserrat_600SemiBold' }}
                className="text-decoration-line: underline"
              >
                Login
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;