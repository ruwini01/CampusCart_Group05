import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import FromField from '../../components/FromField';
import CustomButton from '../../components/CustomButton';
import { Alert } from 'react-native';
import axios from 'react-native-axios';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateRegNo = (regno) => {
  // Format: "2020/ICT/01"
  const regnoRegex = /^\d{4}\/[A-Z]{2,4}\/\d{2,3}$/;
  return regnoRegex.test(regno);
};

const validatePassword = (password) => {
  return password.length >= 6 && /[A-Za-z]/.test(password) && /\d/.test(password);
};

const SignUp = () => {
  const [form, setForm] = useState({
    email: '',
    regno: '',
    password: '',
    confirmpassword: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    regno: '',
    password: '',
    confirmpassword: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    regno: false,
    password: false,
    confirmpassword: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

// Real-time validation
useEffect(() => { 
   // Only validate if field has been touched
   if (touched.email && form.email) {
    if (!validateEmail(form.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  }

  if (touched.regno && form.regno) {
    if (!validateRegNo(form.regno.toUpperCase())) {
      setErrors(prev => ({ ...prev, regno: 'Registration number format should be like 2020/ICT/01' }));
    } else {
      setErrors(prev => ({ ...prev, regno: '' }));
    }
  }

  if (touched.password && form.password) {
    if (!validatePassword(form.password)) {
      setErrors(prev => ({ 
        ...prev, 
        password: 'Password must be at least 6 characters with one letter and one number' 
      }));
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  }

  if (touched.confirmpassword && form.confirmpassword) {
    if (form.confirmpassword !== form.password) {
      setErrors(prev => ({ ...prev, confirmpassword: 'Passwords do not match' }));
    } else {
      setErrors(prev => ({ ...prev, confirmpassword: '' }));
    }
  }

}, [form, touched]);

// Field change handlers with touch state
const handleFieldChange = (field, value) => {
  setForm(prev => ({ ...prev, [field]: value }));
  if (!touched[field]) {
    setTouched(prev => ({ ...prev, [field]: true }));
  }
};


  const submit = async () => {
    try {
       // Mark all fields as touched to show validation errors
       setTouched({
        email: true,
        regno: true,
        password: true,
        confirmpassword: true,
      });


      // Input validation
      if (!form.email || !form.regno || !form.password || !form.confirmpassword) {
        Alert.alert('Error', 'Please Fill All the Fields');
        return;
      }
      
       // Check if there are any validation errors
       if (errors.email || errors.regno || errors.password || errors.confirmpassword) {
        Alert.alert('Error', 'Please correct all validation errors');
        return;
      }


      setIsSubmitting(true);

      // Check if registration number exists
      const regnocheckResponse = await axios.post(
        `${apiUrl}/users/signup/regnocheck`,
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

   // Validation message component
   const ValidationMessage = ({ message, type = 'error' }) => {
    if (!message) return null;
    
    return (
      <Text className={`text-xs px-2 mt-1 ${type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
        {message}
      </Text>
    );
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
            value={form.regno.toUpperCase()}
            handleChangeText={(e) => handleFieldChange('regno', e)}
            otherStyles="mt-7"
            placeholder="Registration No (Ex: 2020/ICT/01)"
          />
          <ValidationMessage message={errors.regno} />


          <FromField
            value={form.email}
            handleChangeText={(e) =>
              handleFieldChange('email', e)
            }
            otherStyles="mt-7"
            placeholder="Email"
          />
          <ValidationMessage message={errors.email} />
          
          <FromField
            value={form.password}
            handleChangeText={(e) =>
              handleFieldChange('password', e)
            }
            otherStyles="mt-7"
            placeholder="Password"
            secureTextEntry={true} 
          />
          <ValidationMessage message={errors.password} />



          <FromField
            value={form.confirmpassword}
            handleChangeText={(e) =>
              handleFieldChange('confirmpassword', e)
            }
            otherStyles="mt-7"
            placeholder="Confirm Password"
            secureTextEntry={true} 
          />
          <ValidationMessage message={errors.confirmpassword} />


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