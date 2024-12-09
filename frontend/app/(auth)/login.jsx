import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'

import { useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = () => {
    // Implement your login logic here
    console.log('Login with:', email, password);
  };

  const handleSocialLogin = (platform) => {
    // Implement social login logic here
    console.log('Login with:', platform);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header with back button */}
      <View className="bg-emerald-700 p-4">
        <Pressable onPress={() => navigation.goBack()}>
          <Text className="text-white text-xl">←</Text>
        </Pressable>
      </View>

      {/* Main content */}
      <View className="p-6">
        <Text className="text-3xl font-bold mb-8">Welcome Back!</Text>

        {/* Email input */}
        <View className="mb-4">
          <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
            <Image
              source={require('../../assets/imagesuser.png')}
              className="w-5 h-5 mr-2"
            />
            <TextInput
              className="flex-1 text-base"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Password input */}
        <View className="mb-4">
          <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
            <Image
              source={require('../../assets/password.png')}
              className="w-5 h-5 mr-2"
            />
            <TextInput
              className="flex-1 text-base"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={require('../../assets/images/eye.png')}
                className="w-5 h-5"
              />
            </Pressable>
          </View>
        </View>

        {/* Forgot Password */}
        <Pressable className="mb-6">
          <Text className="text-emerald-700 text-right">Forgot Password?</Text>
        </Pressable>

        {/* Login button */}
        <TouchableOpacity
          className="bg-emerald-700 rounded-lg p-4 mb-6"
          onPress={handleLogin}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Login
          </Text>
        </TouchableOpacity>

        {/* Social login section */}
        <View className="mb-6">
          <Text className="text-gray-500 text-center mb-4">- OR Continue with -</Text>
          <View className="flex-row justify-center space-x-6">
            <TouchableOpacity
              className="p-3 border border-gray-300 rounded-lg"
              onPress={() => handleSocialLogin('google')}
            >
              <Image
                source={require('../../assets/images/google.png')}
                className="w-6 h-6"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-3 border border-gray-300 rounded-lg"
              onPress={() => handleSocialLogin('apple')}
            >
              <Image
                source={require('../../assets/images/apple.png')}
                className="w-6 h-6"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-3 border border-gray-300 rounded-lg"
              onPress={() => handleSocialLogin('facebook')}
            >
              <Image
                source={require('../../assets/images/facebook.png')}
                className="w-6 h-6"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign up link */}
        <View className="flex-row justify-center">
          <Text className="text-gray-600">Create An Account </Text>
          <Pressable onPress={() => navigation.navigate('SignUp')}>
            <Text className="text-emerald-700 font-semibold">Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;











// old code-----------------------------------------------------

// const Login = () => {
//   return (
//     <SafeAreaView>
//       <ScrollView>
//         <View>
//           <Text>Login Page</Text>



//           {/* Successfully login=>Redirect to home page */}
//           <Link href='/home' className='text-red-600'>Go to Home</Link>

//           <Link href='/signup' className='text-lime-800'>Click here to SignUp</Link>

//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

// export default Login