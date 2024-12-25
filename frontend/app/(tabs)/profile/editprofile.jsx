import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FromField from '../../../components/FromField';
import SaveButton from '../../../components/SaveButton';
import EditButton from '../../../components/EditButton';
import ProfileImageUpload from '../../../components/ProfileImageUpload';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const EditProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [address, setAddress] = useState('');
  const [regno, setRegno] = useState('');

  const handleImageSelect = async (uri) => {
    try {
      const formData = new FormData();
      formData.append('post', {
        uri: uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      const uploadResponse = await axios.post(
        'http://172.20.10.2:8080/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (uploadResponse.data.success) {
        setProfileImage(uploadResponse.data.image_url);
      } else {
        Alert.alert('Error', 'Failed to upload image');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const handleRemoveImage = () => {
    Alert.alert(
      'Remove Profile Picture',
      'Are you sure you want to remove your profile picture?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await axios.post(
                'http://172.20.10.2:8080/users/updateuser',
                {
                  token,
                  name,
                  telephone: Number(telephone),
                  address,
                  profilepic: '',
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );

              if (response.data.success) {
                setProfileImage(null);
                Alert.alert('Success', 'Profile picture removed successfully');
              }
            } catch (error) {
              console.error('Remove profile picture error:', error);
              Alert.alert('Error', 'Failed to remove profile picture');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.post(
          'http://172.20.10.2:8080/users/userdata',
          { token },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.success) {
          const { regno, email, name, telephone, address, profilepic } = response.data.data;
          setRegno(regno);
          setEmail(email);
          if (name) setName(name);
          if (telephone) setTelephone(String(telephone));
          if (address) setAddress(address);
          if (profilepic) setProfileImage(profilepic);
        } else {
          Alert.alert('Error', response.data.errors || 'Failed to fetch user data.');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while fetching user data.');
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const telephoneNumber = telephone ? Number(telephone) : null;

      if (telephoneNumber === null || isNaN(telephoneNumber)) {
        Alert.alert('Error', 'Please enter a valid telephone number.');
        return;
      }

      const response = await axios.post(
        'http://172.20.10.2:8080/users/updateuser',
        {
          token,
          name,
          telephone: telephoneNumber,
          address,
          profilepic: profileImage,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        Alert.alert('Success', response.data.message);
        router.replace('/profile');
      } else {
        Alert.alert('Error', response.data.errors || 'Failed to update profile.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating the profile.');
      console.error(error);
    }
  };

  const handledelete = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your CampusCart Account?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Deletion canceled'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await axios.post(
                'http://172.20.10.2:8080/users/deleteuser',
                { token },
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );

              if (response.data.success) {
                Alert.alert('Success', response.data.message);
                await AsyncStorage.removeItem('token');
                router.replace('/login');
              } else {
                Alert.alert('Error', response.data.errors || 'Failed to delete profile.');
              }
            } catch (error) {
              Alert.alert('Error', 'An error occurred while deleting the profile.');
              console.error(error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="mx-6">
          <Text className="font-semibold text-xl mb-6">Edit Profile</Text>
          <View className="items-center">
            <ProfileImageUpload imageUri={profileImage} onImageSelect={handleImageSelect} />
            {profileImage && (
              <TouchableOpacity onPress={handleRemoveImage} className="mt-2">
                <Text className="text-gray-500">Remove Profile Picture</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="justify-center items-center">
            <View>
              <Text className="font-normal text-base mt-6 pb-1">Name</Text>
              <FromField value={name} handleChangeText={setName} placeholder="Enter your name" />
            </View>

            <View>
              <Text className="font-normal text-base mt-6 pb-1">Registration Number</Text>
              <FromField value={regno} placeholder="Enter your Registration Number" editable={false} />
            </View>

            <View>
              <Text className="font-normal text-base mt-6 pb-1">Email</Text>
              <FromField value={email} placeholder="Enter your email" editable={false} />
            </View>

            <View>
              <Text className="font-normal text-base mt-6 pb-1">Telephone</Text>
              <FromField value={telephone} handleChangeText={setTelephone} placeholder="Enter your telephone" />
            </View>

            <View>
              <Text className="font-normal text-base mt-6 pb-1">Address</Text>
              <FromField value={address} handleChangeText={setAddress} placeholder="Enter your address" />
            </View>
          </View>

          <View className="flex-row justify-between">
            <EditButton handlePress={handledelete} fontStyle="Montserrat_600SemiBold" textStyles="text-white" />
            <SaveButton handlePress={handleSave} fontStyle="Montserrat_600SemiBold" textStyles="text-white" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;