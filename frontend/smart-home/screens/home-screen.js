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


    //Have a music player here that displays different speakers playing music form different rooms

    //Can a have a security card that swipes between all security devices in all rooms


    return (



        <View style={{ height: '100%' }}>
            <StatusBar style={theme == 'light' ? 'dark' : 'light'} />
            <View style={{ height: '100%', width: '100%', display: 'flex' }}>
                <LavaLampBackground />
            </View>

            {/*Main Screen*/}
            <View style={[styles.screen, themeMode, { position: 'absolute', /*flexDirection: 'row'*/ }]}>

                <SafeAreaProvider style={[{ height: '100%', width: '100%' }]}>
                    <SafeAreaView style={[{ height: '100%', width: '100%' }]}>

                        <View style={[styles.helloBar]}>
                            <Text style={{ fontSize: Platform.OS == 'web' ? 35 : 15, }}>Hello, name! </Text>
                            
                            <View style={{
                                        justifyContent:'center', alignItems:'center', 
                                        backgroundColor:'rgba(255,255,255,0.9)', borderRadius:500,
                                        height:'100%', }}>
                                <Ionicons name="person-circle-outline" size={Platform.OS == 'web' ? 70 : 40} />
                            </View>
                        </View>

                        <View style={[styles.mainContainer]}>

                            <View style={[styles.baseStatsBar]}>

                                {/* 
                                    The energy is the total overall energy being consumed by the entire house
                                    The temperature is the average temperature of all rooms
                                */}

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
                                            /* Idk why, but the bold weight for text is necessary else the last word doesnt show up on android, idk */
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
                                            /* Idk why, but the bold weight for text is necessary else the last word doesnt show up on android, idk */
                                            fontWeight: 'bold',
                                            fontSize: Platform.OS == 'web' ? 30 : 15,
                                        }} >
                                            21°C
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={[{ width: '60%', maxWidth: 500 }]}>

                                <Pet moodStates={moodStates} imageDisplays={imageDisplays} />

                            </View>


                        </View>



                    </SafeAreaView>
                </SafeAreaProvider>



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
