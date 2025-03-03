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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import ThermoDial from "../components/thermodial";

import { LinearGradient } from 'expo-linear-gradient';


import { Knob } from 'primereact/knob';


export default function HomeScreen() {

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

    const [firstName, setFirstName] = useState("name")

    const getFirstName = async () => {
        setFirstName(await AsyncStorage.getItem("first_name"))
    }

    useEffect(() => {
        getFirstName()
    }, [firstName])


    //Pet state values
    const [moodStates, setMood] = useState({
        happy: true,
        sad: false,
        death: false,
        joy: false,
    });
    const [imageDisplays, setImageDisplays] = useState({
        bg1: true,
        bg2: false,
        bg3: false,
        hat0: true,
        hat1: false,
        hat2: false,
    });



    const [thermoValue, setThermoValue] = useState(20)

    const knobValueStyle = {
        fontWeight: 'bold',
        color: 'rgb(255, 3, 184)',
        fontSize: '1.2rem',
        fontFamily: 'Arial, sans-serif' // Optional: specify font
    };




    //Have a music player here that displays different speakers playing music form different rooms



    return (



        <View style={{ height: '100%' }}>
            <StatusBar style={theme == 'light' ? 'dark' : 'light'} />
            <View style={{ height: '100%', width: '100%', display: 'flex' }}>
                <LavaLampBackground />
            </View>

            {/*Main Screen*/}
            <View style={[styles.screen, themeMode, { position: 'absolute', /*flexDirection: 'row'*/ }]}>
                <ScrollView style={[{ height: '100%' }]}>

                    <SafeAreaProvider style={[{ height: '100%', width: '100%' }]}>
                        <SafeAreaView style={[{ height: '100%', width: '100%' }]}>

                            <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                style={[styles.helloBar, {
                                    backgroundColor: 'rgb(216, 75, 255)', height: 125, borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
                                }]}>
                                <View style={{ flexDirection: 'row', left: '3%', alignItems: 'center' }}>
                                    <Text style={{ color: 'rgb(232, 232, 232)', fontSize: Platform.OS == 'web' ? 35 : 15, }}>Welcome,</Text>
                                    <Text style={{ color: 'white', fontSize: Platform.OS == 'web' ? 35 : 15, fontWeight: 'bold' }}> {firstName}! </Text>
                                    <Text style={{ color: 'rgb(232, 232, 232)', fontSize: Platform.OS == 'web' ? 45 : 25, }}>👋🏻</Text>
                                </View>


                                <View style={{
                                    justifyContent: 'center', alignItems: 'center',
                                    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 500,
                                    right: '3%', aspectRatio: 1,
                                    //height: '100%',
                                }}>
                                    <Ionicons name="person-circle-outline" size={Platform.OS == 'web' ? 70 : 40} />
                                </View>
                            </LinearGradient>
                            <View style={{ height: '3%' }}>

                            </View>

                            <View style={[styles.mainContainer]}>

                                {/*
                                <View style={[styles.baseStatsBar]}>


                                    <View style={[{ width: '50%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', padding: 10 }]}>
                                        <Ionicons name="flash" size={Platform.OS == 'web' ? 60 : 40} color={'rgba(216, 75, 255, 0.9)'} />
                                        <View style={[]} >
                                            <Text style={{

                                                fontSize: Platform.OS == 'web' ? 20 : 10,
                                                color: 'rgb(165, 165, 165)'
                                            }} >
                                                Energy
                                            </Text>
                                            <Text style={{
                                                
                                                fontWeight: 'bold',
                                                fontSize: Platform.OS == 'web' ? 30 : 15,
                                            }} >
                                                50 kwh
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[{ width: '50%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', padding: 5 }]}>
                                        <Ionicons name="thermometer" size={Platform.OS == 'web' ? 60 : 40} color={'rgba(216, 75, 255, 0.9)'} />
                                        <View style={[]} >
                                            <Text style={{
                                                width: Platform.OS == 'web' ? 70 : 60,
                                                fontSize: Platform.OS == 'web' ? 20 : 10,
                                                color: 'rgb(165, 165, 165)'
                                            }} >
                                                Temp
                                            </Text>
                                            <Text style={{
                                                
                                                fontWeight: 'bold',
                                                fontSize: Platform.OS == 'web' ? 30 : 15,
                                            }} >
                                                21°C
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                */}


                                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', gap: '3%' }}>
                                    <View style={[{ width: '60%', maxWidth: 400 }]}>

                                        <Pet moodStates={moodStates} imageDisplays={imageDisplays} />

                                    </View>

                                    <View style={[{ justifyContent: 'center', alignItems: 'center' }]}>
                                        <View style={[{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}>



                                            <ThermoDial

                                                changeable={true}
                                                tempValue={20}
                                                minValueIn={0}
                                                maxValueIn={40}
                                                radiusIn={150}


                                            />





                                        </View>
                                    </View>

                                </View>

                                <View style={{ flexDirection: 'row', gap: 20 }}>

                                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                        style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', borderRadius: 20, }]}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                height: '100%', width: '100%', padding: 10, paddingLeft: 20, paddingRight: 20,
                                                justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 5
                                            }}
                                            onPress={() => { navigation.navigate("StatisticsStack") }}
                                        >
                                            <Ionicons
                                                name={"flash"}
                                                size={20}
                                                color={'white'}
                                            />
                                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Statistics</Text>
                                        </TouchableOpacity>
                                    </LinearGradient>

                                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                        style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', borderRadius: 20, }]}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                height: '100%', width: '100%', padding: 10, paddingLeft: 20, paddingRight: 20,
                                                justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 5
                                            }}
                                            onPress={() => { navigation.navigate("DevicesStack") }}
                                        >
                                            <Ionicons
                                                name={"desktop"}
                                                size={20}
                                                color={'white'}
                                            />
                                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Device Control</Text>
                                        </TouchableOpacity>
                                    </LinearGradient>

                                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                        style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', borderRadius: 20, }]}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                height: '100%', width: '100%', padding: 10, paddingLeft: 20, paddingRight: 20,
                                                justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 5
                                            }}
                                            onPress={() => { navigation.navigate("CustomStack") }}
                                        >
                                            <Ionicons
                                                name={"color-palette"}
                                                size={20}
                                                color={'white'}
                                            />
                                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Pet Customization</Text>
                                        </TouchableOpacity>
                                    </LinearGradient>

                                </View>




                                <View style={[styles.weather, styles.shadow, {}]}>


                                    <LinearGradient colors={['rgb(3, 188, 255)', 'transparent']}
                                        style={{
                                            height: '50%', width: '100%', borderTopLeftRadius: 50, borderTopRightRadius: 50,
                                            backgroundColor: 'rgb(14, 90, 255)', flexDirection: 'row', alignItems: 'center'
                                        }}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: '5%' }}>

                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 90 }}>22°</Text>

                                            <View style={{ justifyContent: 'center', marginLeft: '15%' }}>
                                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 35 }}>Clear Skies</Text>
                                                <Text style={{ color: 'rgb(189, 203, 223)', fontSize: 25 }}>Dubai, UAE</Text>

                                            </View>

                                        </View>

                                        <View style={{ position: 'absolute', right: 50 }}>
                                            <MaterialCommunityIcons name="cloud" color='white' size={150} />
                                        </View>

                                    </LinearGradient>

                                    <View style={{
                                        height: '50%', width: '100%', borderBottomLeftRadius: 50, borderBottomRightRadius: 50,
                                        backgroundColor: 'rgb(17, 0, 103)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                        gap: '10%'
                                    }}>

                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}>10 km/h</Text>
                                            <Text style={{ color: 'rgb(189, 203, 223)', fontSize: 20 }}>Wind</Text>
                                        </View>

                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}>33%</Text>
                                            <Text style={{ color: 'rgb(189, 203, 223)', fontSize: 20 }}>Humidity</Text>
                                        </View>

                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}>5%</Text>
                                            <Text style={{ color: 'rgb(189, 203, 223)', fontSize: 20 }}>Precipitation</Text>
                                        </View>




                                    </View>

                                </View>

                                <Text>Mumbo Jumbo</Text>




                            </View>



                        </SafeAreaView>
                    </SafeAreaProvider>

                </ScrollView>



            </View>
        </View >


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

    helloBar: {
        width: '100%',
        height: '8%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    mainContainer: {
        alignItems: 'center',     //horizontal
        gap: 30,
    },
    baseStatsBar: {
        width: '90%',
        maxWidth: 900,
        flexDirection: 'row',
        backgroundColor: "rgb(255, 255, 255)",
        borderRadius: 70,

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



    weather: {
        width: '95%',
        maxWidth: 800,
        height: 300,     //temp
        backgroundColor: 'rgb(247, 247, 247)',
        borderRadius: 50,
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
