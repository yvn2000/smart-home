import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import {
    StyleSheet, View, Text, Button, TouchableOpacity,
    Dimensions, TextInput, ScrollView, Alert,
    Platform, //Animated
} from 'react-native';

//import Animated, { } from "react-native-reanimated";

import { DUMMY_DATA } from "../data/dummy-device-data";
//import { useNavigation, useRoute } from "@react-navigation/native";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { Easing, useSharedValue, withTiming, useAnimatedStyle, runOnJS } from 'react-native-reanimated';

import { LinearGradient } from 'expo-linear-gradient';

import CustomSwitch from '../components/switch'
import { Switch } from 'react-native-switch';

import { API_BASE_URL } from "../src/config";


export default function DevicesGrid({ currentRoom, house_id, allRooms, guestCode }) {

    const [loading, setLoading] = useState(true);

    const navigation = useNavigation()
    const route = useRoute();

    const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));

    useEffect(() => {
        setWindowDimensions(Dimensions.get('window'))
    }, [windowDimensions])

    //const [allRooms, setRooms] = useState([]);
    //const [allRooms, setRooms] = useState([]);
    const [devices, setDevices] = useState([]);
    const [localDeviceStates, setLocalDeviceStates] = useState({});
    //console.log(devices)


    useEffect(() => {
        setLoading(false)
    }, [house_id]); // Logs when devices update


    /*
    const fetchRooms2 = async () => {

        const roomsUrl = Platform.OS == 'web' ? `http://127.0.0.1:8000/api/houses/${house_id}/rooms/` : `http://10.0.2.2:8000/api/houses/${house_id}/rooms/`

        try {
            const response = await fetch(roomsUrl + `?t=${Date.now()}`);
            const data = await response.json();

            const stringData = JSON.stringify(data)
            const arrayData = JSON.parse(stringData)

            if (response.ok) {

                //setRooms(arrayData);


                const normalizedRooms = arrayData.map(room => ({
                    ...room,
                    devices: room.devices?.map(device => ({
                        ...device,
                        status: device.status.toLowerCase(),
                        statusBool: device.status.toLowerCase() === 'on'
                    }))
                }));
                //console.log("Data: " + arrayData)
                //console.log(rooms)
                //console.log(stringData[0].room_id)
                //console.log(rooms[0].room_id)
                //console.log("Data: "+stringData)
                //console.log("Rooms: "+rooms)
                setRooms(normalizedRooms);

            } else {
                //setError(data.error || "Failed to fetch rooms");
                console.log(data.error || "Failed to fetch rooms")
            }
        } catch (error) {
            //setError("Network error, please try again.");
            console.log(error)
        } finally {

            //setLoading(false);
        }
    };


    useEffect(() => {
        fetchRooms2();
    }, [currentRoom])

    */


    const fetchDevices = async () => {
        /*
        //console.log("Devices changes")
        const roomData = allRooms.find((item) => item.room_id === currentRoom);
        //console.log("Fetched Room:", roomData);
        if (roomData) {
            //console.log("Fetched Devices:", roomData.devices);
            setDevices(roomData.devices)
        } else {
            setDevices([])
        }
        console.log("Devices Fetched Again")
        */

        try {
            const roomData = allRooms.find(item => item.room_id === currentRoom);
            if (roomData) {
                // Normalize status values
                const normalizedDevices = roomData.devices.map(device => ({
                    ...device,
                    status: device.status.toLowerCase(),
                    statusBool: device.status.toLowerCase() === 'on'
                }));
                setDevices(normalizedDevices);
            } else {
                setDevices([]);
            }
        } catch (error) {
            console.error("Error fetching devices:", error);
        }




    };

    useEffect(() => {

        /*
        const newStates = {};
        devices.forEach(device => {
            newStates[device.device_id] = device.status.toLowerCase() === 'on';
        });
        setLocalDeviceStates(newStates);
        */
        const newStates = {};
        devices.forEach(device => {
            // Ensure both status and statusBool are considered
            const isValidState = typeof device.statusBool === 'boolean';
            newStates[device.device_id] = isValidState
                ? device.statusBool
                : device.status.toLowerCase() === 'on';
        });
        //console.log('Updating Local States:', newStates);
        setLocalDeviceStates(prev => ({ ...prev, ...newStates }));


    }, [devices]);


    useEffect(() => {
        fetchDevices()
    }, [currentRoom, allRooms]);








    const addDeviceOld = async (name, logo, temp, code) => {


        const roomData = allRooms.find((item) => item.room_id === currentRoom);
        if (roomData) {
            const newDevice = {
                name: name || 'New Device', //'Lebron',
                logo: logo || 'unicorn-variant', //'unicorn-variant',
                status: 'off',
                temperature: temp, //22,
                room: currentRoom,
                code: code,
            };



            try {
                const response = await fetch(
                    //Platform.OS == 'android' ? `http://10.0.2.2:8000/api/add-device/` : `http://127.0.0.1:8000/api/add-device/`,
                    `${API_BASE_URL}/api/add-device/`,
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

                fetchRooms2()
                fetchDevices()
            } catch (err) {
                console.error("Error adding device:", err.message);
            }

        }

    };

    /*
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
    */




    const setDeviceStatus = async (device_id, newStatus) => {
        //const newStatus = status === "on" ? "off" : "on";

        const formData = new URLSearchParams();
        //formData.append("status", newStatus);
        formData.append("status", newStatus.toLowerCase()); // Ensure lowercase

        //const url = Platform.OS == "android" ? `http://10.0.2.2:8000/api/update-device-status/${device_id}/` : `http://127.0.0.1:8000/api/update-device-status/${device_id}/`
        const url = `${API_BASE_URL}/api/update-device-status/${device_id}/`
        try {
            const response = await fetch(
                url + `?t=${Date.now()}`
                , {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: formData.toString(),
                });

            const data = await response.json();

            if (response.ok) {
                //setStatus(newStatus);
                //Alert.alert("Success", `Device status updated to ${newStatus}`);
                console.log("Device status changed")
                addAction(device_id, "Turned Device " + newStatus)

            } else {
                //Alert.alert("Error", data.error || "Failed to update status");
            }

            /*
            setRooms(prev => prev.map(room => ({
                ...room,
                devices: room.devices?.map(d =>
                    d.device_id === device_id
                        ? { ...d, status: newStatus, statusBool: newStatus === 'on' }
                        : d
                )
            })));
            */

            setDevices(prev => prev.map(d =>
                d.device_id === device_id
                    ? { ...d, status: newStatus, statusBool: newStatus === 'on' }
                    : d
            ));

            setLocalDeviceStates(prev => ({
                ...prev,
                [device_id]: newStatus === 'on'
            }));


            //await fetchDevices()


        } catch (error) {
            //Alert.alert("Error", "Could not connect to the server");
        }
    };




    const setEnergyConsumption = async (deviceId, incrementValue) => {
        const apiUrl = `${API_BASE_URL}/api/device/${deviceId}/set_energy/`;

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

    const updateDeviceStatus = (device_id, newStatus) => {
        //console.log("Turning Device from "+!status+" to "+newStatus)
        //console.log("Current Status: " + status)
        //toggleStatus(device_id, newStatus==false ? "on" : 'off')
        //toggleStatus(device_id, newStatus==true ? "on" : 'off')
        //toggleStatus(device_id, status)


        try {
            setDeviceStatus(device_id, newStatus);
            //console.log(newStatus)
            //console.log(localDeviceStates)


        } catch (error) {
            throw error;
        }
    };



    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const refresh = async () => {
                //await fetchRooms2();
                if (isActive) {
                    // Force devices update
                    const roomData = allRooms.find(item => item.room_id === currentRoom);
                    setDevices(roomData?.devices || []);
                }
            };

            refresh();

            return () => {
                isActive = false;
            };
        }, [])//[house_id, currentRoom]) // Add proper dependencies
    );



    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (route.params?.refresh) {
                //fetchRooms2();
                navigation.setParams({ refresh: false });
            }
        });

        return unsubscribe;
    }, [navigation, route.params]);


    const addAction = async (device_id, action) => {
        try {
            //const actionUrl = Platform.OS === 'android' ? `http://10.0.2.2:8000/api/device/${device_id}/activity/add-action/` : `http://127.0.0.1:8000/api/device/${device_id}/activity/add-action/`;
            const actionUrl = `${API_BASE_URL}/api/device/${device_id}/activity/add-action/`
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




    if (loading) {
        return (
            <View>

            </View>
        )
    }






    return (
        <View style={styles.container}>


            {/* Dynamic grid container */}
            <View style={[styles.gridContainer]}>

                {allRooms.length != [] && guestCode == '' && <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']} style={[styles.gridItem, styles.shadow]}>
                    <TouchableOpacity title="Add Device"
                        //onPress={openPopup/*addDevice*/
                        onPress={() => {
                            navigation.navigate("Device-Add", {
                                allRooms: allRooms,
                                currentRoom: currentRoom,
                                addDeviceOld: addDeviceOld,

                            })
                        }}
                        style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }} >
                        <Text style={styles.gridText}>Add Device</Text>
                    </TouchableOpacity>
                </LinearGradient>}
                {devices.map((device) => {

                    const currentState = localDeviceStates[device.device_id] ??
                        (device.status.toLowerCase() === 'on');

                    return (
                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']} style={[styles.gridItem, styles.shadow]}>
                            <TouchableOpacity
                                key={device.device_id}
                                //style={[styles.gridItem, styles.shadow]}
                                style={{ width: '100%', height: '100%' }}
                                onPress={() => {
                                    console.log("Standard Checkup: device: " + device + " id: " + device.device_id + " that is " + (device.status.charAt(0).toUpperCase() + device.status.slice(1)));
                                    navigation.navigate("DeviceDetail", {
                                        device: device,
                                        device_id: device.device_id,
                                        name: device.name,
                                        logo: device.logo,
                                        status: device.status,
                                        temp: device.temperature,
                                        room: allRooms.find(item => item.room_id === currentRoom)?.name,
                                        power: device.power_save,
                                        guestCode: guestCode
                                        //deleteDevice: deleteDevice
                                    }
                                    );
                                }}
                            >
                                <View style={[styles.deviceUpper]}>
                                    <MaterialCommunityIcons name={device.logo} size={Platform.OS == 'web' ? 60 : 40} color='rgb(255, 255, 255)' />

                                    <View style={{ width: '35%' }}>

                                        {/*
                                    <CustomSwitch
                                        device={device}
                                        value={(device.status.charAt(0).toUpperCase() + device.status.slice(1)) == "on" ? true : false}
                                    //changeValue={updateDeviceStatus}
                                    />
                                    */}




                                        <Switch
                                            //value={(device.status.charAt(0).toUpperCase() + device.status.slice(1)) == "On" ? true : false}
                                            //value={device.statusBool}
                                            value={localDeviceStates[device.device_id] || false}
                                            /*
                                            onValueChange={() => {
                                                updateDeviceStatus(device.device_id, device.status, device.statusBool)
                                                fetchRooms2()
                                                fetchDevices()
                                            }}
                                            */
                                            onValueChange={async (newValue) => {
                                                try {
                                                    const newStatus = newValue ? 'on' : 'off';
                                                    // Optimistically update local state
                                                    setLocalDeviceStates(prev => ({
                                                        ...prev,
                                                        [device.device_id]: newValue
                                                    }));

                                                    // Convert boolean to proper status string


                                                    // API call
                                                    const success = await updateDeviceStatus(device.device_id, newStatus);

                                                    if (success) {
                                                        await Promise.all([
                                                            fetchRooms2(),
                                                            fetchDevices()
                                                        ]);
                                                    }

                                                    // Refresh data after successful update
                                                    //await fetchRooms2();
                                                    //await fetchDevices();
                                                } catch (error) {
                                                    // Revert on error
                                                    setLocalDeviceStates(prev => ({
                                                        ...prev,
                                                        [device.device_id]: !newValue
                                                    }));
                                                    alert('Failed to update device status');
                                                }
                                            }}




                                            disabled={false}
                                            activeText={'On'}
                                            inActiveText={'Off'}
                                            circleSize={Platform.OS == 'web' ? 35 : 28}
                                            barHeight={Platform.OS == 'web' ? 30 : 24}
                                            circleBorderActiveColor={'rgb(152, 152, 152)'}
                                            circleBorderInactiveColor={'rgb(152, 152, 152)'}
                                            circleBorderWidth={2}
                                            backgroundActive={'rgb(4, 229, 60)'}
                                            backgroundInactive={'gray'}
                                            circleActiveColor={'rgb(255, 255, 255)'}
                                            circleInActiveColor={'rgb(255, 255, 255)'}
                                            renderInsideCircle={() => { }} // custom component to render inside the Switch circle (Text, Image, etc.)
                                            changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                                            innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
                                            outerCircleStyle={{}} // style for outer animated circle
                                            renderActiveText={false}
                                            renderInActiveText={false}
                                            switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                                            switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                                            switchWidthMultiplier={2} // multiplied by the `circleSize` prop to calculate total width of the Switch
                                            switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                                        />


                                    </View>

                                </View>

                                <View style={[styles.deviceLower, { marginLeft: 4 }]}>

                                    <View style={{ bottom: '5%', left: '10%' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={[{ fontSize: Platform.OS == 'web' ? 27 : 20, fontWeight: 'bold', color: 'white' }]}>
                                                {device.name}
                                            </Text>
                                            {device.power_save && <MaterialCommunityIcons

                                                name="lightning-bolt" color='white' size={Platform.OS == 'web' ? 30 : 20}
                                            />}
                                        </View>
                                        <Text style={[{ fontSize: Platform.OS == 'web' ? 20 : 15, fontWeight: 'bold', color: 'rgb(218, 218, 218)' }]}>
                                            {allRooms.find(item => item.room_id === currentRoom)?.name} • {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                                        </Text>

                                    </View>

                                    {true && <MaterialCommunityIcons

                                        name="chevron-right" color='white' size={Platform.OS == 'web' ? 50 : 40}
                                        style={{ position: 'absolute', right: '6%', }}
                                    />}

                                    {/*
                            <TouchableOpacity style={{ bottom: '5%', left: '10%' }} onPress={() => deleteDevice(device.device_id)}>
                                <MaterialCommunityIcons name="cross-bolnisi" color="white" size={22} />
                            </TouchableOpacity>
                            */}

                                </View>
                            </TouchableOpacity>
                        </LinearGradient>
                    )
                })}

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
        gap: Platform.OS == 'web' ? '7%' : '5%',
    },
    gridItem: {
        //width: '15%',
        width: Platform.OS == 'web' ? '30%' : '45%',
        maxWidth: 250,
        //minWidth: 130,
        //minHeight: 130,
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
            height: 5,
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
        gap: Platform.OS == 'web' ? '30%' : '20%',
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
        flex: 1,

    },
    popupContent: {
        //flexDirection: 'column',
        alignItems: 'center',
        gap: '2%',
        height: '100%',
        flex: 1,
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