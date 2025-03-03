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


export default function VerticalSlider({ width, height, fill, maxValue, value, changeValue, shadow }) {     //width is percentage

    const sliderHeight = height
    const fillValue = useSharedValue((fill/100)*height);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gestureState) => {
                const { locationY } = event.nativeEvent;
                //console.log("Gesture event pos: Y: " + locationY);


                //fillValue.value = withSpring((sliderHeight - locationY), { damping: 10, stiffness: 100 });
                fillValue.value = withSpring(
                    Math.min(Math.max(sliderHeight - locationY, 0), height),
                    { damping: 10, stiffness: 100 }
                );

                changeValue((fillValue.value / height) * maxValue);
            },
        })
    ).current;

    const animatedStyle = useAnimatedStyle(() => {
        return {
            //height: fillValue.value,
            height: `${(fillValue.value/height)*100}%`,
        };
    });





    return (

        <View style={[(shadow && styles.shadow),{ backgroundColor: 'rgb(226, 226, 226)', width: `${width}%`, height: sliderHeight,
            borderRadius: 40, overflow: 'hidden', justifyContent: 'flex-end' }]}
            {...panResponder.panHandlers}
        >

            <Animated.View style={[animatedStyle, { width: '100%', }]}>

                <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                    style={{
                        backgroundColor: 'rgb(216, 75, 255)',
                        height: '100%',
                        width: '100%'
                    }}


                >

                </LinearGradient>



            </Animated.View>

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
