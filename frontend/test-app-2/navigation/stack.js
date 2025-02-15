import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/home-screen';
import EventDetailScreen from '../screens/event-detail-screen';
import ProfilesScreen from '../screens/profiles/profiles-screen';
import PetTestScreen2 from '../screens/catanim2';
import ProfileDetailScreen from '../screens/profiles/profile-detail-screen';
import SettingsScreen from '../screens/settings-screen';
import { navOptions } from './options';
import { useNavigation, useRoute } from "@react-navigation/native";

import { HomeTabs } from './tabs';


const Stack = createStackNavigator();


export const HomeStack = () => {

    const navigation = useNavigation()

    return (
        <Stack.Navigator
            screenOptions={()=> navOptions(navigation)}
        >
            {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
            <Stack.Screen name="Home" component={HomeTabs}/>
            <Stack.Screen name="Event" component={EventDetailScreen} />
        </Stack.Navigator>
    )

}

export const ProfileStack = () => {

    const navigation = useNavigation()

    return (
        <Stack.Navigator
            screenOptions={()=> navOptions(navigation)}
        >
            <Stack.Screen name="Profiles" component={ProfilesScreen} />
            <Stack.Screen name="Profile" component={ProfileDetailScreen} />
        </Stack.Navigator>
    )

}

export const PetTestStack2 = () => {

    const navigation = useNavigation()

    return (
        <Stack.Navigator
            screenOptions={()=> navOptions(navigation)}
        >
            <Stack.Screen name="PetTest2" component={PetTestScreen2} />
        </Stack.Navigator>
    )

}

export const SettingsStack = () => {

    const navigation = useNavigation()

    return (
        <Stack.Navigator
            screenOptions={()=> navOptions(navigation)}
        >
            <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
    )

}







