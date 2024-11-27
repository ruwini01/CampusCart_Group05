import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import IconButton from '../../components/IconButton'
import { Link } from 'expo-router'
import SearchInput from '../../components/SearchInput'
const Lost_and_found =() =>{
    return(
        <SafeAreaView>
      <ScrollView>
        <View>
          <Text>lost_and_found</Text>
          
        </View>
      </ScrollView>
    </SafeAreaView>
    );
}

export default Lost_and_found