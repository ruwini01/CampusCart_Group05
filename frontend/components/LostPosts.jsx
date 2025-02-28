import { View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Card from './Card';
import { useRouter } from 'expo-router';
import axios from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const LostPosts = ({ searchQuery }) => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

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
            onPress={() => router.push(`/(tabs)/home/${item._id}`)}
          >
            <Card
              image={item.images[0]}
              name={`${item.itemname} lost at ${item.location}`}
              price={item.lostdate}
              days={item.date}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default LostPosts;