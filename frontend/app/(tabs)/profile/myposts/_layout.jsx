import { Stack } from 'expo-router';

export default function MyPostsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#0D7C66' },
      }}
    >
      <Stack.Screen name="index" options={{ title: '' }} />
      <Stack.Screen name="editbordinghouse" options={{ title: ''}} />
      <Stack.Screen name="editfounditem" options={{ title: '' }} />
      <Stack.Screen name="editlostitem" options={{ title: '' }} />
      <Stack.Screen name="editsellitem" options={{ title: '' }} />
  
    </Stack>
  );
}
