import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, PanResponder, ActivityIndicator, Alert

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


export default function DoorsPanel({ device }) {     //width is percentage

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












    const [doorStatus, setDoor] = useState(true)
    const [code, setCode] = useState(['0', '0', '0', '0']);

    useEffect(() => {
        console.log(code)
    }, [code])

    function setLock(status) {
        setDoor(status)
    }

    const [focusedIndex, setFocusedIndex] = useState(null);

    const inputRefs = [
        React.createRef(),
        React.createRef(),
        React.createRef(),
        React.createRef(),
    ];


    const handleChange = (index, value) => {
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 3) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleVerify = () => {
        console.log('Code:', code.join(''));
    };





    const updateUrl = `${API_BASE_URL}/api/device/${device.device_id}/update_device_info/`

    const updateDeviceInfo = async () => {
        //console.log("update TV")
        // Validate inputs
        if (!code) {
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
                    access_code: parseInt(code.join('')),
                    locked: doorStatus
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

    const setEnergyConsumption = async (deviceId, incrementValue) => {
        /*const apiUrl = Platform.OS === 'android'
            ? `http://10.0.2.2:8000/api/device/${deviceId}/set_energy/`
            : `http://127.0.0.1:8000/api/device/${deviceId}/set_energy/`;*/
        
            const apiUrl = `${API_BASE_URL}/api/device/${deviceId}/set_energy/`

        try {
            //console.log("IncrementValue: " + incrementValue)
            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ increment_value: incrementValue }),
            });

            console.log(incrementValue)

            if (response.ok) {
                const data = await response.json();
                //console.log('Updated Energy Consumption:', data);
            } else {
                console.error('Failed to update energy consumption');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        console.log("Door Changed")
        updateDeviceInfo();
    }, [doorStatus, code]);

    
    useEffect(() => {
        addAction("Changed Code to " + code.join(''))
    }, [code]);
    



    const convertToArray = (num) => {
        return num.toString().padStart(4, '0').split('');
    };


    useEffect(() => {
        if (deviceInfo.data) {
            //console.log(deviceInfo)
            console.log(deviceInfo.data.locked)
            setDoor(deviceInfo.data.locked)
            setCode(convertToArray(deviceInfo.data.access_code))
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

                <TouchableOpacity onPress={() => { setLock(!doorStatus); addAction(!doorStatus ? "Locked Door" : "Unlocked Door") }}
                    style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: theme=='dark' ? 'rgb(42, 45, 125)' : 'rgb(255,255,255)', borderRadius: 30, width: '95%' }]}>
                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                    >
                        <MaterialCommunityIcons name={(!doorStatus) ? "lock-open-variant-outline" : "lock-outline"} size={50} color="white"
                        />
                        {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                    </LinearGradient>

                    <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 20, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>{(!doorStatus) ? "Unlocked" : "Locked"}</Text>

                </TouchableOpacity>
                <View style={[styles.shadow, { width: '90%', borderRadius: 40, gap: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: theme=='dark' ? 'rgb(42, 45, 125)' : 'white', padding: 40 }]}>


                    <Text
                        style={[{ padding: 0, fontSize: 24, color: 'rgb(255, 3, 184)', fontWeight: 'bold' }]}
                    >
                        Access Code
                    </Text>

                    <View style={{ width: '90%' }}>


                        <View style={styles.inputs}>
                            {code.map((value, index) => (
                                <TextInput
                                    key={index}
                                    style={[
                                        styles.input,
                                        { width: '20%', borderColor: focusedIndex === index ? 'rgb(216, 75, 255)' : 'rgb(175, 175, 175)', 
                                            color: theme=='dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)'
                                        } // Conditional border color
                                    ]}
                                    selectionColor={'rgb(216, 75, 255)'}
                                    value={value}
                                    onChangeText={(text) => {handleChange(index, text); }}
                                    maxLength={1}
                                    keyboardType="numeric"
                                    ref={inputRefs[index]}
                                />
                            ))}
                        </View>



                    </View>


                </View>



            </View>




        );
    }










    return (

        <View style={[styles.shadow, {
            width: '80%', maxWidth: 1000, backgroundColor: theme=='dark' ? 'rgb(26, 28, 77)' : 'rgb(255,255,255)', flexDirection: 'row',
            justifyContent: 'center', alignItems: 'center', padding: 40, borderRadius: 40,
            gap: '10%'
        }]}
        >

            <TouchableOpacity onPress={() => { setLock(!doorStatus); addAction(!doorStatus ? "Locked Door" : "Unlocked Door") }}
                style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: theme=='dark' ? 'rgb(42, 45, 125)' : 'rgb(255,255,255)', borderRadius: 30, width: '35%' }]}>
                <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                    style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                >
                    <MaterialCommunityIcons name={(!doorStatus) ? "lock-open-variant-outline" : "lock-outline"} size={70} color="white"
                    />
                    {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                </LinearGradient>

                <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>{(!doorStatus) ? "Unlocked" : "Locked"}</Text>

            </TouchableOpacity>
            <View style={[{ width: '40%', borderRadius: 40, gap: 10, justifyContent: 'center', alignItems: 'center' }]}>


                <Text
                    style={[{ padding: 0, fontSize: 30, color: 'rgb(255, 3, 184)', fontWeight: 'bold' }]}
                >
                    Access Code
                </Text>

                <View>


                    <View style={styles.inputs}>
                        {code.map((value, index) => (
                            <TextInput
                                key={index}
                                style={[
                                    styles.input,
                                    { borderColor: focusedIndex === index ? 'rgb(216, 75, 255)' : 'rgb(175, 175, 175)',
                                        color: theme=='dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)'
                                     } // Conditional border color
                                ]}
                                selectionColor={'rgb(216, 75, 255)'}
                                value={value}
                                onChangeText={(text) => {handleChange(index, text);}}
                                maxLength={1}
                                keyboardType="numeric"
                                ref={inputRefs[index]}
                            />
                        ))}
                    </View>



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


    inputs: {
        flexDirection: 'row',
        marginTop: 10,
        //alignItems:'center',
        justifyContent: 'center',
        //height:'100%'
    },
    input: {
        width: '8%',
        height: 60,
        //height:'80%',
        textAlign: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: '#d2d2d2',
        marginHorizontal: 5,
        fontSize: 30,
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
