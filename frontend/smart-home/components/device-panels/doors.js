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


export default function DoorsPanel({ device }) {     //width is percentage

    const [doorStatus, setDoor] = useState(true)
    const [code, setCode] = useState(['0', '0', '0', '0']);

    function setLock(status) {
        setDoor(status)
    }

    const [focusedIndex, setFocusedIndex] = useState(null);

    const inputRefs = [
        React.createRef(),
        React.createRef(),
        React.createRef(),
        React.createRef(),
    ];


    const handleChange = (index, value) => {
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 3) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleVerify = () => {
        console.log('Code:', code.join(''));
    };






    return (

        <View style={[styles.shadow, {
            width: '80%', maxWidth: 1000, backgroundColor: 'white', flexDirection: 'row',
            justifyContent: 'center', alignItems: 'center', padding: 40, borderRadius: 40,
            gap: '10%'
        }]}
        >

            <TouchableOpacity onPress={() => { setLock(!doorStatus) }}
                style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30, width: '35%' }]}>
                <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                    style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                >
                    <MaterialCommunityIcons name={(doorStatus) ? "lock-open-variant-outline" : "lock-outline"} size={70} color="white"
                    />
                    {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                </LinearGradient>

                <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>{(doorStatus) ? "Unlocked" : "Locked"}</Text>

            </TouchableOpacity>
            <View style={[{ width: '40%', borderRadius: 40, gap: 10, justifyContent: 'center', alignItems: 'center' }]}>


                <Text
                    style={[{ padding: 0, fontSize: 30, color: 'rgb(255, 3, 184)', fontWeight: 'bold' }]}
                >
                    Access Code
                </Text>

                <View>


                    <View style={styles.inputs}>
                        {code.map((value, index) => (
                            <TextInput
                                key={index}
                                style={[
                                    styles.input,
                                    { borderColor: focusedIndex === index ? 'rgb(216, 75, 255)' : 'rgb(175, 175, 175)', } // Conditional border color
                                ]}
                                selectionColor={'rgb(216, 75, 255)'}
                                value={value}
                                onChangeText={(text) => handleChange(index, text)}
                                maxLength={1}
                                keyboardType="numeric"
                                ref={inputRefs[index]}
                            />
                        ))}
                    </View>



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


    inputs: {
        flexDirection: 'row',
        marginTop: 10,
        //alignItems:'center',
        justifyContent: 'center',
        //height:'100%'
    },
    input: {
        width: '8%',
        height: 60,
        //height:'80%',
        textAlign: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: '#d2d2d2',
        marginHorizontal: 5,
        fontSize:30,
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
