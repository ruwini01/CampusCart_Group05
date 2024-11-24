import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TitlePriceSection = ({ title, price }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.price}>Rs. {price}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 24, // Adds top margin for spacing
        marginBottom: 12, // Adds bottom margin for spacing
        paddingHorizontal: 16, // Adds horizontal padding for spacing
    },
    title: {
        fontSize: 28, // Large title text for prominence
        fontWeight: '600', // Semi-bold weight for the title
        color: '#333', // Dark gray color for the title text
        lineHeight: 34, // Provides better line spacing for readability
        textShadowColor: '#aaa', // Subtle shadow to create depth
        textShadowOffset: { width: 0, height: 2 }, // Position of the shadow
        textShadowRadius: 4, // Radius of the shadow
    },
    price: {
        fontSize: 24, // Slightly smaller than the title
        fontWeight: '700', // Bold weight for the price
        color: '#1D4ED8', // Modern blue color for the price text
        lineHeight: 30, // Better line height for readability
        textShadowColor: '#aaa', // Subtle shadow to create depth
        textShadowOffset: { width: 0, height: 1 }, // Position of the shadow
        textShadowRadius: 3, // Radius of the shadow
    },
});

export default TitlePriceSection;
