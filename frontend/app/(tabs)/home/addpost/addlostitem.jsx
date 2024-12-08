import { View, Text } from 'react-native'
import React from 'react'

const AddLostItem = () => {
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
      <Text>AddLostItem</Text>
    </View>
  )
}

export default AddLostItem