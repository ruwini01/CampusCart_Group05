import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "react-native-axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { Divider } from "react-native-paper";
import CallMessageButton from "../../../../components/CallMessageButton";
import { icons } from "../../../../constants";
import SimilarPosts from "../../../../components/SimilarPosts";
import Icon from "react-native-vector-icons/MaterialIcons";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const PostDetail = () => {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [token, setToken] = useState(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken);
    };
    fetchToken();
  }, []);

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
            Alert.alert("Error", "Failed to load post details");
          }
        } else {
          Alert.alert("Error", "Post category not found");
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  useEffect(() => {
    const checkBookmark = async () => {
      if (!post || !post._id || !token) return;

      try {
        const userData = await axios.post(`${apiUrl}/users/userdata`, { token });
        const savedPosts = userData.data.data.savedposts || [];
        setIsBookmarked(savedPosts.includes(post._id.toString()));
      } catch (error) {
        console.error("Error checking bookmarks:", error);
      }
    };

    checkBookmark();
  }, [post, token]); 

  const makePhoneCall = () => {
    Alert.alert("Are you sure?", `Call ${post.contact.telephone}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Call", onPress: () => Linking.openURL(`tel:${post.contact.telephone}`) },
    ]);
  };

  const sendMessage = () => {
    Alert.alert("Are you sure?", `Message ${post.contact.telephone}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Message", onPress: () => Linking.openURL(`sms:${post.contact.telephone}`) },
    ]);
  };

  const addBookmark = async () => {
    try {
      const response = await axios.post(`${apiUrl}/users/bookmark`, { 
        token, 
        postId: post._id.toString() // Ensure it's a string
      });
      
      if (response.data.success) {
        setIsBookmarked(true);
      } else {
        console.log("Bookmark failed:", response.data.message);
        Alert.alert("Error", response.data.message || "Failed to bookmark post");
      }
    } catch (error) {
      console.error("Error adding bookmark:", error);
      
      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error status:", error.response.status);
      }
      
      Alert.alert("Error", "Failed to add bookmark. Please try again.");
    }
  };

  const removeBookmark = async () => {
    try {
      const response = await axios.post(`${apiUrl}/users/unbookmark`, { 
        token, 
        postId: post._id.toString() // Ensure it's a string
      });
      
      if (response.data.success) {
        setIsBookmarked(false);
      } else {
        console.log("Unbookmark failed:", response.data.message);
        Alert.alert("Error", response.data.message || "Failed to remove bookmark");
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
      
      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error status:", error.response.status);
      }
      
      Alert.alert("Error", "Failed to remove bookmark. Please try again.");
    }
  };

  const toggleBookmark = () => {
    if (isBookmarked) {
      removeBookmark();
    } else {
      addBookmark();
    }
  };

  const handlePostClick = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (!post || !category) return <Text>Post not found.</Text>;


  const ContentComponent = {
    sell: ({ post }) => (
      <View>
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-2xl font-semibold">{post.itemname}</Text>
          <TouchableOpacity onPress={toggleBookmark}>
            <Icon name={isBookmarked ? "bookmark" : "bookmark-outline"} size={30} color="#0D7C66" />
          </TouchableOpacity>
        </View>
    
        <Text className="text-lg text-gray-600">Category: {post.category} | Condition: {post.condition}</Text>
        <Divider className="mt-2" />
        <Text className="text-xl font-bold mt-4">Rs.{post.price}.00</Text>
        <Text className="text-base italic">{post.isnegotiable ? "Negotiable" : ""}</Text>
        <Text className="text-lg text-gray-700 mt-8">Description</Text>
        <Text className="text-base text-gray-500">{post.description}</Text>
      </View>
    ),
    boarding: ({ post }) => (
      <View>
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-2xl font-semibold">{post.category}</Text>
          <TouchableOpacity onPress={toggleBookmark}>
            <Icon name={isBookmarked ? "bookmark" : "bookmark-outline"} size={30} color="#0D7C66" />
          </TouchableOpacity>
        </View>
        
        <Text className="text-lg text-gray-600">Location: {post.location} | Available from: {post.availableFrom}</Text>
        <Divider className="mt-2" />
        <Text className="text-xl font-bold mt-4">Rs.{post.rentprice}/month</Text>
        <Text className="text-lg text-gray-700 mt-4">Facilities</Text>
        <View className="mt-2">
          {post.facilities?.map((facility, index) => (
            <Text key={index} className="text-base text-gray-500">• {facility}</Text>
          ))}
        </View>
        <Text className="text-lg text-gray-700 mt-4">Description</Text>
        <Text className="text-base text-gray-500">{post.description}</Text>
      </View>
    ),
    lost: ({ post }) => (
      <View>
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-2xl font-semibold">{post.itemname}</Text>
          <TouchableOpacity onPress={toggleBookmark}>
            <Icon name={isBookmarked ? "bookmark" : "bookmark-outline"} size={30} color="#0D7C66" />
          </TouchableOpacity>
        </View>
    
        <Text className="text-lg text-gray-600">Location: {post.location} | Lost on: {new Date(post.lostdate).toLocaleDateString()}</Text>
        <Divider className="mt-2" />
        <Text className="text-lg text-gray-700 mt-4">Description</Text>
        <Text className="text-base text-gray-500">{post.description}</Text>

    
        <Text className="text-lg text-gray-700 mt-4">Contact Information</Text>
        <Text className="text-base text-gray-500">{post.contact?.name}</Text>
        <Text className="text-base text-gray-500">{post.contact?.phone}</Text>
      </View>
    ),
    found: ({ post }) => (
      <View>
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-2xl font-semibold">{post.itemname}</Text>
          <TouchableOpacity onPress={toggleBookmark}>
            <Icon name={isBookmarked ? "bookmark" : "bookmark-outline"} size={30} color="#0D7C66" />
          </TouchableOpacity>
        </View>
    
        <Text className="text-lg text-gray-600">Location: {post.location} | Found on: {new Date(post.founddate).toLocaleDateString()}</Text>
        <Divider className="mt-2" />
        <Text className="text-lg text-gray-700 mt-4">Description</Text>
        <Text className="text-base text-gray-500">{post.description}</Text>
    
        <Text className="text-lg text-gray-700 mt-4">Contact Information</Text>
        <Text className="text-base text-gray-500">{post.contact?.name}</Text>
        <Text className="text-base text-gray-500">{post.contact?.phone}</Text>
      </View>
    )
  };

  const RenderContent = ContentComponent[category.toLowerCase()] || ContentComponent.sell;

  return (
    <SafeAreaView>
      <ScrollView ref={scrollViewRef}>
        <View className="flex-1 p-4">
          {post.images?.length > 0 && (
            <View className="relative">
              <Image source={{ uri: post.images[0] }} className="w-full h-64 rounded-lg mb-5" resizeMode="cover" />
            </View>
          )}

          <RenderContent post={post} />

          <Text className="text-sm text-gray-400 mt-2">Posted on {new Date(post.date).toLocaleDateString()}</Text>

          <View className="flex-row justify-between mt-4">
            <CallMessageButton image={icons.call} title="Call" handlePress={makePhoneCall} />
            <CallMessageButton image={icons.message} title="Message" handlePress={sendMessage} />
          </View>
        </View>

        <Text className="font-semibold text-xl ml-6 mt-6">Similar Posts</Text>
        <SimilarPosts onPostClick={handlePostClick} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostDetail;