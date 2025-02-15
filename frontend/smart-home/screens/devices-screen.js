import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState } from "react";
import { useTheme } from "../components/themes/theme";

import LavaLampBackground from "../components/themes/lava-lamp-bg";
import Pet from "../components/cat";
import TempDial from "../components/dial";
import DevicesGrid from "../components/devices-grid";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { DUMMY_DATA } from "../data/dummy-device-data";
import { LinearGradient } from 'expo-linear-gradient';


export default function DevicesScreen() {

    const navigation = useNavigation()

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




    const [currentRoom, setCurrentRoom] = useState(1);

    const renderRoom = ({ item }) => {

        return (
            <View style={[{ alignItems: 'center' }]}>
                <TouchableOpacity
                    style={[styles.room,
                    { backgroundColor: (item.room_id == currentRoom) ? 'rgb(216, 75, 255)' : 'rgb(255, 255, 255)' }]}
                    onPress={() => {
                        //console.log("Current Room is: " + item.room);
                        setCurrentRoom(item.room_id)
                    }}>
                    <Text style={[{
                        //width:50,
                        fontSize: Platform.OS == 'web' ? 30 : 10,
                        color: (item.room_id == currentRoom) ? 'rgb(255, 255, 255)' : 'rgb(3, 3, 3)'
                    }]}>
                        {item.room}
                    </Text>
                </TouchableOpacity>
                {item.room_id == currentRoom &&
                    <View
                        style={[{
                            backgroundColor: 'rgb(216, 75, 255)',
                            borderColor: 'rgb(216, 75, 255)',
                            borderWidth: 2, width: '70%', top: 3
                        }]}></View>
                }
            </View>

        )
    }



    const [modeStates, setModeState] = useState({
        cool: true,
        hot: false,
        energy: false,
    })
    const isChosen = (status) => {

        if (status == "cool") {
            if (modeStates.cool == true) {
                return styles.chosenButton
            }
            return styles.notChosenButton
        }
        else if (status == "hot") {
            if (modeStates.hot == true) {
                return styles.chosenButton
            }
            return styles.notChosenButton
        }
        else if (status == "energy") {
            if (modeStates.energy == true) {
                return styles.chosenButton
            }
            return styles.notChosenButton
        }


    }
    const [prevMode, setPrevMode] = useState('cool')
    const changeMode = (newMode) => {
        setModeState((prevModes) => ({
            ...prevModes,
            [prevMode]: !prevModes[prevMode],
            [newMode]: true,
        }));

        setPrevMode(newMode)
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

                            <View style={[{ width: '100%', alignItems: 'center', padding: 20 }]}>
                                <Text style={{ fontSize: Platform.OS == 'web' ? 35 : 15, fontWeight: 'bold', }}>
                                    Device Control
                                </Text>
                            </View>

                            <View style={[styles.mainContainer]}>


                                {Platform.OS == 'web' && <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                                    <View style={[styles.roomScroller]}>

                                        <FlatList
                                            horizontal={true}
                                            data={DUMMY_DATA}
                                            keyExtractor={item => item.room_id}
                                            renderItem={renderRoom}
                                            style={[{ height: '100%' }]}
                                            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', gap: 20 }}
                                        />



                                    </View>
                                    <TouchableOpacity
                                        style={[styles.room,
                                        { backgroundColor: 'rgb(255, 255, 255)', aspectRatio: 1, padding: 0 }]}
                                        onPress={() => {
                                        }}>
                                        <MaterialCommunityIcons name="plus" size={40} />
                                    </TouchableOpacity>
                                </View>}



                                <View style={[styles.roomPanel, { flexDirection: 'row' }]}>

                                    <View style={[{ width: '50%', alignItems: 'center' }]}>
                                        <TempDial device_id={999} deviceName={"Air Conditioner"} changeable={true} tempArg={DUMMY_DATA[0].temperature} />
                                    </View>


                                    {Platform.OS == 'web' &&
                                        <View style={[{ width: '50%' }]}>
                                            <View style={[{ height: '50%', width: '100%' }]}>

                                                <View style={[styles.modePanel, { width: '100%', height: '100%' }]}>
                                                    <TouchableOpacity style={[styles.shadow, styles.modeButton, isChosen("cool"), {}]}
                                                        onPress={() => {
                                                            if (modeStates.cool == false) {
                                                                changeMode('cool')
                                                            }
                                                        }}>
                                                        <LinearGradient colors={[modeStates.cool==true ? 'rgb(255, 3, 184)' : 'rgb(235, 235, 235)', 'transparent']} style={[styles.modeButton, { width: '100%' }]}>
                                                            <Ionicons name="snow-outline" size={'450%'} color={modeStates.cool == true ? 'rgb(255,255,255)' : 'rgb(0, 0, 0)'} />
                                                        </LinearGradient>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={[styles.shadow, styles.modeButton, isChosen("hot"), {}]}
                                                        onPress={() => {
                                                            if (modeStates.hot == false) {
                                                                changeMode('hot')
                                                            }
                                                        }}>
                                                        <LinearGradient colors={[modeStates.hot==true ? 'rgb(255, 3, 184)' : 'rgb(235, 235, 235)', 'transparent']} style={[styles.modeButton, { width: '100%' }]}>
                                                            <Ionicons name="sunny-outline" size={'450%'} color={modeStates.hot == true ? 'rgb(255,255,255)' : 'rgb(0, 0, 0)'} />
                                                        </LinearGradient>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={[styles.shadow, styles.modeButton, isChosen("energy"), {}]}
                                                        onPress={() => {
                                                            if (modeStates.energy == false) {
                                                                changeMode('energy')
                                                            }
                                                        }}>
                                                        <LinearGradient colors={[modeStates.energy==true ? 'rgb(255, 3, 184)' : 'rgb(235, 235, 235)', 'transparent']} style={[styles.modeButton, { width: '100%' }]}>
                                                            <Ionicons name="flash-outline" size={'450%'} color={modeStates.energy == true ? 'rgb(255,255,255)' : 'rgb(0, 0, 0)'} />
                                                        </LinearGradient>
                                                    </TouchableOpacity>
                                                </View>

                                            </View>
                                            <View style={[{ height: '50%' }]}>

                                                <View style={[{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }]}>

                                                    <TouchableOpacity
                                                        style={[{
                                                            width: '50%', justifyContent: 'center',
                                                            alignItems: 'center', borderRadius: 25,
                                                            backgroundColor: 'rgb(235, 235, 235)',
                                                            padding: 20
                                                        }, styles.shadow]}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: '300%' }}>Automation</Text>
                                                    </TouchableOpacity>

                                                </View>

                                            </View>
                                        </View>
                                    }

                                </View>

                            </View>

                            <View style={{ height: 30 }}></View>

                            <View style={[]}>
                                <DevicesGrid currentRoom={currentRoom} />
                            </View>





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

    mainContainer: {
        alignItems: 'center',     //horizontal
        gap: 20,
        width: '100%',
    },
    roomScroller: {
        width: '100%',
        maxWidth: 1000,
        //borderRadius: 50,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        //flexDirection:'row'
    },
    room: {
        height: "70%",
        borderRadius: 100,
        padding: 25,
        justifyContent: 'center',
        alignItems: 'center',

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

    roomPanel: {
        width: '100%',
        //height:'100%',
        maxWidth: 1500
    },

    modePanel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5%'
    },

    modeButton: {
        width: '15%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
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
