import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Card from './Card';
import { useRouter } from 'expo-router';
import axios from 'react-native-axios';
import { useLocalSearchParams } from 'expo-router';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const SimilarPosts = ({ onPostClick }) => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/allposts/getAllPosts/${id}`);

        if (response.data.success) {
          setPosts(response.data.similarItems || []); // Ensure posts is always an array
        } else {
          setError('Failed to load similar posts');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, []);

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

  if (loading) {
    return (
      <View className="p-4 items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="p-4">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  if (!posts.length) {
    return (
      <View className="p-4">
        <Text className="text-gray-500 text-center">No similar posts found</Text>
      </View>
    );
  }

  return (
    <View className="px-4 p-6">
      <View className="flex-row flex-wrap justify-between ml-6">
        {posts.map((item) => (
          <TouchableOpacity
            key={item._id}
            className="w-[48%] mb-4"
            onPress={() => {
              onPostClick();
              router.push(`/(tabs)/home/${item._id}`);
            }}
          >
            <Card
              image={item.images[0]}
              name={item.itemname || item.category}
              price={
                (item.lostdate && item.lostdate.slice(0, 10)) ||
                (item.founddate && item.founddate.slice(0, 10)) ||
                (item.rentprice && `Rs.${item.rentprice}`) ||
                (item.price && `Rs.${item.price}`)
              }
              days={calculateTimeAgo(item.date)} // Pass calculated time
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SimilarPosts;