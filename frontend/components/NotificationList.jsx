import { 
    View, FlatList, TouchableOpacity, Text, ActivityIndicator, Alert, RefreshControl 
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import NotificationBar from './NotificationBar';
import { useRouter, useFocusEffect } from 'expo-router';
import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '../context/GlobalProvider';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const NotificationList = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { readNotifications, markAsRead, fetchUnreadCount } = useGlobalContext();
    const [postsData, setPostsData] = useState({});

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
                    const sortedNotifications = [...response.data.data.notifications].sort((a, b) => {
                      return new Date(b.date) - new Date(a.date);
                    });
                    setNotifications(sortedNotifications);
                    
                    // Fetch post images for all notifications with postId
                    fetchPostImages(sortedNotifications);
                } else {
                    setNotifications([]); // Ensure empty array if no notifications exist
                }
                
                // Update unread count after fetching new notifications
                fetchUnreadCount();
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

  const fetchPostImages = async (notificationsList) => {
    try {
      // Get unique postIds from notifications
      const postIds = [...new Set(notificationsList
        .filter(notification => notification.postId)
        .map(notification => notification.postId))];
      
      // Fetch post details for each unique postId
      const fetchedPosts = {};
      
      for (const postId of postIds) {
        try {
          const detailsResponse = await axios.get(`${apiUrl}/allposts/getAllPosts/${postId}`);
          if (detailsResponse.data.success) {
            fetchedPosts[postId] = detailsResponse.data.post;
          }
        } catch (error) {
          console.error(`Error fetching post ${postId}:`, error);
        }
      }
      
      setPostsData(fetchedPosts);
    } catch (error) {
      console.error("Error fetching post images:", error);
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

      const isNewNotification = (notification) => {
        if (!notification.date) return false;

        // Check if it's already marked as read
        if (readNotifications.includes(notification._id)) {
          return false;
        }

        const date = new Date(notification.date);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        return diffInHours < 24; // If less than 24 hours old, it's considered new
      };

    const handleNotificationPress = (notification) => {
      // Mark as read when clicked
      markAsRead(notification._id);
      console.log(notification.postId);
      router.push(`/(tabs)/home/${notification.postId}`);
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
                      
                      // Get the post image if available
                      let image = null;
                      if (item.postId && postsData[item.postId] && postsData[item.postId].images && postsData[item.postId].images.length > 0) {
                        image = postsData[item.postId].images[0];
                      }
                            
                            return (
                              <TouchableOpacity
                                activeOpacity={0.7}
                                className="p-5 pb-0"
                                onPress={() => handleNotificationPress(item)}
                              >
                                <NotificationBar
                                    seen={!isNewNotification(item)}
                                    title={item.title}
                                    text={item.body}
                                    time={calculateTimeAgo(item.date)}
                                    image={image}
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
