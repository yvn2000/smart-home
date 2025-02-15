import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, PanResponder

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


export default function TVPanel({ }) {     //width is percentage



    const maxVolume = 100;
    const [volume, setVolume] = useState(40);

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
    const [app, setApp] = useState("youtube")




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
    };







    return (

        <View style={[{
            width: '80%', maxWidth: 1000,flexDirection: 'row',
            justifyContent: 'center', alignItems: 'center', gap:'10%',
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

                        <TouchableOpacity onPress={() => { setHDMI(1) }}
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
                        <TouchableOpacity onPress={() => { setHDMI(2) }}
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
                        <TouchableOpacity onPress={() => { setHDMI(3) }}
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

                    <LinearGradient colors={[(app == "youtube") ? 'rgb(255, 3, 184)' : 'rgb(232, 232, 232)', 'transparent']}
                        style={[styles.optionButton, { backgroundColor: (app == "youtube") ? 'rgb(216, 75, 255)' : 'rgb(232, 232, 232)', width: '60%' }]}>

                        <TouchableOpacity onPress={() => { setApp("youtube") }}
                            style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                            <MaterialCommunityIcons name="youtube" size={70}
                                color={(app == "youtube") ? 'white' : 'black'} />

                        </TouchableOpacity>



                    </LinearGradient>



                    <LinearGradient colors={[(app == "hulu") ? 'rgb(255, 3, 184)' : 'rgb(232, 232, 232)', 'transparent']}
                        style={[styles.optionButton, { backgroundColor: (app == "hulu") ? 'rgb(216, 75, 255)' : 'rgb(232, 232, 232)', width: '60%' }]}>
                        <TouchableOpacity onPress={() => { setApp("hulu") }}
                            style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                            <MaterialCommunityIcons name="hulu" size={70}
                                color={(app == "hulu") ? 'white' : 'black'} />

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

            <View style={[styles.shadow,{ width: '50%', flexDirection: 'row', padding: 30,
                 backgroundColor: 'white', borderRadius: 40,
             }]}>

                <View style={{ width: '50%', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>Volume</Text>

                    <VerticalSlider
                        width={60}  //percentage
                        height={300}
                        fill={(volume / maxVolume) * 100}
                        maxValue={maxVolume}
                        value={volume}
                        changeValue={changeVolume}
                        shadow={false}

                    />

                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'rgb(216, 75, 255)' }}>{Math.floor((volume / maxVolume) * 100)}%</Text>


                </View>

                <View style={{ width: '50%', justifyContent: 'center', alignItems: 'center', gap: 10 }}>

                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>Brightness</Text>

                    <VerticalSlider
                        width={60}  //percentage
                        height={300}
                        fill={(bright / maxBright) * 100}
                        maxValue={maxBright}
                        value={bright}
                        changeValue={changeBright}
                        shadow={false}

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
