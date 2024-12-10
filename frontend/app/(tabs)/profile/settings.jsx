// frontend/app/(tabs)/profile/settings.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { icons } from '../../../constants'; // Assuming you have icons imported from constants

const Settings = () => {
  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState('light');

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const handleThemeChange = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.settingItem}>
        <Image source={icons.language} style={styles.icon} />
        <Text style={styles.settingText}>Language: {language}</Text>
        <View style={styles.languageOptions}>
          <TouchableOpacity onPress={() => handleLanguageChange('English')}>
            <Text style={styles.languageOption}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLanguageChange('Tamil')}>
            <Text style={styles.languageOption}>Tamil</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLanguageChange('Sinhala')}>
            <Text style={styles.languageOption}>Sinhala</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingItem}>
        <Image source={icons.theme} style={styles.icon} />
        <Text style={styles.settingText}>Theme: {theme === 'light' ? 'Light' : 'Dark'}</Text>
        <TouchableOpacity onPress={handleThemeChange}>
          <Text style={styles.themeToggle}>Toggle Theme</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Change this based on the theme
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D7C66', // Header color
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: '#0D7C66', // Icon color
    marginRight: 10,
  },
  settingText: {
    flex: 1,
    fontSize: 18,
    color: 'black', // Text color
  },
  languageOptions: {
    flexDirection: 'column',
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    elevation: 5,
    top: 40,
    left: 0,
  },
  languageOption: {
    fontSize: 16,
    color: 'black',
    paddingVertical: 5,
  },
  themeToggle: {
    fontSize: 16,
    color: '#0D7C66', // Theme toggle color
  },
});

export default Settings;