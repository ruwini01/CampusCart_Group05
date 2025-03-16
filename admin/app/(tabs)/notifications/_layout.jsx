import { Stack } from 'expo-router';

export default function NotificationLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#0D7C66' },
      }}
    >
      <Stack.Screen name="index" options={{ title: '' }} />
      
    </Stack>
  );
}
