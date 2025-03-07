import { View, Text, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import FromField from '../../../../components/FromField';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import AddButton from '../../../../components/AddButton';
import { router, useLocalSearchParams } from 'expo-router';
import ImageUploadBoxNew from '../../../../components/ImageUploadBoxNew';
import TextAreaField from '../../../../components/TextAreaField';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditButton from '../../../../components/EditButton';
import SaveButton from '../../../../components/SaveButton';
import { RadioButton } from 'react-native-paper';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const EditSellItem = () => {
  const params = useLocalSearchParams();
  const item = JSON.parse(params.item);

  const [isSwitchOn, setIsSwitchOn] = useState(item?.status === 'available');

  const [selectedCategory, setSelectedCategory] = useState(item.category || null);
  const [customCategory, setCustomCategory] = useState(item.category === 'Other' ? item.category : '');
  const [current, setCurrent] = useState(item.condition || "used");
  const [negotiable, setNegotiable] = useState(item.negotiable || false);
  const [sap, setSap] = useState(false);
  const [hidephoneno, setHidephoneno] = useState(item.hidephoneno || false);
  const [images, setImages] = useState(item.images || [null, null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    token: '',
    category: item.category || '',
    location: item.location || '',
    itemname: item.itemname || '',
    condition: item.condition || '',
    brand: item.brand || '',
    description: item.description || '',
    price: item.price || '',
    originalPrice: item.originalPrice || '',
    negotiable: item.negotiable || false,
    images: item.images || [],
    contact: {
      name: item.contact?.name || '',
      telephone: item.contact?.telephone || '',
      address: item.contact?.address || '',
    },
    hidephoneno: item.hidephoneno || false,
    status: item?.status || 'available',
  });

  useEffect(() => {
    // Ensure images array has exactly 3 slots
    if (!form.images || form.images.length === 0) {
      setImages([null, null, null]);
    } else if (form.images.length === 1) {
      setImages([form.images[0], null, null]);
    } else if (form.images.length === 2) {
      setImages([form.images[0], form.images[1], null]);
    } else {
      setImages(form.images.slice(0, 3));
    }
  }, []);

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

      if (!form.category || !form.location || !form.itemname || !form.description || !form.price || !form.contact.telephone) {
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
        condition: current,
        negotiable: negotiable,
        hidephoneno: hidephoneno,
      };

      const response = await axios.put(
        `${apiUrl}/sellposts/editsellpost/${item._id}`,
        updatedForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Post Updated Successfully');
        router.replace('/(tabs)/profile/myposts');
      } else {
        Alert.alert('Error', response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleDelete = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Deletion canceled'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await axios.delete(
                `${apiUrl}/sellposts/removesellpost/${item._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );

              if (response.data.success) {
                Alert.alert('Success', response.data.message);
                router.replace('/(tabs)/profile/myposts');
              } else {
                Alert.alert('Error', 'Failed to delete profile.');
              }
            } catch (error) {
              Alert.alert('Error', 'An error occurred while deleting the post.');
              console.error(error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
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
      <Text className="mx-6 font-semibold text-xl mb-6">Edit Sell Item Post</Text>
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
            handleChangeText={(text) => setForm(prev => ({ ...prev, location: text }))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Item Name</Text>
          <FromField
            otherStyles="w-full"
            value={form.itemname}
            handleChangeText={(text) => setForm(prev => ({ ...prev, itemname: text }))}
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
            handleChangeText={(text) => setForm(prev => ({ ...prev, brand: text }))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Description</Text>
          <TextAreaField
            otherStyles="w-full"
            value={form.description}
            handleChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Price</Text>
          <FromField
            otherStyles="w-full"
            value={form.price}
            handleChangeText={(text) => setForm(prev => ({ ...prev, price: text }))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Original Price (If used)</Text>
          <FromField
            otherStyles="w-full"
            value={form.originalPrice}
            handleChangeText={(text) => setForm(prev => ({ ...prev, originalPrice: text }))}
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

          <Text className="font-semibold text-lg pb-6 mt-6">Change Status</Text>
          <View className='flex-row items-center gap-8 mb-10'>
            <View className='flex-row items-center'>
              <RadioButton
                value="available"
                status={isSwitchOn ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIsSwitchOn(true);
                  setForm(prev => ({
                    ...prev,
                    status: 'available'
                  }));
                }}
                color="#0D7C66"
              />
              <Text>Available</Text>
            </View>
            <View className='flex-row items-center'>
              <RadioButton
                value=" sold out"
                status={!isSwitchOn ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIsSwitchOn(false);
                  setForm(prev => ({
                    ...prev,
                    status: 'sold out'
                  }));
                }}
                color="#0D7C66"
              />
              <Text>Sold Out</Text>
            </View>
          </View>

          <Text className="font-semibold text-lg pb-6">Contact Details</Text>

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
              contact: { ...prev.contact, name: text }
            }))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Address</Text>
          <FromField
            otherStyles="w-full"
            value={form.contact.address}
            handleChangeText={(text) => setForm(prev => ({
              ...prev,
              contact: { ...prev.contact, address: text }
            }))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Telephone</Text>
          <FromField
            otherStyles="w-full"
            value={form.contact.telephone}
            handleChangeText={(text) => setForm(prev => ({
              ...prev,
              contact: { ...prev.contact, telephone: text }
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

          <View className="flex-row justify-between gap-10 items-center mb-10">
            <EditButton handlePress={handleDelete} text='Delete Post' fontStyle="Montserrat_600SemiBold" textStyles="text-white" />
            <SaveButton handlePress={submit} fontStyle="Montserrat_600SemiBold" textStyles="text-white" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditSellItem;