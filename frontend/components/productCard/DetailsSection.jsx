import React from 'react';
import { View, Text } from 'react-native';

const DetailsSection = ({ location, condition, seller }) => {
    const DetailItem = ({ label, value }) => (
        <View className="flex flex-row justify-between items-center">
            <View className="w-24"> {/* Fixed width for the label */}
                <Text className="text-lg font-semibold text-blue-800">{label}</Text>
            </View>
            <Text className="text-lg text-gray-700 flex-1">{value}</Text>
        </View>
    );

    return (
        <View className="mt-6 space-y-4"> {/* Space at the top and between items */}
            <DetailItem label="Location" value={location} />
            <DetailItem label="Condition" value={condition} />
            <DetailItem label="Seller" value={seller} />
        </View>
    );
};

export default DetailsSection;