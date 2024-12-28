import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import FromField from '../../../../components/FromField';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { Divider } from 'react-native-paper';
import AddButton from '../../../../components/AddButton';
import { router } from 'expo-router';
import ImageUploadBoxNew from '../../../../components/ImageUploadBoxNew';
import DatePickerField from '../../../../components/DatePickerField';
import TextAreaField from '../../../../components/TextAreaField';

const AddFoundItem = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [sap, setSap] = useState(false);
  const [hidephoneno, setHidephoneno] = useState(false);
  const [images, setImages] = useState([]); // Array to hold valid image URIs
  const [dateFound, setDateFound] = useState(new Date()); // State for the found date
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = () => {
    console.log(images);
    router.replace('/home');
  };

  const toggleCheckbox = (item) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleImageSelect = (index, uri) => {
    const newImages = [...images];
    newImages[index] = uri; // Set the selected image URI at the specific index

    // Filter out null values to keep only valid images
    const filteredImages = newImages.filter((image) => image !== null);

    setImages(filteredImages);
  };

  return (
    <SafeAreaView>
      <Text className="mx-6 font-semibold text-xl">Post a Found Item</Text>
      <ScrollView>
        <View className="mx-6">
          <Text className="font-normal text-base mt-6 pb-1">Item</Text>
          <FromField otherStyles="w-full" />

          <Text className="font-normal text-base mt-6 pb-1">Date Found</Text>
          <DatePickerField
            value={dateFound}
            handleChange={setDateFound}
            placeholder="Select Date"
            otherStyles="w-full"
          />

          <Text className="font-normal text-base mt-6 pb-1">Location</Text>
          <FromField otherStyles="w-full" />

          <Text className="font-normal text-base mt-6 pb-1">Description</Text>
          <TextAreaField otherStyles="w-full" />

          <Text className="font-normal text-base mt-6 pb-1">Add up to 2 Photos</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
            {Array.from({ length: 2 }).map((_, index) => (
              <ImageUploadBoxNew
                key={index}
                index={index}
                imageUri={images[index] || null} // Show image if exists, otherwise null
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
