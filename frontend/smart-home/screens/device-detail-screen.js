import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, PanResponder

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { useTheme } from "../components/themes/theme";

import LavaLampBackground from "../components/themes/lava-lamp-bg";
import TempDial from "../components/dial";
import VerticalSlider from "../components/vertical-slider";
//import { CustomSwitch } from '../components/switch';

import ACPanel from "../components/device-panels/ac";
import LightsPanel from "../components/device-panels/lights";
import BlindsPanel from "../components/device-panels/blinds";
import DoorssPanel from "../components/device-panels/doors";
import TVPanel from "../components/device-panels/tvpanel";
import PurifierPanel from "../components/device-panels/purifier";
import SpeakerPanel from "../components/device-panels/speaker";
import RoombaPanel from "../components/device-panels/roomba";
import ThermoPanel from "../components/device-panels/thermostat";
import FridgePanel from "../components/device-panels/fridge";
import WMPanel from "../components/device-panels/washing";
import OvenPanel from "../components/device-panels/oven";
import CoffeePanel from "../components/device-panels/coffee";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { DUMMY_DATA } from "../data/dummy-device-data";

import { HeaderBackButton } from "@react-navigation/elements";
import { LinearGradient } from 'expo-linear-gradient';

import Animated, {
    useSharedValue, useAnimatedStyle, withRepeat, withTiming,
    withDelay, withSpring, withSequence, Easing, useAnimatedProps,
    interpolate, Extrapolation
} from 'react-native-reanimated';

import Modal from "react-native-modal";

import { Switch } from 'react-native-switch';

import { API_BASE_URL } from "../src/config";


export default function DeviceDetail() {

    const route = useRoute()
    const navigation = useNavigation()

    const { device, device_id, name, logo, status, temp, room, deleteDevice, power, guestCode } = route.params
    //console.log("Status: "+status)

    const [loading, setLoading] = useState(true);


    const [deviceStatus, setDeviceStatus] = useState(status.toLowerCase() === 'on');
    const [powerSave, setPowerSave] = useState(power)

    useEffect(() => {
        setPowerSave(power)
    }, [power])

    //console.log("StatusBool: "+deviceStatus)

    const [isUpdating, setIsUpdating] = useState(false);

    // Sync with route params changes
    useEffect(() => {
        setDeviceStatus(status.toLowerCase() === 'on');
    }, [status]);




    useEffect(() => {
        //console.log("GOAT: " + device_id)
        setLoading(false)
    }, [device, device_id]); // Logs when devices update

    /*
    useLayoutEffect(() => {
        navigation.setOptions({
            gestureEnabled: true,
            headerBackTitle: 'Back',
            headerStyle: [themeMode, {
                //backgroundColor:'red'
                borderWidth: 0,
            }],

            headerTitle: name,
            headerTitleStyle: {
                fontSize: 20,
                color: 'rgb(216, 75, 255)',
                fontWeight: 'bold',

            },
            headerLeft: () => (
                <HeaderBackButton
                    tintColor='rgb(216, 75, 255)'
                    onPress={() => navigation.goBack()}
                />
            )
        })
    }, [])
    */

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


    //console.log(device_id)

    const returnSettings = (roomType) => {

        if (roomType == 'air-conditioner') {

            console.log("AC: " + device)
            return (
                <ACPanel
                    device={{ device_id, name, logo, status, temp, room, deleteDevice }}
                />

            )
        }

        else if (roomType == 'lamp-outline') {
            return (
                <LightsPanel
                    device={{ device_id, name, logo, status, room, deleteDevice }}
                />
            )
        }

        else if (roomType == 'television') {
            return (

                <TVPanel
                    device={{ device_id, name, logo, status, room, deleteDevice }}

                />

            )

        }

        else if (roomType == 'air-filter') {
            return (
                <PurifierPanel
                    device={{ device_id, name, logo, status, room, deleteDevice }}
                />

            )
        }

        else if (roomType == 'thermostat') {
            return (
                <ThermoPanel
                    device={{ device_id, name, logo, status, temp, room, deleteDevice }}
                />
            )
        }

        else if (roomType == 'blinds') {

            return (

                <BlindsPanel
                    device={{ device_id, name, logo, status, room, deleteDevice }}
                />

            )
        }

        else if (roomType == 'door') {
            return (
                <DoorssPanel
                    device={{ device_id, name, logo, status, room, deleteDevice }}
                />
            )
        }

        else if (roomType == 'fridge-outline') {
            return (
                <FridgePanel
                    device={{ device_id, name, logo, status, room, deleteDevice }}
                />
            )
        }

        else if (roomType == 'washing-machine') {
            return (
                <WMPanel
                    device={{ device_id, name, logo, status, room, deleteDevice }}
                />
            )
        }

        else if (roomType == 'toaster-oven') {
            return (
                <OvenPanel
                    device={{ device_id, name, logo, status, room, deleteDevice }}
                />
            )
        }

        else if (roomType == 'speaker') {
            return (
                <SpeakerPanel
                    device={{ device_id, name, logo, status, room, deleteDevice }}
                />
            )
        }

        else if (roomType == 'coffee-maker-outline') {
            return (
                <CoffeePanel
                    device={{ device_id, name, logo, status, room, deleteDevice }}
                />
            )
        }

        else if (roomType == 'robot-vacuum') {
            return (
                <RoombaPanel
                    device={{ device_id, name, logo, status, room, deleteDevice }}
                />
            )
        }

        else {
            return (
                <View></View>
            )
        }

    }

    const addAction = async (action) => {
        try {
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


    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const setDeviceStatusFunc = async () => {
        //const newStatus = status === "on" ? "off" : "on";

        //console.log("device status inside the func: "+deviceStatus)

        const newStatus = deviceStatus === true ? 'off' : 'on';

        //console.log("NewStatus: "+newStatus)

        const formData = new URLSearchParams();
        //formData.append("status", newStatus);
        formData.append("status", newStatus.toLowerCase()); // Ensure lowercase

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
                setDeviceStatus(!deviceStatus);
                addAction("Turned Device " + newStatus)
                //Alert.alert("Success", `Device status updated to ${newStatus}`);
            } else {
                //Alert.alert("Error", data.error || "Failed to update status");
            }




        } catch (error) {
            //Alert.alert("Error", "Could not connect to the server");
        }
    };

    const updateDeviceStatus = () => {
        //console.log("Turning Device from "+!status+" to "+newStatus)
        //console.log("Current Status: " + status)
        //toggleStatus(device_id, newStatus==false ? "on" : 'off')
        //toggleStatus(device_id, newStatus==true ? "on" : 'off')
        //toggleStatus(device_id, status)


        try {
            setDeviceStatusFunc();
            //console.log(newStatus)
            //console.log(localDeviceStates)


        } catch (error) {
            throw error;
        }
    };



    const togglePowerSave = async () => {
        try {

            const url = `${API_BASE_URL}/api/power-save/${device_id}/`

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    power: !powerSave  // Send actual boolean value
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();

                throw new Error(errorData.error || 'Failed to update power save');
            }
            setPowerSave(!powerSave)
            return await response.json();
        } catch (error) {
            console.error('Power save error:', error);
            throw error;
        }
    };




    const [isDelDropdownVisible, setDelDropdownVisible] = useState(false);
    const toggleDelDropdown = () => {
        setDelDropdownVisible(!isDelDropdownVisible);
    };
    const toggleAsyncDelDropdown = async () => {
        setDelDropdownVisible(!isDelDropdownVisible);
        setTimeout(1000)
        return true;
    };

    const deleteDeviceFunc = async (deviceId) => {
        //console.log(deviceId)
        try {
            const response = await fetch(
                //`http://127.0.0.1:8000/api/delete-device/${deviceId}/`,
                `${API_BASE_URL}/api/delete-device/${deviceId}/`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            /*
            const ret = await toggleAsyncDelDropdown();
            if (ret) {
                navigation.goBack();
            }
            */
            console.log("going back")
            navigation.goBack();


            //setDevices((prevDevices) => prevDevices.filter((device) => device.device_id !== deviceId));
            console.log(`Device ${deviceId} deleted successfully`);
        } catch (err) {
            console.error("Error deleting device:", err.message);
        }
    };








    if (loading) {
        return (
            <View>

            </View>
        )
    }




    return (



        <View style={{ height: '100%', flex: 1 }}>
            <StatusBar style={theme == 'light' ? 'dark' : 'light'} />
            <View style={{ height: '100%', width: '100%', display: 'flex' }}>
                {(theme == 'crazy') && <LavaLampBackground />}
            </View>

            {/*Main Screen*/}
            <View style={[styles.screen, themeMode, { position: 'absolute', /*flexDirection: 'row'*/ }]}>

                <ScrollView style={[{ height: '100%' }]}>

                    <SafeAreaProvider style={[{ height: '100%', width: '100%' }]}>
                        <SafeAreaView style={[{ height: '100%', width: '100%' }]}>


                            <TouchableOpacity style={[styles.backButton, { maxHeight: 80 }]} >
                                <MaterialCommunityIcons name="chevron-left" color={theme == 'crazy' ? 'white' : 'rgb(255, 3, 184)'} size={50} onPress={() => navigation.goBack()} />
                            </TouchableOpacity>


                            <View style={[{ position: 'absolute', paddingRight: 10, top: Platform.OS == 'web' ? 20 : 80, right: Platform.OS == 'web' ? 15 : 10 }]}>
                                <TouchableOpacity style={[{}]} onPress={toggleDropdown}>
                                    <MaterialCommunityIcons name="menu" size={Platform.OS == 'web' ? 40 : 30} color={theme == 'crazy' ? 'white' : 'rgb(255, 3, 184)'} />
                                </TouchableOpacity>

                                <Modal
                                    isVisible={isDropdownVisible}
                                    onBackdropPress={() => setDropdownVisible(false)} // Close when tapping outside
                                    animationIn="zoomInRight"
                                    animationOut="zoomOutRight"
                                    backdropOpacity={0.3}
                                    style={[{}]}
                                >

                                    <View style={[styles.shadow, styles.dropdownContainer, { borderRadius: 30 }]}>
                                        {/* Custom View Items */}
                                        <TouchableOpacity style={styles.dropdownItem}
                                            onPress={() => {
                                                toggleDropdown()
                                                navigation.navigate("DeviceAuto", {
                                                    device: device,
                                                    device_id: device_id,
                                                })
                                            }}>
                                            <View style={{
                                                padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10,
                                                borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white'
                                            }}>
                                                <MaterialCommunityIcons name="refresh-auto" size={Platform.OS == 'web' ? 70 : 20} color={theme == 'dark' ? 'white' : 'rgb(255, 3, 184)'} />
                                                <Text style={{ color: theme == 'dark' ? 'white' : 'rgb(255, 3, 184)', fontWeight: 'bold' }}>Automation</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.dropdownItem}
                                            onPress={() => {
                                                //toggleDropdown();
                                                togglePowerSave();

                                            }}>
                                            <View style={{ backgroundColor: powerSave ? 'yellow' : (theme == 'dark' ? 'rgb(26, 28, 77)' : 'white'), padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                <Ionicons name="flash-outline" color={powerSave ? 'rgb(255, 187, 0)' : (theme == 'dark' ? 'white' : 'rgb(255, 3, 184)')} size={Platform.OS == 'web' ? 70 : 20} />
                                                <Text style={{ color: powerSave ? 'rgb(255, 187, 0)' : (theme == 'dark' ? 'white' : 'rgb(255, 3, 184)'), fontWeight: 'bold' }}>Energy Mode</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                                            toggleDropdown()
                                            navigation.goBack();
                                            navigation.navigate("StatisticsStack");
                                        }}>
                                            <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white' }}>
                                                <MaterialCommunityIcons name="chart-line" size={Platform.OS == 'web' ? 70 : 20} color={theme == 'dark' ? 'white' : 'rgb(255, 3, 184)'} />
                                                <Text style={{ color: theme == 'dark' ? 'white' : 'rgb(255, 3, 184)', fontWeight: 'bold' }}>Statistics</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={{}} onPress={() => {

                                            if (guestCode == '') {
                                                toggleDropdown()
                                                deleteDeviceFunc(device_id);
                                            }
                                        }}>
                                            <LinearGradient colors={[guestCode == '' ? 'rgb(255, 3, 184)' : 'rgb(133, 133, 133)', 'transparent']}
                                                style={{
                                                    backgroundColor: guestCode == '' ? 'red' : 'rgb(133, 133, 133)', padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10,
                                                    borderBottomLeftRadius: 30, borderBottomRightRadius: 30
                                                }}>
                                                <MaterialCommunityIcons name="delete" size={Platform.OS == 'web' ? 70 : 20} color={guestCode == '' ? 'white' : 'rgb(111, 111, 111)'} />
                                                <Text style={{ color: guestCode == '' ? 'white' : 'rgb(196, 196, 196)', fontWeight: 'bold' }}>Delete Device</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>



                                    </View>


                                </Modal>

                            </View>



                            <View style={[styles.mainContainer, { gap: 40 }]}>

                                {/*
                                <Text style={[styles.testBorder, { fontSize: 20 }]}>This is the event detail screen for {device_id}</Text>
                                <Text style={{ fontSize: 14 }}>{name}</Text>
                                <Text style={{ fontSize: 14 }}>{logo}</Text>
                                <Text style={{ fontSize: 14 }}>{status}</Text>
                                <Text style={{ fontSize: 14 }}>temperature {temp}</Text>
                                */}

                                <View style={[styles.shadow, styles.statsBar, { backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white', justifyContent: 'center' }]}>

                                    <View style={[{ width: '33.33333%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', padding: 10 }]}>
                                        <MaterialCommunityIcons name="battery-medium" size={Platform.OS == 'web' ? 60 : 40} color={'rgba(216, 75, 255, 0.9)'} />
                                        <View style={[]} >
                                            <Text style={{
                                                fontWeight: 'bold',
                                                fontSize: Platform.OS == 'web' ? 20 : 10,
                                                color: 'rgb(165, 165, 165)'
                                            }} >
                                                Battery
                                            </Text>
                                            <Text style={{
                                                /* Idk why, but the bold weight for text is necessary else the last word doesnt show up on android, idk */
                                                fontWeight: 'bold',
                                                fontSize: Platform.OS == 'web' ? 30 : 15,
                                                color: theme == 'dark' ? 'rgb(255, 255, 255)' : 'black'
                                            }} >
                                                69%
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={[{ width: '33.3333%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', padding: 5, gap: 10 }]}>
                                        <MaterialCommunityIcons name="clock-fast" size={Platform.OS == 'web' ? 65 : 40} color={'rgba(216, 75, 255, 0.9)'} />
                                        <View style={[]} >
                                            <Text style={{
                                                fontWeight: 'bold',
                                                width: Platform.OS == 'web' ? 80 : 60,
                                                fontSize: Platform.OS == 'web' ? 20 : 10,
                                                color: 'rgb(165, 165, 165)'
                                            }} >
                                                Runtime
                                            </Text>
                                            <Text style={{
                                                /* Idk why, but the bold weight for text is necessary else the last word doesnt show up on android, idk */
                                                fontWeight: 'bold',
                                                fontSize: Platform.OS == 'web' ? 30 : 15,
                                                color: theme == 'dark' ? 'rgb(255, 255, 255)' : 'black'
                                            }} >
                                                12 Hrs
                                            </Text>
                                        </View>
                                    </View>
                                </View>



                                {returnSettings(logo)}

                                <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']} style={[styles.shadow, styles.deviceCard]}>
                                    <View style={[styles.deviceCardPart, { height: '100%', aspectRatio: 1, left: Platform.OS == 'web' ? 0 : 0 }]}>
                                        <View style={{ backgroundColor: 'white', borderRadius: 500 }}>
                                            <MaterialCommunityIcons name={logo} color='rgb(216, 75, 255)' size={Platform == 'web' ? 50 : 40} style={{ left: 0, padding: 10 }} />
                                        </View>
                                    </View>
                                    <View style={[styles.deviceCardPart, { width: '60%', alignItems: 'baseline', left: Platform.OS == 'web' ? 0 : -10 }]}>
                                        <View>
                                            <Text style={{ fontSize: Platform.OS == 'web' ? 30 : 23, color: 'white', fontWeight: 'bold' }}>{name}</Text>
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: Platform.OS == 'web' ? 17 : 15, color: 'rgb(225, 224, 224)', fontWeight: 'bold' }}>
                                                {room} {/* • {status.charAt(0).toUpperCase() + status.slice(1)} */}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[styles.deviceCardPart, { height: '60%', aspectRatio: 2 / 1, position: 'absolute', right: 0 }]}>


                                        <Switch
                                            //value={(device.status.charAt(0).toUpperCase() + device.status.slice(1)) == "On" ? true : false}
                                            //value={device.statusBool}
                                            //value={status.lowerCase() === "on" ? true : false}
                                            value={deviceStatus}
                                            /*
                                            onValueChange={() => {
                                                updateDeviceStatus(device.device_id, device.status, device.statusBool)
                                                fetchRooms2()
                                                fetchDevices()
                                            }}
                                            */
                                            onValueChange={async (newValue) => { updateDeviceStatus() }}




                                            disabled={false}
                                            activeText={'On'}
                                            inActiveText={'Off'}
                                            circleSize={35}
                                            barHeight={30}
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




                                        {/*
                                        <CustomSwitch
                                            device={device}
                                            value={(device.status.charAt(0).toUpperCase() + device.status.slice(1)) == "on" ? true : false}
                                        //changeValue={updateDeviceStatus}
                                        />
                                        */}
                                    </View>
                                </LinearGradient>







                                {Platform.OS == 'web' &&
                                    <View style={[styles.options]}>

                                        <View style={[{ width: '25%', aspectRatio: 1, padding: 20 }]}>
                                            <TouchableOpacity style={[styles.shadow, styles.optionButton,
                                            { backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white' }
                                            ]}
                                                onPress={() => {
                                                    navigation.navigate("DeviceAuto", {
                                                        device: device,
                                                        device_id: device_id,
                                                    })
                                                }}>
                                                <MaterialCommunityIcons name="refresh-auto" color='rgb(216, 75, 255)' size={70} />
                                            </TouchableOpacity>
                                        </View>

                                        <View style={[{ width: '25%', aspectRatio: 1, padding: 20, }]}>
                                            <TouchableOpacity style={[styles.shadow, styles.optionButton, powerSave && { backgroundColor: 'yellow' },
                                            !powerSave && { backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white' }
                                            ]}
                                                onPress={() => {
                                                    //Make a popup box to confirm energy saving mode
                                                    togglePowerSave()

                                                }}>
                                                <Ionicons name="flash-outline" color={'rgb(216, 75, 255)'} size={70} />
                                            </TouchableOpacity>
                                        </View>

                                        <View style={[{ width: '25%', aspectRatio: 1, padding: 20 }]}>
                                            <TouchableOpacity style={[styles.shadow, styles.optionButton,
                                            { backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white' }
                                            ]}
                                                onPress={() => {
                                                    navigation.goBack();
                                                    navigation.navigate("StatisticsStack");
                                                    //navigation.goBack();
                                                }}>
                                                <MaterialCommunityIcons name="chart-line" color='rgb(216, 75, 255)' size={70} />
                                            </TouchableOpacity>
                                        </View>

                                        <View style={[{ width: '25%', aspectRatio: 1, padding: 20 }]}>
                                            <TouchableOpacity style={[styles.shadow, styles.optionButton, {
                                                backgroundColor: guestCode == '' ? 'red' : 'rgb(133, 133, 133)'
                                            }]}
                                                onPress={() => {
                                                    if (guestCode == '') {
                                                        deleteDeviceFunc(device_id);
                                                    }

                                                    //setTimeout(5000);
                                                    //navigation.goBack();
                                                    //toggleDelDropdown()
                                                }}
                                            >
                                                <MaterialCommunityIcons name="delete" color={guestCode == '' ? 'white' : 'rgb(111, 111, 111)'} size={70} />
                                            </TouchableOpacity>
                                        </View>

                                        <Modal
                                            isVisible={isDelDropdownVisible}
                                            onBackdropPress={() => setDelDropdownVisible(false)} // Close when tapping outside
                                            animationIn="zoomInRight"
                                            animationOut="zoomOutRight"
                                            backdropOpacity={0.3}
                                            style={[{}]}
                                        >

                                            <View style={[styles.shadow, styles.dropdownDelContainer, { backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white' }]}>


                                                <TouchableOpacity style={[{ maxHeight: 80, position: 'absolute', top: 15, right: 30 }]} >
                                                    <MaterialCommunityIcons name="close" color='rgb(255, 3, 184)' size={50}
                                                        onPress={() => { setDelDropdownVisible(false) }}
                                                    />
                                                </TouchableOpacity>


                                                <View>
                                                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'red', textAlign: 'center' }}>
                                                        Are you sure you want to delete {name}?
                                                    </Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', gap: 30, justifyContent: 'center' }}>

                                                    <TouchableOpacity style={{ aspectRatio: 2 / 1 }}
                                                        onPress={async () => {
                                                            const ret = await toggleAsyncDelDropdown()
                                                            if (ret) {
                                                                deleteDeviceFunc(device_id);
                                                            }
                                                            //deleteDeviceFunc(device_id);
                                                            //navigation.goBack();

                                                        }}
                                                    >

                                                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                                            style={{ width: '100%', backgroundColor: 'red', padding: 20, borderRadius: 50 }}
                                                        >
                                                            <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                                                                Delete {name}
                                                            </Text>
                                                        </LinearGradient>

                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={{ aspectRatio: 1.5 / 1 }}
                                                        onPress={() => {
                                                            toggleDelDropdown()
                                                        }}
                                                    >

                                                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                                            style={{ width: '100%', backgroundColor: 'rgb(216, 75, 255)', padding: 20, borderRadius: 50 }}
                                                        >
                                                            <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
                                                                Cancel
                                                            </Text>
                                                        </LinearGradient>

                                                    </TouchableOpacity>

                                                </View>



                                            </View>


                                        </Modal>


                                    </View>
                                }


                            </View>


                            <View style={{ height: 150 }}>{/*To allow space for tab bar to not overlap elements*/}</View>


                        </SafeAreaView>
                    </SafeAreaProvider>

                </ScrollView >



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
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },

    backButton: {
        //width:'10%',
        maxWidth: 80,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },

    deviceCard: {
        flexDirection: 'row',
        borderRadius: 50,
        backgroundColor: 'rgb(216, 75, 255)',
        width: '80%',
        maxWidth: 500,
        alignItems: 'center',
        //justifyContent: 'center',
        top: Platform.OS == 'web' ? 0 : -55,
        maxHeight: 90,
    },
    deviceCardPart: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    switch: {
        //width: '100%',
        //height: '100%',
        width: '90%',
        borderRadius: 500,
        aspectRatio: 2 / 1,
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

    options: {
        width: '100%',
        maxWidth: 650,
        flexDirection: 'row',
    },
    optionButton: {
        width: '60&',       //& apparently makes it centered perfectly idk
        aspectRatio: 1,
        borderRadius: 40,
        backgroundColor: 'rgb(235, 235, 235)',
        justifyContent: 'center',
        alignItems: 'center',
    },


    statsBar: {
        width: '90%',
        maxWidth: 900,
        flexDirection: 'row',
        backgroundColor: "rgb(255, 255, 255)",
        borderRadius: 70,
    },


    dropdownContainer: {
        width: '40%',
        alignSelf: 'flex-end',
        position: 'absolute',
        top: 40,
        right: 0,
    },

    dropdownDelContainer: {
        width: '100%',
        maxWidth: 1000,
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: 'white',
        height: '80%',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3%',

    },






    chosenButton: {
        backgroundColor: 'rgba(216, 75, 255, 1)'
    },
    notChosenButton: {
        backgroundColor: 'rgb(235, 235, 235)'
    },



    darkMode: {
        backgroundColor: 'rgb(17, 18, 44)',
    },
    lightMode: {
        backgroundColor: "rgb(245, 238, 246)",
    },
    crazyMode: {
        backgroundColor: 'rgba(216, 83, 196, 0)'
    }
});
