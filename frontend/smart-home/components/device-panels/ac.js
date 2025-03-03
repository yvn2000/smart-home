import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, PanResponder, Alert, ActivityIndicator

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState, useLayoutEffect, useRef } from "react";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

import Animated, {
    useSharedValue, useAnimatedStyle, withRepeat, withTiming,
    withDelay, withSpring, withSequence, Easing, useAnimatedProps,
    interpolate, Extrapolation
} from 'react-native-reanimated';

import TempDial from "../dial";


export default function ACPanel({ device }) {     //width is percentage



    const [deviceInfo, setDeviceInfo] = useState({});
    const [loading, setLoading] = useState(true); // Track loading state

    const fetchDeviceInfo = async () => {
        try {
            const response = await fetch(
                //getDeviceInfoURLS()
                Platform.OS == 'android'
                    ? `http://10.0.2.2:8000/api/device/${device.device_id}/get_device_info/`
                    : `http://127.0.0.1:8000/api/device/${device.device_id}/get_device_info/`
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

    const apiUrl = Platform.OS === 'android' ? `http://10.0.2.2:8000/api/device/${device.device_id}/get-activity/` : `http://127.0.0.1:8000/api/device/${device.device_id}/get-activity/`;

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

    const actionUrl = Platform.OS === 'android' ? `http://10.0.2.2:8000/api/device/${device.device_id}/activity/add-action/` : `http://127.0.0.1:8000/api/device/${device.device_id}/activity/add-action/`;

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








    const [fanStates, setFan] = useState({
        "High": false,
        "Medium": false,
        "Low": false,
        "Auto": false,
    })

    const [modes, setMode] = useState({
        "Cool": false,
        "Dry": false,
        "Fan": false,
        "Heat": false,
    })

    const fanOptions = ["High", "Medium", "Low", "Auto"];
    const modeOptions = ["Cool", "Dry", "Fan", "Heat"];

    const [prevFan, setPrevFan] = useState("Auto");
    const [prevMode, setPrevMode] = useState("Cool");

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

    const newMode = () => {
        const nextMode = getNextItem(modeOptions, prevMode);

        setMode((prev) => ({
            ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
            [nextMode]: true,
        }));

        setPrevMode(nextMode);
    };











    const updateUrl = Platform.OS === 'android' ? `http://10.0.2.2:8000/api/device/${device.device_id}/update_device_info/` : `http://127.0.0.1:8000/api/device/${device.device_id}/update_device_info/`


    const updateDeviceInfo = async () => {
        //console.log("update TV")
        // Validate inputs
        if (!prevFan || !prevMode) {
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
                    mode: prevMode,
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
    }, [prevFan, prevMode]);





    useEffect(() => {
        if (deviceInfo.data) {
            //console.log(deviceInfo)
            setPrevMode(deviceInfo.data.mode)
            setPrevFan(deviceInfo.data.fan_speed)
        }
    }, [deviceInfo, device.device_id, deviceInfo.data])


    if (loading) {
        return (

            <View style={{}}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>

        )
    }








    if (Platform.OS != 'web') {
        return (

            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30, top: -10 }}>

                <TempDial device_id={device.device_id} deviceName={device.name} changeable={device.logo == 'air-conditioner' ? true : false} tempArg={(deviceInfo.data) ? deviceInfo.data.temperature : device.temp} />

                <View style={[{ borderRadius: 50, padding: 30, alignItems: 'center', flexDirection: 'row', gap:20 }]}>

                    <View style={{alignItems:'center', justifyContent:'center'}}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'rgb(165, 165, 165)' }}>Fan</Text>

                        <TouchableOpacity onPress={() => { newFan(); addAction(`Set Fan to ${prevFan}`) }}
                            style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 20 }]}>
                            <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 20, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                            >
                                <MaterialCommunityIcons name="fan" size={30} color="white"
                                />
                                {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                            </LinearGradient>

                            <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>{prevFan}</Text>

                        </TouchableOpacity>

                    </View>

                    <View style={{alignItems:'center', justifyContent:'center'}}>

                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'rgb(165, 165, 165)' }}>Mode</Text>

                        <TouchableOpacity onPress={() => { newMode(); addAction(`Set Mode to ${prevMode}`) }}
                            style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 20 }]}>
                            <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 20, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                            >
                                <MaterialCommunityIcons name="dots-grid" size={30} color="white"
                                />
                                {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                            </LinearGradient>

                            <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>{prevMode}</Text>

                        </TouchableOpacity>

                    </View>

                </View>


            </View>




        );
    }










    return (

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 50 }}>

            <TempDial device_id={device.device_id} deviceName={device.name} changeable={device.logo == 'air-conditioner' ? true : false} tempArg={(deviceInfo.data) ? deviceInfo.data.temperature : device.temp} />

            <View style={[styles.shadow, { backgroundColor: 'white', borderRadius: 50, padding: 30, alignItems: 'center' }]}>

                <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, color: 'rgb(165, 165, 165)' }}>Fan</Text>

                <TouchableOpacity onPress={() => { newFan(); addAction(`Set Fan to ${prevFan}`) }}
                    style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30 }]}>
                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                    >
                        <MaterialCommunityIcons name="fan" size={70} color="white"
                        />
                        {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                    </LinearGradient>

                    <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>{prevFan}</Text>

                </TouchableOpacity>



                <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, marginTop: 40, color: 'rgb(165, 165, 165)' }}>Mode</Text>

                <TouchableOpacity onPress={() => { newMode(); addAction(`Set Mode to ${prevMode}`) }}
                    style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30 }]}>
                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                    >
                        <MaterialCommunityIcons name="dots-grid" size={70} color="white"
                        />
                        {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                    </LinearGradient>

                    <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>{prevMode}</Text>

                </TouchableOpacity>

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
