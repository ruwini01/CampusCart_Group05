import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import FromField from '../../../../components/FromField';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import {Divider} from 'react-native-paper'
import AddButton from '../../../../components/AddButton';
import { router } from 'expo-router';

const AddBordingHouse = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [current, setCurrent] = useState("used");
  const [negotiable, setNegotiable] = useState(false);
  const [sap, setSap] = useState(false);
  const [hidephoneno , setHidephoneno] = useState(false);

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
    <SafeAreaView>
      <Text className="mx-6 font-semibold text-xl">Find Boarding House</Text>
      <ScrollView>
        <View className="mx-6">
        <Text className="font-normal text-base mt-6">Select a category</Text>
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
          {/* Change This field to a description box (text area) */}
          <FromField otherStyles="w-full h-[100]" />

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

          <Text className="font-normal text-base mt-6 pb-1">Add upto 3 Photos</Text>
          <Divider className='my-8'/>

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

        
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddBordingHouse