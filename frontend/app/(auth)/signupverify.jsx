import { View, Text, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router, useLocalSearchParams } from 'expo-router';
import CustomButton from '../../components/CustomButton';
import ImageUploadBox from '../../components/ImageUploadBox';
import axios from 'react-native-axios';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const SignUpVerify = () => {
  const params = useLocalSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    regno: '',
    password: '',
  });

  useEffect(() => {
    setFormData({
      email: params.email,
      regno: params.regno,
      password: params.password,
    });
  }, [params.regno, params.email, params.password]);

  console.log('Form Data:', formData);

  const handleImageSelect = (index, selectedImage) => {
    setImageUri(selectedImage.uri);
    setImage(selectedImage);
  };

  console.log("Setted Image: ", image);

  const submit = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image first.');
      return;
    }

    try {
      setIsSubmitting(true);

      // First request - Image verification
      const formData1 = new FormData();
      formData1.append('image', {
        uri: image.uri,
        type: image.type,
        name: image.fileName,
      });

      const response = await axios.post(
        `${apiUrl}/verify/signupverify`,
        formData1,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Response:', response.data);

      if (response.data.success) {
        if(formData.regno === response.data.enrollmentNumber){
          Alert.alert('Success', 'Verification successful');

          // Second request - User signup
          try {
            const signupResponse = await axios.post(
              `${apiUrl}/users/signup`,
              {
                email: formData.email,
                regno: formData.regno,
                password: formData.password
              },
              {
                headers: {
                  'Content-Type': 'application/json'
                },
              }
            );

            console.log('Signup Response:', signupResponse.data);

            if (signupResponse.data.success) {

              //set it to global state

              router.replace('/login');
            } else {
              Alert.alert('Error', signupResponse.data.errors || 'Signup failed. Please try again.');
            }
          } catch (signupError) {
            console.error('Signup error:', signupError.response?.data || signupError.message);
            Alert.alert('Error', signupError.response?.data?.errors || 'Failed to create account. Please try again.');
          }
        } else {
          Alert.alert('Error', 'Registration number does not match with ID card');
        }
      } else {
        Alert.alert('Error', response.data.message || 'Verification failed. Please try again.');
      }

    } catch (error) {
      //console.error('Error uploading image:', error.response ? error.response.data : error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to upload image. Please try again.');
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
          Verify Your{'\n'}Registration No
        </Text>
        <View className="py-20 items-center">
          <Text
            style={{ fontFamily: 'Montserrat_400Regular' }}
            className="px-5 text-center"
          >
            Upload front side image of your University ID.
            <TouchableOpacity
              onPress={() => router.back()}
            >
              <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}  className="text-[#0D7C66]">
                {' '}
                Change Registration Number
              </Text>
            </TouchableOpacity>
          </Text>

          <View className="flex-row my-20 gap-8">
            <ImageUploadBox imageUri={imageUri} onImageSelect={handleImageSelect} width={300} height={150} />
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
  );
};

export default SignUpVerify;