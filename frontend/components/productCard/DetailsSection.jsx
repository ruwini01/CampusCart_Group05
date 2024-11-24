import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DetailsSection = ({ location, condition, seller }) => {
    const DetailItem = ({ label, value }) => (
        <View style={styles.detailItemContainer}>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>{label}</Text>
            </View>
            <Text style={styles.value}>{value}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <DetailItem label="Location" value={location} />
            <DetailItem label="Condition" value={condition} />
            <DetailItem label="Seller" value={seller} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 24, // Space at the top
        gap: 16, // Space between items
    },
    detailItemContainer: {
        flexDirection: 'row', // Align label and value side by side
        justifyContent: 'space-between', // Distribute space evenly
        alignItems: 'center', // Center items vertically
    },
    labelContainer: {
        width: 100, // Fixed width for the label
    },
    label: {
        fontSize: 16, // Moderate size for the label
        fontWeight: '600', // Bold for labels
        color: '#1E3A8A', // Modern blue color
    },
    value: {
        fontSize: 16, // Regular size for the value
        color: '#4B5563', // Dark gray for values
        flex: 1, // Ensure value takes up remaining space
    },
});

export default DetailsSection;
