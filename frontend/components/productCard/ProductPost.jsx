import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import ImageSection from './ImageSection';
import TitlePriceSection from './TitlePriceSection';
import TrackTimeSection from './TrackTimeSection';
import DetailsSection from './DetailsSection';
import DescriptionSection from './DescriptionSection';
import ContactButtons from './ContactButtons';

const ProductPost = ({
    image,
    title,
    price,
    postedTime,
    description,
    location,
    seller,
    condition,
}) => {
    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <ImageSection imageSource={image} />
            <View style={styles.content}>
                <TitlePriceSection title={title} price={price} />
                <TrackTimeSection
                    postedTime={postedTime}
                    onTrackPress={() => console.log('Track pressed')}
                />
                <DetailsSection
                    location={location}
                    condition={condition}
                    seller={seller}
                />
                <DescriptionSection description={description} />
                <ContactButtons
                    onMessagePress={() => console.log('Message pressed')}
                    onCallPress={() => console.log('Call pressed')}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollViewContainer: {
        flexGrow: 1, // Allows ScrollView content to grow and be scrollable
    },
    content: {
        padding: 16, // Padding around the content
        gap: 16, // Space between each section
    },
});

export default ProductPost;
