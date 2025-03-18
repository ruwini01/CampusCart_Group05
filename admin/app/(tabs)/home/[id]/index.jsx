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
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import EditButton from "../../../../components/EditButton";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const PostDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [token, setToken] = useState(null);
  const scrollViewRef = useRef(null);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken);
    };
    fetchToken();
  }, []);

  useEffect(() => {


    const fetchUser = async () => {
      try {
        const userResponse = await axios.get(`${apiUrl}/posts/userbypost/${id}`);
        if (userResponse) {
          setUser(userResponse.data);
          console.log(userResponse.data);
          
        } else {
          Alert.alert("Error", "Failed to load user details");
        }  
    }
    catch (error) {
      Alert.alert("Error", error.message);
    }
  }


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

    fetchUser();
    fetchPostDetails();
  }, [id]);

   

  const makePhoneCall = () => {
    Alert.alert("Are you sure?", `Call ${post.contact.telephone}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Call", onPress: () => Linking.openURL(`tel:${user.telephone}`) },
    ]);
  };

  const sendMessage = () => {
    Alert.alert("Are you sure?", `Message ${post.contact.telephone}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Message", onPress: () => Linking.openURL(`sms:${user.telephone}`) },
    ]);
  };

  const emailOpen = () => {
    router.push({
      pathname: "/(tabs)/email",
      params: { userEmail: user.email }
    });
  };
  


  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (!post || !category) return <Text>Post not found.</Text>;

  const ContentComponent = {
    sell: ({ post }) => (
      <View>
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-2xl font-semibold">{post.itemname}</Text>
          
        </View>
    
        <Text className="text-lg text-gray-600">Category: {post.category} | Condition: {post.condition}</Text>
        <Divider className="mt-2" />
        <Text className="text-xl font-bold mt-4">Rs.{post.price}.00</Text>
        <Text className="text-base italic">{post.isnagotiable ? "Negotiable" : ""}</Text>
        <Text className="text-lg text-gray-700 font-semibold mt-8">Description</Text>
        <Text className="text-base text-gray-500">Brand: {post.brand}</Text>
        <Text className="text-base text-gray-500">Available Location: {post.location}</Text>
        <Text className="text-base text-gray-500">{post.description}</Text>

        <Text className="text-lg text-gray-700 font-semibold mt-4">Contact Information</Text>
        <Text className="text-base text-gray-500">{post.contact?.name}</Text>
        <Text className="text-base text-gray-500">{post.contact?.address}</Text>
        <Text className="text-base text-gray-500">{post.hidephoneno ? "" : "+94 "+post.contact?.telephone}</Text>
      </View>
    )
    ,
    boarding: ({ post }) => (
      <View>
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-2xl font-semibold">{post.category}</Text>
        
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
    lost: ({ post}) => (
      <View>
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-2xl font-semibold">{post.itemname}</Text>
         
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

  let apiEndPoint = '';

  if (category === 'lost'){
    apiEndPoint = `${apiUrl}/lostposts/removelostpost`
  }
  else if (category === 'found'){
    apiEndPoint = `${apiUrl}/foundposts/removefoundpost`
  }
  else if (category === 'sell'){
    apiEndPoint = `${apiUrl}/sellposts/removesellpost`
  }
  else if (category === 'boarding'){
    apiEndPoint = `${apiUrl}/boardingposts/removeboardingpost`
  }


  const handleDelete = async () => {
    const authToken = await AsyncStorage.getItem('adminToken');

    if (!authToken) {
        Alert.alert("Error", "You are not authenticated. Please log in as admin.");
        return;
    }

    Alert.alert(
        'Confirm Deletion',
        'Are you sure you want to delete this post?',
        [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const response = await axios.delete(`${apiEndPoint}/${id}`, {
                            headers: { Authorization: `Bearer ${authToken}` }
                        });

                        if (response.data.success) {
                            Alert.alert('Success', response.data.message);
                        } else {
                            Alert.alert('Error', response.data.errors || 'Failed to delete the post.');
                        }
                    } catch (error) {
                        Alert.alert('Error', error.response?.data?.message || 'An error occurred while deleting the post.');
                        console.error(error);
                    }
                },
            },
        ],
        { cancelable: true }
    );
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
        <Divider className="mt-2" />
        <Text className="text-lg text-gray-700 font-semibold mt-4">Post Owner Information</Text>
        <Text className="text-base text-gray-500">{user.name}</Text>
        <Text className="text-base text-gray-500">{user.address}</Text>
        <Text className="text-base text-gray-500">+94 {user.telephone}</Text>

        <Text className="text-sm text-gray-400 mt-2">Posted on {new Date(post.date).toLocaleDateString()}</Text>

        <View className="flex-row gap-10 justify-center items-center">
          <CallMessageButton image={icons.call} handlePress={makePhoneCall} />
          <CallMessageButton image={icons.message} handlePress={sendMessage} />
          <CallMessageButton image={icons.mail} handlePress={emailOpen} />
        </View>

        <View className="flex-row  justify-center items-center">
          <EditButton text='Delete Post' handlePress={handleDelete}/>
        </View>

      </View>

      
    </ScrollView>
  </SafeAreaView>
);

};

export default PostDetail;
