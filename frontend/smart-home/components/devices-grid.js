import React, { useEffect, useState } from 'react';
import {
    StyleSheet, View, Text, Button, TouchableOpacity,
    Dimensions, TextInput, ScrollView,
    Platform, //Animated
} from 'react-native';

//import Animated, { } from "react-native-reanimated";

import { DUMMY_DATA } from "../data/dummy-device-data";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { Easing, useSharedValue, withTiming, useAnimatedStyle, runOnJS } from 'react-native-reanimated';

import { LinearGradient } from 'expo-linear-gradient';


export default function DevicesGrid({ currentRoom }) {

    const navigation = useNavigation()

    const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));

    useEffect(() => {
        setWindowDimensions(Dimensions.get('window'))
    }, [windowDimensions])

    const [allRooms, setRooms] = useState([]);
    const [devices, setDevices] = useState([]);

    //console.log(DUMMY_DATA.find(item => item.room_id === currentRoom))

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch(Platform.OS == 'android' ? "http://10.0.2.2:8000/api/rooms/" : "http://127.0.0.1:8000/api/rooms/");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                //console.log("Fetched Rooms:", data);
                setRooms(data);
            } catch (err) {
                //setError(err.message);
            }
        };
        fetchRooms();
    }, [currentRoom])

    useEffect(() => {
        console.log("Devices changes")
        const roomData = allRooms.find((item) => item.room_id === currentRoom);
        if (roomData) {
            setDevices(roomData.devices)
        } else {
            setDevices([])
        }
    }, [currentRoom, allRooms]);




    
    const addDeviceOld = async ( name, logo, temp ) => {



        //setDevices((prev) => [...prev, { id: prev.length + 1 }]);
        /*
        setDevices((prev) => [
            ...prev,
            { device_id: prev.length + 1, name: `Device ${prev.length + 1}`, status: 'off', temperature: 22 },
        ]);
        */


        const roomData = allRooms.find((item) => item.room_id === currentRoom);
        if (roomData) {
            const newDevice = {
                name: name || 'New Device', //'Lebron',
                logo: logo || 'unicorn-variant', //'unicorn-variant',
                status: 'off',
                temperature: temp, //22,
                room: currentRoom,
            };



            try {
                const response = await fetch(
                    Platform.OS == 'android' ? `http://10.0.2.2:8000/api/add-device/` : `http://127.0.0.1:8000/api/add-device/`,
                    //`http://127.0.0.1:8000/api/add-device/`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newDevice),
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const addedDevice = await response.json();
                //console.log("Added Device:", addedDevice);
                setDevices((prevDevices) => [...prevDevices, addedDevice]);
            } catch (err) {
                console.error("Error adding device:", err.message);
            }

        }

    };

    const deleteDevice = async (deviceId) => {
        //console.log(deviceId)
        try {
            const response = await fetch(
                //`http://127.0.0.1:8000/api/delete-device/${deviceId}/`,
                Platform.OS == 'android' ? `http://10.0.2.2:8000/api/delete-device/${deviceId}/` : `http://127.0.0.1:8000/api/delete-device/${deviceId}/`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }


            setDevices((prevDevices) => prevDevices.filter((device) => device.device_id !== deviceId));
            console.log(`Device ${deviceId} deleted successfully`);
        } catch (err) {
            console.error("Error deleting device:", err.message);
        }
    };







    return (
        <View style={styles.container}>

            

            {/* Dynamic grid container */}
            <View style={[styles.gridContainer]}>

                <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']} style={[styles.gridItem, styles.shadow]}>
                    <TouchableOpacity title="Add Device"
                        //onPress={openPopup/*addDevice*/
                        onPress={()=>{
                            navigation.navigate("Device-Add", {
                                allRooms: allRooms,
                                currentRoom: currentRoom,
                                addDeviceOld: addDeviceOld,

                            })
                        }}
                        style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }} >
                        <Text style={styles.gridText}>Add Device</Text>
                    </TouchableOpacity>
                </LinearGradient>
                {devices.map((device) => (
                    /*
                    <TouchableOpacity key={device.device_id} style={[styles.gridItem, styles.shadow]}>
                        <Text style={styles.gridText}>{device.name}</Text>
                        <Text style={styles.gridText}>Status: {device.status}</Text>
                        <Text style={styles.gridText}>Temp: {device.temperature}°C</Text>
                    </TouchableOpacity>
                    */
                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']} style={[styles.gridItem, styles.shadow]}>
                        <TouchableOpacity
                            key={device.device_id}
                            //style={[styles.gridItem, styles.shadow]}
                            style={{ width: '100%', height: '100%' }}
                            onPress={() => {
                                navigation.navigate("DeviceDetail", {
                                    device_id: device.device_id,
                                    name: device.name,
                                    logo: device.logo,
                                    status: device.status,
                                    temp: device.temperature,
                                    room: allRooms.find(item => item.room_id === currentRoom)?.name,
                                    deleteDevice: deleteDevice
                                }
                                );
                            }}
                        >
                            <View style={[styles.deviceUpper]}>
                                <MaterialCommunityIcons name={device.logo} size={60} color='rgb(255, 255, 255)' />
                                <TouchableOpacity style={[styles.switch]}>

                                    <View style={[styles.switchCircle]}>
                                        {/*<Text>On</Text>*/}
                                    </View>

                                </TouchableOpacity>
                            </View>

                            <View style={[styles.deviceLower]}>

                                <View style={{ bottom: '5%', left: '10%' }}>
                                    <Text style={[{ fontSize: 27, fontWeight: 'bold', color: 'white' }]}>
                                        {device.name}
                                    </Text>
                                    <Text style={[{ fontSize: 20, fontWeight: 'bold', color: 'rgb(218, 218, 218)' }]}>
                                        {allRooms.find(item => item.room_id === currentRoom)?.name}
                                    </Text>
                                </View>

                                {/*
                            <TouchableOpacity style={{ bottom: '5%', left: '10%' }} onPress={() => deleteDevice(device.device_id)}>
                                <MaterialCommunityIcons name="cross-bolnisi" color="white" size={22} />
                            </TouchableOpacity>
                            */}

                            </View>
                        </TouchableOpacity>
                    </LinearGradient>
                ))}

            </View>

            

            <View style={{ height: 200 }}>{/*to allow room for taskbar to not overlay devices*/}</View>

        </View>
    );
}

const styles = StyleSheet.create({
    testBorder: {
        borderColor: 'red',
        borderWidth: 3,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    gridContainer: {
        width: '100%',
        maxWidth: 1800,
        marginTop: 16,
        flexDirection: 'row',
        flexWrap: 'wrap', //go to next row
        justifyContent: 'center',
        gap: 100,
    },
    gridItem: {
        width: '15%',
        minWidth: 130,
        minHeight: 130,
        aspectRatio: 1, // Ensures square-shaped items
        backgroundColor: 'rgb(216, 75, 255)',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
        borderRadius: 40,
    },
    gridText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
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

    deviceUpper: {
        height: '50%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '30%',
        alignItems: 'center',
    },
    deviceLower: {
        height: '50%',
        width: '100%',
        //flexDirection:'row',
        //alignItems:'center',
        justifyContent: 'center',
    },
    switch: {
        width: '35%',
        height: '40%',
        borderRadius: 500,
        flexDirection: 'row',
        backgroundColor: 'rgba(200, 200, 200, 0.9)',
    },
    switchCircle: {
        height: '100%',
        aspectRatio: 1,
        backgroundColor: 'white',
        borderRadius: 500,
        justifyContent: 'center',
        alignItems: 'center',

    },

    deviceType: {
        aspectRatio: 1,
        backgroundColor: 'rgb(235, 235, 235)',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        width: `${100 / 10}%`,
        padding: 5,
        gap: 5,
    },

    deviceTypes: {
        flexDirection: 'row',
        width: '100%',
        maxWidth: 800,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5%',
    },




    popup: {
        position: 'absolute',
        bottom: 0,
        width: '80%',
        height: '100%',
        maxWidth: 1100,
        //maxHeight: 330,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 50,
        flex:1,

    },
    popupContent: {
        //flexDirection: 'column',
        alignItems: 'center',
        gap: '2%',
        height: '100%',
        flex:1,
    },
    input: {
        width: '80%',
        maxWidth: 500,
        height: 80,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
        fontSize: 30
    },
});