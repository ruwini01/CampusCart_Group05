import { View, Text, ScrollView, Button, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import SearchInput from '../../../components/SearchInput'
import IconButton from '../../../components/IconButton'
import { icons } from '../../../constants'
import RecentPosts from '../../../components/RecentPosts'

const Home = () => {

    const router = useRouter();

  return (
    <SafeAreaView className="h-full">
      <View className="w-full h-full px-6">
        <Text className="font-semibold text-xl ml-6 mt-6">Profile</Text>

        {/* Flex container for the grid */}
        <View className="flex-1 flex-row flex-wrap gap-12 py-20 items-center justify-center">
          <IconButton
            image={icons.user}
            title="Edit profile"
            handlePress={() => router.push('/(tabs)/profile/editprofile')}
            otherStyle="w-36"
          />
          <IconButton
            image={icons.posts}
            title="My Posts"
            handlePress={() => router.push('/(tabs)/profile/myposts')}
            otherStyle="w-36"
          />
          <IconButton
            image={icons.settings}
            title="Settings"
            handlePress={() => router.push('/(tabs)/profile/settings')}
            otherStyle="w-36"
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Home