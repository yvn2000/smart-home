import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, Dimensions, Alert, ActivityIndicator

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState, useLayoutEffect } from "react";
import { useTheme } from "../components/themes/theme";

import LavaLampBackground from "../components/themes/lava-lamp-bg";
import TempDial from "../components/dial";
import Switch from '../components/switch';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { BarChart, LineChart, barDataItem, Stop } from "react-native-gifted-charts";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

import { HeaderBackButton } from "@react-navigation/elements";
import { LinearGradient } from 'expo-linear-gradient';


import AsyncStorage from "@react-native-async-storage/async-storage";


export default function DailySummaryScreen() {

    const route = useRoute()
    const navigation = useNavigation()

    //const { device, device_id, name, logo, status, temp, room, } = route.params

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


    const [windowDimensions, setWindowDimensions] = useState(Dimensions.get("window"));
    //console.log("Width: " + windowDimensions.width + ", Height: " + windowDimensions.height)


    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions(Dimensions.get("window"));
        };

        if (Platform.OS == 'web') {
            Dimensions.addEventListener("change", handleResize);        //checks if size changed

            return () => {
                Dimensions.removeEventListener("change", handleResize);       //cleanup
            };

        }
    }, []);



    const [house_id, setHouseId] = useState(0)


    const getHouse = async () => {
        setHouseId(await AsyncStorage.getItem("house_id"))
    }




    const [deviceInfo, setDeviceInfo] = useState({});
    const [loading, setLoading] = useState(true);


    const [activityLogs, setActivityLogs] = useState([]);

    const fetchActivityLogs = async () => {
        try {
            const apiUrl = Platform.OS === 'android'
                ? 'http://10.0.2.2:8000/api/get-daily-activity/'
                : 'http://127.0.0.1:8000/api/get-daily-activity/';


            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok) {
                setActivityLogs(data.activity_log);
            } else {
                Alert.alert('Error', data.error || 'Failed to fetch activity logs');
            }
        } catch (error) {
            Alert.alert('Error', 'Network request failed');
        } finally {
            setLoading(false);
        }
    };

    /*
    useEffect(() => {
        //fetchActivityLogs();
    }, []);
    */


    const fetchHouseLogs = async () => {

        const apiUrl = Platform.OS === 'android'
                ? `http://10.0.2.2:8000/api/get-daily-activity/${house_id}/`
                : `http://127.0.0.1:8000/api/get-daily-activity/${house_id}/`;
        try {
            //setLoading(true);
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok) {
                setActivityLogs(data.activity_log); // Set logs from API
            } else {
                console.error("Error fetching activity logs:", data.error);
            }
        } catch (error) {
            console.error("Network error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getHouse()
        fetchHouseLogs()
    }, [house_id])



    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }








    if (loading) {
        return (

            <View style={{}}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
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


                            <TouchableOpacity style={[styles.backButton, {maxHeight:100}]} >
                                <MaterialCommunityIcons name="chevron-left" color='rgb(255, 3, 184)' size={50} onPress={() => navigation.goBack()} />
                            </TouchableOpacity>

                            <View style={[{ width: '100%', alignItems: 'center', padding: 20, top: Platform.OS=='web' ? 0 : -30 }]}>
                                <Text style={{ fontSize: Platform.OS == 'web' ? 35 : 15, fontWeight: 'bold', color:'rgb(255, 3, 184)' }}>
                                    Today's Activity Summary
                                </Text>
                            </View>


                            <View style={[styles.mainContainer, {top: Platform.OS=='web' ? 0 : -30}]}>


                                {loading ? (
                                    <ActivityIndicator size="large" color="#0000ff" />
                                ) : (
                                    activityLogs.length > 0 ? (
                                        activityLogs.map((log, index) => (
                                            <LinearGradient key={index} colors={['rgb(255, 3, 184)', 'transparent']}
                                                style={[styles.action, { backgroundColor: 'rgba(216, 75, 255, 1)' }]}
                                            >
                                                <Text style={{fontWeight:'bold', color:'white', fontSize:20}}>{log.device_name}</Text>
                                                <Text style={{fontWeight:'bold', color:'white', fontSize:20}}>{log.action}</Text>
                                                <Text style={{fontWeight:'bold', color:'rgb(178, 253, 187)', fontSize:30}}>{formatTimestamp(log.timestamp)}</Text>
                                            </LinearGradient>
                                        ))
                                    ) : (
                                        <Text style={styles.noLogs}>No activity logs for today.</Text>
                                    )
                                )}







                            </View>


                            <View style={{ height: 150 }}>{/*To allow space for tab bar to not overlap elements*/}</View>


                        </SafeAreaView>
                    </SafeAreaProvider >

                </ScrollView >



            </View >
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


    homePanel: {
        width: '90%',
        maxWidth: 1500,
        //height: 600,    //for testing
        backgroundColor: 'white',
        borderRadius: 60,
        alignItems: 'center',
        paddingBottom: 50,
    },

    homeStats: {
        flexDirection: 'row',
        //padding: 20,
        width: '90%',
        height: '90%',
        //width:0.9*1500,
        justifyContent: 'center'

    },

    graphStats: {
        width: '50%',
        height: '100%'
    },

    homeStatsDetails: {
        width: '50%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10%'
    },


    activity: {
        width: '80%',
        //alignItems:'center',
        //justifyContent:'center'
    },

    activityLog: {
        width: '100%',
        marginBottom: 30,
        padding: 25,
        maxWidth: 1000,
        backgroundColor: 'rgba(216, 75, 255, 1)',
        borderRadius: 50,
        alignItems: 'center'
    },


    recommend: {
        //alignItems: 'center',
        padding: 25,
        backgroundColor: 'rgb(243, 243, 243)',
        borderRadius: 50,
    },

    recText: {
        color: 'rgba(216, 75, 255, 1)',
        fontSize: 22,
        fontWeight: 'bold',
    },

    action: {
        flexDirection:'row',
        width:'95%',
        maxWidth:800,
        padding:30,
        justifyContent:'center',
        alignItems:'center',
        gap: Platform.OS=='web' ? 80 : 20,
        borderRadius:30,
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
