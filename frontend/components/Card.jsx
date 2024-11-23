import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity,
  Pressable 
} from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledImage = styled(Image)
const StyledPressable = styled(Pressable)

const Card = ({ title, price, image, postedTime, onTrackPress, onCardPress }) => {
  return (
    <StyledPressable 
      className="bg-white rounded-3xl shadow-lg m-4 overflow-hidden"
      onPress={onCardPress}
    >
      {/* Product Image */}
      <StyledImage
        source={image}
        className="w-full h-48 rounded-t-3xl"
        resizeMode="cover"
      />

      {/* Product Details */}
      <StyledView className="p-4">
        {/* Title and Price */}
        <StyledView className="space-y-1">
          <StyledText className="text-2xl text-gray-800 font-medium">
            {title}
          </StyledText>
          <StyledText className="text-xl text-gray-800 font-semibold">
            Rs.{price}
          </StyledText>
        </StyledView>

        {/* Track Button and Posted Time */}
        <StyledView className="flex-row justify-between items-center mt-4">
          <TouchableOpacity onPress={onTrackPress}>
            <StyledText className="text-emerald-600 text-lg font-semibold">
              Track
            </StyledText>
          </TouchableOpacity>
          
          <StyledText className="text-gray-400">
            {postedTime}
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledPressable>
  );
};

// Usage Example Component
const ExampleUsage = () => {
  const handleTrack = () => {
    console.log('Track button pressed');
  };

  const handleCardPress = () => {
    console.log('Card pressed');
  };

  return (
    <Card
      title="Double Bed Set"
      price="5000"
      image={require('./assets/bed-image.jpg')} // Make sure to replace with your actual image path
      postedTime="3 days ago"
      onTrackPress={handleTrack}
      onCardPress={handleCardPress}
    />
  );
};

export default Card;