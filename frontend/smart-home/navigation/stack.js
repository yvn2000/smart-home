import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navOptions } from './options';
import { useNavigation, useRoute } from "@react-navigation/native";

import { CentralTab } from "./tabs";

import LoginScreen from "../screens/login-screen";
import Sample from "../screens/sample";
import Home from "../screens/home-screen";
import Tutorial from "../screens/tutorial";
import SettingsScreen from "../screens/settings";
import SettingsItemScreen from "../screens/settings-item";
import UserDeleteScreen from "../screens/user-delete";

import DevicesScreen from "../screens/devices-screen";
import RoomAdd from "../screens/room-add-screen";
import RoomDelete from "../screens/room-delete-screen";
import DevicesAdd from "../screens/device-add-screen";
import DeviceDetail from "../screens/device-detail-screen";
import DeviceAuto from "../screens/device-auto";
import RoomAuto from "../screens/room-auto";

import PetCustomScreen from "../screens/pet-custom-screen";

import StatisticsScreen from "../screens/statistics";
import DeviceStatisticsScreen from "../screens/statistics-device";
import ShareStatsScreen from "../screens/share";
import DailySummaryScreen from "../screens/daily-summary-screen";

import LoginMain from "../components/login/login-main"
import Login from "../components/login/login";
import Register from "../components/login/register";
import Forgot from "../components/login/forgot";
import Guest from "../components/login/guest";
import Houses from "../components/login/houses";

import 'react-native-gesture-handler';    //important for some reason


const Stack = createStackNavigator();


export const LoginStack = () => {

    const navigation = useNavigation()

    return (
        
        <Stack.Navigator
            //screenOptions={()=> navOptions(navigation)}
            screenOptions={{headerShown: false, cardStyle: { backgroundColor: 'transparent' }, animation:'slide_from_right' }}
        >   
            
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="Register" component={Register}/>
            <Stack.Screen name="Forgot" component={Forgot}/>
            {/*<Stack.Screen name="Guest" component={Guest}/>*/}
            <Stack.Screen name="Houses" component={Houses}/>
            
        </Stack.Navigator>
        
        
    )
}

export const LoginMainStack = () => {
    const navigation = useNavigation()

    return (
        <Stack.Navigator
            //screenOptions={()=> navOptions(navigation)}
            screenOptions={{headerShown: false, animation:'fade' }}
        >   
            <Stack.Screen name="LoginMain" component={LoginMain}/>
            <Stack.Screen name="Guest" component={Guest}/>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
        </Stack.Navigator>
    )
}


export const MainStack = () => {

    const navigation = useNavigation()

    return (
        <Stack.Navigator
            //screenOptions={()=> navOptions(navigation)}
            screenOptions={{headerShown: false, animation:'fade' }}
        >   
            <Stack.Screen name="LoginMainStack" component={LoginMainStack} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="Tutorial" component={Tutorial} />
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
            <Stack.Screen name="Room-Add" component={RoomAdd} options={{animation:'slide_from_bottom'}} />
            <Stack.Screen name="Room-Delete" component={RoomDelete} options={{animation:'slide_from_bottom'}} />
            <Stack.Screen name="Device-Add" component={DevicesAdd} options={{animation:'slide_from_bottom'}} />
            <Stack.Screen name="DeviceDetail" component={DeviceDetail} 
                //options={{ headerShown: true }}
            />
            <Stack.Screen name="DeviceAuto" component={DeviceAuto} />
            <Stack.Screen name="RoomAuto" component={RoomAuto} />
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
            <Stack.Screen name="ShareStats" component={ShareStatsScreen}/>
            <Stack.Screen name="DailySummary" component={DailySummaryScreen}/>
        </Stack.Navigator>
    )

}

export const SettingsStack = () => {

    const navigation = useNavigation()

    return (
        <Stack.Navigator
            screenOptions={{headerShown: false, animation:'slide_from_right' }}
        >
            <Stack.Screen name="Settings" component={SettingsScreen}/>
            <Stack.Screen name="SettingsItem" component={SettingsItemScreen} />
            <Stack.Screen name="UserDelete" component={UserDeleteScreen} />
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




