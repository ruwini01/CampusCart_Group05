import React from 'react';
import { View, Image, TouchableOpacity, Alert, ActionSheetIOS } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import cameraIcon from '../assets/icons/upload.png';

const ImageUploadBox = ({ index, imageUri, onImageSelect, width = 100, height = 100 }) => {
  const handleImagePicker = async () => {
    try {
      // Request camera and media library permissions
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraPermission.granted && mediaLibraryPermission.granted) {
        // Show options to pick from gallery or use camera
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['Cancel', 'Pick from Gallery', 'Take a Photo'],
            cancelButtonIndex: 0,
          },
          async (buttonIndex) => {
            if (buttonIndex === 1) {
              // Pick from gallery
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaType,
                aspect: [4, 3], // Optional aspect ratio for cropping
                quality: 1, // High-quality images
              });

              if (!result.canceled) {
                const selectedImage = result.assets[0]; // Get the first selected asset
                onImageSelect(index, selectedImage); // Pass the URI to the parent
              }
            } else if (buttonIndex === 2) {
              // Take a photo with the camera
              const cameraResult = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
              });

              if (!cameraResult.canceled) {
                const selectedImage = cameraResult.assets[0]; // Get the first selected asset
                onImageSelect(index, selectedImage); // Pass the URI to the parent
              }
            }
          }
        );
      } else {
        Alert.alert("Permissions Denied", "Please allow camera and media library permissions.");
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
        width: width,
        height: height,
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

// Default props to set default width and height
ImageUploadBox.defaultProps = {
  width: 100,
  height: 100,
};

export default ImageUploadBox;
