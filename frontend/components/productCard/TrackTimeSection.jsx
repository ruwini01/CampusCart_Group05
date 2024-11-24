import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TrackTimeSection = ({ postedTime, onTrackPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.trackButton} onPress={onTrackPress}>
                <Text style={styles.trackText}>Track</Text>
            </TouchableOpacity>

            <Text style={styles.postedTime}>{postedTime}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16, // Adds top margin for spacing
    },
    trackButton: {
        backgroundColor: '#E0F9F4', // Soft emerald background color
        paddingHorizontal: 24, // Horizontal padding for spacing
        paddingVertical: 8, // Vertical padding for spacing
        borderRadius: 20, // Rounded button
        shadowColor: '#000', // Subtle shadow to create depth
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    trackText: {
        color: '#10B981', // Emerald green text color
        fontSize: 16, // Font size for the text
        fontWeight: '600', // Semi-bold weight for the text
        textAlign: 'center',
    },
    postedTime: {
        color: '#A1A1AA', // Light gray color for the posted time text
        fontSize: 14, // Slightly smaller font size for the posted time
        fontWeight: '400', // Regular weight for the text
    },
});

export default TrackTimeSection;
