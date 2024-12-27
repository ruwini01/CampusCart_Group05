import { View, Text, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import FromField from '../components/FromField';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import AddButton from '../components/AddButton';
import { router } from 'expo-router';
import ImageUploadBoxNew from '../components/ImageUploadBox';
import TextAreaField from '../components/TextAreaField';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddBoardingPost = () => {
  const [current, setCurrent] = useState("single"); // Type of accommodation
  const [negotiable, setNegotiable] = useState(false);
  const [hidephoneno, setHidephoneno] = useState(false);
  const [images, setImages] = useState([null, null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    token: '',
    type: '',
    location: '',
    rentprice: '',
    description: '',
    contact: {},
    hidephoneno: false,
    negotiable: false,
    images: [],
  });

  const handleImageUpload = async (uri, index) => {
    try {
      const formData = new FormData();
      formData.append('post', {
        uri: uri,
        type: 'image/jpeg',
        name: `image${index + 1}.jpg`,
      });

      const uploadResponse = await axios.post(
        'http://172.20.10.2:8080/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (uploadResponse.data.success) {
        setImages(prevImages => {
          const newImages = [...prevImages];
          newImages[index] = uploadResponse.data.image_url;
          return newImages;
        });

        setForm(prevForm => ({
          ...prevForm,
          images: [
            ...prevForm.images.slice(0, index),
            uploadResponse.data.image_url,
            ...prevForm.images.slice(index + 1)
          ],
        }));

        return uploadResponse.data.image_url;
      } else {
        Alert.alert('Error', 'Failed to upload image');
        return null;
      }
    } catch (error) {
      console.error('Image upload error:', error);
      Alert.alert('Error', 'Failed to upload image');
      return null;
    }
  };

  const submit = async () => {
    try {
      if (!form.location || !form.rentprice || !form.description) {
        Alert.alert('Error', 'Please fill all the required fields.');
        return;
      }

      setIsSubmitting(true);
      const validImages = images.filter(img => img !== null);
      const token = await AsyncStorage.getItem('token');

      const updatedForm = {
        ...form,
        token: token,
        images: validImages,
        type: current,
        negotiable: negotiable,
        hidephoneno: hidephoneno,
      };

      const response = await axios.post(
        'http://172.20.10.2:8080/api/boardingPost/add',
        updatedForm,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Boarding Post Added Successfully');
        router.replace('/home');
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="mb-10">
      <Text className="mx-6 font-semibold text-xl mb-6">Add Boarding Accommodation</Text>
      <ScrollView>
        <View className="mx-6">
          <Text className="font-normal text-base mt-6 pb-1">Location</Text>
          <FromField
            otherStyles="w-full"
            value={form.location}
            handleChangeText={(text) => setForm(prev => ({ ...prev, location: text }))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Type</Text>
          <View className="flex-row items-center gap-5">
            <RadioButtonGroup
              selected={current}
              onSelected={(value) => setCurrent(value)}
              radioBackground="#0D7C66"
              size={16}
            >
              <RadioButtonItem value="single" label="Single Room" />
              <RadioButtonItem value="shared" label="Shared Room" />
            </RadioButtonGroup>
          </View>

          <Text className="font-normal text-base mt-6 pb-1">Rent Price</Text>
          <FromField
            otherStyles="w-full"
            value={form.rentprice}
            handleChangeText={(text) => setForm(prev => ({ ...prev, rentprice: text }))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Description</Text>
          <TextAreaField
            otherStyles="w-full"
            value={form.description}
            handleChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Add up to 3 Photos</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
            {images.map((imageUri, index) => (
              <ImageUploadBoxNew
                key={index}
                imageUri={imageUri}
                onImageSelect={(uri) => handleImageUpload(uri, index)}
              />
            ))}
          </View>

          <View className="flex-row items-center gap-5 mt-2 mx-1">
            <Checkbox
              value={negotiable}
              onValueChange={() => setNegotiable(!negotiable)}
              color={negotiable ? '#0D7C66' : '#0D7C66'}
            />
            <Text>Negotiable</Text>
          </View>

          <Text className="font-semibold text-lg pb-6">Contact Details</Text>

          <View className="flex-row items-center gap-5 mt-2 mx-1">
            <Checkbox
              value={hidephoneno}
              onValueChange={() => setHidephoneno(!hidephoneno)}
              color={hidephoneno ? '#0D7C66' : '#0D7C66'}
            />
            <Text>Hide Phone Number</Text>
          </View>

          <View className="items-center">
            <AddButton
              title="Submit"
              loading={isSubmitting}
              handlePress={submit}
              disabled={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddBoardingPost;
