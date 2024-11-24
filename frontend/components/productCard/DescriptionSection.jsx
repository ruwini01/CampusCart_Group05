import React from 'react';
import { View, Text } from 'react-native';

const DescriptionSection = ({ description }) => {
    return (
        <View className="mt-6 p-4 rounded-lg bg-white shadow-md">
            {/* Section Title */}
            <Text className="text-lg font-bold text-blue-900 mb-3 tracking-wide">Description</Text>

            {/* Description Content */}
            <Text className="text-base text-gray-700 leading-6 tracking-wide">{description}</Text>
        </View>
    );
};

export default DescriptionSection;