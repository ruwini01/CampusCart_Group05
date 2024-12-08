import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#0D7C66' },
      }}
    >
      <Stack.Screen name="index" options={{ title: '' }} />
      <Stack.Screen name="editprofile" options={{ title: '' }} />
      <Stack.Screen name="myposts" options={{ title: '' }} />
      <Stack.Screen name="settings" options={{ title: '' }} />

  
    </Stack>
  );
}
