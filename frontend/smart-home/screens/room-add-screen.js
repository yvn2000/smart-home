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

import { API_BASE_URL } from "../src/config";


export default function RoomAdd() {

    const route = useRoute()

    const { houseId, setRoomCount } = route.params; // Passed from navigation

    const navigation = useNavigation()

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


    //const { addRoom, allRooms, setRoom } = route.params

    const [newRoomName, setNewRoomName] = useState('')


    const addRoom = async (newRoomName) => {
        if (!newRoomName) {
            //Alert.alert("Error", "Please enter room name and temperature");
            return;
        }

        //const addUrl = Platform.OS == 'web' ? `http://127.0.0.1:8000/api/houses/${houseId}/add-room/` : `http://10.0.2.2:8000/api/houses/${houseId}/add-room/`
const addUrl = `${API_BASE_URL}/api/houses/${houseId}/add-room/`
        try {
            const response = await fetch(addUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newRoomName }),
            });

            if (response.ok) {
                //Alert.alert("Success", "Room added!");
                setNewRoomName("");
                setRoomCount(1)
                navigation.goBack()
            } else {
                //Alert.alert("Error", "Failed to add room");
            }
        } catch (error) {
            console.error("Error adding room:", error);
        }
    };











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


                            <TouchableOpacity style={[styles.backButton, {position:'absolute', top:Platform.OS=='web' ? 0 : 30,}]} >
                                <MaterialCommunityIcons name="chevron-left" color={theme=='crazy' ? 'white' : 'rgb(255, 3, 184)'} size={50}
                                    onPress={() => {
                                        navigation.goBack()
                                        //navigation.navigate("Devices")
                                    }}
                                />
                            </TouchableOpacity>


                            <View style={[styles.mainContainer, {marginTop:50,}]}>

                                <Text
                                    style={{ fontWeight: 'bold', fontSize: 30, color:theme=='crazy' ? 'white' : 'rgb(255, 3, 184)' }}
                                >
                                    Add Room
                                </Text>

                                <TextInput
                                    style={[styles.shadow, styles.input, 
                                        {backgroundColor:theme=='dark' ? 'rgb(26, 28, 77)' : 'white', borderColor:theme=='dark' ? 'rgb(26, 28, 77)' : 'white',
                                            color:theme=='dark' ? 'white' : 'black',
                                        }]}
                                    placeholder="Room Name"
                                    placeholderTextColor={'rgb(156, 156, 156)'}
                                    value={newRoomName}
                                    onChangeText={setNewRoomName}
                                    
                                />


                                


                                <View style={{ flexDirection: 'row', gap: 20 }}>
                                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                        style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', padding: 20, borderRadius: 25, alignItems: 'center', justifyContent: 'center' }]}
                                    >
                                        <TouchableOpacity onPress={() => {
                                            //addDeviceOld(newDeviceName, newDeviceLogo, newDeviceTemp)
                                            addRoom(newRoomName)
                                            //navigation.goBack();
                                        }}
                                            style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'white' }}>Add Room</Text>
                                        </TouchableOpacity>

                                    </LinearGradient>

                                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                        style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', padding: 30, borderRadius: 25, alignItems: 'center', justifyContent: 'center' }]}
                                    >
                                        <TouchableOpacity onPress={() => {
                                            navigation.goBack();
                                        }}
                                            style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'white' }}>Cancel</Text>
                                        </TouchableOpacity>
                                    </LinearGradient>
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
        backgroundColor: 'white'
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
