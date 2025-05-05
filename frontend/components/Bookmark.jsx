import { View, FlatList, TouchableOpacity, Text, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import React, { useState, useCallback } from 'react';
import TrackCard from './TrackCard';
import { useRouter, useFocusEffect } from 'expo-router';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const Bookmark = () => {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPostData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                Alert.alert('Error', 'Please login first');
                return;
            }

            const response = await axios.get(`${apiUrl}/bookmark/bookmarkedList`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setPosts(response.data.bookmarkedPosts);
            } else {
                setPosts([]);
            }
        } catch (error) {
            setPosts([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchPostData();
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPostData();
    }, []);

    const calculateTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <View className="flex-1 items-center pb-4">

            {posts.length === 0 ? (
                <Text className="text-gray-500 mt-4">No bookmarked posts</Text>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="p-4"
                            onPress={() => router.push(`/(tabs)/home/${item._id}`)}
                        >
                            <TrackCard
                                handlePress={() => {
                                    router.push({
                                        pathname: '/(tabs)/bookmark/trackpost',
                                        params: { item: JSON.stringify(item) }
                                    });
                                }}
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
            )}
        </View>
    );
};

export default Bookmark;
