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
          <View className='px-6'>
          <View className='flex-row gap-24 justify-center py-10'>
          <IconButton 
            image={icons.sell}
            title='Buy & Sell'
            handlePress={() => router.push('/(tabs)/home/buyandsellhome')}
            otherStyle='w-36'
          />

          <IconButton 
            image={icons.found}
            title='Lost & Found'
            width='36'
            handlePress={() => router.push('/(tabs)/home/lostandfoundhome')}
            otherStyle='w-36'
           
          />
          </View>
          <IconButton 
            image={icons.house}
            title='Boarding Accommodation'
            otherStyle={'flex-row gap-9 w-full'}
            handlePress={() => router.push('/(tabs)/home/bordinghouseshome')}
          />
          </View>


          <Text className='font-semibold text-xl ml-6 mt-6'>Recent Posts</Text>
          <RecentPosts/>
        

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
          </View>
    </SafeAreaView>
  )
}

export default Home