import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const ImageSection = ({ imageSource }) => {
    return (
        <View style={styles.imageContainer}>
            <Image
                source={imageSource}
                style={styles.image}
                resizeMode="cover"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: '100%', // Full width of the parent container
        height: 320, // Set a specific height for the image (adjustable)
        borderRadius: 12, // Rounded corners for the image container
        overflow: 'hidden', // Ensures the image content stays within the rounded corners
        shadowColor: '#000', // Shadow color
        shadowOpacity: 0.2, // Shadow opacity
        shadowRadius: 8, // Shadow blur radius
        shadowOffset: { width: 0, height: 4 }, // Shadow offset for depth
        elevation: 5, // Elevation for Android devices
    },
    image: {
        width: '100%', // Ensures the image fills the container width
        height: '100%', // Ensures the image fills the container height
        borderRadius: 12, // Rounded corners for the image itself
    },
});

export default ImageSection;
