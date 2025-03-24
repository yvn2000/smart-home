import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, PanResponder, Alert, ActivityIndicator

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import React, { useEffect, useState, useLayoutEffect, useRef } from "react";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

import Animated, {
    useSharedValue, useAnimatedStyle, withRepeat, withTiming,
    withDelay, withSpring, withSequence, Easing, useAnimatedProps,
    interpolate, Extrapolation
} from 'react-native-reanimated';

import VerticalSlider from "../vertical-slider";

import { useTheme } from "../themes/theme";
import { API_BASE_URL } from "../../src/config";


export default function FridgePanel({ device }) {     //width is percentage


    const { theme, toggleTheme } = useTheme()

    const [themeMode, setTheme] = useState(styles.lightMode)

    useEffect(() => {
        if (theme == 'dark') {
            setTheme(styles.darkMode)
        }
        else if (theme == 'light') {
            setTheme(styles.lightMode)
        }
        else if (theme == 'crazy') {
            setTheme(styles.crazyMode)
        }
    }, [theme])



    const [activityLog, setActivityLog] = useState([]);

    const apiUrl = `${API_BASE_URL}/api/device/${device.device_id}/get-activity/`
    // Function to fetch the current activity log when the component loads
    const fetchActivityLog = async () => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (response.ok) {
                setActivityLog(data.activity_log);
            } else {
                Alert.alert('Error', 'Failed to fetch activity log');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch activity log');
        }
    };

    const actionUrl = `${API_BASE_URL}/api/device/${device.device_id}/activity/add-action/`
    const addAction = async (action) => {
        try {
            const response = await fetch(actionUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });

            if (!response.ok) {
                Alert.alert('Error', 'Failed to add action');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to connect to server');
        }
    };

    useEffect(() => {
        // Fetch the activity log when the component mounts
        fetchActivityLog();
    }, []);


    if (Platform.OS!='web') {
        return (

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 50, paddingBottom:30 }}>
    
    
    
                <View style={[styles.shadow, { backgroundColor: theme=='dark' ? 'rgb(26, 28, 77)' : 'rgb(255,255,255)', borderRadius: 50, padding: 30, alignItems: 'center' }]}>
    
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: 'rgb(165, 165, 165)' }}>Temperature</Text>
    
                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', padding: 12, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}
                    >
    
                        {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                        <View style={{ marginLeft: 30, marginRight: 30, }}>
                            <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>3°C</Text>
    
                        </View>
    
                    </LinearGradient>
    
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 30, color: 'rgb(165, 165, 165)' }}>Drop Ice?</Text>
    
                    <TouchableOpacity onPress={() => { addAction("Dropped Ice") }}
                        style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30 }]}>
                        <LinearGradient colors={['rgb(216, 75, 255)', 'transparent']}
                            style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1, borderWidth: 4, borderColor: 'rgb(255, 3, 184)' }}
                        >
                            <MaterialCommunityIcons name="delete-variant" size={50} color="white"
                            />
                            {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                        </LinearGradient>
    
    
    
                    </TouchableOpacity>
    
    
    
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 30, color: 'rgb(165, 165, 165)' }}>Inventory Capacity</Text>
    
                    <View
                        style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30 }]}>
                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                            style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
                        >
    
                            {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                            <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 20, fontWeight: 'bold', color: 'white' }}>{"Half Full"}</Text>
                        </LinearGradient>
    
    
    
                    </View>
    
                </View>
    
    
            </View>
    
    
    
    
        );
    }



    return (

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 50 }}>



            <View style={[styles.shadow, { backgroundColor: theme=='dark' ? 'rgb(26, 28, 77)' : 'rgb(255,255,255)', borderRadius: 50, padding: 30, alignItems: 'center' }]}>

                <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, color: 'rgb(165, 165, 165)' }}>Temperature</Text>

                <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                    style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}
                >

                    {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                    <View style={{ marginLeft: 30, marginRight: 30, }}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>3°C</Text>

                    </View>

                </LinearGradient>

                <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, marginTop: 30, color: 'rgb(165, 165, 165)' }}>Drop Ice?</Text>

                <TouchableOpacity onPress={() => { addAction("Dropped Ice") }}
                    style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30 }]}>
                    <LinearGradient colors={['rgb(216, 75, 255)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1, borderWidth: 4, borderColor: 'rgb(255, 3, 184)' }}
                    >
                        <MaterialCommunityIcons name="delete-variant" size={70} color="white"
                        />
                        {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                    </LinearGradient>



                </TouchableOpacity>



                <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, marginTop: 30, color: 'rgb(165, 165, 165)' }}>Inventory Capacity</Text>

                <View
                    style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30 }]}>
                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
                    >

                        {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                        <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'white' }}>{"Half Full"}</Text>
                    </LinearGradient>



                </View>

            </View>


        </View>




    );
}



const styles = StyleSheet.create({
    testBorder: {
        borderColor: 'red',
        borderWidth: 3,
    },
    screen: {
        //padding: 20,
        height: '100%',
        width: '100%',
        //display:'none',
    },
    mainContainer: {
        alignItems: 'center',     //horizontal
        gap: 40,
        width: '100%',
    },

    shadow: {
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


    optionButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(216, 75, 255)',
        aspectRatio: 1,
        width: '40%',
        borderRadius: 30,
        shadowColor: '#7F5Df0',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },








    darkMode: {
        backgroundColor: "#4A4A4A",
    },
    lightMode: {
        backgroundColor: "rgb(245, 238, 246)",
    },
    crazyMode: {
        backgroundColor: 'rgba(216, 83, 196, 0)'
    }
});
