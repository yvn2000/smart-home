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


export default function WMPanel() {


    const [washStates, setWashStates] = useState({
        "Normal": true,
        "Delicate": false,
        "Heavy": false,
        "Quick": false,
    })

    const washOptions = ["Normal", "Delicate", "Heavy", "Quick"];

    const [washCycle, setWash] = useState("Normal");

    const newWash = () => {
        const nextWash = getNextItem(washOptions, washCycle);

        setWashStates((prev) => ({
            ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
            [nextWash]: true,
        }));

        setWash(nextWash);
    };



    const [pause, setPause] = useState(false)







    const getNextItem = (options, currentItem) => {
        const currentIndex = options.indexOf(currentItem);
        const nextIndex = (currentIndex + 1) % options.length;
        return options[nextIndex];
    };


    if (Platform.OS != 'web') {
        return (

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 50, top:-20, paddingBottom:10 }}>



                <View style={[styles.shadow, { backgroundColor: 'white', borderRadius: 50, padding: 30, alignItems: 'center', paddingTop:0 }]}>

                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 30, color: 'rgb(165, 165, 165)' }}>Status</Text>

                    <TouchableOpacity onPress={() => { setPause(!pause) }}
                        style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30 }]}>
                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                            style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                        >
                            <MaterialCommunityIcons name={(pause == true) ? "play" : "pause"} size={50} color="white"
                            />
                            {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                        </LinearGradient>

                        <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 20, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>
                            {(pause == true) ? "Paused" : "Washing"}
                        </Text>

                    </TouchableOpacity>


                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 30, color: 'rgb(165, 165, 165)' }}>Washing Progress</Text>

                    <View
                        style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30 }]}>
                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                            style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
                        >

                            {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                            <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 25, fontWeight: 'bold', color: 'white' }}>{"37%"}</Text>
                        </LinearGradient>



                    </View>



                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 30, color: 'rgb(165, 165, 165)' }}>Wash Cycle</Text>

                    <TouchableOpacity onPress={() => { newWash() }}
                        style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30 }]}>
                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                            style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                        >
                            <MaterialCommunityIcons name={"sync"} size={50} color="white"
                            />
                            {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                        </LinearGradient>

                        <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 20, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>
                            {washCycle}
                        </Text>

                    </TouchableOpacity>








                </View>


            </View>




        );
    }




    return (

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 50 }}>



            <View style={[styles.shadow, { backgroundColor: 'white', borderRadius: 50, padding: 30, alignItems: 'center' }]}>

                <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, marginTop: 30, color: 'rgb(165, 165, 165)' }}>Status</Text>

                <TouchableOpacity onPress={() => { setPause(!pause) }}
                    style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30 }]}>
                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                    >
                        <MaterialCommunityIcons name={(pause == true) ? "play" : "pause"} size={70} color="white"
                        />
                        {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                    </LinearGradient>

                    <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>
                        {(pause == true) ? "Paused" : "Washing"}
                    </Text>

                </TouchableOpacity>


                <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, marginTop: 30, color: 'rgb(165, 165, 165)' }}>Washing Progress</Text>

                <View
                    style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30 }]}>
                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
                    >

                        {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                        <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'white' }}>{"37%"}</Text>
                    </LinearGradient>



                </View>



                <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, marginTop: 30, color: 'rgb(165, 165, 165)' }}>Wash Cycle</Text>

                <TouchableOpacity onPress={() => { newWash() }}
                    style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30 }]}>
                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                    >
                        <MaterialCommunityIcons name={"sync"} size={70} color="white"
                        />
                        {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                    </LinearGradient>

                    <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>
                        {washCycle}
                    </Text>

                </TouchableOpacity>








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
