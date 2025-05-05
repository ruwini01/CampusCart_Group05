import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const TrackPost = () => {

    const params = useLocalSearchParams();
    const item = params.item ? JSON.parse(params.item) : null;
    console.log(item.cat);


    const renderStatus = () => {
      if (!item || !item.status || !item.cat) {
        return <Text className="text-center text-gray-500">No Status Available</Text>;
      }
  
      switch (item.cat) {
        case 'boarding':
          return (
            <View className="p-4  rounded-lg bg-white shadow mx-4 h-96">
              <Text className="text-lg font-semibold mb-2">{item.category} Status</Text>
              <View className="flex-col gap-5 items-center mt-16">
                {item.status === 'available' ? (
                  <>
                    <Icon name="smile-o" size={45} color="#0D7C66" />
                    <Text className="text-[#0D7C66]">Available</Text>
                    
                  </>
                ) : (
                  <>
                  <Icon name="frown-o" size={45} color="gray" />
                  <Text className="text-gray-600">Not Available</Text>
                    
                  </>
                )}
              </View>
            </View>
          );
  
        case 'lost':
          return (
            <View className="p-4  rounded-lg bg-white shadow mx-4 h-96">
              <Text className="text-lg font-semibold mb-2">Lost {item.itemname} Status</Text>
              <View className="flex-col gap-5 items-center mt-16">
                {item.status === 'searching' ? (
                  <>
                    <Icon name="search" size={45} color="#0D7C66" />
                    <Text className="text-[#0D7C66]">Searching</Text>
                  </>
                ) : (
                  <>
                    <Icon name="check-circle" size={45} color="#0D7C66" />
                    <Text className="text-[#0D7C66]">Found</Text>
                    
                  </>
                )}
              </View>
            </View>
          );
  
        case 'found':
          return (
            <View className="p-4  rounded-lg bg-white shadow mx-4 h-96">
              <Text className="text-lg font-semibold mb-2">Found {item.itemname} Status</Text>
              <View className="flex-col gap-5 items-center mt-16">
                {item.status === 'searching for owner' ? (
                  <>
                    <Icon name="user-o" size={45} color="#0D7C66" />
                    <Text className="text-[#0D7C66]">Searching for Owner</Text>
                    
                  </>
                ) : (
                  <>
                    <Icon name="user" size={45} color="#0D7C66" />
                    <Text className="text-[#0D7C66]">Owner Found</Text>
                  </>
                )}
              </View>
            </View>
          );
  
        case 'sell':
          return (
            <View className="p-4  rounded-lg bg-white shadow mx-4 h-96">
              <Text className="text-lg font-semibold mb-2">Selling Status</Text>
              <View className="flex-col gap-5 items-center mt-16">
                {item.status === 'available' ? (
                  <>
                    <Icon name="shopping-cart" size={45} color="#0D7C66" />
                    <Text className="text-[#0D7C66]">Available</Text>
                    
                  </>
                ) : (
                  <>
                    <Icon name="ban" size={45} color="red" />
                    <Text className="text-red-600">Sold Out</Text>
                    
                  </>
                )}
              </View>
            </View>
          );
  
        default:
          return <Text className="text-center text-gray-500">Unknown Status</Text>;
      }
    };
    


    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <Text className="mx-6 font-semibold text-xl mb-6">Track Post</Text>
        <ScrollView>{renderStatus()}</ScrollView>
        
      </SafeAreaView>
    );
}

export default TrackPost