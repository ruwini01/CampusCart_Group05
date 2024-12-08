import { View, TextInput } from 'react-native';
import React, { useState } from 'react';

const TextAreaField = ({ value, placeholder, handleChangeText, otherStyles, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`flex-row items-center border-2 w-11/12 h-40 px-4 rounded-2xl bg-[#e4e4e4] 
      ${isFocused ? 'border-[#0D7C66]' : 'border-[#bababa]'} ${otherStyles}`}
    >
      <TextInput
        className="flex-1 font-semibold text-base"
        style={{ fontFamily: 'Montserrat_500Medium' }}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#7b7b8b"
        onChangeText={handleChangeText}
        multiline={true} // Enable multiline for text area
        numberOfLines={4} // Set the number of lines for the text area
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
};

export default TextAreaField;