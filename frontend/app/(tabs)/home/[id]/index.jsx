import { View, Text, Image, ActivityIndicator, Alert, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { Divider, divider } from 'react-native-paper';
import CallMessageButton from '../../../../components/CallMessageButton';
import { icons } from '../../../../constants';
import { Platform, Linking } from 'react-native';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const PostDetail = () => {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await axios.get(`${apiUrl}/allposts/getAllPosts/${id}`);
        if (response.data.success) {
          setPost(response.data.post);
        } else {
          Alert.alert('Error', 'Failed to load post details');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetail();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  if (!post) {
    return <Text>Post not found.</Text>;
  }

  const makePhoneCall = () => {
    Alert.alert('Are you sure you want to ', `Call ${post.contact.telephone}?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Call',
        onPress: () => {
          Linking.openURL(`tel:${post.contact.telephone}`);
        },
      },
    ]);
  }

  const sendMessage = () => {
    Alert.alert('Are you sure you want to ', `Message ${post.contact.telephone}?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Message',
        onPress: () => {
          let url = `sms:${post.contact.telephone}`;
          if (Platform.OS === 'android') {
            url = `sms:${post.contact.telephone}`;
          } else if (Platform.OS === 'ios') {
            url = `sms:${post.contact.telephone}`;
          }
          Linking.openURL(url);
        },
      },
    ]);
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex-1 p-4">
          <Image
            source={{ uri: post.images[0] }}
            className="w-full h-64 rounded-lg mb-5"
            resizeMode="cover"
          />
          <Text className="text-2xl font-semibold mt-4">{post.itemname}</Text>
          <Text className="text-lg text-gray-600 font-normal">Categoty: {post.category} | Condition: {post.condition}</Text>
          <Divider className='mt-2' />
          <Text className="text-xl font-bold mt-4">Rs.{post.price}.00</Text>
          <Text className="text-base italic font-thin">{(post.isnegotiable) ? 'Negotiable' : ''}</Text>

          <Text className="text-lg font-normal text-gray-700 mt-8">Description</Text>
          <Text className="text-base text-gray-500 ">{post.description}</Text>
          <Text className="text-sm text-gray-400 mt-2">
            Posted on {new Date(post.date).toLocaleDateString()}
          </Text>
          <View className="flex-row justify-between mt-4">
            <CallMessageButton
              image={icons.call}
              title='Call'
              handlePress={makePhoneCall}
            />

            <CallMessageButton
              image={icons.message}
              title='Message'
              handlePress={sendMessage}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostDetail;
