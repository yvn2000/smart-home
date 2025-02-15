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


export default function DeviceDetail() {

    const route = useRoute()
    const navigation = useNavigation()

    const { device_id, name, logo, status, temp, room, deleteDevice } = route.params

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




    const returnSettings = (roomType) => {

        if (roomType == 'air-conditioner') {
            return (
                <ACPanel
                    device={{ device_id, name, logo, status, temp, room, deleteDevice }}
                />

            )
        }

        else if (roomType == 'lamp-outline') {
            return (
                <LightsPanel />
            )
        }

        else if (roomType == 'television') {
            return (
                
                <TVPanel />

            )

        }

        else if (roomType == 'air-filter') {
            return (
                <PurifierPanel
                />

            )
        }

        else if (roomType == 'thermostat') {
            
        }

        else if (roomType == 'blinds') {

            return (
                
                <BlindsPanel />

            )
        }

        else if (roomType == 'door') {
            return (
                <DoorssPanel />
            )
        }

        else if (roomType == 'fridge-outline') {

        }

        else if (roomType == 'washing-machine') {

        }

        else if (roomType == 'toaster-oven') {

        }

        else if (roomType == 'speaker') {
            return (
                <SpeakerPanel />
            )
        }

        else if (roomType == 'coffee-maker-outline') {

        }

        else if (roomType == 'robot-vacuum') {

        }

        else if (roomType == 'toilet') {

        }

        else {
            return (
                <View></View>
            )
        }

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


                            <TouchableOpacity style={[styles.backButton]} >
                                <MaterialCommunityIcons name="chevron-left" color='rgb(255, 3, 184)' size={50} onPress={() => navigation.goBack()} />
                            </TouchableOpacity>

                            <View style={[styles.mainContainer]}>

                                {/*
                                <Text style={[styles.testBorder, { fontSize: 20 }]}>This is the event detail screen for {device_id}</Text>
                                <Text style={{ fontSize: 14 }}>{name}</Text>
                                <Text style={{ fontSize: 14 }}>{logo}</Text>
                                <Text style={{ fontSize: 14 }}>{status}</Text>
                                <Text style={{ fontSize: 14 }}>temperature {temp}</Text>
                                */}

                                <View style={[styles.shadow, styles.statsBar]}>

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
                                            }} >
                                                69%
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[{ width: '33.3333%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', padding: 5, gap: 10 }]}>
                                        <MaterialCommunityIcons name='heart-pulse' size={Platform.OS == 'web' ? 65 : 40} color={'rgba(216, 75, 255, 0.9)'} />
                                        <View style={[]} >
                                            <Text style={{
                                                /* Idk why, but the bold weight for text is necessary else the last word doesnt show up on android, idk */
                                                fontWeight: 'bold',
                                                fontSize: Platform.OS == 'web' ? 30 : 15,
                                                color: 'rgb(56, 253, 109)'
                                            }} >
                                                Healthy
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
                                            }} >
                                                12 Hrs
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {returnSettings(logo)}

                                <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']} style={[styles.shadow, styles.deviceCard]}>
                                    <View style={[styles.deviceCardPart, { width: '20%' }]}>
                                        <View style={{ backgroundColor: 'white', borderRadius: 500 }}>
                                            <MaterialCommunityIcons name={logo} color='rgb(216, 75, 255)' size={50} style={{ left: 0, padding: 10 }} />
                                        </View>
                                    </View>
                                    <View style={[styles.deviceCardPart, { width: '60%', alignItems: 'baseline' }]}>
                                        <View>
                                            <Text style={{ fontSize: 30, color: 'white', fontWeight: 'bold' }}>{name}</Text>
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 17, color: 'rgb(225, 224, 224)', fontWeight: 'bold' }}>
                                                {room} • {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[styles.deviceCardPart, { width: '20%' }]}>
                                        <TouchableOpacity style={[styles.switch]}>

                                            <View style={[styles.switchCircle]}>
                                                {/*<Text>On</Text>*/}
                                            </View>

                                        </TouchableOpacity>
                                    </View>
                                </LinearGradient>








                                <View style={[styles.options]}>

                                    <View style={[{ width: '25%', aspectRatio: 1, padding: 20 }]}>
                                        <TouchableOpacity style={[styles.shadow, styles.optionButton]}>
                                            <MaterialCommunityIcons name="alarm" color='rgb(216, 75, 255)' size={70} />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={[{ width: '25%', aspectRatio: 1, padding: 20, }]}>
                                        <TouchableOpacity style={[styles.shadow, styles.optionButton]}
                                            onPress={() => {
                                                //Make a popup box to confirm energy saving mode
                                            }}>
                                            <Ionicons name="flash-outline" color='rgb(216, 75, 255)' size={70} />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={[{ width: '25%', aspectRatio: 1, padding: 20 }]}>
                                        <TouchableOpacity style={[styles.shadow, styles.optionButton]}
                                            onPress={() => {
                                                navigation.goBack();
                                                navigation.navigate("StatisticsStack");
                                                //navigation.goBack();
                                            }}>
                                            <MaterialCommunityIcons name="chart-line" color='rgb(216, 75, 255)' size={70} />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={[{ width: '25%', aspectRatio: 1, padding: 20 }]}>
                                        <TouchableOpacity style={[styles.shadow, styles.optionButton, { backgroundColor: 'red' }]}
                                            onPress={() => {
                                                deleteDevice(device_id);
                                                navigation.goBack();
                                            }}
                                        >
                                            <MaterialCommunityIcons name="delete" color='white' size={70} />
                                        </TouchableOpacity>
                                    </View>
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

    deviceCard: {
        flexDirection: 'row',
        borderRadius: 50,
        backgroundColor: 'rgb(216, 75, 255)',
        width: '100%',
        maxWidth: 500,
        alignItems: 'center',
        justifyContent: 'center'
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
