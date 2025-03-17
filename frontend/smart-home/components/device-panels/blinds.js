import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, PanResponder, ActivityIndicator, Alert

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

import VerticalSlider from "../vertical-slider";
import Slider from "react-native-sliders";

import { useTheme } from "../themes/theme";

export default function BlindsPanel({ device }) {     //width is percentage

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





    const [blindsOpen, setOpen] = useState(true)

    const maxOpen = 100;
    const [openness, setOpenness] = useState(40);

    function setBlinds(status) {
        setOpen(status)
    }

    function changeOpenness(newOpenness) {
        setOpenness(newOpenness)
        //console.log('Openness updated to:', newOpenness);
    }

    useEffect(() => {
        if (openness <= 0) {
            setOpen(false)
        }
        else if (openness > 0 && (blindsOpen == false)) {
            setOpen(true)
        }
    }, [openness])






    const updateUrl = Platform.OS === 'android' ? `http://10.0.2.2:8000/api/device/${device.device_id}/update_device_info/` : `http://127.0.0.1:8000/api/device/${device.device_id}/update_device_info/`


    const updateDeviceInfo = async () => {
        //console.log("update TV")
        // Validate inputs
        if (!openness) {
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
                    open_status: (blindsOpen) ? 'Open' : 'Close',
                    openness_value: parseInt(openness),
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
    }, [openness, blindsOpen]);




    useEffect(() => {
        if (deviceInfo.data) {
            //console.log(deviceInfo)
            setOpen(deviceInfo.data.open_status == 'Open' ? true : false)
            setOpenness(deviceInfo.data.openness_value)
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

            <View style={[{
                width: '80%', maxWidth: 1000,
                justifyContent: 'center', alignItems: 'center', padding: 40, borderRadius: 40,
                gap: '10%', paddingBottom: 50,
            }]}
            >

                <TouchableOpacity onPress={() => { setBlinds(!blindsOpen); addAction(blindsOpen == false ? "Opened Blinds" : "Closed Blinds") }}
                    style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: theme == 'dark' ? 'rgb(42, 45, 125)' : 'rgb(255,255,255)', borderRadius: 30, width: '100%' }]}>
                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                    >
                        <MaterialCommunityIcons name={(blindsOpen) ? "blinds-open" : "blinds"} size={70} color="white"
                        />
                        {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                    </LinearGradient>

                    <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>{(blindsOpen) ? "Open" : "Closed"}</Text>

                </TouchableOpacity>
                <View style={[styles.shadow, { width: '100%', borderRadius: 20, gap: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: theme == 'dark' ? 'rgb(42, 45, 125)' : 'rgb(255,255,255)', padding: 50 }]}>




                    <Slider
                        style={{ width: '80%', height: 20, }}
                        minimumValue={0}
                        maximumValue={100}
                        step={1} // Adjust value in steps
                        value={openness}
                        onValueChange={(val) => setOpenness(val)}
                        minimumTrackTintColor='rgb(216, 75, 255)'
                        maximumTrackTintColor="#D3D3D3"
                        thumbTintColor='rgb(255, 3, 184)'
                    />


                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'rgb(216, 75, 255)' }}>{blindsOpen ? Math.floor((openness / maxOpen) * 100) : 0}% Open</Text>


                </View>



            </View>




        );
    }



    return (

        <View style={[styles.shadow, {
            width: '80%', maxWidth: 1000, backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255,255,255)', flexDirection: 'row',
            justifyContent: 'center', alignItems: 'center', padding: 40, borderRadius: 40,
            gap: '10%'
        }]}
        >

            <TouchableOpacity onPress={() => { setBlinds(!blindsOpen); addAction(blindsOpen == false ? "Opened Blinds" : "Closed Blinds") }}
                style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: theme == 'dark' ? 'rgb(42, 45, 125)' : 'rgb(255,255,255)', borderRadius: 30, width: '30%' }]}>
                <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                    style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                >
                    <MaterialCommunityIcons name={(blindsOpen) ? "blinds-open" : "blinds"} size={70} color="white"
                    />
                    {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                </LinearGradient>

                <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>{(blindsOpen) ? "Open" : "Closed"}</Text>

            </TouchableOpacity>
            <View style={[{ width: '40%', borderRadius: 40, gap: 10, justifyContent: 'center', alignItems: 'center' }]}>




                <Slider
                    style={{ width: '80%', height: 20, }}
                    minimumValue={0}
                    maximumValue={100}
                    step={1} // Adjust value in steps
                    value={openness}
                    onValueChange={(val) => setOpenness(val)}
                    minimumTrackTintColor='rgb(216, 75, 255)'
                    maximumTrackTintColor="#D3D3D3"
                    thumbTintColor='rgb(255, 3, 184)'
                />


                <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'rgb(216, 75, 255)' }}>{blindsOpen ? Math.floor((openness / maxOpen) * 100) : 0}% Open</Text>


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
