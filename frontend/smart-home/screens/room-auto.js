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

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


import { HeaderBackButton } from "@react-navigation/elements";
import { LinearGradient } from 'expo-linear-gradient';

import Modal from "react-native-modal";
import { Dropdown } from 'react-native-element-dropdown';
import { TimePickerModal } from 'react-native-paper';

import { Switch } from 'react-native-switch';


export default function RoomAuto() {

    const route = useRoute()
    const navigation = useNavigation()

    const { devices } = route.params
    //console.log("Status: "+status)

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        //setLoading(false)
        //console.log(devices)
    }, [devices]); // Logs when devices update

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





    const deleteAutomation = async (automationId) => {
        try {
            const url = Platform.OS === "android"
                ? `http://10.0.2.2:8000/api/automations/delete/`
                : `http://127.0.0.1:8000/api/automations/delete/`;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    automation_id: automationId
                }),
            });

            if (response.status === 204) {
                return { status: 'success' };
            }

            const data = await response.json();

            if (!response.ok) {
                console.log("Fetch error1: " + data.message)
                throw new Error(data.message || 'Failed to delete automation');
            }

            return data;
        } catch (error) {
            console.error('Delete error:', error);
            throw error;
        }
    };



    //const [automations, setAutomations] = useState([]);
    const [roomAutos, setRoomAutos] = useState([])
    const [error, setError] = useState('');


    const fetchRoomAutomations = async () => {
        try {
            setLoading(true);
            setError('');

            // Fetch automations for all devices in parallel
            const devicesAutomations = await Promise.all(
                devices.map(device => fetchAutomations(device.device_id))
            );

            //flatten the 2d array into a single array
            const allAutomations = devicesAutomations.flat().filter(item => item && item.auto_id);

            //setAutomations(allAutomations);
            setRoomAutos(allAutomations)
        } catch (error) {
            setError('Failed to fetch some automations');
        } finally {
            //console.log(automations)
            setLoading(false);
        }
    }

    const fetchAutomations = async (device_id) => {
        try {
            const url = Platform.OS === "android"
                ? `http://10.0.2.2:8000/api/automations-list/device/${device_id}/`
                : `http://127.0.0.1:8000/api/automations-list/device/${device_id}/`;


            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'success') {
                //setAutomations(automations.push(data.automations));
                //setAutomations(data.automations);
                //console.log("Automations: "+automations)
                return data.automations;
            } else {
                console.log(data.message)
                setError(data.message || 'Failed to fetch automations');
            }
        } catch (err) {
            console.log(err)
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchRoomAutomations();
    }, [devices]);



    const addAction = async (device_id, action) => {
        try {
            const actionUrl = Platform.OS === 'android' ? `http://10.0.2.2:8000/api/device/${device_id}/activity/add-action/` : `http://127.0.0.1:8000/api/device/${device_id}/activity/add-action/`;

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
                                <MaterialCommunityIcons name="chevron-left" color='rgb(255, 3, 184)' size={50} onPress={() => navigation.goBack()} />
                            </TouchableOpacity>





                            <View style={[styles.mainContainer, { gap: 40 }]}>


                                <ScrollView
                                    style={[{ width: '60%' }]}
                                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', gap: 30, }}
                                >

                                    {roomAutos.length === 0 ? (
                                        <Text style={styles.emptyText}>No automations found for this room</Text>
                                    ) : (
                                        roomAutos.map((item) => //{ if (!item) return null; return
                                        (<LinearGradient key={item.auto_id}
                                            colors={['rgb(255, 3, 184)', 'transparent']} style={[styles.autoItem, styles.shadow, { flexDirection: 'row', justifyContent: 'flex-start' }]}>
                                            <MaterialCommunityIcons
                                                name={item.automation_type === 'time' ? 'clock-outline' : 'account-voice'}
                                                size={50}
                                                color="white"
                                                style={{ marginLeft: 10 }}
                                            />
                                            <View style={{ left: '10%' }}>
                                                <Text style={styles.detailText}>
                                                    {item.automation_type === 'time'
                                                        //? `Active: ${new Date(item.start_time).toLocaleString()} - ${new Date(item.end_time).toLocaleString()}`
                                                        ? `Time: ${new Date(item.start_time).getHours().toString().padStart(2, '0')}:${new Date(item.start_time).getMinutes().toString().padStart(2, '0')} - ${new Date(item.end_time).getHours().toString().padStart(2, '0')}:${new Date(item.end_time).getMinutes().toString().padStart(2, '0')}`
                                                        : `Phrase: "${item.phrase}"`}
                                                </Text>
                                                <Text style={[styles.detailText, {color:'rgb(194, 194, 194)'}]}>
                                                    {item.device_name}  •  {item.active ? 'Active' : 'Inactive'}
                                                </Text>
                                            </View>

                                            <TouchableOpacity
                                                style={{
                                                    position: 'absolute', padding: 8,
                                                    right: '3%', backgroundColor: 'red',
                                                    borderRadius: 50,
                                                }}
                                                onPress={async () => {  // Make the handler async
                                                    try {
                                                        // Wait for the automation to be added
                                                        await deleteAutomation(item.auto_id);

                                                        // Refresh the automations list
                                                        await fetchRoomAutomations();

                                                        await addAction(item.device_id, "Deleted An Automation")

                                                        // Optional: Reset form state
                                                        setAutoType(null);
                                                        setFunc('')
                                                        setPhrase('');
                                                        setStartTime(null);
                                                        setEndTime(null);
                                                    } catch (error) {

                                                        console.log('Error:', error);
                                                        setError(error.message);
                                                    }
                                                }}
                                            >
                                                <MaterialCommunityIcons name="delete" color='white' size={50} />
                                            </TouchableOpacity>

                                        </LinearGradient>)


                                            //}
                                        )
                                    )}



                                    <View style={{ height: 30 }}>

                                    </View>


                                </ScrollView>









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


    autoItem: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(216, 75, 255)',
        padding: 20,
        borderRadius: 40,
    },


    dropdownContainer: {
        width: '95%',
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




    dropdown: {
        //height: 50,
        width: '30%',
        height: '100%',
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        padding: 10
    },



    detailText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },





    timePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 160,
        marginVertical: 10,
    },
    timeColumn: {
        height: 160,
        width: 80,
        overflow: 'hidden',
    },
    scrollContent: {
        paddingVertical: 60,
    },
    timeItem: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedTimeItem: {
        backgroundColor: 'rgba(255, 3, 184, 0.2)',
        borderRadius: 8,
    },
    timeText: {
        color: 'rgb(255, 3, 184)',
        fontSize: 18,
    },
    timeSeparator: {
        color: 'rgb(255, 3, 184)',
        fontSize: 24,
        marginHorizontal: 4,
    },
    timeSection: {
        marginVertical: 15,
        width: '100%',
    },
    timeLabel: {
        color: 'rgb(255, 3, 184)',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },





    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
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
