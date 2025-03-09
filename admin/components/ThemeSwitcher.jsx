// components/ThemeSwitcher.jsx
import React, { useState } from 'react';
import { View, Text, Modal, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { icons } from '../constants'; // Ensure you have the correct path to your icons


const ThemeSwitcher = () => {
  const [selectedTheme, setSelectedTheme] = useState('Light'); // Default theme
  const [modalVisible, setModalVisible] = useState(false);

  const themes = [
    { name: 'Light' },
    { name: 'Dark' },
  ];

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme.name);
    setModalVisible(false);
    // Here you can also call your backend API to switch the theme
    // For example: fetch('/api/setTheme', { method: 'POST', body: JSON.stringify({ theme: theme.name }) });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.themeButton}>
      <Image source={icons.theme} style={styles.icon} 
          className='w-10 h-10 mr-1'
          resizeMethod='contain'
          tintColor='#1d816ddc' />
        <Text style={styles.linkText}>Theme: {selectedTheme}</Text>
      </TouchableOpacity>

      {/* Modal for theme selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Theme</Text>
            <FlatList
              data={themes}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleThemeChange(item)}
                  style={styles.themeOption}
                >
                  <Text style={styles.themeLabel}>{item.name}</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  linkText: {
    fontSize: 16,
    color: '#0D7C66', // Color for the hyperlink
    marginRight: 5, // Space between text and icon
  },
  icon: {
    width: 30, // Set a fixed width for the icon
    height: 30, // Set a fixed height for the icon
    resizeMode: 'contain', // Ensure the icon maintains its aspect ratio
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
  themeOption: {
    padding: 10,
  },
  themeLabel: {
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

export default ThemeSwitcher;