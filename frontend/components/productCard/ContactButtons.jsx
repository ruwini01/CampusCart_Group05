import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const ContactButtons = ({ onMessagePress, onCallPress }) => {
    return (
        <View className="mt-8 space-y-4">
            {/* Message Seller Button */}
            <TouchableOpacity
                className="w-full bg-blue-600 py-4 rounded-lg shadow-md shadow-blue-300"
                onPress={onMessagePress}
            >
                <Text className="text-white text-center font-semibold text-lg tracking-wide">
                    Message Seller
                </Text>
            </TouchableOpacity>

            {/* Call Seller Button */}
            <TouchableOpacity
                className="w-full bg-white py-4 rounded-lg border border-blue-600 shadow-sm"
                onPress={onCallPress}
            >
                <Text className="text-blue-600 text-center font-semibold text-lg tracking-wide">
                    Call Seller
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ContactButtons;