import { Text,View } from 'react-native';
import React, {useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FoundPosts from '../../../components/FoundPosts';
import SearchInput from '../../../components/SearchInput';

const FoundHome = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView className="flex-1">
      <Text className="font-semibold text-xl mb-6 px-6">Found items</Text>
      <View className="mb-6 px-6">
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </View>
      <FoundPosts searchQuery={searchQuery} />
    </SafeAreaView>
  );
};

export default FoundHome;