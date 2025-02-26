import { View, Text, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import FromField from '../../../../components/FromField';
import AddButton from '../../../../components/AddButton';
import { router, useLocalSearchParams } from 'expo-router';
import ImageUploadBoxNew from '../../../../components/ImageUploadBoxNew';
import DatePickerField from '../../../../components/DatePickerField';
import TextAreaField from '../../../../components/TextAreaField';
import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditButton from '../../../../components/EditButton';
import SaveButton from '../../../../components/SaveButton';
import { RadioButton } from 'react-native-paper';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const EditFoundItem = () => {
  const params = useLocalSearchParams();
  const item = params.item ? JSON.parse(params.item) : null;

  const [isSwitchOn, setIsSwitchOn] = useState(item?.status === 'searching for owner');

  const [sap, setSap] = useState(false);
  const [hidephoneno, setHidephoneno] = useState(item?.hidephoneno || false);
  const [images, setImages] = useState(
    Array(2).fill(null).map((_, index) => item?.images[index] || null)
  );
  const [dateFound, setDateFound] = useState(item?.founddate ? new Date(item.founddate) : new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    itemname: item?.itemname || '',
    founddate: item?.founddate || '',
    location: item?.location || '',
    description: item?.description || '',
    images: item?.images || [],
    contact: {
      name: item?.contact?.name || '',
      telephone: item?.contact?.telephone?.toString() || '',
      address: item?.contact?.address || '',
    },
    hidephoneno: item?.hidephoneno || false,
    status: item?.status || 'searching for owner',
  });

  useEffect(() => {
    if (!item) {
      Alert.alert('Error', 'No post data found');
      router.back();
    }
  }, [item]);

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

      const response = await axios.put(
        `${apiUrl}/foundposts/editfoundpost/${item._id}`,
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
      Alert.alert('Error', 'Failed to update post');
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
                `${apiUrl}/foundposts/removefoundpost/${item._id}`,
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
                Alert.alert('Error', 'Failed to delete Post.');
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


  return (
    <SafeAreaView>
      <Text className="mx-6 font-semibold text-xl">Edit Found Item Post</Text>
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


          <Text className="font-semibold text-lg pb-6 mt-6">Change Status</Text>
          <View className='flex-row items-center gap-8 mb-10'>
            <View className='flex-row items-center'>
              <RadioButton
                value="searching for owner"
                status={isSwitchOn ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIsSwitchOn(true);
                  setForm(prev => ({
                    ...prev,
                    status: 'searching for owner'
                  }));
                }}
                color="#0D7C66"
              />
              <Text>Searching for Owner</Text>
            </View>
            <View className='flex-row items-center'>
              <RadioButton
                value=" owner found"
                status={!isSwitchOn ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIsSwitchOn(false);
                  setForm(prev => ({
                    ...prev,
                    status: 'owner found'
                  }));
                }}
                color="#0D7C66"
              />
              <Text>Owner Found</Text>
            </View>
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
              onValueChange={() => {
                setHidephoneno(!hidephoneno);
                setForm(prev => ({ ...prev, hidephoneno: !hidephoneno }));
              }}
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

export default EditFoundItem;