// components/LanguageSelector.jsx
import { View, Image, Modal, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { icons } from '../constants'; // Ensure you have the correct path to your icons
import {  Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English'); // Default language
  const [modalVisible, setModalVisible] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'sinhala', label: 'Sinhala' },
    { code: 'tamil', label: 'Tamil' },
  ];

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language.label);
    setModalVisible(false);
    // Here you can also call your backend API to switch the language
    // For example: fetch('/api/setLanguage', { method: 'POST', body: JSON.stringify({ language: language.code }) });
  };

  return (
    
        <View className="mx-6">
        
        <View>
        <View className='flex-row items-center'>
        <Image
          source={icons.language}
          className='w-8 h-8 mr-1'
          resizeMethod='contain'
          tintColor='#1d816ddc'
        />
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.linkText}>Language: {selectedLanguage}</Text>
      </TouchableOpacity>

      {/* Modal for language selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleLanguageChange(item)}
                  style={styles.languageOption}
                >
                  <Text style={styles.languageLabel}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </View>
        </View>
        
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  linkText: {
    fontSize: 16,
    color: '#0D7C66', // Color for the hyperlink
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  languageOption: {
    padding: 10,
  },
  languageLabel: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#0D7C66',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LanguageSelector;