import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, PanResponder, Alert, ActivityIndicator

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import React, { useEffect, useState, useLayoutEffect, useRef } from "react";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

import Animated, {
    useSharedValue, useAnimatedStyle, withRepeat, withTiming,
    withDelay, withSpring, withSequence, Easing, useAnimatedProps,
    interpolate, Extrapolation
} from 'react-native-reanimated';

import VerticalSlider from "../vertical-slider";
import HorizontalSlider from "../horizontal-slider";
import Slider from "react-native-sliders";


export default function SpeakerPanel({ device }) {     //width is percentage



    const [deviceInfo, setDeviceInfo] = useState({});
    const [loading, setLoading] = useState(true); // Track loading state

    const fetchDeviceInfo = async () => {
        try {
            const response = await fetch(
                //getDeviceInfoURLS()
                Platform.OS == 'android'
                    ? `http://10.0.2.2:8000/api/device/${device.device_id}/get_device_info/`
                    : `http://127.0.0.1:8000/api/device/${device.device_id}/get_device_info/`
            );

            const data = await response.json();
            //console.log(data)
            if (response.ok) {
                setDeviceInfo(data); // Update state with fetched device information
                //console.log(deviceInfo)
            } else {
                //Alert.alert("Error", "Failed to fetch device information");
            }
        } catch (error) {
            //Alert.alert("Error", "Network request failed");
        } finally {
            setLoading(false); // Stop the loading indicator once the fetch is complete
        }
    };


    useEffect(() => {
        fetchDeviceInfo();
    }, [device.device_id]); // Fetch whenever device_id changes


    const [activityLog, setActivityLog] = useState([]);

    const apiUrl = Platform.OS === 'android' ? `http://10.0.2.2:8000/api/device/${device.device_id}/get-activity/` : `http://127.0.0.1:8000/api/device/${device.device_id}/get-activity/`;

    // Function to fetch the current activity log when the component loads
    const fetchActivityLog = async () => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (response.ok) {
                setActivityLog(data.activity_log);
            } else {
                //Alert.alert('Error', 'Failed to fetch activity log');
            }
        } catch (error) {
            //Alert.alert('Error', 'Failed to fetch activity log');
        }
    };

    const actionUrl = Platform.OS === 'android' ? `http://10.0.2.2:8000/api/device/${device.device_id}/activity/add-action/` : `http://127.0.0.1:8000/api/device/${device.device_id}/activity/add-action/`;

    const addAction = async (action) => {
        try {
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

    useEffect(() => {
        // Fetch the activity log when the component mounts
        fetchActivityLog();
    }, []);










    const maxVolume = 100;
    const [volume, setVolume] = useState(40);

    function changeVolume(newVolume) {
        setVolume(newVolume)
    }

    const songLength = 100;     //in seconds
    const [songProg, setSongProg] = useState(40);

    function changeSongProg(newProg) {
        setSongProg(newProg)
    }


    const [musicPlaying, setMusicPlaying] = useState(true)




    const getNextItem = (options, currentItem) => {
        const currentIndex = options.indexOf(currentItem);
        const nextIndex = (currentIndex + 1) % options.length;
        return options[nextIndex];
    };







    const updateUrl = Platform.OS === 'android' ? `http://10.0.2.2:8000/api/device/${device.device_id}/update_device_info/` : `http://127.0.0.1:8000/api/device/${device.device_id}/update_device_info/`


    const updateDeviceInfo = async () => {
        //console.log("update TV")
        // Validate inputs
        if (!volume || !songProg) {
            //Alert.alert('Error', 'All fields are required');
            return;
        }

        try {
            const response = await fetch(updateUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    volume: parseInt(volume),
                    song_progress: parseInt(songProg),
                    music_playing: musicPlaying,
                }),
            });

            //console.log("Values Updated: " + bright + "" + input)

            const data = await response.json();

            if (response.ok) {
                //Alert.alert('Success', 'Television updated successfully');
                // You can reset the form or handle additional UI logic here
            } else {
                //Alert.alert('Error', 'Failed to update television');
            }
        } catch (error) {
            //Alert.alert('Error', 'Failed to update television');
        }
    };

    const setEnergyConsumption = async (deviceId, incrementValue) => {
        const apiUrl = Platform.OS === 'android'
            ? `http://10.0.2.2:8000/api/device/${deviceId}/set_energy/`
            : `http://127.0.0.1:8000/api/device/${deviceId}/set_energy/`;

        try {
            //console.log("IncrementValue: " + incrementValue)
            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ increment_value: incrementValue }),
            });

            console.log(incrementValue)

            if (response.ok) {
                const data = await response.json();
                //console.log('Updated Energy Consumption:', data);
            } else {
                console.error('Failed to update energy consumption');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        updateDeviceInfo();
    }, [volume, songProg, musicPlaying]);



    useEffect(() => {
        if (deviceInfo.data) {
            //console.log(deviceInfo)
            setVolume(deviceInfo.data.volume)
            setSongProg(deviceInfo.data.song_progress)
            setMusicPlaying(deviceInfo.data.music_playing)
        }
    }, [deviceInfo, device.device_id, deviceInfo.data])


    if (loading) {
        return (

            <View style={{}}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>

        )
    }







    if (Platform.OS != 'web') {
        return (

            <View style={[{
                width: '80%', maxWidth: 1000,
                justifyContent: 'center', alignItems: 'center', gap: '5%', paddingBottom: 30,
            }]}
            >

                <View>

                    <View style={[styles.musicPlayer, styles.shadow, { width: '90%' }]}>

                        <View style={{ flexDirection: 'row', marginBottom: 30, alignItems: 'center', justifyContent: 'center', gap: '60%' }}>

                            <View style={{}}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>Sigma Boy</Text>
                                <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'rgb(174, 174, 174)' }}>Ligma James</Text>
                            </View>

                            <TouchableOpacity onPress={() => { }} style={{ aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <MaterialCommunityIcons color='rgb(255, 3, 184)' size={40} name={"spotify"} />

                            </TouchableOpacity>

                        </View>


                        <HorizontalSlider
                            fixedWidth={300}
                            height={10}
                            fill={(songProg / songLength) * 100}
                            maxValue={songLength}
                            value={songProg}
                            changeValue={changeSongProg}
                            shadow={false}
                            pointer={true}

                        />

                        <View style={[styles.musicOptions]}>

                            <TouchableOpacity onPress={() => { }} style={{ right: 30 }}>
                                <MaterialCommunityIcons color='rgb(255, 3, 184)' size={30} name={"shuffle"} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { }}>
                                <MaterialCommunityIcons color='rgb(255, 3, 184)' size={35} name={"arrow-left-drop-circle"} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { setMusicPlaying(!musicPlaying); addAction(!musicPlaying ? "Set Player to Playing" : "Paused Music") }}>
                                <MaterialCommunityIcons color='rgb(255, 3, 184)' size={40} name={(musicPlaying) ? "pause-circle" : "play-circle"} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { }}>
                                <MaterialCommunityIcons color='rgb(255, 3, 184)' size={35} name={"arrow-right-drop-circle"} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { }} style={{ left: 30 }}>
                                <MaterialCommunityIcons color='rgb(255, 3, 184)' size={30} name={"replay"} />
                            </TouchableOpacity>


                        </View>


                    </View>


                </View>


                <View style={[styles.shadow, {
                    flexDirection: 'row', padding: 20,
                    backgroundColor: 'white', borderRadius: 40,
                }]}>

                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>Volume</Text>



                        <Slider
                            style={{ width: '90%', height: 20, }}
                            minimumValue={0}
                            maximumValue={100}
                            step={1} // Adjust value in steps
                            value={volume}
                            onValueChange={(val) => setVolume(val)}
                            minimumTrackTintColor='rgb(216, 75, 255)'
                            maximumTrackTintColor="#D3D3D3"
                            thumbTintColor='rgb(255, 3, 184)'
                        />



                        <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'rgb(216, 75, 255)' }}>{Math.floor(volume)}%</Text>


                    </View>




                </View>





            </View>


        );
    }










    return (

        <View style={[{
            width: '80%', maxWidth: 1000, flexDirection: 'row',
            justifyContent: 'center', alignItems: 'center', gap: '10%',
        }]}
        >

            <View>

                <View style={[styles.musicPlayer, styles.shadow]}>

                    <View style={{ flexDirection: 'row', marginBottom: 30, alignItems: 'center', justifyContent: 'center', gap: '60%' }}>

                        <View style={{}}>
                            <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>Sigma Boy</Text>
                            <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'rgb(174, 174, 174)' }}>Ligma James</Text>
                        </View>

                        <TouchableOpacity onPress={() => { }} style={{ aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <MaterialCommunityIcons color='rgb(255, 3, 184)' size={60} name={"spotify"} />

                        </TouchableOpacity>

                    </View>


                    <HorizontalSlider
                        fixedWidth={400}
                        height={10}
                        fill={(songProg / songLength) * 100}
                        maxValue={songLength}
                        value={songProg}
                        changeValue={changeSongProg}
                        shadow={false}
                        pointer={true}

                    />

                    <View style={[styles.musicOptions]}>

                        <TouchableOpacity onPress={() => { }} style={{ right: 30 }}>
                            <MaterialCommunityIcons color='rgb(255, 3, 184)' size={40} name={"shuffle"} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { }}>
                            <MaterialCommunityIcons color='rgb(255, 3, 184)' size={50} name={"arrow-left-drop-circle"} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { setMusicPlaying(!musicPlaying); addAction(!musicPlaying ? "Set Player to Playing" : "Paused Music") }}>
                            <MaterialCommunityIcons color='rgb(255, 3, 184)' size={60} name={(musicPlaying) ? "pause-circle" : "play-circle"} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { }}>
                            <MaterialCommunityIcons color='rgb(255, 3, 184)' size={50} name={"arrow-right-drop-circle"} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { }} style={{ left: 30 }}>
                            <MaterialCommunityIcons color='rgb(255, 3, 184)' size={40} name={"replay"} />
                        </TouchableOpacity>


                    </View>


                </View>





            </View>


            <View style={[styles.shadow, {
                flexDirection: 'row', padding: 50,
                backgroundColor: 'white', borderRadius: 40,
            }]}>

                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>Volume</Text>



                    <Slider
                        style={{ width: '100%', height: 20, }}
                        minimumValue={0}
                        maximumValue={100}
                        step={1} // Adjust value in steps
                        value={volume}
                        onValueChange={(val) => setVolume(val)}
                        minimumTrackTintColor='rgb(216, 75, 255)'
                        maximumTrackTintColor="#D3D3D3"
                        thumbTintColor='rgb(255, 3, 184)'
                    />



                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'rgb(216, 75, 255)' }}>{Math.floor(volume)}%</Text>


                </View>




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


    optionButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(216, 75, 255)',
        aspectRatio: 1,
        width: '40%',
        borderRadius: 30,
        shadowColor: '#7F5Df0',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },

    musicPlayer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 40,
        padding: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },

    musicOptions: {
        width: '100%',
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'row',
        gap: 10,
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
