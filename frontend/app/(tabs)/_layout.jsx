import { View, Text } from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router'

const TabsLayout = () => {
    return (
        <>
            <Tabs>
                <Tabs.Screen
                    name='home'
                    options={{
                        title: 'Home',
                        headerShown: false
                    }}
                />

                <Tabs.Screen
                    name='savedItems'
                    options={{
                        title: 'Saved',
                        headerShown: false
                    }}
                />


                <Tabs.Screen
                    name='notification'
                    options={{
                        title: 'Notification',
                        headerShown: false
                    }}
                />


                <Tabs.Screen
                    name='profile'
                    options={{
                        title: 'Profile',
                        headerShown: false
                    }}
                />
            </Tabs>
        </>
    )
}

export default TabsLayout