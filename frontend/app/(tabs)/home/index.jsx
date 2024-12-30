import { View, Text, Image, ActivityIndicator, Alert, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {Divider} from 'react-native-paper';
import CallMessageButton from '../../../../components/CallMessageButton';
import { icons } from '../../../../constants';
import { Platform, Linking } from 'react-native';

const PostDetail = () => {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //backend api url
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
          <Text className="text-lg text-gray-600 font-normal">Category: {post.category} | Condition: {post.condition}</Text>
          <Divider className='mt-2'/>
          <Text className="text-xl font-bold mt-4">Rs.{post.price}.00</Text>
          <Text className="text-base italic font-thin">{(post.isnegotiable) ? 'Negotiable': ''}</Text>

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