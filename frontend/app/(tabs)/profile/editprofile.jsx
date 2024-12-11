import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FromField from '../../../components/FromField';
import ImageUploadBox from '../../../components/ImageUploadBox';
import AddButton from '../../../components/AddButton';
import SaveButton from '../../../components/SaveButton';
import EditButton from '../../../components/EditButton';
import ProfileImageUpload from '../../../components/ProfileImageUpload';
import { router } from 'expo-router';
const EditProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [address, setAddress] = useState('');

  const handleImageSelect = (uri) => {
    setProfileImage(uri);
  };

  const handleSave = () => {
    // Logic to save the updated profile information
    console.log('Profile updated:', { name, email, telephone, profileImage });
    router.replace('/profile'); // Navigate back to profile after saving
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="mx-6">
        <Text className="font-semibold text-xl mt-6">Edit Profile</Text>
        
        <ProfileImageUpload
            imageUri={profileImage} // Pass the current image URI
            onImageSelect={handleImageSelect} // Callback to update the image
          />

          <Text className="font-normal text-base mt-6 pb-1">Name</Text>
          <FromField
            value={name}
            handleChangeText={setName}
            placeholder="Enter your name"
          />

          <Text className="font-normal text-base mt-6 pb-1">Email</Text>
          <FromField
            value={email}
            handleChangeText={setEmail}
            placeholder="Enter your email"
          />

          <Text className="font-normal text-base mt-6 pb-1">Telephone</Text>
          <FromField
            value={telephone}
            handleChangeText={setTelephone}
            placeholder="Enter your telephone"
          />
          <Text className="font-normal text-base mt-6 pb-1">Address</Text>
          <FromField
            value={address}
            handleChangeText={setAddress}
            placeholder="Enter your address"
          />

          <View className="flex-row justify-between mt-6">
            <EditButton
              handlePress={() => console.log('Edit button pressed')}
              containerStyles="bg-gray-400"
              fontStyle="Montserrat_600SemiBold"
              textStyles="text-white"
            />
            <SaveButton
              handlePress={handleSave}
              containerStyles="bg-[#0D7C66]"
              fontStyle="Montserrat_600SemiBold"
              textStyles="text-white"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditProfile