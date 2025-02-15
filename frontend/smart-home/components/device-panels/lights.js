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


export default function LightsPanel({ device }) {     //width is percentage

    const [colors, setColors] = useState({
        "violet": false,
        "pink": false,
        "purple": false,
        "blue": false,
        "cyan": false,
        "green": false,
        "yellow": false,
        "orange": false,
        "red": false,
        "white": true,
    })

    const [prevColor, setPrevColor] = useState("white")

    const setColor = (newColor) => {
        setColors((prev) => ({
            ...prev,
            [prevColor]: !prev[prevColor],
            [newColor]: true,
        }));

        setPrevColor(newColor)
    }

    const maxIntensity = 200;
    const [intensity, setIntensity] = useState(40);

    function changeIntensity(newIntensity) {
        setIntensity(newIntensity)
        //console.log('Intensity updated to:', newIntensity);
    }





    return (

        <View style={{ flexDirection: 'row', width: '90%', maxWidth: 1000, padding: 20 }}>

            <View style={[{ width: '50%', justifyContent: 'center', alignItems: 'center' }]}>

                {/*<Text style={{ top: 10, fontWeight: 'bold' }}>--- Light Color ---</Text>*/}

                <View style={[{ flexDirection: 'row', width: '100%', justifyContent: 'center' }]}>
                    <View style={[{ width: '20%', gap: 30, padding: 20, justifyContent: 'center', alignItems: 'center' }]}>
                        <TouchableOpacity
                            style={[styles.hueOption, {
                                backgroundColor: 'rgb(225, 0, 255)',
                                borderWidth: 3,
                                borderColor: (colors.violet == true ? 'black' : 'rgb(225, 0, 255)')
                            }]}
                            onPress={() => { setColor("violet") }}
                        >

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.hueOption, {
                            backgroundColor: 'rgb(255, 0, 153)',
                            borderWidth: 3,
                            borderColor: (colors.pink == true ? 'black' : 'rgb(255, 0, 153)')
                        }]}
                            onPress={() => { setColor("pink") }}>

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.hueOption, {
                            backgroundColor: 'rgb(149, 0, 255)',
                            borderWidth: 3,
                            borderColor: (colors.purple == true ? 'black' : 'rgb(149, 0, 255)')
                        }]}
                            onPress={() => { setColor("purple") }}>

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.hueOption, {
                            backgroundColor: 'rgb(4, 0, 255)',
                            borderWidth: 3,
                            borderColor: (colors.blue == true ? 'black' : 'rgb(4, 0, 255)')
                        }]}
                            onPress={() => { setColor("blue") }}>

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.hueOption, {
                            backgroundColor: 'rgb(0, 255, 255)',
                            borderWidth: 3,
                            borderColor: (colors.cyan == true ? 'black' : 'rgb(0, 255, 255)')
                        }]}
                            onPress={() => { setColor("cyan") }}>

                        </TouchableOpacity>

                    </View>
                    <View style={[{ width: '20%', gap: 30, padding: 20, justifyContent: 'center', alignItems: 'center' }]}>
                        <TouchableOpacity style={[styles.hueOption, {
                            backgroundColor: 'rgb(0, 255, 34)',
                            borderWidth: 3,
                            borderColor: (colors.green == true ? 'black' : 'rgb(0, 255, 34)')
                        }]}
                            onPress={() => { setColor("green") }}>

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.hueOption, {
                            backgroundColor: 'rgb(242, 255, 0)',
                            borderWidth: 3,
                            borderColor: (colors.yellow == true ? 'black' : 'rgb(242, 255, 0)')
                        }]}
                            onPress={() => { setColor("yellow") }}>

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.hueOption, {
                            backgroundColor: 'rgb(255, 145, 0)',
                            borderWidth: 3,
                            borderColor: (colors.orange == true ? 'black' : 'rgb(255, 145, 0)')
                        }]}
                            onPress={() => { setColor("orange") }}>

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.hueOption, {
                            backgroundColor: 'rgb(255, 0, 0)',
                            borderWidth: 3,
                            borderColor: (colors.red == true ? 'black' : 'rgb(255, 0, 0)')
                        }]}
                            onPress={() => { setColor("red") }}>

                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.hueOption, {
                            backgroundColor: 'rgb(255, 255, 255)',
                            borderWidth: 3,
                            borderColor: (colors.white == true ? 'black' : 'rgb(255, 255, 255)')
                        }]}
                            onPress={() => { setColor("white") }}>

                        </TouchableOpacity>
                    </View>

                </View>




            </View>


            <View style={[styles.shadow, { backgroundColor: 'white', width: '50%', alignItems: 'center', gap: 10, borderRadius: 50, paddingBottom: 40, paddingTop: 10 }]}>

                <Text style={{ fontSize: 20, marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>--- Light Intensity ---</Text>


                <VerticalSlider
                    width={30}  //percentage
                    height={300}
                    fill={(intensity / maxIntensity) * 100}
                    maxValue={maxIntensity}
                    value={intensity}
                    changeValue={changeIntensity}
                    shadow={false}

                />

                <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'rgb(216, 75, 255)' }}>{Math.floor((intensity / maxIntensity) * 100)}%</Text>



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


    hueOption: {
        aspectRatio: 1,
        borderRadius: 500,
        width: '90%',
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
