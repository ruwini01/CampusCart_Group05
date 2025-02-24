import { View, FlatList, TouchableOpacity ,Text} from 'react-native';
import React,{useEffect,useState} from 'react';
import Card from './Card';
import { useRouter } from 'expo-router';
import axios from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const FoundPosts = () => {
  const router = useRouter();

   const [posts, setPosts] = useState([]);
 
   useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/foundposts/listfoundposts`);
        
        if (response.data.success) {
          setPosts(response.data.foundPosts);
        } else {
          Alert.alert('Error', 'Error occurred');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
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

  return (
    <View className="flex-1 flex-grow items-center pb-4">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            className="p-4"
            onPress={() => router.push(`/(tabs)/home/${item.id}`)}
          >
            <Card image={item.image} name={item.name} price={item.price} days={item.days} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default FoundPosts;
