import { View, FlatList, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Card from './Card';
import { useRouter } from 'expo-router';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const STORAGE_KEY_SELL = 'seenSellPosts';

const BuyAndSellPosts = ({ searchQuery }) => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [seenPosts, setSeenPosts] = useState([]);

  // Load seen posts from AsyncStorage when the component mounts
  useEffect(() => {
    const loadSeenPosts = async () => {
      try {
        const storedSeenPosts = await AsyncStorage.getItem(STORAGE_KEY_SELL);
        if (storedSeenPosts !== null) {
          setSeenPosts(JSON.parse(storedSeenPosts));
        }
      } catch (error) {
        console.error('Error loading seen posts:', error);
      }
    };
    loadSeenPosts();
  }, []);

  // Fetch posts data from API
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/sellposts/listsellposts`);
        if (response.data.success) {
          setPosts(response.data.sellPosts);
          setFilteredPosts(response.data.sellPosts);
        } else {
          Alert.alert('Error', 'Error occurred');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };
    fetchPostData();
  }, []);

  // Filter posts based on the search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = posts.filter((post) =>
        post.itemname.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [searchQuery, posts]);

  const calculateTimeAgo = (dateString) => {
    const postedDate = new Date(dateString);
    const now = new Date();
    const differenceInMs = now - postedDate;
    const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60));

    if (differenceInMinutes < 1) {
      return 'just now';
    }
    if (differenceInMinutes < 60) {
      return `${differenceInMinutes} min${differenceInMinutes > 1 ? 's' : ''} ago`;
    }
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    if (differenceInHours < 24) {
      return `${differenceInHours} hour${differenceInHours > 1 ? 's' : ''} ago`;
    }
    const differenceInDays = Math.floor(differenceInHours / 24);
    return `${differenceInDays} day${differenceInDays > 1 ? 's' : ''} ago`;
  };

  // Save seen posts to AsyncStorage
  const saveSeenPosts = async (postsArray) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_SELL, JSON.stringify(postsArray));
    } catch (error) {
      console.error('Error saving seen posts:', error);
    }
  };

  const handlePress = async (item) => {
    // If the post hasn't been seen, mark it as seen and persist the update
    if (!seenPosts.includes(item._id)) {
      const updatedSeenPosts = [...seenPosts, item._id];
      setSeenPosts(updatedSeenPosts);
      await saveSeenPosts(updatedSeenPosts);
    }
    router.push(`/(tabs)/home/${item._id}`);
  };

  return (
    <View className="flex-1 flex-grow items-center pb-4">
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.7} className="p-4" onPress={() => handlePress(item)}>
            <View className="relative">
              <Card
                image={item.images[0]}
                name={item.itemname}
                price={'Rs.' + item.price}
                days={calculateTimeAgo(item.date)}
              />
              {/* Render a green circle if the post is new (i.e., not clicked/seen yet) */}
              {!seenPosts.includes(item._id) && (
                <View className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#0D7C66]" />
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default BuyAndSellPosts;
