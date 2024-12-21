// components/ImageUploadBox.jsx
import React from 'react';
import { View, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import cameraIcon from '../assets/icons/upload.png'; // Adjust the path to your camera icon image

const ImageUploadBox = ({ index, imageUri, onImageSelect }) => {
  const handleImagePicker = async () => {
    try {
      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType, // Restrict to images only
        aspect: [4, 3], // Optional aspect ratio for cropping
        quality: 1, // High-quality images
      });

      if (!result.canceled) {
        const selectedImage = result.assets[0]; // Get the first selected asset
        onImageSelect(index, selectedImage); // Pass the URI to the parent
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Something went wrong while selecting the image. Please try again.");
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
