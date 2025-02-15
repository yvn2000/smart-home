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

import VerticalSlider from "../vertical-slider";


export default function BlindsPanel({ device }) {     //width is percentage

    const [blindsOpen, setOpen] = useState(true)

    const maxOpen = 100;
    const [openness, setOpenness] = useState(40);

    function setBlinds(status) {
        setOpen(status)
    }

    function changeOpenness(newOpenness) {
        setOpenness(newOpenness)
        //console.log('Openness updated to:', newOpenness);
    }

    useEffect(() => {
        if (openness<=0) {
            setOpen(false)
        }
        else if (openness>0 && (blindsOpen==false)) {
            setOpen(true)
        }
    }, [openness])





    return (

        <View style={[styles.shadow, {
            width: '80%', maxWidth: 1000, backgroundColor: 'white', flexDirection: 'row',
            justifyContent: 'center', alignItems: 'center', padding: 40, borderRadius: 40,
            gap: '10%'
        }]}
        >

            <TouchableOpacity onPress={() => { setBlinds(!blindsOpen) }}
                style={[styles.shadow, { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 30, width:'30%' }]}>
                <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                    style={{ backgroundColor: 'rgb(216, 75, 255)', padding: 15, borderRadius: 30, justifyContent: 'center', alignItems: 'center', aspectRatio: 1 }}
                >
                    <MaterialCommunityIcons name={(blindsOpen) ? "blinds-open" : "blinds"} size={70} color="white"
                    />
                    {/*<Text style={{fontSize: 15, fontWeight: 'bold', color: 'white' }}>Fan</Text>*/}
                </LinearGradient>

                <Text style={{ marginLeft: 30, marginRight: 30, fontSize: 30, fontWeight: 'bold', color: 'rgb(255, 3, 184)' }}>{(blindsOpen) ? "Open" : "Closed"}</Text>

            </TouchableOpacity>
            <View style={[{ width: '40%', borderRadius: 40, gap:10, justifyContent:'center', alignItems:'center' }]}>

                
                <VerticalSlider
                    width={60}  //percentage
                    height={300}
                    fill={40}
                    maxValue={maxOpen}
                    value={openness}
                    changeValue={changeOpenness}
                    shadow={false}
                />
                

                <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'rgb(216, 75, 255)' }}>{blindsOpen ? Math.floor((openness / maxOpen) * 100) : 0}% Open</Text>


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
