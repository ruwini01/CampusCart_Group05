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
        <FromField otherStyles="w-full" />

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

        

        <Text className="font-normal text-base mt-6 pb-1">Capacity</Text>
        <FromField otherStyles="w-full" />

        <Text className="font-normal text-base mt-6 pb-1">Distance to Vavuniya University</Text>
        <FromField otherStyles="w-full" />

        <Text className="font-normal text-base mt-6 pb-1">Description</Text>
        <TextAreaField otherStyles="w-full" />

          <Text className="font-normal text-base mt-6 pb-1">Rent Price</Text>
          <FromField otherStyles="w-full" />

          <View className="flex-row items-center gap-5 mt-2 mx-1">
            <Checkbox
              value={negotiable}
              onValueChange={() => setNegotiable(!negotiable)}
              color={negotiable ? '#0D7C66' : '#0D7C66'}
            />
            <Text>Negotiable</Text>
          </View>
          

          <Text className="font-normal text-base mt-6 pb-1">Add up to 6 Photos</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
            {images.map((imageUri, index) => (
              <ImageUploadBox
                key={index}
                index={index}
                imageUri={imageUri}
                onImageSelect={handleImageSelect}
              />
            ))}
          </View>


          <Text className="font-semibold text-lg pb-6">Contact Details</Text>

          <View className="flex-row items-center gap-5 mt-2 mx-1">
            <Checkbox
              value={sap}
              onValueChange={() => setSap(!sap)}
              color={sap ? '#0D7C66' : '#0D7C66'}
            />
            <Text>Same as My Profile</Text>
          </View>

          <Text className="font-normal text-base mt-6 pb-1">Name</Text>
          <FromField otherStyles="w-full" />

          <Text className="font-normal text-base mt-6 pb-1">Email</Text>
          <FromField otherStyles="w-full" />

          <Text className="font-normal text-base mt-6 pb-1">Telephone</Text>
          <FromField otherStyles="w-full" />

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