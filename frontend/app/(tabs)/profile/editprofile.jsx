import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FromField from '../../../components/FromField';
import ImageUploadBox from '../../../components/ImageUploadBox';
import AddButton from '../../../components/AddButton';
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
    <View>
      <Text>EditProfile</Text>
    </View>
  )
}

export default EditProfile