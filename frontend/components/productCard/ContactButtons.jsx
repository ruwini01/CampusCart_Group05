import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const ContactButtons = ({ onMessagePress, onCallPress }) => {
    return (
        <View className="mt-8 space-y-4">
            {/* Message Button */}
            <TouchableOpacity
                className="w-full py-4 rounded-lg bg-blue-800 shadow-lg"
                onPress={onMessagePress}
            >
                <Text className="text-white text-lg font-semibold text-center tracking-wide">
                    Message Seller
                </Text>
            </TouchableOpacity>

            {/* Call Button */}
            <TouchableOpacity
                className="w-full py-4 rounded-lg border border-blue-900 bg-white shadow-sm"
                onPress={onCallPress}
            >
                <Text className="text-blue-900 text-lg font-semibold text-center tracking-wide">
                    Call Seller
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default ContactButtons;
