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


export default function LightsPanel({ device }) {     //width is percentage

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





    const [colors, setColors] = useState({
        "violet": false,
        "pink": false,
        "purple": false,
        "blue": false,
        "cyan": false,
        "green": false,
        "yellow": false,
        "orange": false,
        "red": false,
        "white": true,
    })

    const [prevColor, setPrevColor] = useState("white")

    const setColor = (newColor) => {
        setColors((prev) => ({
            ...prev,
            [prevColor]: !prev[prevColor],
            [newColor]: true,
        }));

        setPrevColor(newColor)
    }

    const maxIntensity = 100;
    const [intensity, setIntensity] = useState(40);

    function changeIntensity(newIntensity) {
        setIntensity(newIntensity)
        //console.log('Intensity updated to:', newIntensity);
    }








    const updateUrl = Platform.OS === 'android' ? `http://10.0.2.2:8000/api/device/${device.device_id}/update_device_info/` : `http://127.0.0.1:8000/api/device/${device.device_id}/update_device_info/`


    const updateDeviceInfo = async () => {
        //console.log("update TV")
        // Validate inputs
        if (!intensity || !prevColor) {
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
                    intensity: parseInt(intensity),
                    rgb: prevColor,
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
            Alert.alert('Error', 'Failed to update television');
        }
    };


    useEffect(() => {
        updateDeviceInfo();
    }, [prevColor, intensity]);


    



    useEffect(() => {
        if (deviceInfo.data) {
            //console.log(deviceInfo)
            setIntensity(deviceInfo.data.intensity)
            setPrevColor(deviceInfo.data.rgb)
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

            <View style={{ flexDirection: 'row', width: '90%', maxWidth: 1000, padding: 20, paddingBottom:50, alignItems:'center' }}>
    
                <View style={[{ width: '50%', justifyContent: 'center', alignItems: 'center' }]}>
    
                    {/*<Text style={{ top: 10, fontWeight: 'bold' }}>--- Light Color ---</Text>*/}
    
                    <View style={[{ flexDirection: 'row', width: '100%', justifyContent: 'center', gap:20 }]}>
                        <View style={[{ width: '20%', gap: 30, padding: 20, justifyContent: 'center', alignItems: 'center' }]}>
                            <TouchableOpacity
                                style={[styles.hueOption, {
                                    width:40,
                                    backgroundColor: 'rgb(225, 0, 255)',
                                    borderWidth: 3,
                                    borderColor: (prevColor=='violet' ? 'black' : 'rgb(225, 0, 255)')
                                }]}
                                onPress={() => { setColor("violet"); addAction("Set Color to Violet"); }}
                            >
    
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.hueOption, {
                                width:40,
                                backgroundColor: 'rgb(255, 0, 153)',
                                borderWidth: 3,
                                borderColor: (prevColor=='pink' ? 'black' : 'rgb(255, 0, 153)')
                            }]}
                                onPress={() => { setColor("pink"); addAction("Set Color to Pink"); }}>
    
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.hueOption, {
                                width:40,
                                backgroundColor: 'rgb(149, 0, 255)',
                                borderWidth: 3,
                                borderColor: (prevColor=='purple' ? 'black' : 'rgb(149, 0, 255)')
                            }]}
                                onPress={() => { setColor("purple"); addAction("Set Color to Purple"); }}>
    
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.hueOption, {
                                width:40,
                                backgroundColor: 'rgb(4, 0, 255)',
                                borderWidth: 3,
                                borderColor: (prevColor=='blue' ? 'black' : 'rgb(4, 0, 255)')
                            }]}
                                onPress={() => { setColor("blue"); addAction("Set Color to Blue"); }}>
    
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.hueOption, {
                                width:40,
                                backgroundColor: 'rgb(0, 255, 255)',
                                borderWidth: 3,
                                borderColor: (prevColor=='cyan' ? 'black' : 'rgb(0, 255, 255)')
                            }]}
                                onPress={() => { setColor("cyan"); addAction("Set Color to Cyan"); }}>
    
                            </TouchableOpacity>
    
                        </View>
                        <View style={[{ width: '20%', gap: 30, padding: 20, justifyContent: 'center', alignItems: 'center' }]}>
                            <TouchableOpacity style={[styles.hueOption, {
                                width:40,
                                backgroundColor: 'rgb(0, 255, 34)',
                                borderWidth: 3,
                                borderColor: (prevColor=='green' ? 'black' : 'rgb(0, 255, 34)')
                            }]}
                                onPress={() => { setColor("green"); addAction("Set Color to Green"); }}>
    
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.hueOption, {
                                width:40,
                                backgroundColor: 'rgb(242, 255, 0)',
                                borderWidth: 3,
                                borderColor: (prevColor=='yellow' ? 'black' : 'rgb(242, 255, 0)')
                            }]}
                                onPress={() => { setColor("yellow"); addAction("Set Color to Yellow"); }}>
    
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.hueOption, {
                                width:40,
                                backgroundColor: 'rgb(255, 145, 0)',
                                borderWidth: 3,
                                borderColor: (prevColor=='orange' ? 'black' : 'rgb(255, 145, 0)')
                            }]}
                                onPress={() => { setColor("orange"); addAction("Set Color to Orange"); }}>
    
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.hueOption, {
                                width:40,
                                backgroundColor: 'rgb(255, 0, 0)',
                                borderWidth: 3,
                                borderColor: (prevColor=='red' ? 'black' : 'rgb(255, 0, 0)')
                            }]}
                                onPress={() => { setColor("red"); addAction("Set Color to Red"); }}>
    
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.hueOption, {
                                width:40,
                                backgroundColor: 'rgb(255, 255, 255)',
                                borderWidth: 3,
                                borderColor: (prevColor=='white' ? 'black' : 'rgb(255, 255, 255)')
                            }]}
                                onPress={() => { setColor("white"); addAction("Set Color to White"); }}>
    
                            </TouchableOpacity>
                        </View>
    
                    </View>
    
    
    
    
                </View>
    
    
                <View style={[styles.shadow, { backgroundColor: 'white', width: '50%', alignItems: 'center', justifyContent:'center', gap: 10, borderRadius: 50, paddingBottom: 20, paddingTop: 20 }]}>
    
                    <Text style={{ fontSize: 12, marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>Light Intensity</Text>
    
    
                    <Slider
                        style={{ width: '80%', height: 20, }}
                        minimumValue={0}
                        maximumValue={100}
                        step={1} // Adjust value in steps
                        value={intensity}
                        onValueChange={(val) => setIntensity(val)}
                        minimumTrackTintColor='rgb(216, 75, 255)'
                        maximumTrackTintColor="#D3D3D3"
                        thumbTintColor='rgb(255, 3, 184)'
                    />
    
                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'rgb(216, 75, 255)' }}>{Math.floor(intensity)}%</Text>
    
    
    
                </View>
    
    
    
            </View>
    
    
        );
    }










    return (

        <View style={{ flexDirection: 'row', width: '90%', maxWidth: 1000, padding: 20 }}>

            <View style={[{ width: '50%', justifyContent: 'center', alignItems: 'center' }]}>

                {/*<Text style={{ top: 10, fontWeight: 'bold' }}>--- Light Color ---</Text>*/}

                <View style={[{ flexDirection: 'row', width: '100%', justifyContent: 'center' }]}>
                    <View style={[{ width: '20%', gap: 30, padding: 20, justifyContent: 'center', alignItems: 'center' }]}>
                        <TouchableOpacity
                            style={[styles.hueOption, {
                                backgroundColor: 'rgb(225, 0, 255)',
                                borderWidth: 3,
                                borderColor: (prevColor=='violet' ? 'black' : 'rgb(225, 0, 255)')
                            }]}
                            onPress={() => { setColor("violet"); addAction("Set Color to Violet"); }}
                        >

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.hueOption, {
                            backgroundColor: 'rgb(255, 0, 153)',
                            borderWidth: 3,
                            borderColor: (prevColor=='pink' ? 'black' : 'rgb(255, 0, 153)')
                        }]}
                            onPress={() => { setColor("pink"); addAction("Set Color to Pink"); }}>

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.hueOption, {
                            backgroundColor: 'rgb(149, 0, 255)',
                            borderWidth: 3,
                            borderColor: (prevColor=='purple' ? 'black' : 'rgb(149, 0, 255)')
                        }]}
                            onPress={() => { setColor("purple"); addAction("Set Color to Purple"); }}>

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.hueOption, {
                            backgroundColor: 'rgb(4, 0, 255)',
                            borderWidth: 3,
                            borderColor: (prevColor=='blue' ? 'black' : 'rgb(4, 0, 255)')
                        }]}
                            onPress={() => { setColor("blue"); addAction("Set Color to Blue"); }}>

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.hueOption, {
                            backgroundColor: 'rgb(0, 255, 255)',
                            borderWidth: 3,
                            borderColor: (prevColor=='cyan' ? 'black' : 'rgb(0, 255, 255)')
                        }]}
                            onPress={() => { setColor("cyan"); addAction("Set Color to Cyan"); }}>

                        </TouchableOpacity>

                    </View>
                    <View style={[{ width: '20%', gap: 30, padding: 20, justifyContent: 'center', alignItems: 'center' }]}>
                        <TouchableOpacity style={[styles.hueOption, {
                            backgroundColor: 'rgb(0, 255, 34)',
                            borderWidth: 3,
                            borderColor: (prevColor=='green' ? 'black' : 'rgb(0, 255, 34)')
                        }]}
                            onPress={() => { setColor("green"); addAction("Set Color to Green"); }}>

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.hueOption, {
                            backgroundColor: 'rgb(242, 255, 0)',
                            borderWidth: 3,
                            borderColor: (prevColor=='yellow' == true ? 'black' : 'rgb(242, 255, 0)')
                        }]}
                            onPress={() => { setColor("yellow"); addAction("Set Color to Yellow"); }}>

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.hueOption, {
                            backgroundColor: 'rgb(255, 145, 0)',
                            borderWidth: 3,
                            borderColor: (prevColor=='orange' ? 'black' : 'rgb(255, 145, 0)')
                        }]}
                            onPress={() => { setColor("orange"); addAction("Set Color to Orange"); }}>

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.hueOption, {
                            backgroundColor: 'rgb(255, 0, 0)',
                            borderWidth: 3,
                            borderColor: (prevColor=='red' ? 'black' : 'rgb(255, 0, 0)')
                        }]}
                            onPress={() => { setColor("red"); addAction("Set Color to Red"); }}>

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.hueOption, {
                            backgroundColor: 'rgb(255, 255, 255)',
                            borderWidth: 3,
                            borderColor: (prevColor=='white' ? 'black' : 'rgb(255, 255, 255)')
                        }]}
                            onPress={() => { setColor("white"); addAction("Set Color to White"); }}>

                        </TouchableOpacity>
                    </View>

                </View>




            </View>


            <View style={[styles.shadow, { backgroundColor: 'white', width: '50%', alignItems: 'center', justifyContent:'center', gap: 10, borderRadius: 50, paddingBottom: 40, paddingTop: 10 }]}>

                <Text style={{ fontSize: 20, marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>--- Light Intensity ---</Text>


                <Slider
                    style={{ width: '80%', height: 20, }}
                    minimumValue={0}
                    maximumValue={100}
                    step={1} // Adjust value in steps
                    value={intensity}
                    onValueChange={(val) => setIntensity(val)}
                    minimumTrackTintColor='rgb(216, 75, 255)'
                    maximumTrackTintColor="#D3D3D3"
                    thumbTintColor='rgb(255, 3, 184)'
                />

                <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'rgb(216, 75, 255)' }}>{Math.floor((intensity / maxIntensity) * 100)}%</Text>



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


    hueOption: {
        aspectRatio: 1,
        borderRadius: 500,
        width: '90%',
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
