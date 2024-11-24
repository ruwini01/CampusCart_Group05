import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import ImageSection from './ImageSection';
import TitlePriceSection from './TitlePriceSection';

import DetailsSection from './DetailsSection';
import DescriptionSection from './DescriptionSection';
import ContactButtons from './ContactButtons';
import PropTypes from 'prop-types';

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
        <ScrollView style={styles.container}>
            <ImageSection imageSource={image} />
            <View style={styles.content}>
                <View style={styles.section}>
                    <TitlePriceSection title={title} price={price} />
                </View>

                <View style={styles.section}>
                    <DetailsSection
                        location={location}
                        condition={condition}
                        seller={seller}
                    />
                </View>
                <View style={styles.section}>
                    <DescriptionSection description={description} />
                </View>
                <View style={styles.section}>
                    <ContactButtons
                        onMessagePress={() => console.log('Message pressed')}
                        onCallPress={() => console.log('Call pressed')}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // White background for the entire screen
    },
    content: {
        padding: 16, // Padding around the content
    },
    section: {
        marginBottom: 16, // Space between each section
    },
});

// PropTypes for validation
ProductPost.propTypes = {
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    postedTime: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    seller: PropTypes.string.isRequired,
    condition: PropTypes.string.isRequired,
};

export default ProductPost;