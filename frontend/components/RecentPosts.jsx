import { View, FlatList, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Card from './Card';
import { useRouter } from 'expo-router';
import axios from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const RecentPosts = () => {
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/allposts/getAllPosts`);
        if (response.data.success) {
          setPosts(response.data.recentPosts);
        } else {
          Alert.alert('Error', 'Error occurred');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false); // Stop loading after fetching data
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
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View className="flex-1 flex-grow items-center pb-4">
      <FlatList
        data={posts}
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
        )}
      />
    </View>
  );
};

export default RecentPosts;
