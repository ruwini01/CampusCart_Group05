import React, { useEffect, useState } from 'react';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;


const BordingAccommodationPosts = () => {
  const router = useRouter();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/boardingposts/listbordingposts`);

        if (response.data.success) {
          setPosts(response.data.data);
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
      <Text>Hi</Text>
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
              name={item.category}
              price={item.rentprice}
              days={calculateTimeAgo(item.date)} // Pass calculated time
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
  
};

export default BordingAccommodationPosts
