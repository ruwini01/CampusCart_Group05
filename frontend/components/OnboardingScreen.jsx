import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import { useNavigation } from '@react-navigation/native';

export default function OnboardingScreen() {
  const navigation = useNavigation();

  const handleDone = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        containerStyles={{ paddingHorizontal: 15 }}
        pages={[
          {
            backgroundColor: '#fff',
            image: (
              <Image
                source={require('../assets/images/buy-sell-or-hold.jpg')}
                style={styles.image}
              />
            ),
            title: 'Buy & Sell Products',
            subtitle: 'Easily buy and sell items online.',
            titleStyles: styles.title,
            subTitleStyles: styles.subtitle,
          },
          {
            backgroundColor: '#fff',
            image: (
              <Image
                source={require('../assets/images/lost-and-found.jpg')}
                style={styles.image}
              />
            ),
            title: 'Lost & Found Items',
            subtitle: 'Help find lost items or report found ones.',
            titleStyles: styles.title,
            subTitleStyles: styles.subtitle,
          },
          {
            backgroundColor: '#fff',
            image: (
              <Image
                source={require('../assets/images/find_boarding.jpg')}
                style={styles.image}
              />
            ),
            title: 'Find a Boarding',
            subtitle: 'Discover the perfect boarding options.',
            titleStyles: styles.title,
            subTitleStyles: styles.subtitle,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20, // Add some space between the image and the title
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
