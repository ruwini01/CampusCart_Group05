import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductPost from '../../components/productCard/ProductPost';

const imgebed = require('../../assets/images/bed.jpg'); // Use require for images

const Profile = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>Profile</Text>

          {/* For viewing a post */}
          <ProductPost
            image={imgebed} // Use the correct variable name
            title="King Size Bed"
            price="25000"
            postedTime="2 hours ago"
            description="A luxury king-size bed with a sturdy wooden frame and modern design."
            location="Galle, Sri Lanka"
            seller="Michael Johnson"
            condition="Used - Excellent"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
