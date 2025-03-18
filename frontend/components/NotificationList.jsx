import { 
    View, FlatList, TouchableOpacity, Text, ActivityIndicator, Alert, RefreshControl 
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import NotificationBar from './NotificationBar';
import { useRouter, useFocusEffect } from 'expo-router';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const NotificationList = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');

            const response = await axios.post(
                `${apiUrl}/users/userdata`,
                { token },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.success) {
                console.log("Fetched Notifications:", response.data.data.notifications);
                
                if (response.data.data.notifications?.length) {
                    setNotifications([...response.data.data.notifications]); // Ensures state updates
                } else {
                    setNotifications([]); // Ensure empty array if no notifications exist
                }
            } else {
                Alert.alert('Error', 'Failed to fetch notifications.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while fetching user data.');
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUserData();
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUserData();
    }, []);

    const calculateTimeAgo = (dateString) => {
        if (!dateString) return "Unknown time";

        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <View className="flex-1 w-full pb-4">
            {notifications.length > 0 ? (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item._id}
                    numColumns={1}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    renderItem={({ item }) => {
                        console.log("Rendering Notification:", item);
                        return (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                className="p-4"
                                onPress={() => {console.log(item.postId), router.push(`/(tabs)/home/${item.postId}`)}}
                            >
                                <NotificationBar
                                    
                                    title={item.title}
                                    text={item.body}
                                    time={calculateTimeAgo(item.date)}
                                />
                            </TouchableOpacity>
                        );
                    }}
                />
            ) : (
                <Text className="text-gray-500 mt-4 text-center">No Notifications</Text>
            )}
        </View>
    );
};

export default NotificationList;
