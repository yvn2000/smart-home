import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, PanResponder

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
import HorizontalSlider from "../horizontal-slider";

import { useTheme } from "../themes/theme";
import { API_BASE_URL } from "../../src/config";


export default function OvenPanel({device}) {

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


    const [modeStates, setModeStates] = useState({
        "Preheat": true,
        "Roast": false,
        "Bake": false,
        "Broil": false,
    })
    const modeOptions = ["Preheat", "Roast", "Bake", "Broil"];

    const [mode, setMode] = useState("Preheat");


    const newMode = () => {
        const nextMode = getNextItem(modeOptions, mode);

        setModeStates((prev) => ({
            ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
            [nextMode]: true,
        }));

        setMode(nextMode);
    };


    const getNextItem = (options, currentItem) => {
        const currentIndex = options.indexOf(currentItem);
        const nextIndex = (currentIndex + 1) % options.length;
        return options[nextIndex];
    };

    const [minutes, setMinutes] = useState("00")
    const [seconds, setSeconds] = useState("00")

    const updateMinutes = (value) => {
        const currentMin = parseInt(minutes)
        var newMin = currentMin + value
        if (newMin < 0) {
            newMin = 0
        }
        else if (newMin > 60) {
            newMin = 60
        }
        var stringMin = (newMin < 10) ? ("0" + newMin.toString()) : (newMin.toString())
        setMinutes(stringMin)
    }

    const updateSeconds = (value) => {
        const currentSec = parseInt(seconds)
        var newSec = currentSec + value
        if (newSec < 0) {
            if (minutes == "00") {
                newSec = 0
            }
            else {
                updateMinutes(-1)
                newSec = 59
            }
        }
        else if (newSec > 59) {
            updateMinutes(1)
            newSec = 0
        }
        else if (minutes == "60" && value > 0) {
            newSec = 0
        }
        var stringSec = (newSec < 10) ? ("0" + newSec.toString()) : (newSec.toString())
        setSeconds(stringSec)
    }


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
                //Alert.alert('Error', 'Failed to fetch activity log');
            }
        } catch (error) {
            //Alert.alert('Error', 'Failed to fetch activity log');
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
                //Alert.alert('Error', 'Failed to add action');
            }
        } catch (error) {
            //Alert.alert('Error', 'Failed to connect to server');
        }
    };

    useEffect(() => {
        // Fetch the activity log when the component mounts
        fetchActivityLog();
    }, []);












    if (Platform.OS != 'web') {
        return (

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 50, paddingBottom: 35 }}>



                <View style={[styles.shadow, { backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255,255,255)', borderRadius: 50, padding: 30, alignItems: 'center', width: '90%' }]}>

                    <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 10, color: 'rgb(165, 165, 165)' }}>Temperature</Text>

                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', padding: 10, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}
                    >

                        {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                        <View style={{ marginLeft: 30, marginRight: 30, }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>140°C</Text>

                        </View>

                    </LinearGradient>

                    <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 10, marginTop: 20, color: 'rgb(165, 165, 165)' }}>------------------</Text>

                    <View style={{ flexDirection: 'row', gap: 20 }}>

                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 10, marginTop: 10, color: 'rgb(165, 165, 165)' }}>Timer</Text>

                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginLeft: 20, marginRight: 20 }}>

                                <View style={{ alignItems: 'center' }}>

                                    <TouchableOpacity onPress={() => { updateMinutes(1) }}>
                                        <MaterialCommunityIcons name="plus" size={20} color="'rgb(255, 3, 184)'" />
                                    </TouchableOpacity>

                                    <View style={[{ alignItems: 'center', justifyContent: 'center', padding: 5 }]}>
                                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'rgb(165, 165, 165)' }}>
                                            {minutes}
                                        </Text>
                                    </View>

                                    <TouchableOpacity onPress={() => { updateMinutes(-1) }}>
                                        <MaterialCommunityIcons name="minus" size={20} color="'rgb(255, 3, 184)'" />
                                    </TouchableOpacity>

                                </View>

                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'rgb(165, 165, 165)' }}>
                                    :
                                </Text>

                                <View style={{ alignItems: 'center' }}>

                                    <TouchableOpacity onPress={() => { updateSeconds(1) }}>
                                        <MaterialCommunityIcons name="plus" size={20} color="'rgb(255, 3, 184)'" />
                                    </TouchableOpacity>

                                    <View style={[{ alignItems: 'center', justifyContent: 'center', padding: 5 }]}>
                                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'rgb(165, 165, 165)' }}>
                                            {seconds}
                                        </Text>
                                    </View>

                                    <TouchableOpacity onPress={() => { updateSeconds(-1) }}>
                                        <MaterialCommunityIcons name="minus" size={20} color="'rgb(255, 3, 184)'" />
                                    </TouchableOpacity>

                                </View>

                            </View>
                        </View>


                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 10, marginTop: 10, color: 'rgb(165, 165, 165)' }}>Mode</Text>

                            <TouchableOpacity onPress={() => { newMode() }}
                                style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: theme == 'dark' ? 'rgb(42, 45, 125)' : 'rgb(255,255,255)', borderRadius: 30 }]}>
                                <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                    style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                                >
                                    <MaterialCommunityIcons name="waves" size={40} color="white"
                                    />
                                    {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                                </LinearGradient>

                                <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 20, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>{mode}</Text>

                            </TouchableOpacity>


                        </View>
                    </View>

                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', marginTop: 20, padding: 18, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}
                    >

                        {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                        <TouchableOpacity style={{ marginLeft: 30, marginRight: 30, }}>
                            <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>Start</Text>

                        </TouchableOpacity>

                    </LinearGradient>





                </View>


            </View>




        );
    }




    return (

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 50 }}>



            <View style={[styles.shadow, { backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255,255,255)', borderRadius: 50, padding: 30, alignItems: 'center' }]}>

                <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, color: 'rgb(165, 165, 165)' }}>Temperature</Text>

                <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                    style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', padding: 18, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}
                >

                    {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                    <View style={{ marginLeft: 30, marginRight: 30, }}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>140°C</Text>

                    </View>

                </LinearGradient>

                <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, marginTop: 20, color: 'rgb(165, 165, 165)' }}>------------------</Text>

                <View style={{ flexDirection: 'row', gap: 40 }}>

                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, marginTop: 10, color: 'rgb(165, 165, 165)' }}>Timer</Text>

                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginLeft: 20, marginRight: 20 }}>

                            <View style={{ alignItems: 'center' }}>

                                <TouchableOpacity onPress={() => { updateMinutes(1) }}>
                                    <MaterialCommunityIcons name="plus" size={40} color="'rgb(255, 3, 184)'" />
                                </TouchableOpacity>

                                <View style={[{ alignItems: 'center', justifyContent: 'center', padding: 5 }]}>
                                    <Text style={{ fontSize: 35, fontWeight: 'bold', color: 'rgb(165, 165, 165)' }}>
                                        {minutes}
                                    </Text>
                                </View>

                                <TouchableOpacity onPress={() => { updateMinutes(-1) }}>
                                    <MaterialCommunityIcons name="minus" size={40} color="'rgb(255, 3, 184)'" />
                                </TouchableOpacity>

                            </View>

                            <Text style={{ fontSize: 35, fontWeight: 'bold', color: 'rgb(165, 165, 165)' }}>
                                :
                            </Text>

                            <View style={{ alignItems: 'center' }}>

                                <TouchableOpacity onPress={() => { updateSeconds(1) }}>
                                    <MaterialCommunityIcons name="plus" size={40} color="'rgb(255, 3, 184)'" />
                                </TouchableOpacity>

                                <View style={[{ alignItems: 'center', justifyContent: 'center', padding: 5 }]}>
                                    <Text style={{ fontSize: 35, fontWeight: 'bold', color: 'rgb(165, 165, 165)' }}>
                                        {seconds}
                                    </Text>
                                </View>

                                <TouchableOpacity onPress={() => { updateSeconds(-1) }}>
                                    <MaterialCommunityIcons name="minus" size={40} color="'rgb(255, 3, 184)'" />
                                </TouchableOpacity>

                            </View>

                        </View>
                    </View>


                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, marginTop: 10, color: 'rgb(165, 165, 165)' }}>Mode</Text>

                        <TouchableOpacity onPress={() => { newMode(); }}
                            style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: theme == 'dark' ? 'rgb(42, 45, 125)' : 'rgb(255,255,255)', borderRadius: 30 }]}>
                            <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                            >
                                <MaterialCommunityIcons name="waves" size={70} color="white"
                                />
                                {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                            </LinearGradient>

                            <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>{mode}</Text>

                        </TouchableOpacity>


                    </View>
                </View>

                <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                    style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', marginTop: 20, padding: 18, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}
                >

                    {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                    <TouchableOpacity 
                        onPress={()=> {
                            addAction("Started")
                        }}
                        style={{ marginLeft: 30, marginRight: 30, }}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>Start</Text>

                    </TouchableOpacity>

                </LinearGradient>





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
