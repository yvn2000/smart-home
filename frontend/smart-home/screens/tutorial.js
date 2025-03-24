import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, Image

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "../components/themes/theme";
import LavaLampBackground from "../components/themes/lava-lamp-bg";

import Pet from "../components/cat";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import ThermoDial from "../components/thermodial";

import { LinearGradient } from 'expo-linear-gradient';

import Modal from "react-native-modal";
import { Knob } from 'primereact/knob';

import { API_BASE_URL } from "../src/config";


export default function Tutorial() {

    const navigation = useNavigation()

    const route = useRoute(); // Get the current route object
    const { statsAccess, deviceAccess, petAccess, isNew } = route.params || {}; // Extract params safely

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





    const [isVisible, setDropdownVisible] = useState(true);

    const [indexWeb, setIndexWeb] = useState(0);

    const changeIndexWeb = (val) => {
        if (indexWeb + val < 0) {
            setIndexWeb(indexWeb)
        }
        else if (indexWeb + val >= screensWeb.length) {
            setIndexWeb(indexWeb)
        }
        else {
            setIndexWeb(indexWeb + val)
        }
    }

    const screensWeb = [
        require("../assets/images/app/web-tutorial/Home_pet.jpg"),
        require("../assets/images/app/web-tutorial/Home_bar.jpg"),
        require("../assets/images/app/web-tutorial/Home_thermo.jpg"),
        require("../assets/images/app/web-tutorial/Stats_panel.jpg"),
        require("../assets/images/app/web-tutorial/Stats_energy_graph.jpg"),
        require("../assets/images/app/web-tutorial/Stats_weekly.jpg"),
        require("../assets/images/app/web-tutorial/Stats_share.jpg"),
        require("../assets/images/app/web-tutorial/Stats_daily.jpg"),
        require("../assets/images/app/web-tutorial/Stats_device.jpg"),
        require("../assets/images/app/web-tutorial/Stats_excl.jpg"),
        require("../assets/images/app/web-tutorial/DC_room.jpg"),
        require("../assets/images/app/web-tutorial/DC_device.jpg"),
        require("../assets/images/app/web-tutorial/PC_custom.jpg"),
        require("../assets/images/app/web-tutorial/PC_level.jpg"),
        require("../assets/images/app/web-tutorial/PC_death.jpg"),
    ]




    const [indexMob, setIndexMob] = useState(0);

    const changeIndexMob = (val) => {
        if (indexMob + val < 0) {
            setIndexMob(indexMob)
        }
        else if (indexMob + val >= screensMob.length) {
            setIndexMob(indexMob)
        }
        else {
            setIndexMob(indexMob + val)
        }
    }

    const screensMob = [
        require("../assets/images/app/mobile-tutorial/Home_pet.jpg"),
        require("../assets/images/app/mobile-tutorial/Home_bar.jpg"),
        require("../assets/images/app/mobile-tutorial/Home_thermo.jpg"),
        require("../assets/images/app/mobile-tutorial/Stats_panel.jpg"),
        require("../assets/images/app/mobile-tutorial/Stats_energy_graph.jpg"),
        require("../assets/images/app/mobile-tutorial/Stats_weekly.jpg"),
        require("../assets/images/app/mobile-tutorial/Stats_device.jpg"),
        require("../assets/images/app/mobile-tutorial/Stats_excl.jpg"),
        require("../assets/images/app/mobile-tutorial/DC_room.jpg"),
        require("../assets/images/app/mobile-tutorial/DC_device.jpg"),
        require("../assets/images/app/mobile-tutorial/PC_custom.jpg"),
        require("../assets/images/app/mobile-tutorial/PC_level.jpg"),
        require("../assets/images/app/mobile-tutorial/PC_death.jpg"),
    ]


    const refreshingToken = async () => {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (!refreshToken) {
            console.log("fucnction failed to get refresh token")
        }
        else {
            console.log("fucnction got the refresh token: " + refreshToken)
        }
        if (!refreshToken) return;

        const refreshUrl = `${API_BASE_URL}/api/token/refresh/`

        try {
            const response = await fetch(refreshUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            const data = await response.json();
            console.log("Data:" + data)
            if (response.ok) {
                // Save the new access token
                await AsyncStorage.setItem('access_token', data.access_token);
                console.log('Token refreshed');
            } else {
                console.log('Error refreshing token:', data.error);
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    };


    const updateUserNoob = async () => {
        try {

            // Retrieve the token from AsyncStorage
            const token = await AsyncStorage.getItem('access_token');
            const refreshToken = await AsyncStorage.getItem('refresh_token');

            console.log("Verfying Access token: " + token)
            console.log("Verfying Refresh token: " + refreshToken)

            if (!token) {
                console.log('No token found');
                return;
            }

            //const url = Platform.OS == 'web' ? "http://127.0.0.1:8000/api/update-user-noob/" : "http://10.0.2.2:8000/api/update-user-noob/"
            const url = `${API_BASE_URL}/api/update-user-noob/`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token, noobility: isNew }),  // Send token in the body
                credentials: 'include',
            });

            const data = await response.json()
            //const data = JSON.stringify(respData);

            if (response.ok) {
                console.log("User Noob Updated")
                //await fetchProfile()
            } else {
                console.log('Token expired, refreshing...');
                const newToken = await refreshingToken();  // Try refreshing the token
                if (newToken) {
                    console.log("Refresh token: " + refreshToken)
                    // Retry with the new token
                    updateUserNoob()
                }
                else {
                    console.log("Refresh token failed")
                }
            }
        } catch (error) {
            console.error('Error :', error);
        } finally {
            //setProfileLoading(false);
        }
    }





    return (



        <View style={{ height: '100%' }}>
            <StatusBar style={theme == 'light' ? 'dark' : 'light'} />
            <View style={{ height: '100%', width: '100%', display: 'flex' }}>
                <LavaLampBackground />
            </View>

            {/*Main Screen*/}
            {Platform.OS == 'web' && <View style={[styles.screen, themeMode, { position: 'absolute', alignItems: 'center', justifyContent: 'center', gap: 20, }]}>

                <Text style={{ color: 'rgb(255, 3, 184)', fontSize: 50, fontWeight: 'bold' }}>Tutorial</Text>

                <View style={{ height: '70%', aspectRatio: 2 / 1.3, alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={{ height: '100%', width: '100%' }} source={screensWeb[indexWeb]} />
                </View>

                <View style={{ flexDirection: 'row', gap: 250, alignItems: 'center' }}>

                    {indexWeb > 0 && <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', borderRadius: 40, }}>

                        <TouchableOpacity
                            style={{ padding: 20 }}
                            onPress={() => { changeIndexWeb(-1) }}
                        >
                            <MaterialCommunityIcons name={"undo"} size={40} color={'rgb(255, 255, 255)'} />

                        </TouchableOpacity>

                    </LinearGradient>}

                    <Text style={{ color: 'rgb(255, 3, 184)', fontSize: 30, fontWeight: 'bold' }}>Page {indexWeb + 1}</Text>

                    {indexWeb < screensWeb.length - 1 && <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', borderRadius: 40, }}>

                        <TouchableOpacity
                            style={{ padding: 20 }}
                            onPress={() => { changeIndexWeb(1) }}
                        >
                            <MaterialCommunityIcons name={"redo"} size={40} color={'rgb(255, 255, 255)'} />

                        </TouchableOpacity>

                    </LinearGradient>}

                    {indexWeb == screensWeb.length - 1 && <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', borderRadius: 40, }}>

                        <TouchableOpacity
                            style={{ padding: 20 }}
                            onPress={() => {
                                updateUserNoob();
                                navigation.navigate("Main", {
                                    statsAccess: statsAccess,
                                    deviceAccess: deviceAccess,
                                    petAccess: petAccess,
                                })
                            }}
                        >
                            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 20 }}>Finish</Text>

                        </TouchableOpacity>

                    </LinearGradient>}

                </View>




            </View>}


            {/*Main Screen*/}
            {Platform.OS != 'web' && <View style={[styles.screen, themeMode, { position: 'absolute', alignItems: 'center', justifyContent: 'center', gap: 20, }]}>

                <Text style={{ color: 'rgb(255, 3, 184)', fontSize: 30, fontWeight: 'bold', marginTop: 20 }}>Tutorial</Text>

                <View style={{ height: '70%', aspectRatio: 1 / 2.2, alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={{ height: '100%', width: '100%' }} source={screensMob[indexMob]} />
                </View>

                <View style={{ flexDirection: 'row', gap: 50, alignItems: 'center' }}>

                    {indexMob > 0 && <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', borderRadius: 40, }}>

                        <TouchableOpacity
                            style={{ padding: 20 }}
                            onPress={() => { changeIndexMob(-1) }}
                        >
                            <MaterialCommunityIcons name={"undo"} size={30} color={'rgb(255, 255, 255)'} />

                        </TouchableOpacity>

                    </LinearGradient>}

                    <Text style={{ color: 'rgb(255, 3, 184)', fontSize: 30, fontWeight: 'bold' }}>Page {indexMob + 1}</Text>

                    {indexMob < screensMob.length - 1 && <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', borderRadius: 40, }}>

                        <TouchableOpacity
                            style={{ padding: 20 }}
                            onPress={() => { changeIndexMob(1) }}
                        >
                            <MaterialCommunityIcons name={"redo"} size={30} color={'rgb(255, 255, 255)'} />

                        </TouchableOpacity>

                    </LinearGradient>}

                    {indexMob == screensMob.length - 1 && <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', borderRadius: 40, }}>

                        <TouchableOpacity
                            style={{ padding: 20 }}
                            onPress={() => {
                                updateUserNoob();
                                navigation.navigate("Main", {
                                    statsAccess: statsAccess,
                                    deviceAccess: deviceAccess,
                                    petAccess: petAccess,
                                })
                            }}
                        >
                            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 20 }}>Finish</Text>

                        </TouchableOpacity>

                    </LinearGradient>}

                </View>




            </View>}


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
            height: 5,
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
        backgroundColor: 'rgb(17, 18, 44)',
    },
    lightMode: {
        backgroundColor: "rgb(245, 238, 246)",
    },
    crazyMode: {
        backgroundColor: 'rgba(216, 83, 196, 0)'
    }
});
