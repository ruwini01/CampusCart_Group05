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
