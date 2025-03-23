import { View, Text, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const Login = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.username || !form.password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem('adminToken', data.token);
        Alert.alert('Success', 'Login successful!');
        router.replace('(tabs)/home'); // Redirect to admin dashboard
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Server error. Please try again.');
    }

    setIsSubmitting(false);
  };

  return (
    <SafeAreaView className="h-full">
      <View className="w-full h-full px-4">
        <Text
          className="text-4xl font-semibold"
          style={{ fontFamily: 'Montserrat_700Bold' }}
        >
          Welcome{'\n'}Back!
        </Text>
        <View className="py-20 items-center">
          <FormField
            value={form.username} // No toUpperCase() to allow normal typing
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
            title="Password"
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

          <Link
            href="/resetpassword"
            className="text-[#0D7C66] text-sm mt-2 mb-10"
            style={{ fontFamily: 'Montserrat_400Regular' }}
          >
            Forgot Password?
          </Link>

          <CustomButton
            title="Login"
            handlePress={submit} // Calls the function correctly
            containerStyles="mt-7"
            fontStyle="Montserrat_600SemiBold"
            isLoading={isSubmitting}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
