import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductPost from '../../components/productCard/ProductPost'; // Import the ProductPost component

// Image for the post
const imgebed = require('../../assets/images/bed.jpg');

// Profile screen where one post will be displayed
const Profile = () => {
  return (
    <SafeAreaView>
      <ScrollView style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>profile</Text>

        {/* Render a single product post */}
        {/* <ProductPost
          image={imgebed} // Image for the post
          title="King Size Bed"
          price="25000"
          postedTime="2 hours ago"
          description="A luxury king-size bed with a sturdy wooden frame and modern design."
          location="Galle, Sri Lanka"
          seller="Michael Johnson"
          condition="Used - Excellent"
        /> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
