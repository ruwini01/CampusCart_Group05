import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FromField from '../../../components/FromField';
import AddButton from '../../../components/AddButton';
import SaveButton from '../../../components/SaveButton';
import EditButton from '../../../components/EditButton';
import ProfileImageUpload from '../../../components/ProfileImageUpload';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const EditProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [address, setAddress] = useState('');
  const [regno, setRegno] = useState('');

  const handleImageSelect = (uri) => {
    setProfileImage(uri);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.post(
        'http://192.168.1.4:8080/users/userdata',
        {
          token: token,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.success) {
        //Alert.alert('Success', response.data.message);
        setRegno(response.data.data.regno);
        setEmail(response.data.data.email);

      } else {
        // Show error message from server
        Alert.alert('Error', response.data.errors);
      }
    
    };
    
    fetchUserData();
  }, []);

  
  const handleSave = () => {
    
    //console.log('Token:', token);
    console.log('Profile updated:', { name, email, telephone, profileImage, regno });
    router.replace('/profile');
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="mx-6">
        <Text className="font-semibold text-xl mb-6">Edit Profile</Text>
        <View className='items-center'>
        <ProfileImageUpload
            imageUri={profileImage}
            onImageSelect={handleImageSelect}
          />
        </View>
        <View className='justify-center items-center'>
          <View>
          <Text className="font-normal text-base mt-6 pb-1">Name</Text>
          <FromField
            value={name}
            handleChangeText={setName}
            placeholder="Enter your name"
          />
          </View>

          <View>
          <Text className="font-normal text-base mt-6 pb-1">Registration Number</Text>
          <FromField
            value={regno}
            //handleChangeText={setRegno}
            placeholder="Enter your Registration Number"
            editable={false}
          />
          </View>

          <View>
          <Text className="font-normal text-base mt-6 pb-1">Email</Text>
          <FromField
            value={email}
            //handleChangeText={setEmail}
            placeholder="Enter your email"
            editable={false}
          />
          </View>

          <View>
          <Text className="font-normal text-base mt-6 pb-1">Telephone</Text>
          <FromField
            value={telephone}
            handleChangeText={setTelephone}
            placeholder="Enter your telephone"
          />
          </View>

          <View>
          <Text className="font-normal text-base mt-6 pb-1">Address</Text>
          <FromField
            value={address}
            handleChangeText={setAddress}
            placeholder="Enter your address"
          />
          </View>
          
          </View>

          <View className="flex-row justify-between">
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