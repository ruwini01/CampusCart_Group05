// components/DatePickerField.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePickerField = ({ value, handleChange, placeholder, otherStyles }) => {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(value || new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    handleChange(currentDate); // Call the passed function to update the date
  };

  return (
    <View className={`flex-row items-center border-2 w-11/12 h-14 px-4 rounded-2xl bg-[#e4e4e4] ${otherStyles}`}>
      <TouchableOpacity onPress={() => setShow(true)} className="flex-1">
        <Text className="font-semibold text-base">
          {date.toLocaleDateString() || placeholder}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default DatePickerField;