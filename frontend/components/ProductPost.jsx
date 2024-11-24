import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import imgebed from '../assets/images/bed.jpg'

const ProductPost = ({
  title = "Double Bed Set",
  price = "5000",
  postedTime = "3 days ago",
  description = "Modern double bed set with tufted headboard, perfect for your bedroom.",
  location = "Colombo, Sri Lanka",
  seller = "John Doe",
  condition = "Used - Like New"
}) => {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Image Section */}
      <Image
        source={imgebed}
        className="w-full h-80"
        resizeMode="cover"
      />

      {/* Content Container */}
      <View className="p-4">
        {/* Title and Price */}
        <View className="space-y-2">
          <Text className="text-3xl font-semibold text-gray-800">
            {title}
          </Text>
          <Text className="text-2xl font-bold text-gray-900">
            Rs.{price}
          </Text>
        </View>

        {/* Track Button and Time */}
        <View className="flex-row justify-between items-center mt-4">
          <TouchableOpacity
            className="bg-emerald-50 px-6 py-2 rounded-full"
            onPress={() => console.log('Track pressed')}
          >
            <Text className="text-emerald-600 text-lg font-semibold">
              Track
            </Text>
          </TouchableOpacity>

          <Text className="text-gray-400">
            {postedTime}
          </Text>
        </View>

        {/* Details Section */}
        <View className="mt-6 space-y-4">
          {/* Location */}
          <View className="flex-row items-center">
            <View className="w-24">
              <Text className="text-gray-500">Location</Text>
            </View>
            <Text className="text-gray-800 flex-1">{location}</Text>
          </View>

          {/* Condition */}
          <View className="flex-row items-center">
            <View className="w-24">
              <Text className="text-gray-500">Condition</Text>
            </View>
            <Text className="text-gray-800 flex-1">{condition}</Text>
          </View>

          {/* Seller */}
          <View className="flex-row items-center">
            <View className="w-24">
              <Text className="text-gray-500">Seller</Text>
            </View>
            <Text className="text-gray-800 flex-1">{seller}</Text>
          </View>
        </View>

        {/* Description */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Description
          </Text>
          <Text className="text-gray-600 leading-6">
            {description}
          </Text>
        </View>

        {/* Contact Buttons */}
        <View className="mt-8 space-y-3">
          <TouchableOpacity
            className="w-full bg-emerald-600 py-3 rounded-xl"
            onPress={() => console.log('Message pressed')}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Message Seller
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full bg-white py-3 rounded-xl border border-emerald-600"
            onPress={() => console.log('Call pressed')}
          >
            <Text className="text-emerald-600 text-center font-semibold text-lg">
              Call Seller
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductPost;
