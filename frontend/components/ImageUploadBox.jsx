// components/ImageUploadBox.jsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImageUploadBox = ({ index, imageUri, onImageSelect }) => {
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
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onImageSelect(index, result.assets[0].uri); // Call the callback with the selected image URI
    }
  };

  return (
    <TouchableOpacity
      onPress={handleImagePicker}
      style={{
        width: 100,
        height: 100,
        margin: 5,
        backgroundColor: '#e4e4e4',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
      }}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{ width: '100%', height: '100%', borderRadius: 5 }}
        />
      ) : (
        <Text>Select Image</Text>
      )}
    </TouchableOpacity>
  );
};

export default ImageUploadBox;