// components/ProfileImageUpload.jsx
import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import cameraIcon from '../assets/icons/upload.png'; // Adjust the path to your camera icon image

const ProfileImageUpload = ({ imageUri, onImageSelect }) => {
  const handleImagePicker = async () => {
    // Request permission to access the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onImageSelect(result.assets[0].uri); // Call the callback with the selected image URI
    }
  };

  return (
    <TouchableOpacity
      onPress={handleImagePicker}
      style={{
        width: 150,
        height: 150,
        borderRadius: 100,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e4e4e4',
        borderWidth: 1.5,
        borderColor:'#0D7C66',
        boxShadow: '0px 0px 6px #0D7C66',
        
      }}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{ width: '100%', height: '100%', borderRadius: 100 }} // Match border radius
        />
      ) : (
        <Image
          source={cameraIcon} // Use the imported camera icon image
          style={{ width: 40, height: 40 }} // Adjust size as needed
        />
      )}
    </TouchableOpacity>
  );
};

export default ProfileImageUpload;