import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DescriptionSection = ({ description }) => {
    return (
        <View style={styles.container}>
            {/* Section Title */}
            <Text style={styles.title}>Description</Text>

            {/* Description Content */}
            <Text style={styles.description}>{description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 24, // Space at the top of the section
        padding: 16, // Padding inside the section
        borderRadius: 12, // Rounded corners
        backgroundColor: '#fff', // White background
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3, // Elevation for shadow on Android
    },
    title: {
        fontSize: 20, // Larger font size for the title
        fontWeight: '700', // Bold title
        color: '#1E3A8A', // Modern blue color for the title
        marginBottom: 12, // Space below the title
        letterSpacing: 1, // Slight letter spacing for clarity
    },
    description: {
        fontSize: 16, // Regular size for description text
        color: '#4B5563', // Dark gray text color for readability
        lineHeight: 24, // Line height for better spacing between lines
        letterSpacing: 0.5, // Slight letter spacing for readability
    },
});

export default DescriptionSection;
