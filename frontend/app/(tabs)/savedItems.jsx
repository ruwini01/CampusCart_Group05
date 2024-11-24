import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'

const SavedItems = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>Saved Items</Text>

          <Link href="/tabs/singlePost" className="text-blue-600">Go to Single Post</Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SavedItems