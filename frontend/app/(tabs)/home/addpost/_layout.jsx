import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router';

const AddPostLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: true, headerStyle:{backgroundColor:'#0D7C66'}}}>
          <Stack.Screen name="index" options={{ title: ''}} />
          <Stack.Screen name="addbordinghouse" options={{ title: '' }} />
          <Stack.Screen name="addfounditem" options={{ title: '' }} />
          <Stack.Screen name="addlostitem" options={{ title: '' }} />
          <Stack.Screen name="addsellitem" options={{ title: '' }} />
        </Stack>
      );
}

export default AddPostLayout