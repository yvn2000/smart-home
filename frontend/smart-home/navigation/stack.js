import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navOptions } from './options';
import { useNavigation, useRoute } from "@react-navigation/native";

import { CentralTab } from "./tabs";

import LoginScreen from "../screens/login-screen";
import Sample from "../screens/sample";
import Home from "../screens/home-screen";
import SettingsScreen from "../screens/settings";
import DevicesScreen from "../screens/devices-screen";
import DevicesAdd from "../screens/device-add-screen";
import DeviceDetail from "../screens/device-detail-screen";
import PetCustomScreen from "../screens/pet-custom-screen";
import StatisticsScreen from "../screens/statistics";
import DeviceStatisticsScreen from "../screens/statistics-device";

import Login from "../components/login/login";
import Register from "../components/login/register";
import Forgot from "../components/login/forgot";
import Guest from "../components/login/guest";

import 'react-native-gesture-handler';    //important for some reason


const Stack = createStackNavigator();
const StackLogin = createStackNavigator();


export const LoginStack = () => {

    const navigation = useNavigation()

    return (
        
        <StackLogin.Navigator
            //screenOptions={()=> navOptions(navigation)}
            screenOptions={{headerShown: false, cardStyle: { backgroundColor: 'transparent' }, animation:'slide_from_right' }}
        >   
            
            <StackLogin.Screen name="Login" component={Login}/>
            <StackLogin.Screen name="Register" component={Register}/>
            <Stack.Screen name="Forgot" component={Forgot}/>
            <Stack.Screen name="Guest" component={Guest}/>
            
        </StackLogin.Navigator>
        
        
    )
}


export const MainStack = () => {

    const navigation = useNavigation()

    return (
        <Stack.Navigator
            //screenOptions={()=> navOptions(navigation)}
            screenOptions={{headerShown: false, animation:'fade' }}
        >   
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="Main" component={CentralTab} />
        </Stack.Navigator>
    )

}




export const SampleStack = () => {

    const navigation = useNavigation()

    return (
        <Stack.Navigator
            screenOptions={()=> navOptions(navigation)}
        >   
            <Stack.Screen name="Sample" component={Sample}/>
        </Stack.Navigator>
    )

}

export const HomeStack = () => {

    const navigation = useNavigation()

    return (
        <Stack.Navigator
            //screenOptions={()=> navOptions(navigation)}
            screenOptions={{headerShown: false, }}
        >
            <Stack.Screen name="Home" component={Home}/>
        </Stack.Navigator>
    )

}

export const DevicesStack = () => {

    const navigation = useNavigation()

    return (
        <Stack.Navigator
            //screenOptions={()=> navOptions(navigation)}
            screenOptions={{headerShown: false, animation:'slide_from_right' }}
        >
            <Stack.Screen name="Devices" component={DevicesScreen}/>
            <Stack.Screen name="Device-Add" component={DevicesAdd} options={{animation:'slide_from_bottom'}} />
            <Stack.Screen name="DeviceDetail" component={DeviceDetail} 
                //options={{ headerShown: true }}
            />
        </Stack.Navigator>
    )

}

export const StatisticsStack = () => {

    const navigation = useNavigation()

    return (
        <Stack.Navigator
            //screenOptions={()=> navOptions(navigation)}
            screenOptions={{headerShown: false, animation:'slide_from_right' }}
        >
            <Stack.Screen name="Statistics" component={StatisticsScreen}/>
            <Stack.Screen name="DeviceStatistics" component={DeviceStatisticsScreen}/>
        </Stack.Navigator>
    )

}

export const SettingsStack = () => {

    const navigation = useNavigation()

    return (
        <Stack.Navigator
            screenOptions={()=> navOptions(navigation)}
        >
            <Stack.Screen name="Settings" component={SettingsScreen}/>
            <Stack.Screen name="Sample" component={Sample}/>
        </Stack.Navigator>
    )

}

export const PetCustomStack = () => {

    const navigation = useNavigation()

    return (
        <Stack.Navigator
            //screenOptions={()=> navOptions(navigation)}
            screenOptions={{headerShown: false, }}
        >
            <Stack.Screen name="Pet-Custom" component={PetCustomScreen}/>
        </Stack.Navigator>
    )

}



/*

export const HomeStack = () => {

    const navigation = useNavigation()

    return (
        <Stack.Navigator
            screenOptions={()=> navOptions(navigation)}
        >
            
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


*/




