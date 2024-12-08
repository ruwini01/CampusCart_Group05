import { View, Text, Image } from 'react-native'
import React from 'react'
import {Tabs, Redirect} from 'expo-router'
import {icons} from '../../constants'

const TabIcon = ({icon, color, name, focused}) => {
    return (
        <View className='items-center justify-center gap-2 w-20 pt-3'>
            <Image
                source={icon}
                resizeMethod='contain'
                tintColor={color}
                className="w-5 h-5"
            />
            <Text className={`${focused? 'font-semibold' : 'font-normal'} text-xs`} style={{color:color}}>{name}</Text>
        </View>
    )
}

const TabsLayout = () => {
  return (
    <>
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#0D7C66',
                tabBarInactiveTintColor: '#B7B7B7',
                tabBarStyle:{
                    borderTopWidth:'0.2',
                    borderTopColor:'#0D7C66',
                    height:84,
                }
            }}
        >
            <Tabs.Screen
                name='home'
                options={{
                    title:'Home',
                    headerShown:false,
                    tabBarIcon: ({color, focused})=>(
                        <TabIcon
                            icon={icons.home}
                            color={color}
                            name="Home"
                            focused={focused}
                        />
                    )
                }}
            />

            <Tabs.Screen
                name='bookmark'
                options={{
                    title:'Bookmark',
                    headerShown:false,
                    tabBarIcon: ({color, focused})=>(
                        <TabIcon
                            icon={icons.bookmark}
                            color={color}
                            name="Bookmark"
                            focused={focused}
                        />
                    )
                }}
            />
 

            <Tabs.Screen
                name='notification'
                options={{
                    title:'Notification',
                    headerShown:true,
                    headerStyle:{
                        backgroundColor:'#0D7C66', 
                    },
                    headerTitle:'',
                    tabBarIcon: ({color, focused})=>(
                        <TabIcon
                            icon={icons.notification}
                            color={color}
                            name="Notification"
                            focused={focused}
                        />
                    )
                }}
            />


            <Tabs.Screen
                name='profile'
                options={{
                    title:'Profile',
                    headerShown:false,
                    tabBarIcon: ({color, focused})=>(
                        <TabIcon
                            icon={icons.profile}
                            color={color}
                            name="Profile"
                            focused={focused}
                        />
                    )
                }}
            />
        </Tabs>
    </>
  )
}

export default TabsLayout