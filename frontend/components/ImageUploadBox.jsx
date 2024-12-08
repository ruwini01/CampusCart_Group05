// components/ImageUploadBox.jsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import cameraIcon from '../assets/icons/cameraIcon.jpg'; // Adjust the path to your camera icon image

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
        borderRadius: 15, // Adjusted border radius for a more rounded look
      }}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{ width: '100%', height: '100%', borderRadius: 15 }} // Match border radius
        />
      ) : (
        <View style={{ alignItems: 'center' }}>
          <Image
            source={cameraIcon} // Use the imported camera icon image
            style={{ width: 24, height: 24 }} // Adjust size as needed
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ImageUploadBox;