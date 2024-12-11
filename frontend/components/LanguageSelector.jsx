// components/LanguageSelector.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { icons } from '../constants'; // Ensure you have the correct path to your icons

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English'); // Default language

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    // Add more languages as needed
  ];

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language.label);
    // Here you can also call your backend API to switch the language
    // For example: fetch('/api/setLanguage', { method: 'POST', body: JSON.stringify({ language: language.code }) });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.languageText}>Language</Text>
      <Image source={icons.language} style={styles.icon} />
      <View style={styles.languageOptions}>
        {languages.map((language) => (
          <TouchableOpacity
            key={language.code}
            onPress={() => handleLanguageChange(language)}
            style={styles.languageButton}
          >
            <Text style={styles.languageLabel}>{language.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.selectedLanguage}>Selected: {selectedLanguage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  languageText: {
    fontSize: 16,
    marginRight: 5,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  languageOptions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  languageButton: {
    marginHorizontal: 5,
  },
  languageLabel: {
    fontSize: 14,
  },
  selectedLanguage: {
    marginTop: 5,
    fontSize: 12,
    color: 'gray',
  },
});

export default LanguageSelector;