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
import HorizontalSlider from "../horizontal-slider";


export default function SpeakerPanel() {     //width is percentage



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

                        <TouchableOpacity onPress={() => { setMusicPlaying(!musicPlaying) }}>
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
                flexDirection: 'row', padding: 30,
                backgroundColor: 'white', borderRadius: 40,
            }]}>

                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>Volume</Text>



                    <VerticalSlider
                        width={60}  //percentage
                        height={250}
                        fill={(volume / maxVolume) * 100}
                        maxValue={maxVolume}
                        value={volume}
                        changeValue={changeVolume}
                        shadow={false}

                    />



                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'rgb(216, 75, 255)' }}>{Math.floor((volume / maxVolume) * 100)}%</Text>


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
