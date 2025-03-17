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

import { useTheme } from "../themes/theme";


export default function CoffeePanel() {


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


    const [strength, setStrength] = useState(1)
    const [size, setSize] = useState(5)
    const [temp, setTemp] = useState(90)

    const updateStrength = (value) => {
        if ((strength + value) >= 10) {
            setStrength(9)
        }
        else if ((strength + value) <= 0) {
            setStrength(1)
        }
        else {
            setStrength(strength + value)
        }
    }
    const updateSize = (value) => {
        if ((size + value) >= 20) {
            setSize(20)
        }
        else if ((size + value) <= 5) {
            setSize(5)
        }
        else {
            setSize(size + value)
        }
    }
    const updateTemp = (value) => {
        if ((temp + value) >= 120) {
            setTemp(120)
        }
        else if ((temp + value) <= 80) {
            setTemp(80)
        }
        else {
            setTemp(temp + value)
        }
    }





    if (Platform.OS != 'web') {
        return (

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 50, paddingBottom: 35 }}>



                <View style={[styles.shadow, { backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255,255,255)', borderRadius: 50, padding: 30, alignItems: 'center', width: '90%' }]}>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 50 }}>

                        <View>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 10, color: 'rgb(165, 165, 165)' }}>Coffee Capacity</Text>

                            <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', padding: 10, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}
                            >

                                {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                                <View style={{ marginLeft: 30, marginRight: 30, }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>84%</Text>

                                </View>

                            </LinearGradient>
                        </View>


                        <View>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 10, color: 'rgb(165, 165, 165)' }}>Water Capacity</Text>

                            <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', padding: 10, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}
                            >

                                {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                                <View style={{ marginLeft: 30, marginRight: 30, }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>37%</Text>

                                </View>

                            </LinearGradient>
                        </View>

                    </View>

                    <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 10, marginTop: 20, color: 'rgb(165, 165, 165)' }}>------------------</Text>


                    <View style={{ flexDirection: 'row', gap: 15 }}>

                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 10, color: 'rgb(165, 165, 165)' }}>Strength</Text>

                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginLeft: 20, marginRight: 20 }}>

                                <View style={{ alignItems: 'center' }}>

                                    <TouchableOpacity onPress={() => { updateStrength(1) }}>
                                        <MaterialCommunityIcons name="plus" size={20} color="'rgb(255, 3, 184)'" />
                                    </TouchableOpacity>

                                    <View style={[{ alignItems: 'center', justifyContent: 'center', padding: 5 }]}>
                                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'rgb(165, 165, 165)' }}>
                                            {`${strength}`}
                                        </Text>
                                    </View>

                                    <TouchableOpacity onPress={() => { updateStrength(-1) }}>
                                        <MaterialCommunityIcons name="minus" size={20} color="'rgb(255, 3, 184)'" />
                                    </TouchableOpacity>

                                </View>

                            </View>
                        </View>

                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 10, color: 'rgb(165, 165, 165)' }}>Size</Text>

                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginLeft: 20, marginRight: 20 }}>

                                <View style={{ alignItems: 'center' }}>

                                    <TouchableOpacity onPress={() => { updateSize(1) }}>
                                        <MaterialCommunityIcons name="plus" size={20} color="'rgb(255, 3, 184)'" />
                                    </TouchableOpacity>

                                    <View style={[{ alignItems: 'center', justifyContent: 'center', padding: 5 }]}>
                                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'rgb(165, 165, 165)' }}>
                                            {`${size} oz`}
                                        </Text>
                                    </View>

                                    <TouchableOpacity onPress={() => { updateSize(-1) }}>
                                        <MaterialCommunityIcons name="minus" size={20} color="'rgb(255, 3, 184)'" />
                                    </TouchableOpacity>

                                </View>

                            </View>
                        </View>


                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, marginTop: 10, color: 'rgb(165, 165, 165)' }}>Temperature</Text>

                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginLeft: 20, marginRight: 20 }}>

                                <View style={{ alignItems: 'center' }}>

                                    <TouchableOpacity onPress={() => { updateTemp(1) }}>
                                        <MaterialCommunityIcons name="plus" size={20} color="'rgb(255, 3, 184)'" />
                                    </TouchableOpacity>

                                    <View style={[{ alignItems: 'center', justifyContent: 'center', padding: 5 }]}>
                                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'rgb(165, 165, 165)' }}>
                                            {`${temp}°C`}
                                        </Text>
                                    </View>

                                    <TouchableOpacity onPress={() => { updateTemp(-1) }}>
                                        <MaterialCommunityIcons name="minus" size={20} color="'rgb(255, 3, 184)'" />
                                    </TouchableOpacity>

                                </View>

                            </View>
                        </View>
                    </View>

                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', marginTop: 20, padding: 18, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}
                    >

                        {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                        <TouchableOpacity style={{ marginLeft: 30, marginRight: 30, }}>
                            <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>Brew</Text>

                        </TouchableOpacity>

                    </LinearGradient>





                </View>


            </View>




        );
    }




    return (

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 50 }}>



            <View style={[styles.shadow, { backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255,255,255)', borderRadius: 50, padding: 30, alignItems: 'center' }]}>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 50 }}>

                    <View>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, color: 'rgb(165, 165, 165)' }}>Coffee Capacity</Text>

                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                            style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', padding: 18, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}
                        >

                            {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                            <View style={{ marginLeft: 30, marginRight: 30, }}>
                                <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>84%</Text>

                            </View>

                        </LinearGradient>
                    </View>


                    <View>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, color: 'rgb(165, 165, 165)' }}>Water Capacity</Text>

                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                            style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', padding: 18, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}
                        >

                            {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                            <View style={{ marginLeft: 30, marginRight: 30, }}>
                                <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>37%</Text>

                            </View>

                        </LinearGradient>
                    </View>

                </View>

                <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, marginTop: 20, color: 'rgb(165, 165, 165)' }}>------------------</Text>


                <View style={{ flexDirection: 'row', gap: 40 }}>

                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, marginTop: 10, color: 'rgb(165, 165, 165)' }}>Strength</Text>

                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginLeft: 20, marginRight: 20 }}>

                            <View style={{ alignItems: 'center' }}>

                                <TouchableOpacity onPress={() => { updateStrength(1) }}>
                                    <MaterialCommunityIcons name="plus" size={40} color="'rgb(255, 3, 184)'" />
                                </TouchableOpacity>

                                <View style={[{ alignItems: 'center', justifyContent: 'center', padding: 5 }]}>
                                    <Text style={{ fontSize: 35, fontWeight: 'bold', color: 'rgb(165, 165, 165)' }}>
                                        {`${strength}`}
                                    </Text>
                                </View>

                                <TouchableOpacity onPress={() => { updateStrength(-1) }}>
                                    <MaterialCommunityIcons name="minus" size={40} color="'rgb(255, 3, 184)'" />
                                </TouchableOpacity>

                            </View>

                        </View>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, marginTop: 10, color: 'rgb(165, 165, 165)' }}>Size</Text>

                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginLeft: 20, marginRight: 20 }}>

                            <View style={{ alignItems: 'center' }}>

                                <TouchableOpacity onPress={() => { updateSize(1) }}>
                                    <MaterialCommunityIcons name="plus" size={40} color="'rgb(255, 3, 184)'" />
                                </TouchableOpacity>

                                <View style={[{ alignItems: 'center', justifyContent: 'center', padding: 5 }]}>
                                    <Text style={{ fontSize: 35, fontWeight: 'bold', color: 'rgb(165, 165, 165)' }}>
                                        {`${size} oz`}
                                    </Text>
                                </View>

                                <TouchableOpacity onPress={() => { updateSize(-1) }}>
                                    <MaterialCommunityIcons name="minus" size={40} color="'rgb(255, 3, 184)'" />
                                </TouchableOpacity>

                            </View>

                        </View>
                    </View>


                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, marginTop: 10, color: 'rgb(165, 165, 165)' }}>Temperature</Text>

                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginLeft: 20, marginRight: 20 }}>

                            <View style={{ alignItems: 'center' }}>

                                <TouchableOpacity onPress={() => { updateTemp(1) }}>
                                    <MaterialCommunityIcons name="plus" size={40} color="'rgb(255, 3, 184)'" />
                                </TouchableOpacity>

                                <View style={[{ alignItems: 'center', justifyContent: 'center', padding: 5 }]}>
                                    <Text style={{ fontSize: 35, fontWeight: 'bold', color: 'rgb(165, 165, 165)' }}>
                                        {`${temp}°C`}
                                    </Text>
                                </View>

                                <TouchableOpacity onPress={() => { updateTemp(-1) }}>
                                    <MaterialCommunityIcons name="minus" size={40} color="'rgb(255, 3, 184)'" />
                                </TouchableOpacity>

                            </View>

                        </View>
                    </View>
                </View>

                <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                    style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', marginTop: 20, padding: 18, borderRadius: 30, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}
                >

                    {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                    <TouchableOpacity style={{ marginLeft: 30, marginRight: 30, }}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>Brew</Text>

                    </TouchableOpacity>

                </LinearGradient>





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
