import { View, Text, ScrollView, Image, Button } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import FromField from '../../../../components/FromField';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import {Divider} from 'react-native-paper'
import AddButton from '../../../../components/AddButton';
import { router } from 'expo-router';
import ImageUploadBox from '../../../../components/ImageUploadBox'; // Import the new component

const AddBordingHouse = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [current, setCurrent] = useState("used");
  const [negotiable, setNegotiable] = useState(false);
  const [sap, setSap] = useState(false);
  const [hidephoneno , setHidephoneno] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]); // State to hold selected images

  const submit = ()=>{
    router.replace('/home')
  }

  const toggleCheckbox = (item) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleImagePicker = async () => {
    // Request permission to access the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Update the images state with the selected images
      setImages((prevImages) => [...prevImages, ...result.assets.map(asset => asset.uri)]);
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
          {/* Change This field to a description box (text area) */}
          <FromField otherStyles="w-full h-[100]" />

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
          <Button title="Upload Images" onPress={handleImagePicker} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
            {images.map((imageUri, index) => (
              <Image
                key={index}
                source={{ uri: imageUri }}
                style={{ width: 100, height: 100, margin: 5 }}
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

export default AddBordingHouse