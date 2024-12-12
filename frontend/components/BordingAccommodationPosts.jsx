import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, Image } from 'react-native';
import axios from 'axios';

const BordingAccommodationPosts = () => {
    const [posts, setPosts] = useState([]);
    const BASE_URL = 'http://localhost:8080'; // Replace with your IP address

    useEffect(() => {
      const fetchPosts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/boardingPost/list`);
            setPosts(response.data.posts);
            console.log(posts)
        } catch (error) {
            console.error("Error fetching posts:", error.response ? error.response.data : error.message);
        }
    };
    
        fetchPosts();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity>
            <Image source={{ uri: `${item.images[0]}` }} style={{ width: 100, height: 100 }} />
            <Text>{item.location}</Text>
            <Text>{item.rentprice}</Text>
        </TouchableOpacity>
    );

    return (
        <View>
            <FlatList
                data={posts}
                keyExtractor={item => item._id}
                renderItem={renderItem}
            />
        </View>
    );
};

export default BordingAccommodationPosts;
