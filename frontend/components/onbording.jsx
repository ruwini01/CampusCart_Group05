import React,{useState,useRef} from 'react';

import {View,Text,StyleSheet,FlatList,Animated} from 'react-native';

//import OnboardingItem from ''

export default Onboarding=()=>{
    const [currentIndex,setCurrentIndex]=useState(0);
    const scrollX=useRef(new Animated.Value(0)).current;

    return(
        <View style={styles.container}>

            <View style={{flex:3}}>
                
            <FlatList

            data={slides}
            renderItem={({item})=><OnboardingItem item={item} />}
            horizontal
            showsHorizontalScrollIndicator
            pagingEnabled
            bounces={false}
            keyExtractor={(item)=>item.id}
            onScroll={Animated.event([{nativeEvent:{contentOffset:{x:scrollX}}}],{
                useNativeDriver:false,
            })}
            
                scrollEventThrottle={32}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewConfig}
                ref={slidesRef}

            />

        </View>

        </View>
    )
}
