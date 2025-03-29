import React,{useEffect,useState} from "react";
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../components/HomeScreen.js';
import OnboardingScreen from "../components/OnboardingScreen.js";

const Stack=createNativeStackNavigator();

export default function AppNavigation(){

    return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Onboarding'>
                <Stack.Screen name="Onboarding" options={{headerShown:false}} component={OnboardingScreen}/>
                <Stack.Screen name="Home" options={{headerShown:false}} component={HomeScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}