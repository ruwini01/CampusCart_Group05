import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import IconButton from '../../components/IconButton'
import { Link } from 'expo-router'
import SearchInput from '../../components/SearchInput'
import { NavigationContainer } from '@react-navigation/native'



const Buy_and_sell =() =>{
    return(
        <SafeAreaView style={styles.overall}>
      <ScrollView style={styles.topbar}>
      <View >
          <Text>Items to Sell</Text>
          
        </View>
      </ScrollView>
      <ScrollView style={styles.body}>
        <View >
          <Text style={styles.texts}>Items to Sell</Text>
          
        </View>
      </ScrollView>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create(
  { topbar: {
    backgroundColor: 'green',
    height: '15%',
  
    },
    body: {
      backgroundColor: 'white',
      height: '85%',
      margin: 20,
      fontFamily: 'openSansBold',
      },
    texts:{
        fontSize: 20,
        fontWeight: 'bold',
      },
    overall: {
        backgroundColor: 'white',
      },
    }

);
export default Buy_and_sell;

