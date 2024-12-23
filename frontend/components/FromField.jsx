import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';

const FromField = ({
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  secureTextEntry,
  editable = true, // Default to editable
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`flex-row items-center border-2 w-11/12 h-14 px-4 rounded-2xl bg-[#e4e4e4] 
      ${!editable ? 'border-[#0D7C66]' : isFocused ? 'border-[#0D7C66]' : 'border-[#bababa]'} ${otherStyles}`}
    >
      <TextInput
        className="flex-1 font-semibold text-base"
        style={{ fontFamily: 'Montserrat_500Medium' }}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#7b7b8b"
        onChangeText={handleChangeText}
        secureTextEntry={secureTextEntry && !showPassword} // Toggles visibility for secure text fields
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        editable={editable}
        {...props}
      />
      {/* Display eye icon for secure text fields */}
      {secureTextEntry && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={!showPassword ? icons.eye : icons.eyeHide}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FromField;
