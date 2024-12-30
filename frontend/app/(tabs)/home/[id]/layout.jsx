
import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router';

const PostDetailLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false, headerStyle:{backgroundColor:'#0D7C66'}}}>
          <Stack.Screen name="index" options={{ title: ''}} />
        </Stack>
      );
}

export default PostDetailLayout