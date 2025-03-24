import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import React, { useEffect, useState } from "react";

import { navOptions } from './options';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Dimensions, View, Image, Text, Platform, ActivityIndicator } from 'react-native';

import Sigma from "../screens/sigmaboy";
import ParentScreen from "../screens/stacktestparent";

import TabBar from "../components/tab-bar"

import { SampleStack, HomeStack, DevicesStack, StatisticsStack, SettingsStack, PetCustomStack, LoginStack } from "./stack";


import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "../src/config";


const Tab = createBottomTabNavigator();


export const CentralTab = ( {/*statsAccess, deviceAccess, petAccess*/} ) => {

    const route = useRoute(); // Get the current route object
    const { statsAccess, deviceAccess, petAccess } = route.params || {}; // Extract params safely

    //console.log("Stats: " + statsAccess);
    //console.log("Device: " + deviceAccess);
    //console.log("Pet: " + petAccess);


    const maxBarWidth = 800;

    const [windowDimensions, setWindowDimensions] = useState(Dimensions.get("window"));
    console.log("Width: " + windowDimensions.width + ", Height: " + windowDimensions.height)

    const tabBarWidth = Math.min(0.9 * windowDimensions.width, maxBarWidth);
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
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={({ route }) => ({
                headerShown: false,
                animation: 'shift'
            })}
        >

            <Tab.Screen name="HomeStack" options={{ title: 'Home' }} component={HomeStack}  />
            {statsAccess && <Tab.Screen name="StatisticsStack" options={{ title: 'Statistics' }} component={StatisticsStack} />}
            {deviceAccess && <Tab.Screen name="DevicesStack" options={{ title: 'Devices' }} component={DevicesStack} />}
            {petAccess && <Tab.Screen name="CustomStack" options={{ title: 'Pet' }} component={PetCustomStack} />}
            <Tab.Screen name="SettingsStack" options={{ title: 'Settings' }} component={SettingsStack} />

        </Tab.Navigator>

        
    )


}







