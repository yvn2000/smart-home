import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import React, { useEffect, useState } from "react";

import { navOptions } from './options';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Dimensions, View, Image, Text, Platform } from 'react-native';

import Sigma from "../screens/sigmaboy";
import ParentScreen from "../screens/stacktestparent";

import TabBar from "../components/tab-bar"

import { SampleStack, HomeStack, DevicesStack, StatisticsStack, SettingsStack, PetCustomStack, LoginStack } from "./stack";


const Tab = createBottomTabNavigator();


export const CentralTab = () => {

    const maxBarWidth = 800;

    const [windowDimensions, setWindowDimensions] = useState(Dimensions.get("window"));
    console.log("Width: " + windowDimensions.width + ", Height: " + windowDimensions.height)

    const tabBarWidth = Math.min(0.9*windowDimensions.width, maxBarWidth);
    const tabBarLeft = (windowDimensions.width - tabBarWidth) / 2;

    useEffect(() => {
        const handleResize = () => {
          setWindowDimensions(Dimensions.get("window"));
        };
    
        Dimensions.addEventListener("change", handleResize);        //checks if size changed
        
        return () => {
          Dimensions.removeEventListener("change", handleResize);       //cleanup
        };
      }, []);
    

    return (

        <Tab.Navigator
            tabBar={(props) => <TabBar {...props}  />}
            screenOptions={({ route }) => ({
                headerShown:false,
                animation:'shift'
            })}
        >   
            
            <Tab.Screen name="HomeStack" options={{title: 'Home'}} component={HomeStack}/>
            <Tab.Screen name="StatisticsStack" options={{title: 'Statistics'}} component={StatisticsStack}/>
            <Tab.Screen name="DevicesStack" options={{title: 'Devices'}} component={DevicesStack}/>
            <Tab.Screen name="CustomStack" options={{title: 'Pet'}} component={PetCustomStack}/>
            <Tab.Screen name="SettingsStack" options={{title: 'Settings'}} component={SettingsStack}/>

        </Tab.Navigator>

        /*
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,         //show 'home' next to home icon
                //tabBarAccessibilityLabel: "yeah",
                tabBarLabelPosition: 'below-icon',
                tabBarStyle: {
                    backgroundColor: 'rgba(233, 233, 233, 0.9)',
                    //borderWidth: 5,
                    //borderColor:'red',
                    borderRadius: 75,
                    height:80,
                    //width: '90%',
                    width: Platform.OS=='web' ? tabBarWidth : '90%',
                    maxWidth: maxBarWidth,

                    //Positioning
                    justifyContent: 'center', // Center content vertically
                    //alignItems: 'center', // Center content horizontally
                    position:'absolute',
                    //left: '30%',
                    //left: lefty,
                    left: Platform.OS=='web' ? tabBarLeft : '10%',
                    alignSelf:'center',
                    bottom: '5%',
                    elevation: 0,

                    //shadow
                    shadowColor: '#7F5Df0',
                    shadowOffset: {
                        width: 0,
                        height: 10,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.5,
                    elevation: 5,

                },
                tabBarActiveTintColor: 'rgba(75, 219, 255, 0.9)',
                //tabBarActiveBackgroundColor: 'rgba(150, 220, 231, 0.36)',
                
                //tabBarInactiveTintColor: "red",


                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    if (route.name === 'SampleStack') {
                        iconName = focused ? 'male-female' : 'male-female-outline'
                    }
                    else if (route.name === 'SigmaScreen') {
                        iconName = focused ? 'accessibility' : 'accessibility-outline'
                    }
                    else if (route.name === 'HomeStack') {
                        iconName = focused ? 'home' : 'home-outline'
                    }
                    else if (route.name === 'EnergyStack') {
                        iconName = focused ? 'flash' : 'flash-outline'
                    }
                    else if (route.name === 'DevicesStack') {
                        iconName = focused ? 'desktop' : 'desktop-outline'
                    }
                    else if (route.name === 'CustomStack') {
                        iconName = focused ? 'color-palette' : 'color-palette-outline'
                    }
                    else if (route.name === 'SettingsStack') {
                        iconName = focused ? 'settings' : 'settings-outline'
                    }

                    return <Ionicons name={iconName} size={focused ? (3.2/100)*windowDimensions.height : (2.8/100)*windowDimensions.height} color={color} />
                },
                tabBarIconStyle: {
                    top:'25%'
                },
                tabBarLabelStyle: {
                    top:'25%'
                },
            })}
            
        >
            
            <Tab.Screen name="SampleStack" component={SampleStack} options={{title: 'Sample'}}/>



            <Tab.Screen name="SigmaScreen" options={{title: 'SigmaBoy'}} component={Sigma}/>
            <Tab.Screen name="HomeStack" options={{title: 'Home'}} component={SettingsStack}/>
            <Tab.Screen name="EnergyStack" options={{title: 'Statistics'}} component={SettingsStack}/>
            <Tab.Screen name="DevicesStack" options={{title: 'Devices'}} component={SettingsStack}/>
            <Tab.Screen name="CustomStack" options={{title: 'Customize'}} component={SettingsStack}/>
            <Tab.Screen name="SettingsStack" options={{title: 'Settings'}} component={SettingsStack}/>
        </Tab.Navigator>

        */
    )


}







