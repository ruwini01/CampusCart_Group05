import { View, Text, Image } from 'react-native';
import React, { useState } from 'react';
import { useGlobalSearchParams } from 'expo-router';
import { images } from '../../../../constants';
import BookmarkButton from '../../../../components/BookmarkButton';

const ItemDetail = () => {
  const { id } = useGlobalSearchParams();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const posts = {
    '1': { id: '1', image: images.bed, name: 'Double Bed Set', price: '3000', days: '3' },
    '2': { id: '2', image: images.bed, name: 'Sofa Set', price: '2500', days: '5' },
    '3': { id: '3', image: images.bed, name: 'Dining Table', price: '4000', days: '2' },
    '4': { id: '4', image: images.bed, name: 'Office Chair', price: '1500', days: '7' },
  };

  const item = posts[id] || {};

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement bookmark saving logic
  };

  if (!item.name) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Item not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Image source={item.image} style={{ width: '100%', height: 200, marginBottom: 16 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>{item.name}</Text>
        <BookmarkButton isBookmarked={isBookmarked} onPress={handleBookmark} />
      </View>
      <Text style={{ fontSize: 18, color: 'gray', marginBottom: 8 }}>Price: {item.price}</Text>
      <Text style={{ fontSize: 16 }}>Posted {item.days} days ago</Text>
    </View>
  );
};

export default ItemDetail;