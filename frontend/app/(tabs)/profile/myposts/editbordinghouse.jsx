import { View, Text, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import FromField from '../../../../components/FromField';
import AddButton from '../../../../components/AddButton';
import { router, useLocalSearchParams } from 'expo-router';
import ImageUploadBoxNew from '../../../../components/ImageUploadBoxNew';
import TextAreaField from '../../../../components/TextAreaField';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import EditButton from '../../../../components/EditButton';
import SaveButton from '../../../../components/SaveButton';
import { RadioButton } from 'react-native-paper';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const EditBordingHouse = () => {
  const params = useLocalSearchParams();
  const item = params.item ? JSON.parse(params.item) : null;

  const [isSwitchOn, setIsSwitchOn] = useState(item?.status === 'available');

  const categories = [
    'Single Room',
    'Double Room',
    'Triple Room',
    'Annex Room',
    'House',
    'Domitory',
    'Other',
  ];

  const facilities = [
    'Water',
    'Electricity',
    'Furniture',
    'Wifi',
    'Kitchen Appliance',
    'Other',
  ];

  const [selectedCategory, setSelectedCategory] = useState(item?.category || null);
  const [customCategory, setCustomCategory] = useState(
    !categories.includes(item?.category) ? item?.category : ''
  );
  const [checkedItems, setCheckedItems] = useState(
    item?.facilities?.reduce((acc, facility) => ({
      ...acc,
      [facility]: true
    }), {}) || {}
  );
  const [negotiable, setNegotiable] = useState(item?.negotiable || false);
  const [sap, setSap] = useState(false);
  const [hidephoneno, setHidephoneno] = useState(item?.hidephoneno || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState(
    Array(6).fill(null).map((_, index) => item?.images[index] || null)
  );
  const [customFacility, setCustomFacility] = useState('');

  const [form, setForm] = useState({
    category: item?.category || '',
    location: item?.location || '',
    facilities: item?.facilities || [],
    capacity: item?.capacity || '',
    distance: item?.distance || '',
    description: item?.description || '',
    rentprice: item?.rentprice?.toString() || '',
    negotiable: item?.negotiable || false,
    images: item?.images || [],
    contact: {
      name: item?.contact?.name || '',
      telephone: item?.contact?.telephone?.toString() || '',
      address: item?.contact?.address || '',
    },
    hidephoneno: item?.hidephoneno || false,
    status: item?.status || 'available',
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

  const toggleCheckbox = (item) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));

    setForm((prev) => {
      if (item === 'Other') {
        return prev;
      }

      const isAlreadySelected = prev.facilities.includes(item);
      const updatedFacilities = isAlreadySelected
        ? prev.facilities.filter((facility) => facility !== item)
        : [...prev.facilities, item];

      return {
        ...prev,
        facilities: updatedFacilities,
      };
    });
  };

  const handleCustomFacilityChange = (text) => {
    setCustomFacility(text);

    setForm((prev) => {
      const facilities = prev.facilities.filter(facility =>
        facility !== prev.customFacility
      );

      if (text.trim()) {
        facilities.push(text.trim());
      }

      return {
        ...prev,
        facilities,
        customFacility: text
      };
    });
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
      if (!form.location || !form.facilities || !form.capacity || !form.distance || !form.description || !form.rentprice || !form.contact.telephone) {
        Alert.alert('Error', 'Please fill all the required fields.');
        return;
      }

      setIsSubmitting(true);
      const validImages = images.filter(img => img !== null);
      const token = await AsyncStorage.getItem('token');

      const updatedForm = {
        ...form,
        images: validImages,
        negotiable: negotiable,
        hidephoneno: hidephoneno,
        status: isSwitchOn ? 'available' : 'not available',
      };

      const response = await axios.put(
        `${apiUrl}/boardingposts/editbordingpost/${item._id}`,
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
        console.log(updatedForm);

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
                `${apiUrl}/boardingposts/removeboardingpost/${item._id}`,
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

  useEffect(() => {
    if (!item) {
      Alert.alert('Error', 'No post data found');
      router.back();
    }
  }, [item]);

  return (
    <SafeAreaView>
      <Text className="mx-6 font-semibold text-xl">Edit Boarding House Post</Text>
      <ScrollView>
        <View className="mx-6 mt-6">
          <Text className="font-normal text-base">Select Bording Type</Text>
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
              <Text className="font-normal text-base pb-1">Specify Other Type</Text>
              <FromField
                otherStyles="w-full"
                value={customCategory}
                handleChangeText={handleCustomCategoryChange}
              />
            </View>
          )}
        </View>

        <View className="mx-6">
          <Text className="font-normal text-base mt-6 pb-1">Add Location</Text>
          <FromField
            otherStyles="w-full"
            value={form.location}
            handleChangeText={(text) => setForm((prev) => ({ ...prev, location: text }))}
          />

          <Text className="font-normal text-base mt-6">Facilities</Text>
          <View className="flex-row flex-wrap justify-between mt-6 pl-6">
            {facilities.map((facility, index) => (
              <View
                key={index}
                className="w-[48%] flex-row items-center gap-5 mb-4"
              >
                <Checkbox
                  value={checkedItems[facility] || false}
                  onValueChange={() => toggleCheckbox(facility)}
                  color={checkedItems[facility] ? '#0D7C66' : '#0D7C66'}
                />
                <Text>{facility}</Text>
              </View>
            ))}
          </View>

          {checkedItems['Other'] && (
            <View className="mt-4">
              <Text className="font-normal text-base pb-1">Specify Other Facility</Text>
              <FromField
                otherStyles="w-full"
                value={customFacility}
                handleChangeText={handleCustomFacilityChange}
              />
            </View>
          )}

          <Text className="font-normal text-base mt-6 pb-1">Capacity</Text>
          <FromField
            otherStyles="w-full"
            value={form.capacity}
            handleChangeText={(text) => setForm((prev) => ({ ...prev, capacity: text }))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Distance to Vavuniya University</Text>
          <FromField
            otherStyles="w-full"
            value={form.distance}
            handleChangeText={(text) => setForm((prev) => ({ ...prev, distance: text }))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Description</Text>
          <TextAreaField
            otherStyles="w-full"
            value={form.description}
            handleChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
          />

          <Text className="font-normal text-base mt-6 pb-1">Rent Price</Text>
          <FromField
            otherStyles="w-full"
            value={form.rentprice}
            handleChangeText={(text) => setForm((prev) => ({ ...prev, rentprice: text }))}
          />

          <View className="flex-row items-center gap-5 mt-2 mx-1">
            <Checkbox
              value={negotiable}
              onValueChange={() => {
                setNegotiable(!negotiable);
                setForm(prev => ({ ...prev, negotiable: !negotiable }));
              }}
              color={negotiable ? '#0D7C66' : '#0D7C66'}
            />
            <Text>Negotiable</Text>
          </View>

          <Text className="font-normal text-base mt-6 pb-1">Add up to 6 Photos</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
            {images.map((imageUri, index) => (
              <ImageUploadBoxNew
                key={index}
                imageUri={imageUri}
                onImageSelect={(uri) => handleImageSelect(index, uri)}
              />
            ))}
          </View>

          <Text className="font-semibold text-lg pb-6 mt-6">Change Availability</Text>
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
                value="not available"
                status={!isSwitchOn ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIsSwitchOn(false);
                  setForm(prev => ({
                    ...prev,
                    status: 'not available'
                  }));
                }}
                color="#0D7C66"
              />
              <Text>Not Available</Text>
            </View>
          </View>

          <Text className="font-semibold text-lg pb-6 mt-6">Contact Details</Text>

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

export default EditBordingHouse;