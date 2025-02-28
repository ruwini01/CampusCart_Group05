import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'react-native';
import { useRouter, useNavigation, Redirect } from 'expo-router'; 
import { useGlobalContext } from '../context/GlobalProvider';

const Index = () => {
    const { isLoading, isLogged } = useGlobalContext();
    const router = useRouter();
    const navigation = useNavigation();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            const startRedirectTimer = () => {
                const timer = setTimeout(() => {
                    setShowSplash(false);
                    if (isLogged) {
                        router.push('/(tabs)/home');
                    } else {
                        router.push('/(auth)/login');
                    }
                }, 1500);
                return timer;
            };

            let timer = startRedirectTimer();
            const unsubscribe = navigation.addListener('focus', () => {
                setShowSplash(true);
                clearTimeout(timer);
                timer = startRedirectTimer();
            });

            return () => {
                clearTimeout(timer);
                unsubscribe();
            };
        }
    }, [isLoading, isLogged, router, navigation]);

    if (isLoading) {
        return null;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0D7C66' }}>
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View className='bg-[#0D7C66] w-full items-center justify-center h-full px-4'>
                    <Image
                        source={require('../assets/images/logo.png')}
                        style={{ width: 250, height: 250 }}
                        transition={1000}
                    />
                </View>
            </ScrollView>
            <StatusBar backgroundColor='#0D7C66' style='light' />
        </SafeAreaView>
    );
};

export default Index;