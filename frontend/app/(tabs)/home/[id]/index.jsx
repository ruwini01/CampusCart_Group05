import { View, Text, Image, ActivityIndicator, Alert, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { Divider } from 'react-native-paper';
import CallMessageButton from '../../../../components/CallMessageButton';
import { icons } from '../../../../constants';
import { Platform, Linking } from 'react-native';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const PostDetail = () => {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const categoryResponse = await axios.get(`${apiUrl}/allposts/listposts/${id}`);
        if (categoryResponse.data.success && categoryResponse.data.allPosts.length > 0) {
          const postCategory = categoryResponse.data.allPosts[0].category;
          setCategory(postCategory);
          
          const detailsResponse = await axios.get(`${apiUrl}/allposts/getAllPosts/${id}`);
          if (detailsResponse.data.success) {
            setPost(detailsResponse.data.post);
          } else {
            Alert.alert('Error', 'Failed to load post details');
          }
        } else {
          Alert.alert('Error', 'Post category not found');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

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
  };

  const sendMessage = () => {
    Alert.alert('Are you sure you want to ', `Message ${post.contact.telephone}?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Message',
        onPress: () => {
          const url = `sms:${post.contact.telephone}`;
          Linking.openURL(url);
        },
      },
    ]);
  };

  const SellContent = ({ post }) => (
    <View>
      <Text className="text-2xl font-semibold mt-4">{post.itemname}</Text>
      <Text className="text-lg text-gray-600 font-normal">
        Category: {category} | Condition: {post.condition}
      </Text>
      <Divider className="mt-2" />
      <Text className="text-xl font-bold mt-4">Rs.{post.price}.00</Text>
      <Text className="text-base italic font-thin">
        {post.isnegotiable ? 'Negotiable' : ''}
      </Text>
      <Text className="text-lg font-normal text-gray-700 mt-8">Description</Text>
      <Text className="text-base text-gray-500">{post.description}</Text>
    </View>
  );

  const BoardingContent = ({ post }) => (
    <View>
      <Text className="text-2xl font-semibold mt-4">{post.title}</Text>
      <Text className="text-lg text-gray-600 font-normal">
        Location: {post.location} | Available from: {post.availableFrom}
      </Text>
      <Divider className="mt-2" />
      <Text className="text-xl font-bold mt-4">Rs.{post.rentprice}/month</Text>
      <Text className="text-lg font-normal text-gray-700 mt-4">Facilities</Text>
      <View className="mt-2">
        {post.facilities?.map((facility, index) => (
          <Text key={index} className="text-base text-gray-500">• {facility}</Text>
        ))}
      </View>
      <Text className="text-lg font-normal text-gray-700 mt-4">Description</Text>
      <Text className="text-base text-gray-500">{post.description}</Text>
    </View>
  );

  const LostContent = ({ post }) => (
    <View>
      <Text className="text-2xl font-semibold mt-4">{post.itemname}</Text>
      <Text className="text-lg text-gray-600 font-normal">
        Lost on: {new Date(post.lostDate).toLocaleDateString()} | Location: {post.lastLocation}
      </Text>
      <Divider className="mt-2" />
      <Text className="text-lg font-normal text-gray-700 mt-4">Item Details</Text>
      <Text className="text-base text-gray-500">{post.description}</Text>
      <Text className="text-lg font-normal text-gray-700 mt-4">Reward</Text>
      <Text className="text-base text-gray-500">{post.reward || 'No reward specified'}</Text>
    </View>
  );

  const FoundContent = ({ post }) => (
    <View>
      <Text className="text-2xl font-semibold mt-4">{post.itemname}</Text>
      <Text className="text-lg text-gray-600 font-normal">
        Found on: {new Date(post.foundDate).toLocaleDateString()} | Location: {post.foundLocation}
      </Text>
      <Divider className="mt-2" />
      <Text className="text-lg font-normal text-gray-700 mt-4">Item Details</Text>
      <Text className="text-base text-gray-500">{post.description}</Text>
      <Text className="text-lg font-normal text-gray-700 mt-4">Identifying Details Required</Text>
      <Text className="text-base text-gray-500">
        {post.identifyingDetails || 'Contact to provide identifying details'}
      </Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  if (!post || !category) {
    return <Text>Post not found.</Text>;
  }

  const CategoryContent = {
    sell: SellContent,
    boarding: BoardingContent,
    lost: LostContent,
    found: FoundContent,
  };

<<<<<<< HEAD

  const RenderContent = ContentComponent[category.toLowerCase()] || ContentComponent.sell;
=======
  const ContentComponent = CategoryContent[category.toLowerCase()] || SellContent;
>>>>>>> parent of a7c6dc35 (index.jsx updated)

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex-1 p-4">
          {post.images?.length > 0 && (
            <Image
              source={{ uri: post.images[0] }}
              className="w-full h-64 rounded-lg mb-5"
              resizeMode="cover"
            />
          )}
          
          <ContentComponent post={post} />

          <Text className="text-sm text-gray-400 mt-2">
            Posted on {new Date(post.date).toLocaleDateString()}
          </Text>
          
          <View className="flex-row justify-between mt-4">
            <CallMessageButton
              image={icons.call}
              title="Call"
              handlePress={makePhoneCall}
            />
            <CallMessageButton
              image={icons.message}
              title="Message"
              handlePress={sendMessage}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostDetail;