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
    interpolate, Extrapolation, interpolateColor,
} from 'react-native-reanimated';


export default function CustomSwitch({ device, value, changeValue, energyToBeAdded }) {

    const [status, setStatus] = useState(device.status);

    const [deviceInfo, setDeviceInfo] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchDeviceInfo = async () => {
        try {
            const response = await fetch(
                //getGETURL()
                Platform.OS == 'android'
                    ? `http://10.0.2.2:8000/api/device/${device.device_id}/get_device_info/`
                    : `http://127.0.0.1:8000/api/device/${device.device_id}/get_device_info/`
            );

            const data = await response.json();
            //console.log(data)
            if (response.ok) {
                setDeviceInfo(data); // Update state with fetched device information
            } else {
                Alert.alert("Error", "Failed to fetch device information");
            }
        } catch (error) {
            Alert.alert("Error", "Network request failed");
        } finally {
            setLoading(false); // Stop the loading indicator once the fetch is complete
        }
    };

    useEffect(() => {
        fetchDeviceInfo(); // Fetch device info when the component mounts
        //console.log(deviceInfo)
        //console.log("Device Info: " + deviceInfo)
    }, [device.device_id]); // Fetch whenever device_id changes


    const [switchValue, setSwitchValue] = useState(value); // Sync with prop initially
    const backgroundColor = useSharedValue(status === "on" ? 1 : 0); // Set based on initial status
    const translateX = useSharedValue(status === "on" ? 1 : 0); // Set initial position based on status


    const switchWidth = useSharedValue(0); // Stores parent width
    const switchRef = useRef(null)


    // Update the local state and animation when the status changes
    useEffect(() => {
        setSwitchValue(status === "on"); // Sync switch value with the status prop
        translateX.value = withTiming(status === "on" ? switchWidth.value / 2 : 0, { duration: 200 });
        backgroundColor.value = withTiming(status === "on" ? 1 : 0, { duration: 200 });
    }, [status]); // Re-run whenever status prop changes


    const toggleStatus = async (device_id) => {
        const newStatus = status === "on" ? "off" : "on";

        const formData = new URLSearchParams();
        formData.append("status", newStatus);

        try {
            const response = await fetch(
                Platform.OS == "android" ? `http://10.0.2.2:8000/api/update-device-status/${device_id}/` : `http://127.0.0.1:8000/api/update-device-status/${device_id}/`
                , {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: formData.toString(),
                });

            const data = await response.json();

            if (response.ok) {
                setStatus(newStatus);
                Alert.alert("Success", `Device status updated to ${newStatus}`);
            } else {
                Alert.alert("Error", data.error || "Failed to update status");
            }
        } catch (error) {
            Alert.alert("Error", "Could not connect to the server");
        }
    };

    const toggleSwitch = () => {
        const newValue = !switchValue;
        setSwitchValue(newValue);
        if (changeValue) {
            changeValue(device.device_id, newValue == false ? "off" : "on")
        }


        toggleStatus(device.device_id)
        //console.log("device stat changed")


        translateX.value = withTiming(newValue ? switchWidth.value / 2 : 0, { duration: 200 });
        backgroundColor.value = withTiming(newValue ? 1 : 0, { duration: 200 });
        //translateX.value = withTiming(status ? switchWidth.value / 2 : 0, { duration: 200 });
        //backgroundColor.value = withTiming(status ? 1 : 0, { duration: 200 });
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });


    // Animated background color
    const backgroundStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            backgroundColor.value,
            [0, 1],
            ["rgba(200, 200, 200, 0.9)", "rgba(0, 200, 0, 0.9)"] // Gray → Green
        ),
    }));





    /*
    const getGETURL = () => {

        if (device.logo=='television' || device.logo=='air-conditioner') {
            return (
                Platform.OS == 'android'
                    ? `http://10.0.2.2:8000/api/device/${device.device_id}/get_television/`
                    : `http://127.0.0.1:8000/api/device/${device.device_id}/get_television/`
            )
        }

    }
    */



    /*
    const updateEnergyConsumption = async (deviceId, incrementValue) => {
        const apiUrl = Platform.OS === 'android' 
            ? `http://10.0.2.2:8000/api/device/${deviceId}/update_energy/`
            : `http://127.0.0.1:8000/api/device/${deviceId}/update_energy/`;
    
        try {
            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ increment_value: incrementValue }),
            });
    
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
    */

    const setEnergyConsumption = async (deviceId, incrementValue) => {
        const apiUrl = Platform.OS === 'android'
            ? `http://10.0.2.2:8000/api/device/${deviceId}/set_energy/`
            : `http://127.0.0.1:8000/api/device/${deviceId}/set_energy/`;

        try {
            //console.log("IncrementValue: " + incrementValue)
            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ increment_value: incrementValue }),
            });

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
        //console.log(status)
        if (deviceInfo.data) {
            console.log("BaseEnergy: " + deviceInfo.data.base_energy + " Current_Energy: " + deviceInfo.data.energy_consumption)
            if (status == 'on') {

                setEnergyConsumption(device.device_id, deviceInfo.data.base_energy)
            }
            else {
                setEnergyConsumption(device.device_id, 0)
            }

        }


    }, [status])






    if (loading) {
        return (

            <View style={{}}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>

        )
    }











    return (

        <Animated.View
            ref={switchRef}
            style={[backgroundStyle, styles.switch]}
            onLayout={(event) => {
                switchWidth.value = event.nativeEvent.layout.width;
            }}
        >
            {/* TouchableOpacity inside the Animated View */}
            <TouchableOpacity style={styles.touchableArea} onPress={toggleSwitch} activeOpacity={0.8}>
                <Animated.View style={[animatedStyle, styles.switchCircle]}>
                    {/*<Text>{switchValue ? "On" : "Off"}</Text>*/}
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>




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


    switch: {
        width: '100%',
        height: '100%',
        //aspectRatio:'2/1',
        borderRadius: 500,
        flexDirection: 'row',
        //backgroundColor: 'rgba(200, 200, 200, 0.9)',
    },
    switchCircle: {
        height: '100%',
        width: '50%',
        aspectRatio: 1,
        backgroundColor: 'white',
        borderRadius: 500,
        justifyContent: 'center',
        alignItems: 'center',

    },
    touchableArea: {
        width: "100%",
        height: "100%",
        //justifyContent: "center",
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
