import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, PanResponder

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState, useLayoutEffect, useRef } from "react";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

import Animated, {
    useSharedValue, useAnimatedStyle, withRepeat, withTiming,
    withDelay, withSpring, withSequence, Easing, useAnimatedProps,
    interpolate, Extrapolation
} from 'react-native-reanimated';

import TempDial from "../dial";


export default function ACPanel({ device }) {     //width is percentage


    const [fanStates, setFan] = useState({
        "High": false,
        "Medium": false,
        "Low": false,
        "Auto": false,
    })

    const [modes, setMode] = useState({
        "Cool": false,
        "Dry": false,
        "Fan": false,
        "Heat": false,
    })

    const fanOptions = ["High", "Medium", "Low", "Auto"];
    const modeOptions = ["Cool", "Dry", "Fan", "Heat"];

    const [prevFan, setPrevFan] = useState("Auto");
    const [prevMode, setPrevMode] = useState("Cool");

    const getNextItem = (options, currentItem) => {
        const currentIndex = options.indexOf(currentItem);
        const nextIndex = (currentIndex + 1) % options.length;
        return options[nextIndex];
    };

    const newFan = () => {
        const nextFan = getNextItem(fanOptions, prevFan);

        setFan((prev) => ({
            ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
            [nextFan]: true,
        }));

        setPrevFan(nextFan);
    };

    const newMode = () => {
        const nextMode = getNextItem(modeOptions, prevMode);

        setMode((prev) => ({
            ...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
            [nextMode]: true,
        }));

        setPrevMode(nextMode);
    };





    return (

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 50 }}>

            <TempDial device_id={device.device_id} deviceName={device.name} changeable={device.logo == 'air-conditioner' ? true : false} tempArg={device.temp} />

            <View style={[styles.shadow, { backgroundColor: 'white', borderRadius: 50, padding: 30, alignItems: 'center' }]}>

                <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, color:'rgb(165, 165, 165)' }}>Fan</Text>

                <TouchableOpacity onPress={() => { newFan() }}
                    style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30 }]}>
                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                    >
                        <MaterialCommunityIcons name="fan" size={70} color="white"
                        />
                        {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                    </LinearGradient>

                    <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>{prevFan}</Text>

                </TouchableOpacity>



                <Text style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10, marginTop:40, color:'rgb(165, 165, 165)' }}>Mode</Text>

                <TouchableOpacity onPress={() => { newMode() }}
                    style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30 }]}>
                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                    >
                        <MaterialCommunityIcons name="dots-grid" size={70} color="white"
                        />
                        {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                    </LinearGradient>

                    <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>{prevMode}</Text>

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
