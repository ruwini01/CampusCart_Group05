import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import IconButton from '../../components/IconButton'
import { Link } from 'expo-router'
import SearchInput from '../../components/SearchInput'
const Buy_and_sell =() =>{
    return(
        <SafeAreaView>
      <ScrollView style={styles.topbar}>
        <View >
          <Text>Buy_and_sell</Text>
          
        </View>
      
      </ScrollView>
      <ScrollView style={styles.topbar}>
        <View >
          <Text>Buy_and_sell</Text>
          
        </View>
      </ScrollView>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create(
  { topbar: {
    backgroundColor: 'green',
    height: '15%',
    text: {}
    },
    body: {
      backgroundColor: '#white',
      height: '85%',
      },
    }
    
);
export default Buy_and_sell;

