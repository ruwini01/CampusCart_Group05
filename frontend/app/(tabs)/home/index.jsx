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
    <SafeAreaView className='h-full'>
        <View className='w-full h-full px-4'>
          <View className='px-6'>
          <SearchInput/>
          </View>
          
          
          {/* handlePress={() => router.push('/(tabs)/home/bordinghouseshome')} */}
          {/* Flex container for the grid */}
        <View className="flex-1 flex-row flex-wrap gap-12 py-10 mb-6 items-center justify-center">
          <IconButton
            image={icons.sell}
            title="Buy an Item"
            handlePress={() => router.push('/(tabs)/home/buyandsellhome')}
            otherStyle="w-36"
          />
          <IconButton
            image={icons.lost}
            title="Lost Items"
            handlePress={() => router.push('/(tabs)/home/losthome')}
            otherStyle="w-36"
          />

          <IconButton
            image={icons.found}
            title="Found Items"
            handlePress={() => router.push('/(tabs)/home/foundhome')}
            otherStyle="w-36"
          />

          <IconButton
            image={icons.house}
            title="Bording Accommocation"
            handlePress={() => router.push('/(tabs)/home/bordinghouseshome')}
            otherStyle="w-36"
          />
        </View>
 
          <Text className='font-semibold text-xl ml-6 mt-6'>Recent Posts</Text>
          <RecentPosts/>
        </View>

        <View className='justify-center items-center'>
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={()=> router.push('/(tabs)/home/addpost')}
          >
            <Image
              source={icons.plus}
              className='w-14 h-14 mt-[-14]'
              resizeMode='contain'
            />
          </TouchableOpacity>
          </View>
    </SafeAreaView>
  )
}

export default Home