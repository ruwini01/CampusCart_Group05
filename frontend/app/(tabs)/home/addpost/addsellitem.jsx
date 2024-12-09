import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import FromField from '../../../../components/FromField';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import {Divider} from 'react-native-paper'
import AddButton from '../../../../components/AddButton';
import { router } from 'expo-router';
import ImageUploadBox from '../../../../components/ImageUploadBox';
import TextAreaField from '../../../../components/TextAreaField'; 


const AddSellItem = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [current, setCurrent] = useState("used");
  const [negotiable, setNegotiable] = useState(false);
  const [sap, setSap] = useState(false);
  const [hidephoneno , setHidephoneno] = useState(false);

  const [images, setImages] = useState(Array(3).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = ()=>{
      router.replace('/home')
    }
  

  const toggleCheckbox = (item) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleImageSelect = (index, uri) => {
    const newImages = [...images];
    newImages[index] = uri; // Set the selected image URI at the specific index
    setImages(newImages);
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
                  value={checkedItems[category] || false}
                  onValueChange={() => toggleCheckbox(category)}
                  color={checkedItems[category] ? '#0D7C66' : '#0D7C66'}
                />
                <Text>{category}</Text>
              </View>
            ))}
          </View>

          <Text className="font-normal text-base mt-6 pb-1">Add Location</Text>
          <FromField otherStyles="w-full" />

          <Text className="font-normal text-base mt-6 pb-1">Item Name</Text>
          <FromField otherStyles="w-full" />

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
          <FromField otherStyles="w-full" />

          <Text className="font-normal text-base mt-6 pb-1">Description</Text>
          <TextAreaField otherStyles="w-full" />

          <Text className="font-normal text-base mt-6 pb-1">Price</Text>
          <FromField otherStyles="w-full" />

          <Text className="font-normal text-base mt-6 pb-1">Original Price (If used)</Text>
          <FromField otherStyles="w-full" />

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
  );
};

export default AddSellItem;
