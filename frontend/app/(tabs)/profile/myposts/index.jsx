import { View, FlatList, TouchableOpacity, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Card from '../../../../components/Card';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const Home = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/posts/getAllPosts`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.success) {
          setPosts(response.data.posts || []);
        } else {
          setError('Failed to load my posts');
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
        <Text className="text-gray-500 text-center">No my posts found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <Text className="mx-6 font-semibold text-xl mt-6 mb-6">My Posts</Text>
      <FlatList
      className='pl-6'
        data={posts}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
        renderItem={({ item }) => (
            <TouchableOpacity
            className="w-[48%] mb-4"
            onPress={() => {
              if (item.cat === 'sell') {
                router.push({
                  pathname: `/(tabs)/profile/myposts/editsellitem`,
                  params: { item: JSON.stringify(item) }
                });
              }
              if (item.cat === 'lost') {
                router.push({
                  pathname: `/(tabs)/profile/myposts/editlostitem`,
                  params: { item: JSON.stringify(item) }
                });
              }
              if (item.cat === 'found') {
                console.log(item);
                
                router.push({
                  pathname: `/(tabs)/profile/myposts/editfounditem`,
                  params: { item: JSON.stringify(item) }
                });
              }
              if (item.cat === 'boarding') {
                console.log(item);
                router.push({
                  pathname: `/(tabs)/profile/myposts/editbordinghouse`,
                  params: { item: JSON.stringify(item) }
                });
              }
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
              days={calculateTimeAgo(item.date)}
            />
          </TouchableOpacity>
          
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
