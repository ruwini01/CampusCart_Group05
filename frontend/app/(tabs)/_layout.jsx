import { View, Text, Image } from 'react-native';
import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { icons } from '../../constants';
import { useGlobalContext } from '../../context/GlobalProvider';

const TabIcon = ({ icon, color, name, focused, badgeCount }) => {
  return (
    <View className="items-center justify-center gap-2 w-20 pt-3 relative">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-5 h-5"
      />
      <Text className={`${focused ? 'font-semibold' : 'font-normal'} text-xs`} style={{ color: color }}>
        {name}
      </Text>
      {/* Only show badge if there are unread notifications */}
      {badgeCount > 0 && (
        <View className="absolute top-1 right-5 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
          <Text className="text-white text-xs font-semibold">{badgeCount}</Text>
        </View>
      )}
    </View>
  );
};

const TabsLayout = () => {
  const { unreadCount, fetchUnreadCount } = useGlobalContext();

  useEffect(() => {
    // Fetch unread notifications when the component mounts
    fetchUnreadCount();
    
    // Set up a refresh interval to periodically check for new notifications
    const intervalId = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#0D7C66',
        tabBarInactiveTintColor: '#B7B7B7',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="bookmark"
        options={{
          title: 'Bookmark',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.bookmark} color={color} name="Bookmark" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="notification"
        options={{
          title: 'Notification',
          headerShown: true,
          headerStyle: { backgroundColor: '#0D7C66' },
          headerTitle: '',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.notification}
              color={color}
              name="Notification"
              focused={focused}
              badgeCount={unreadCount}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.profile} color={color} name="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;