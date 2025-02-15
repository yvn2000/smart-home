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

import ACPanel from "../components/device-panels/ac";
import LightsPanel from "../components/device-panels/lights";
import BlindsPanel from "../components/device-panels/blinds";
import DoorssPanel from "../components/device-panels/doors";
import TVPanel from "../components/device-panels/tvpanel";
import PurifierPanel from "../components/device-panels/purifier";
import SpeakerPanel from "../components/device-panels/speaker";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { DUMMY_DATA } from "../data/dummy-device-data";

import { HeaderBackButton } from "@react-navigation/elements";
import { LinearGradient } from 'expo-linear-gradient';

import Animated, {
    useSharedValue, useAnimatedStyle, withRepeat, withTiming,
    withDelay, withSpring, withSequence, Easing, useAnimatedProps,
    interpolate, Extrapolation
} from 'react-native-reanimated';


export default function DeviceAdd() {

    const route = useRoute()
    const navigation = useNavigation()


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


    const { allRooms, currentRoom, addDeviceOld } = route.params


    const [newDeviceName, setNewDeviceName] = useState('')
    const [newDeviceLogo, setNewDeviceLogo] = useState('')
    const [newDeviceTemp, setNewDeviceTemp] = useState(22)

    const [sampleDevices, setSampleDevices] = useState([
        { "Air Conditioner": 'air-conditioner' },
        { "Lights": 'lamp-outline' },
        { "TV": 'television' },
        { "Air Purifier": 'air-filter' },
        { "Thermostat": 'thermostat' },
        { "Blinds": 'blinds' },
        { "Door Locks": 'door' },
        { "Refrigerator": 'fridge-outline' },
        { "Washing Machine": 'washing-machine' },
        { "Oven": 'toaster-oven' },
        { "Speaker": 'speaker' },
        { "Coffee Maker": 'coffee-maker-outline' },
        { "Roomba": 'robot-vacuum' },
        { "Toilet": 'toilet' },
    ])











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


                            <TouchableOpacity style={[styles.backButton]} >
                                <MaterialCommunityIcons name="chevron-left" color='rgb(255, 3, 184)' size={50} onPress={() => navigation.goBack()} />
                            </TouchableOpacity>


                            <View style={[styles.mainContainer]}>

                                <Text
                                    style={{ fontWeight: 'bold', fontSize: 30 }}
                                >
                                    Add Device
                                </Text>

                                <TextInput
                                    style={[styles.shadow, styles.input]}
                                    placeholder="Device Name"
                                    placeholderTextColor={'rgb(156, 156, 156)'}
                                    value={newDeviceName}
                                    onChangeText={setNewDeviceName}
                                />


                                <View style={[styles.deviceTypes]}>

                                    <ScrollView horizontal={true}
                                        style={{ width: '100%', height: '100%', }}
                                        contentContainerStyle={{ alignItems: 'center', padding: 30, gap: 20 }}

                                    >



                                        {sampleDevices.map((device, index) => {
                                            const deviceName = Object.keys(device)[0];
                                            const deviceLogo = device[deviceName];
                                            return (
                                                <TouchableOpacity
                                                    key={index}
                                                    style={[
                                                        styles.deviceType,
                                                        styles.shadow,
                                                        {
                                                            backgroundColor: newDeviceLogo === deviceLogo ? 'rgb(255, 3, 184)' : 'rgb(235, 235, 235)',
                                                        },
                                                    ]}
                                                    onPress={() => {
                                                        setNewDeviceLogo(newDeviceLogo === deviceLogo ? '' : deviceLogo);
                                                    }}
                                                >
                                                    <MaterialCommunityIcons
                                                        name={deviceLogo}
                                                        size={60}
                                                        color={newDeviceLogo === deviceLogo ? 'black' : 'black'}
                                                    />
                                                    <Text
                                                        style={{
                                                            fontWeight: 'bold', color: newDeviceLogo === deviceLogo ? 'black' : 'black',
                                                            flexWrap: 'wrap'
                                                        }}>
                                                        {deviceName}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}


                                    </ScrollView>
                                </View>


                                <View style={{ flexDirection: 'row', gap: 20 }}>
                                    <TouchableOpacity
                                        style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', padding: 20, borderRadius: 25, alignItems: 'center', justifyContent: 'center' }]}
                                        onPress={() => {
                                            addDeviceOld(newDeviceName, newDeviceLogo, newDeviceTemp)
                                            navigation.goBack();
                                        }}
                                    >
                                        <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'white' }}>Add Device</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', padding: 30, borderRadius: 25, alignItems: 'center', justifyContent: 'center' }]}
                                        onPress={() => {}}
                                    >
                                        <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'white' }}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>






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
            height: 10,
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
        fontSize: 30,
        backgroundColor:'white'
    },








    chosenButton: {
        backgroundColor: 'rgba(216, 75, 255, 1)'
    },
    notChosenButton: {
        backgroundColor: 'rgb(235, 235, 235)'
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
