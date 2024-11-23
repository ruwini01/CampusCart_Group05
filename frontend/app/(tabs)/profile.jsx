import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Card from '../../components/Card'


const Profile = () => {
  return (
    <>
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>Profile</Text>
            

{/* Inside your screen component: */}

<Card
  title="Double Bed Set"
  price="5000"
  image={require('../../assets/images/your-bed-image.jpg')}
  
  postedTime="3 days ago"
  onTrackPress={() => {
    // Handle track button press
    console.log('Track pressed');
  }}
  onCardPress={() => {
    // Handle card press
    console.log('Card pressed');
  }}
/>

        </View>
      </ScrollView>
    </SafeAreaView>
    </>
    
  )
}


export default Profile