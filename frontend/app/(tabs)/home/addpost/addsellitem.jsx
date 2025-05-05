import { View, Text, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import FromField from '../../../../components/FromField';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import AddButton from '../../../../components/AddButton';
import { router } from 'expo-router';
import ImageUploadBoxNew from '../../../../components/ImageUploadBoxNew';
import TextAreaField from '../../../../components/TextAreaField';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const AddSellItem = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customCategory, setCustomCategory] = useState(''); // New state for custom category
  const [current, setCurrent] = useState("used");
  const [negotiable, setNegotiable] = useState(false);
  const [sap, setSap] = useState(false);
  const [hidephoneno, setHidephoneno] = useState(false);
  const [images, setImages] = useState([null, null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    token:'',
    category: '',
    location: '',
    itemname: '',
    condition: '',
    brand: '',
    description: '',
    price: '',
    originalPrice: '',
    negotiable: false,
    images: [],
    contact: {},
    hidephoneno: false,
  });

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setForm(prev => ({ ...prev, category: '' }));
    } else {
      setSelectedCategory(category);
      setForm(prev => ({ ...prev, category: category }));
    }
  };

  const handleCustomCategoryChange = (text) => {
    setCustomCategory(text);
    setForm(prev => ({ ...prev, category: text }));
  };

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
      if (!form.category) {
        Alert.alert('Error', 'Please select one category');
        return;
      }
  
      setIsSubmitting(true);
      const validImages = images.filter(img => img !== null);
      const token = await AsyncStorage.getItem('token');
  
      const updatedForm = {
        ...form,
        token: token,
        images: validImages,
        condition: current,
        negotiable: negotiable,
        hidephoneno: hidephoneno,
      };

      if (!form.category || !form.location || !form.itemname || !form.description || !form.price || !form.contact.telephone) {
        Alert.alert('Error', 'Please fill all the required fields.');
        return;
    }
  
      // Log updated form details to the console
      console.log('Updated Form Details:', updatedForm);

     

      const response = await axios.post(
        `${apiUrl}/sellposts/addsellpost`,
        updatedForm
        ,
        {
          headers: {
            'Content-Type': 'application/json',
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
  

  const categories = [
    'Furniture',
    'Electronics',
    'Fashion',
    'Education',
    'Appliances',
    'Essentials',
    'Vehicles',
    'Sports Equipment',
    'Clothing',
    'Other',
  ];

  return (
    <SafeAreaView className='mb-10'>
      <Text className="mx-6 font-semibold text-xl mb-6">Sell an Item</Text>
      <ScrollView>
        <View className="mx-6">
          <Text className="font-normal text-base">Select a category</Text>
          <View className="flex-row flex-wrap justify-between mt-6 pl-6">
            {categories.map((category, index) => (
              <View
                key={index}
                className="w-[48%] flex-row items-center gap-5 mb-4"
              >
                <Checkbox
                  value={selectedCategory === category}
                  onValueChange={() => handleCategorySelect(category)}
                  color={selectedCategory === category ? '#0D7C66' : '#0D7C66'}
                />
                <Text>{category}</Text>
              </View>
            ))}
          </View>

          {selectedCategory === 'Other' && (
            <View className="mt-4">
              <Text className="font-normal text-base pb-1">Specify Other Category</Text>
              <FromField
                otherStyles="w-full"
                value={customCategory}
                handleChangeText={handleCustomCategoryChange}
              />
            </View>
          )}

          <Text className="font-normal text-base mt-6 pb-1">Add Location</Text>
          <FromField 
            otherStyles="w-full" 
            value={form.location}
            handleChangeText={(text) => setForm(prev => ({...prev, location: text}))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Item Name</Text>
          <FromField 
            otherStyles="w-full"
            value={form.itemname}
            handleChangeText={(text) => setForm(prev => ({...prev, itemname: text}))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Condition</Text>
          <View className="flex-row items-center gap-5">
            <RadioButtonGroup
              selected={current}
              onSelected={(value) => setCurrent(value)}
              radioBackground="#0D7C66"
              size={16}
            >
              <RadioButtonItem value="used" label="Used" />
              <RadioButtonItem value="brandnew" label="Brand New" />
            </RadioButtonGroup>
          </View>

          <Text className="font-normal text-base mt-6 pb-1">Brand</Text>
          <FromField 
            otherStyles="w-full"
            value={form.brand}
            handleChangeText={(text) => setForm(prev => ({...prev, brand: text}))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Description</Text>
          <TextAreaField 
            otherStyles="w-full"
            value={form.description}
            handleChangeText={(text) => setForm(prev => ({...prev, description: text}))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Price</Text>
          <FromField 
            otherStyles="w-full"
            value={form.price}
            handleChangeText={(text) => setForm(prev => ({...prev, price: text}))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Original Price (If used)</Text>
          <FromField 
            otherStyles="w-full"
            value={form.originalPrice}
            handleChangeText={(text) => setForm(prev => ({...prev, originalPrice: text}))}
          />

          <View className="flex-row items-center gap-5 mt-2 mx-1">
            <Checkbox
              value={negotiable}
              onValueChange={() => setNegotiable(!negotiable)}
              color={negotiable ? '#0D7C66' : '#0D7C66'}
            />
            <Text>Negotiable</Text>
          </View>

          <Text className="font-normal text-base mt-6 pb-1">Add up to 3 Photos</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
            {images.map((imageUri, index) => (
              <ImageUploadBoxNew
                key={index}
                imageUri={imageUri}
                onImageSelect={(uri) => handleImageSelect(index, uri)}
              />
            ))}
          </View>

          <Text className="font-semibold text-lg pb-6">Contact Details</Text>
          
          <View className="flex-row items-center gap-5 mt-2 mx-1">
          <Checkbox
              value={sap}
              onValueChange={(checked) => {
                setSap(checked);
                if (checked) {
                  fetchUserData(); // Fetch data when checked
                } else {
                  // Reset contact fields when unchecked
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
              onValueChange={() => setHidephoneno(!hidephoneno)}
              color={hidephoneno ? '#0D7C66' : '#0D7C66'}
            />
            <Text>Hide Phone Number</Text>
          </View>

            <View className='items-center'>
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

export default AddSellItem;
