import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import FromField from '../../../../components/FromField';
import AddButton from '../../../../components/AddButton';
import { router } from 'expo-router';
import ImageUploadBoxNew from '../../../../components/ImageUploadBoxNew';
import TextAreaField from '../../../../components/TextAreaField';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const AddBordingHouse = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [negotiable, setNegotiable] = useState(false);
  const [sap, setSap] = useState(false);
  const [hidephoneno , setHidephoneno] = useState(false);z

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([null, null, null, null, null, null]);
  const [customFacility, setCustomFacility] = useState('');

  const [form, setForm] = useState({
    location: '',
    facilities: [],
    capacity: '',
    distance: '',
    description: '',
    rentprice: '',
    negotiable: false,
    images: [],
    contact: {},
    hidephoneno: false,
  });
  
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
    };

  
    console.log('Updated Form Details:', updatedForm);


    const response = await axios.post(
     `${apiUrl}/boardingposts/addbordingpost`,
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


  const facilities = [
    'Water',
    'Electricity',
    'Furniture',
    'Wifi',
    'Kitchen Appliance',
    'Other',
  ];

  return (
    <SafeAreaView>
      <Text className="mx-6 font-semibold text-xl">Post about a Boarding House</Text>
      <ScrollView>
        <View className="mx-6">
          <Text className="font-normal text-base mt-6 pb-1">Add Location</Text>
          <FromField
            otherStyles="w-full"
            value={form.location}
            handleChangeText={(text) => setForm((prev) => ({ ...prev, location: text }))}
          />

          <Text className="font-normal text-base mt-6">Facilities</Text>
          <View className="flex-row flex-wrap justify-between mt-6 pl-6">
            {facilities.map((category, index) => (
              <View
                key={index}
                className="w-[48%] flex-row items-center gap-5 mb-4"
              >
                <Checkbox
                  value={checkedItems[category] || false}
                  onValueChange={() => toggleCheckbox(category)}
                  color={checkedItems[category] ? '#0D7C66' : '#0D7C66'}
                />
                <Text>{category}</Text>
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
  )
}

export default AddBordingHouse