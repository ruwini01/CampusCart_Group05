import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import FromField from '../../../../components/FromField';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import {Divider} from 'react-native-paper'
import AddButton from '../../../../components/AddButton';
import { router } from 'expo-router';

const AddFoundItem = () => {
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
    <View>
      <Text>AddFoundItem</Text>
    </View>
  )
}

export default AddFoundItem