import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import FromField from '../../../../components/FromField';
import AddButton from '../../../../components/AddButton';
import { router } from 'expo-router';
import ImageUploadBoxNew from '../../../../components/ImageUploadBoxNew';
import DatePickerField from '../../../../components/DatePickerField';
import TextAreaField from '../../../../components/TextAreaField';
import axios from 'react-native-axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const AddFoundItem = () => {
  const [sap, setSap] = useState(false);
  const [hidephoneno, setHidephoneno] = useState(false);
  const [images, setImages] = useState([null, null]);
  const [dateFound, setDateFound] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    itemname: '',
    founddate: '',
    location: '',
    description: '',
    images: [],
    contact: {},
    hidephoneno: false,
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
        `${apiUrl}/upload`,
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


  const handleImageSelect = async (index, uri) => {
      try {
        const uploadedImageUrl = await handleImageUpload(uri, index);
        if (uploadedImageUrl) {
          setImages(prevImages => {
            const newImages = [...prevImages];
            newImages[index] = uploadedImageUrl;
            return newImages;
          });
        }
      } catch (error) {
        console.error('Error handling image selection:', error);
        Alert.alert('Error', 'Failed to process image');
      }
    };

    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.post(
          `${apiUrl}/users/userdata`,
          { token },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
  
        if (response.data.success) {
          const { name, telephone, address } = response.data.data;
  
          setForm((prev) => ({
            ...prev,
            contact: {
              name: name || '',
              telephone: telephone ? String(telephone) : '',
              address: address || '',
            },
          }));
  
        } else {
          Alert.alert('Error', response.data.errors || 'Failed to fetch user data.');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while fetching user data.');
        console.error(error);
      }
    };



    const submit = async () => {
      try {
        if (!form.itemname || !form.founddate || !form.location || !form.description || !form.contact.telephone) {
          Alert.alert('Error', 'Please fill all the required fields.');
          return;
         }
    
        setIsSubmitting(true);
        const validImages = images.filter(img => img !== null);
        const token = await AsyncStorage.getItem('token');
    
        const updatedForm = {
          ...form,
          images: validImages,
          hidephoneno: hidephoneno,
        };
  
      
        //console.log('Updated Form Details:', updatedForm);
  
  
        const response = await axios.post(
         `${apiUrl}/foundposts/addfoundpost`,
          updatedForm
          ,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.data.success) {
          Alert.alert('Success', 'Post Added Successfully');
          router.replace('/home');
        }
        else{
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
    <SafeAreaView>
      <Text className="mx-6 font-semibold text-xl">Post a Found Item</Text>
      <ScrollView>
        <View className="mx-6">
          <Text className="font-normal text-base mt-6 pb-1">Item</Text>
          <FromField
            otherStyles="w-full"
            value={form.itemname}
            handleChangeText={(text) => setForm((prev) => ({ ...prev, itemname: text }))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Date Found</Text>
          <DatePickerField
            value={dateFound}
            handleChange={(date) => {
              setDateFound(date);
              setForm((prev) => ({ ...prev, founddate: date }));
            }}
            placeholder="Select Date"
            otherStyles="w-full"
          />


          <Text className="font-normal text-base mt-6 pb-1">Location</Text>
          <FromField
            otherStyles="w-full"
            value={form.location}
            handleChangeText={(text) => setForm((prev) => ({ ...prev, location: text }))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Description</Text>
          <TextAreaField 
            otherStyles="w-full"
            value={form.description}
            handleChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Add up to 2 Photos</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
          {images.map((imageUri, index) => (
                <ImageUploadBoxNew
                  key={index}
                  imageUri={imageUri}
                  onImageSelect={(uri) => handleImageSelect(index, uri)}
                />
              ))}
          </View>

          <View className="flex-row items-center gap-5 mt-2 mx-1">
          <Checkbox
              value={sap}
              onValueChange={(checked) => {
                setSap(checked);
                if (checked) {
                  fetchUserData();
                } else {
                  setForm((prev) => ({
                    ...prev,
                    contact: {
                      name: '',
                      address: '',
                      telephone: '',
                    },
                  }));
                }
              }}
              color={sap ? '#0D7C66' : '#0D7C66'}
            />
            <Text>Same as My Profile</Text>
          </View>

          <Text className="font-normal text-base mt-6 pb-1">Name</Text>
          <FromField 
            otherStyles="w-full"
            value={form.contact.name}
            handleChangeText={(text) => setForm(prev => ({
              ...prev, 
              contact: {...prev.contact, name: text}
            }))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Address</Text>
          <FromField 
            otherStyles="w-full"
            value={form.contact.address}
            handleChangeText={(text) => setForm(prev => ({
              ...prev, 
              contact: {...prev.contact, address: text}
            }))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Telephone</Text>
          <FromField 
            otherStyles="w-full"
            value={form.contact.telephone}
            handleChangeText={(text) => setForm(prev => ({
              ...prev, 
              contact: {...prev.contact, telephone: text}
            }))}
          />



          <View className="flex-row items-center gap-5 mt-2 mx-1">
            <Checkbox
              value={hidephoneno}
              onValueChange={() => {
                setHidephoneno(!hidephoneno);
                setForm(prev => ({ ...prev, hidephoneno: !hidephoneno }));
              }}
              color={hidephoneno ? '#0D7C66' : '#0D7C66'}
            />
            <Text>Hide Phone Number</Text>
            
          </View>
          <View className="items-center">
            <AddButton
              handlePress={submit}
              containerStyles="mt-15"
              fontStyle="Montserrat_600SemiBold"
              isLoading={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddFoundItem;
