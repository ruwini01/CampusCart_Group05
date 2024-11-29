import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Share, Alert, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router'
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
const { height } = Dimensions.get('window');

const Buy_and_sell = () => {
    const onBackPress = () => {
        // Navigate back to the previous screen
        // You can use navigation.goBack() if you're using react-navigation
        navigation.navigate('home'); // Navigate to the home page
       // Alert.alert("Back Button Pressed");
    };

    const onSharePress = async () => {
        try {
            await Share.share({
                message: 'Check out this buy and sell app!',
            });
        } catch (error) {
            Alert.alert("Error sharing the app");
        }
    };

    const Header = () => {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={onBackPress} style={styles.button}>
                    <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Buy & Sell</Text>
                <TouchableOpacity onPress={onSharePress} style={styles.button}>
                    <Icon name="share-social" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.overall}>
            <Header />
            <ScrollView contentContainerStyle={styles.body}>
                <Text style={styles.texts}>Welcome to the Buy & Sell section!</Text>
                {/* Add more content here as needed */}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    overall: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: height * 0.2, // 20% of the screen height
        backgroundColor: '#0D7C66', // Change to your desired color
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    button: {
        padding: 10,
    },
    body: {
        backgroundColor: 'white',
        padding: 20,
        flexGrow: 1, // Ensures the body takes up the remaining space
    },
    texts: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Buy_and_sell;