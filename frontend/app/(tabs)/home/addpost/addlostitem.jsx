import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import FromField from '../../../../components/FromField';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import {Divider} from 'react-native-paper'
import AddButton from '../../../../components/AddButton';
import { router } from 'expo-router';
import ImageUploadBox from '../../../../components/ImageUploadBox';  // Import the new component
import DatePickerField from '../../../../components/DatePickerField'; // Import the new component

const AddLostItem = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [current, setCurrent] = useState("used");
  const [negotiable, setNegotiable] = useState(false);
  const [sap, setSap] = useState(false);
  const [hidephoneno , setHidephoneno] = useState(false);
  const [images, setImages] = useState(Array(2).fill(null)); // Array to hold up to 2 images
  const [dateLost, setDateLost] = useState(new Date()); // State for the lost date
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


  return (
    <SafeAreaView>
      <Text className="mx-6 font-semibold text-xl">Report a Lost Item</Text>
      <ScrollView>
        <View className="mx-6">
        <Text className="font-normal text-base mt-6 pb-1">Item</Text>
        <FromField otherStyles="w-full" />

        <Text className="font-normal text-base mt-6 pb-1">Date Lost</Text>
          <DatePickerField
            value={dateLost}
            handleChange={setDateLost} // Update the dateLost state
            placeholder="Select Date"
            otherStyles="w-full" // Additional styles if needed
          />


          <Text className="font-normal text-base mt-6 pb-1">Location</Text>
          <FromField otherStyles="w-full" />

          <Text className="font-normal text-base mt-6 pb-1">Description</Text>
          {/* Change This field to a description box (text area) */}
          <FromField otherStyles="w-full h-[100]" />

         
          <Text className="font-normal text-base mt-6 pb-1">Add up to 2 Photos</Text>
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
          <AddButton
            handlePress={submit}
            containerStyles="mt-7"
            fontStyle="Montserrat_600SemiBold"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddLostItem