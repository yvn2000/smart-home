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
import Slider from "react-native-sliders";


export default function TVPanel({ device }) {     //width is percentage


    const [deviceInfo, setDeviceInfo] = useState({});
    const [loading, setLoading] = useState(true); // Track loading state

    const [statusDisplay, setStatusDisplay] = useState("off");

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


    //const maxVolume = 100;
    const maxVolume = 100;

    const [volume, setVolume] = useState(50);

    function changeVolume(newVolume) {
        setVolume(newVolume)
    }


    const maxBright = 100;
    const [bright, setBright] = useState(80);

    function changeBright(newBright) {
        setBright(newBright)
    }




    const [inputs, setInputStatus] = useState({
        HDMI: true,
        Stream: false,
        Cable: false,
    })
    const inputOptions = ["HDMI", "Stream", "Cable"];


    const [input, setInput] = useState("HDMI")

    const [hdmiInput, setHDMI] = useState(1)
    const [channel, setChannel] = useState(50)
    const [app, setApp] = useState("Youtube")




    const getNextItem = (options, currentItem) => {
        const currentIndex = options.indexOf(currentItem);
        const nextIndex = (currentIndex + 1) % options.length;
        return options[nextIndex];
    };

    const switchInput = () => {
        const nextInput = getNextItem(inputOptions, input);

        setInputStatus((prev) => ({
            ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
            [nextInput]: true,
        }));

        setInput(nextInput);

        addAction(`Set Input to ${nextInput}`)
    };



    const updateUrl = Platform.OS === 'android' ? `http://10.0.2.2:8000/api/device/${device.device_id}/update_device_info/` : `http://127.0.0.1:8000/api/device/${device.device_id}/update_device_info/`


    const updateTelevision = async () => {
        //console.log("update TV")
        // Validate inputs
        if (!volume || !input || !hdmiInput || !channel || !app || !bright) {
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
                    //volume: volume,
                    volume: parseInt(volume),
                    input_source: input,
                    //hdmi_input: hdmiInput,
                    hdmi_input: parseInt(hdmiInput),
                    //cable_channel: channel,
                    cable_channel: parseInt(channel),
                    stream_app: app,
                    //brightness: bright,
                    brightness: parseInt(bright),
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

  

    useEffect(() => {
        updateTelevision();
    }, [volume, input, hdmiInput, channel, app, bright]);




    useEffect(() => {
        if (deviceInfo.data) {
            //console.log(deviceInfo)
            setVolume(deviceInfo.data.volume)
            //console.log(deviceInfo.data.volume)
            setBright(deviceInfo.data.brightness)
            setInput(deviceInfo.data.input_source)
            setHDMI(deviceInfo.data.hdmi_input)
            setChannel(deviceInfo.data.cable_channel)
            setApp(deviceInfo.data.stream_app)
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
                top: -30,
                justifyContent: 'center', alignItems: 'center', gap: '2%',
            }]}
            >

                <View style={[{ width: '100%', justifyContent: 'center', alignItems: 'center', gap: '5%' }]}>

                    <TouchableOpacity onPress={() => { switchInput() }}
                        style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30, width: '65%' }]}>
                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                            style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                        >
                            <MaterialCommunityIcons name="video-input-hdmi" size={50} color="white"
                            />
                            {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                        </LinearGradient>

                        <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>{input}</Text>

                    </TouchableOpacity>


                    {(input == "HDMI") && <View style={{ flexDirection: 'row', gap: 20, marginTop: 20, width: '100%', justifyContent: 'center' }}>

                        <LinearGradient colors={[(hdmiInput == 1) ? 'rgb(255, 3, 184)' : 'rgb(232, 232, 232)', 'transparent']}
                            style={[styles.optionButton, { backgroundColor: (hdmiInput == 1) ? 'rgb(216, 75, 255)' : 'rgb(232, 232, 232)' }]}>

                            <TouchableOpacity onPress={() => { setHDMI(1); addAction(`Set HDMI Input to 1`); }}
                                style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                                <MaterialCommunityIcons name="cable-data" size={50}
                                    color={(hdmiInput == 1) ? 'white' : 'black'} />
                                <Text style={{ color: (hdmiInput == 1) ? 'white' : 'black', fontSize: 15, fontWeight: 'bold' }}>
                                    1
                                </Text>

                            </TouchableOpacity>



                        </LinearGradient>

                        <LinearGradient colors={[(hdmiInput == 2) ? 'rgb(255, 3, 184)' : 'rgb(232, 232, 232)', 'transparent']}
                            style={[styles.optionButton, { backgroundColor: (hdmiInput == 2) ? 'rgb(216, 75, 255)' : 'rgb(232, 232, 232)' }]}>
                            <TouchableOpacity onPress={() => { setHDMI(2); addAction(`Set HDMI Input to 2`); }}
                                style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                                <MaterialCommunityIcons name="cable-data" size={50}
                                    color={(hdmiInput == 2) ? 'white' : 'black'} />
                                <Text style={{ color: (hdmiInput == 2) ? 'white' : 'black', fontSize: 15, fontWeight: 'bold' }}>
                                    2
                                </Text>

                            </TouchableOpacity>
                        </LinearGradient>

                        <LinearGradient colors={[(hdmiInput == 3) ? 'rgb(255, 3, 184)' : 'rgb(232, 232, 232)', 'transparent']}
                            style={[styles.optionButton, { backgroundColor: (hdmiInput == 3) ? 'rgb(216, 75, 255)' : 'rgb(232, 232, 232)' }]}>
                            <TouchableOpacity onPress={() => { setHDMI(3); addAction(`Set HDMI Input to 3`); }}
                                style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                                <MaterialCommunityIcons name="cable-data" size={50}
                                    color={(hdmiInput == 3) ? 'white' : 'black'} />
                                <Text style={{ color: (hdmiInput == 3) ? 'white' : 'black', fontSize: 15, fontWeight: 'bold' }}>
                                    3
                                </Text>

                            </TouchableOpacity>
                        </LinearGradient>

                    </View>}

                    {(input == "Stream") && <View style={{ flexDirection: 'row', gap: 30, marginTop: 20, width: '100%', justifyContent: 'center' }}>

                        <LinearGradient colors={[(app == "Youtube") ? 'rgb(255, 3, 184)' : 'rgb(232, 232, 232)', 'transparent']}
                            style={[styles.optionButton, { backgroundColor: (app == "Youtube") ? 'rgb(216, 75, 255)' : 'rgb(232, 232, 232)', width: '30%' }]}>

                            <TouchableOpacity onPress={() => { setApp("Youtube"); addAction("Set Streaming App to Youtube"); }}
                                style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                                <MaterialCommunityIcons name="youtube" size={70}
                                    color={(app == "Youtube") ? 'white' : 'black'} />

                            </TouchableOpacity>



                        </LinearGradient>



                        <LinearGradient colors={[(app == "Hulu") ? 'rgb(255, 3, 184)' : 'rgb(232, 232, 232)', 'transparent']}
                            style={[styles.optionButton, { backgroundColor: (app == "Hulu") ? 'rgb(216, 75, 255)' : 'rgb(232, 232, 232)', width: '30%' }]}>
                            <TouchableOpacity onPress={() => { setApp("Hulu"); addAction("Set Streaming App to Hulu"); }}
                                style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                                <MaterialCommunityIcons name="hulu" size={70}
                                    color={(app == "Hulu") ? 'white' : 'black'} />

                            </TouchableOpacity>
                        </LinearGradient>

                    </View>}

                    {(input == "Cable") && <View style={{ flexDirection: 'row', gap: 5, marginTop: 10, alignItems: 'center', justifyContent: 'center', width: '100%' }}>

                        <TouchableOpacity onPress={() => { setChannel(channel - 1) }}
                            style={{ justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                            <MaterialCommunityIcons name="chevron-left" size={50}
                                color={'black'} />

                        </TouchableOpacity>

                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                            style={[styles.optionButton, { backgroundColor: 'rgb(216, 75, 255)', width: '35%' }]}>
                            <TouchableOpacity onPress={() => { }}
                                style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                                <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>
                                    Channel
                                </Text>
                                <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>
                                    {channel}
                                </Text>

                            </TouchableOpacity>
                        </LinearGradient>


                        <TouchableOpacity onPress={() => { setChannel(channel + 1) }}
                            style={{ justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                            <MaterialCommunityIcons name="chevron-right" size={50}
                                color={'black'} />

                        </TouchableOpacity>

                    </View>}


                </View>

                <View style={[styles.shadow, {
                    width: '90%', //flexDirection: 'row',
                    padding: 30,
                    backgroundColor: 'white', borderRadius: 40,
                    justifyContent: 'center', alignItems: 'center',
                    gap: 30,
                }]}>

                    <View style={{ width: '90%', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>Volume: {Math.floor((volume / maxVolume) * 100)}%</Text>

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




                    </View>

                    <View style={{ width: '90%', justifyContent: 'center', alignItems: 'center', gap: 10 }}>

                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>Brightness: {Math.floor((bright / maxBright) * 100)}%</Text>

                        <Slider
                            style={{ width: '100%', height: 20, }}
                            minimumValue={0}
                            maximumValue={100}
                            step={1} // Adjust value in steps
                            value={bright}
                            onValueChange={(val) => setBright(val)}
                            minimumTrackTintColor='rgb(216, 75, 255)'
                            maximumTrackTintColor="#D3D3D3"
                            thumbTintColor='rgb(255, 3, 184)'
                        />




                    </View>


                </View>





            </View>
        )
    }



    return (

        <View style={[{
            width: '80%', maxWidth: 1000, flexDirection: 'row',
            justifyContent: 'center', alignItems: 'center', gap: '10%',
        }]}
        >

            <View style={[{ width: '50%', justifyContent: 'center', alignItems: 'center', gap: '10%' }]}>

                <TouchableOpacity onPress={() => { switchInput() }}
                    style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30, width: '55%' }]}>
                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                    >
                        <MaterialCommunityIcons name="video-input-hdmi" size={70} color="white"
                        />
                        {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                    </LinearGradient>

                    <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>{input}</Text>

                </TouchableOpacity>


                {(input == "HDMI") && <View style={{ flexDirection: 'row', gap: 20, marginTop: 50, }}>

                    <LinearGradient colors={[(hdmiInput == 1) ? 'rgb(255, 3, 184)' : 'rgb(232, 232, 232)', 'transparent']}
                        style={[styles.optionButton, { backgroundColor: (hdmiInput == 1) ? 'rgb(216, 75, 255)' : 'rgb(232, 232, 232)' }]}>

                        <TouchableOpacity onPress={() => { setHDMI(1); addAction(`Set HDMI Input to 1`); }}
                            style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                            <MaterialCommunityIcons name="cable-data" size={70}
                                color={(hdmiInput == 1) ? 'white' : 'black'} />
                            <Text style={{ color: (hdmiInput == 1) ? 'white' : 'black', fontSize: 20, fontWeight: 'bold' }}>
                                1
                            </Text>

                        </TouchableOpacity>



                    </LinearGradient>

                    <LinearGradient colors={[(hdmiInput == 2) ? 'rgb(255, 3, 184)' : 'rgb(232, 232, 232)', 'transparent']}
                        style={[styles.optionButton, { backgroundColor: (hdmiInput == 2) ? 'rgb(216, 75, 255)' : 'rgb(232, 232, 232)' }]}>
                        <TouchableOpacity onPress={() => { setHDMI(2); addAction(`Set HDMI Input to 2`); }}
                            style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                            <MaterialCommunityIcons name="cable-data" size={70}
                                color={(hdmiInput == 2) ? 'white' : 'black'} />
                            <Text style={{ color: (hdmiInput == 2) ? 'white' : 'black', fontSize: 20, fontWeight: 'bold' }}>
                                2
                            </Text>

                        </TouchableOpacity>
                    </LinearGradient>

                    <LinearGradient colors={[(hdmiInput == 3) ? 'rgb(255, 3, 184)' : 'rgb(232, 232, 232)', 'transparent']}
                        style={[styles.optionButton, { backgroundColor: (hdmiInput == 3) ? 'rgb(216, 75, 255)' : 'rgb(232, 232, 232)' }]}>
                        <TouchableOpacity onPress={() => { setHDMI(3); addAction(`Set HDMI Input to 3`); }}
                            style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                            <MaterialCommunityIcons name="cable-data" size={70}
                                color={(hdmiInput == 3) ? 'white' : 'black'} />
                            <Text style={{ color: (hdmiInput == 3) ? 'white' : 'black', fontSize: 20, fontWeight: 'bold' }}>
                                3
                            </Text>

                        </TouchableOpacity>
                    </LinearGradient>

                </View>}

                {(input == "Stream") && <View style={{ flexDirection: 'row', gap: 20, marginTop: 50, }}>

                    <LinearGradient colors={[(app == "Youtube") ? 'rgb(255, 3, 184)' : 'rgb(232, 232, 232)', 'transparent']}
                        style={[styles.optionButton, { backgroundColor: (app == "Youtube") ? 'rgb(216, 75, 255)' : 'rgb(232, 232, 232)', width: '60%' }]}>

                        <TouchableOpacity onPress={() => { setApp("Youtube"); addAction("Set Streaming App to Youtube"); }}
                            style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                            <MaterialCommunityIcons name="youtube" size={70}
                                color={(app == "Youtube") ? 'white' : 'black'} />

                        </TouchableOpacity>



                    </LinearGradient>



                    <LinearGradient colors={[(app == "Hulu") ? 'rgb(255, 3, 184)' : 'rgb(232, 232, 232)', 'transparent']}
                        style={[styles.optionButton, { backgroundColor: (app == "Hulu") ? 'rgb(216, 75, 255)' : 'rgb(232, 232, 232)', width: '60%' }]}>
                        <TouchableOpacity onPress={() => { setApp("Hulu"); addAction("Set Streaming App to Hulu"); }}
                            style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                            <MaterialCommunityIcons name="hulu" size={70}
                                color={(app == "Hulu") ? 'white' : 'black'} />

                        </TouchableOpacity>
                    </LinearGradient>

                </View>}

                {(input == "Cable") && <View style={{ flexDirection: 'row', gap: 20, marginTop: 50, alignItems: 'center', justifyContent: 'center' }}>

                    <TouchableOpacity onPress={() => { setChannel(channel - 1) }}
                        style={{ justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                        <MaterialCommunityIcons name="chevron-left" size={70}
                            color={'black'} />

                    </TouchableOpacity>

                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={[styles.optionButton, { backgroundColor: 'rgb(216, 75, 255)', width: '50%' }]}>
                        <TouchableOpacity onPress={() => { setHDMI(3) }}
                            style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', padding: 30 }}>
                            <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>
                                Channel
                            </Text>
                            <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold' }}>
                                {channel}
                            </Text>

                        </TouchableOpacity>
                    </LinearGradient>


                    <TouchableOpacity onPress={() => { setChannel(channel + 1) }}
                        style={{ justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                        <MaterialCommunityIcons name="chevron-right" size={70}
                            color={'black'} />

                    </TouchableOpacity>

                </View>}


            </View>

            <View style={[styles.shadow, {
                width: '50%', padding: 30,
                backgroundColor: 'white', borderRadius: 40,
                alignItems:'center', gap:30,
            }]}>

                <View style={{ width: '70%', justifyContent: 'center', alignItems: 'center', gap:10 }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>Volume</Text>

                    <View style={{ width: '100%', }}>


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

                    </View>

                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'rgb(216, 75, 255)' }}>{Math.floor((volume / maxVolume) * 100)}%</Text>


                </View>

                <View style={{ width: '70%', justifyContent: 'center', alignItems: 'center', gap: 10 }}>

                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>Brightness</Text>

                    <Slider
                        style={{ width: '100%', height: 20, }}
                        minimumValue={0}
                        maximumValue={100}
                        step={1} // Adjust value in steps
                        value={bright}
                        onValueChange={(val) => setBright(val)}
                        minimumTrackTintColor='rgb(216, 75, 255)'
                        maximumTrackTintColor="#D3D3D3"
                        thumbTintColor='rgb(255, 3, 184)'
                    />

                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'rgb(216, 75, 255)' }}>{Math.floor((bright / maxBright) * 100)}%</Text>


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
        width: Platform.OS == 'web' ? '35%' : '25%',
        borderRadius: Platform.OS == 'web' ? 30 : 20,
        shadowColor: '#7F5Df0',
        shadowOffset: {
            width: 0,
            height: 10,
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
