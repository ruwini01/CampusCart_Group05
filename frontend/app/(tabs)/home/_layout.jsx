import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#0D7C66' },
      }}
    >
      <Stack.Screen name="index" options={{ title: '' }} />
      <Stack.Screen name="buyandsellhome" options={{ title: '' }} />
      <Stack.Screen name="losthome" options={{ title: '' }} />
      <Stack.Screen name="foundhome" options={{ title: '' }} />
      <Stack.Screen name="bordinghouseshome" options={{ title: '' }} />

  
      <Stack.Screen
        name="addpost"
        options={{
          title: '',
          headerShown: false, 
        }}
      />
    </Stack>
  );
}
