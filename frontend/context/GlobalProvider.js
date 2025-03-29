import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'react-native-axios';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const GlobalProvider = ({children}) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [readNotifications, setReadNotifications] = useState([]);
    const [allNotifications, setAllNotifications] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                
                if (token) {
                    const response = await axios.post(
                        `${apiUrl}/users/userdata`,
                        { token },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        }
                    );

                    setIsLogged(true);
                    setUser(response.data.data);
                    
                    // Store all notifications for reference
                    setAllNotifications(response.data.data.notifications || []);
                } else {
                    setIsLogged(false);
                    setUser(null);
                }
            } catch (error) {
                console.log('Error:', error);
                setIsLogged(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUserData();
    }, []);

    useEffect(() => {
        const loadReadNotifications = async () => {
            try {
                const storedReadNotifications = await AsyncStorage.getItem('readNotifications');
                if (storedReadNotifications) {
                    setReadNotifications(JSON.parse(storedReadNotifications));
                }
            } catch (error) {
                console.error("Error loading read notifications:", error);
            }
        };

        loadReadNotifications();
    }, []);

    // Calculate unread count whenever allNotifications or readNotifications change
    useEffect(() => {
        if (allNotifications.length > 0) {
            const unreadNotifications = allNotifications.filter(
                notification => !readNotifications.includes(notification._id)
            );
            setUnreadCount(unreadNotifications.length);
        }
    }, [allNotifications, readNotifications]);

    const fetchUnreadCount = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const response = await axios.post(`${apiUrl}/users/userdata`, { token }, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.data.success) {
                const notifications = response.data.data.notifications || [];
                setAllNotifications(notifications);
            }
        } catch (error) {
            console.error('Error fetching unread notifications:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        if (!readNotifications.includes(notificationId)) {
            const updatedReadNotifications = [...readNotifications, notificationId];
            setReadNotifications(updatedReadNotifications);
            
            // The unread count will be updated by the useEffect
            
            try {
                await AsyncStorage.setItem('readNotifications', JSON.stringify(updatedReadNotifications));
            } catch (error) {
                console.error("Error saving read notification:", error);
            }
        }
    };

    return (
        <GlobalContext.Provider
            value={{
                isLogged,
                setIsLogged,
                user,
                setUser,
                isLoading,
                unreadCount, 
                readNotifications, 
                markAsRead, 
                fetchUnreadCount
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;