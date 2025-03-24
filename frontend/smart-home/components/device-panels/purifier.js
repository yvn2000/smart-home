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

import { useTheme } from "../themes/theme";
import { API_BASE_URL } from "../../src/config";


export default function PurifierPanel({ device }) {     //width is percentage

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


    const [fanStates, setFan] = useState({
        "High": false,
        "Medium": false,
        "Low": false,
        "Auto": false,
    })

    const [filterStates, setFilterStates] = useState({
        "Optimal": true,
        "Moderate": false,
        "Clogged": false,
        "Blocked": false,
    })


    const fanOptions = ["High", "Medium", "Low", "Auto"];

    const [prevFan, setPrevFan] = useState("Auto");
    const [filter, setFilter] = useState("Optimal");
    const [clog, setClog] = useState(78);

    const getNextItem = (options, currentItem) => {
        const currentIndex = options.indexOf(currentItem);
        const nextIndex = (currentIndex + 1) % options.length;
        return options[nextIndex];
    };

    const newFan = () => {
        const nextFan = getNextItem(fanOptions, prevFan);

        setFan((prev) => ({
            ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
            [nextFan]: true,
        }));

        setPrevFan(nextFan);
    };

    const checkFilter = () => {
        if (clog >= 80) {
            setFilter("Optimal")
        }
        else if (clog < 80 && clog >= 50) {
            setFilter("Moderate")
        }
        else if (clog < 50 && clog >= 15) {
            setFilter("Clogged")
        }
        else if (clog < 15) {
            setFilter("Blocked")
        }
    }

    useEffect(() => {
        checkFilter()
    }, [clog])



    const [deviceInfo, setDeviceInfo] = useState({});
    const [loading, setLoading] = useState(true); // Track loading state

    const fetchDeviceInfo = async () => {
        try {
            const response = await fetch(
                //getDeviceInfoURLS()
                `${API_BASE_URL}/api/device/${device.device_id}/get_device_info/`
            );

            const data = await response.json();
            //console.log(data)
            if (response.ok) {
                setDeviceInfo(data); // Update state with fetched device information
                //console.log(deviceInfo)
            } else {
                //Alert.alert("Error", "Failed to fetch device information");
            }
        } catch (error) {
            //Alert.alert("Error", "Network request failed");
        } finally {
            setLoading(false); // Stop the loading indicator once the fetch is complete
        }
    };


    useEffect(() => {
        fetchDeviceInfo();
    }, [device.device_id]); // Fetch whenever device_id changes


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



    const updateUrl = `${API_BASE_URL}/api/device/${device.device_id}/update_device_info/`

    const updateDeviceInfo = async () => {
        //console.log("update TV")
        // Validate inputs
        if (!prevFan) {
            //Alert.alert('Error', 'All fields are required');
            return;
        }

        try {
            const response = await fetch(updateUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fan_speed: prevFan,
                }),
            });

            //console.log("Values Updated: " + bright + "" + input)

            const data = await response.json();

            if (response.ok) {
                //Alert.alert('Success', 'Television updated successfully');
                // You can reset the form or handle additional UI logic here
            } else {
                //Alert.alert('Error', 'Failed to update television');
            }
        } catch (error) {
            //Alert.alert('Error', 'Failed to update television');
        }
    };


    useEffect(() => {
        updateDeviceInfo();
    }, [prevFan]);






    useEffect(() => {
        if (deviceInfo.data) {
            //console.log(deviceInfo)
            setPrevFan(deviceInfo.data.fan_speed)
        }
    }, [deviceInfo, device.device_id, deviceInfo.data])






    if (Platform.OS != 'web') {
        return (

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 50, width: '100%', top: -30 }}>



                <View style={[{ borderRadius: 50, padding: 30, alignItems: 'center', width: '90%' }]}>

                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'rgb(165, 165, 165)' }}>Air Quality</Text>

                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}
                    >
                        <MaterialCommunityIcons name="leaf" size={50} color="white"
                        />
                        {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                        <View style={{ marginLeft: 10, marginRight: 30, }}>
                            <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Fresh</Text>

                        </View>

                    </LinearGradient>

                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 20, color: 'rgb(165, 165, 165)' }}>Fan</Text>

                    <TouchableOpacity onPress={() => { newFan(); addAction("Set Fan Speed to "+getNextItem(fanOptions, prevFan)); }}
                        style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: theme == 'dark' ? 'rgb(42, 45, 125)' : 'rgb(255,255,255)', borderRadius: 30 }]}>
                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                            style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                        >
                            <MaterialCommunityIcons name="fan" size={45} color="white"
                            />
                            {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                        </LinearGradient>

                        <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 20, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>{prevFan}</Text>

                    </TouchableOpacity>



                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 10, color: 'rgb(165, 165, 165)' }}>Filter Efficiency</Text>

                    <View
                        style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30 }]}>
                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                            style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
                        >
                            <MaterialCommunityIcons name="filter-outline" size={50} color="white"
                            />
                            {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                            <Text style={{ marginLeft: 10, marginRight: 30, fontSize: 25, fontWeight: 'bold', color: 'white' }}>{clog + "% - " + filter}</Text>
                        </LinearGradient>



                    </View>

                </View>


            </View>




        );
    }






    return (

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 50 }}>



            <View style={[styles.shadow, { backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255,255,255)', borderRadius: 50, padding: 30, alignItems: 'center' }]}>

                <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, color: 'rgb(165, 165, 165)' }}>Air Quality</Text>

                <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                    style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}
                >
                    <MaterialCommunityIcons name="leaf" size={70} color="white"
                    />
                    {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                    <View style={{ marginLeft: 10, marginRight: 30, }}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>Fresh</Text>

                    </View>

                </LinearGradient>

                <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, marginTop: 30, color: 'rgb(165, 165, 165)' }}>Fan</Text>

                <TouchableOpacity onPress={() => { newFan(); addAction("Set Fan Speed to "+getNextItem(fanOptions, prevFan)); }}
                    style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: theme == 'dark' ? 'rgb(42, 45, 125)' : 'rgb(255,255,255)', borderRadius: 30 }]}>
                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                    >
                        <MaterialCommunityIcons name="fan" size={70} color="white"
                        />
                        {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                    </LinearGradient>

                    <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>{prevFan}</Text>

                </TouchableOpacity>



                <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, marginTop: 30, color: 'rgb(165, 165, 165)' }}>Filter Efficiency</Text>

                <View
                    style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30 }]}>
                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
                    >
                        <MaterialCommunityIcons name="filter-outline" size={70} color="white"
                        />
                        {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                        <Text style={{ marginLeft: 10, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'white' }}>{clog + "% - " + filter}</Text>
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
