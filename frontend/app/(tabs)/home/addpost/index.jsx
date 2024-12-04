import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import IconButton from '../../../../components/IconButton';
import { icons } from '../../../../constants';

const AddPost = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="h-full">
      <View className="w-full h-full px-6">
        <Text className="font-semibold text-xl ml-6 mt-6">Post an Ad Today</Text>

        {/* Flex container for the grid */}
        <View className="flex-1 flex-row flex-wrap gap-12 py-20 items-center justify-center">
          <IconButton
            image={icons.sell}
            title="Sell an Item"
            handlePress={() => router.push('/(tabs)/home/addpost/addsellitem')}
            otherStyle="w-36"
          />
          <IconButton
            image={icons.house}
            title="Post a Bording-House"
            handlePress={() => router.push('/(tabs)/home/addpost/addbordinghouse')}
            otherStyle="w-36"
          />
          <IconButton
            image={icons.lost}
            title="Report a Lost Item"
            handlePress={() => router.push('/(tabs)/home/addpost/addlostitem')}
            otherStyle="w-36"
          />
          <IconButton
            image={icons.found}
            title="Report a Found Item"
            handlePress={() => router.push('/(tabs)/home/addpost/addfounditem')}
            otherStyle="w-36"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddPost;
