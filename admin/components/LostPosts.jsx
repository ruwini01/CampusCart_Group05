import { View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Card from './Card';
import { useRouter } from 'expo-router';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const STORAGE_KEY_LOST = 'seenLostPosts';

const LostPosts = ({ searchQuery }) => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [seenPosts, setSeenPosts] = useState([]);

  // Load seen posts from AsyncStorage on mount
  useEffect(() => {
    const loadSeenPosts = async () => {
      try {
        const storedSeenPosts = await AsyncStorage.getItem(STORAGE_KEY_LOST);
        if (storedSeenPosts !== null) {
          setSeenPosts(JSON.parse(storedSeenPosts));
        }
      } catch (error) {
        console.error('Error loading seen posts:', error);
      }
    };
    loadSeenPosts();
  }, []);

  // Fetch lost posts data
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/lostposts/listlostposts`);
        if (response.data.success) {
          setPosts(response.data.lostPosts);
          setFilteredPosts(response.data.lostPosts);
        }
      } catch (error) {
        console.error('Error fetching lost posts:', error);
      }
    };
    fetchPostData();
  }, []);

  // Filter posts based on search query
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

  // Persist seen posts in AsyncStorage
  const saveSeenPosts = async (postsArray) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_LOST, JSON.stringify(postsArray));
    } catch (error) {
      console.error('Error saving seen posts:', error);
    }
  };

  const handlePress = async (item) => {
    // Mark the post as seen if not already
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
          <TouchableOpacity
            activeOpacity={0.7}
            className="p-4"
            onPress={() => handlePress(item)}
          >
            <View className="relative">
              <Card
                image={item.images[0]}
                name={`${item.itemname} lost at ${item.location}`}
                price={item.lostdate}
                days={item.date}
              />
              {/* Green circle indicates an unseen post */}
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

export default LostPosts;
