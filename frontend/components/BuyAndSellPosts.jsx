import { View, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import Card from './Card';
import { images } from '../constants';
import { useRouter } from 'expo-router';

const BuyAndSellPosts = () => {
  const router = useRouter();

  const posts = [
    { id: '1', image: images.bed, name: 'Double Bed Set', price: '3000', days: '3' },
    { id: '2', image: images.bed, name: 'Sofa Set', price: '2500', days: '5' },
    { id: '3', image: images.bed, name: 'Dining Table', price: '4000', days: '2' },
    { id: '4', image: images.bed, name: 'Office Chair', price: '1500', days: '7' },
    { id: '5', image: images.bed, name: 'Double Bed Set', price: '3000', days: '3' },
    { id: '6', image: images.bed, name: 'Sofa Set', price: '2500', days: '5' },
    { id: '7', image: images.bed, name: 'Dining Table', price: '4000', days: '2' },
    { id: '8', image: images.bed, name: 'Office Chair', price: '1500', days: '7' },
  ];

  return (
    <View className="flex-1 flex-grow items-center pb-4">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            className="p-4"
            onPress={() => router.push(`/(tabs)/home/${item.id}`)}
          >
            <Card image={item.image} name={item.name} price={item.price} days={item.days} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default BuyAndSellPosts;
