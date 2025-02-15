import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, Text, View, Button,
    TouchableOpacity, PanResponder, Dimensions

} from "react-native";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "../components/themes/theme";
import LavaLampBackground from "../components/themes/lava-lamp-bg";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { DUMMY_DATA } from "../data/dummy-device-data";

import Svg, { Circle, Path } from 'react-native-svg';

import Animated, {
    useSharedValue, useAnimatedStyle, withRepeat, withTiming,
    withDelay, withSpring, withSequence, Easing, useAnimatedProps,
    interpolate, Extrapolation
} from 'react-native-reanimated';

import { LinearGradient } from 'expo-linear-gradient';


export default function TempDial( {device_id, deviceName, changeable, tempArg} ) {

    const [windowDimensions, setWindowDimensions] = useState(Dimensions.get("window"));
    //console.log(windowDimensions)
    useEffect(() => {
        setWindowDimensions(Dimensions.get("window"))
    }, [windowDimensions])


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


    //const [temp, setTemp] = useState(20);       //initial temp is 20
    const [temp, setTemp] = useState(tempArg);
    const minTemp = 0;
    const maxTemp = 40;
    const prog = useSharedValue(temp / maxTemp);            //initial prog is 50%

    //const radius = 100
    //const radius = Platform.OS == 'web' ? (((windowDimensions.width / 10) < 1500) ? windowDimensions.width / 12 : 100) : 0.25 * windowDimensions.width;

    //const [radius, setRadius] = useState(0)
    const [radius, setRadius] = useState(Platform.OS == 'web' ? (((windowDimensions.width / 10) < 1500) ? windowDimensions.width / 12 : 100) : 0.25 * windowDimensions.width)
    

    useEffect(() => {
        setWindowDimensions(Dimensions.get("window"))
        setRadius(Platform.OS == 'web' ? (((windowDimensions.width / 10) < 1500) ? windowDimensions.width / 12 : 100) : 0.25 * windowDimensions.width)
    }, [windowDimensions])



    //console.log("Radius: " + radius)
    const strokeWidth = 0.2 * radius
    const circum = 2 * Math.PI * radius

    const AnimatedCircle = Animated.createAnimatedComponent(Circle)

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: circum * (1 - prog.value)           //offset removes the percentage
        //strokeDashoffset: circum * (1 - 0.35)           
    }))

    //For the + and - buttons
    const changeTemp = (change, type) => {
        //console.log("Type: " + type)
        if (type == "plus" && temp < maxTemp) {
            setTemp(temp + change)
        }
        else if (type == "minus" && temp > minTemp) {
            setTemp(temp - change)
        }

    }
    useEffect(() => {
        prog.value = withSpring(temp / maxTemp)
    }, [temp])

    //Angle testing
    //const degree = 30;
    //const angle = degree*(Math.PI/180)//Math.PI/3;
    //console.log("Cos("+angle+"): " + Math.cos(angle))
    //console.log("Sin("+angle+"): " + Math.sin(angle))


    // Gesture Handling
    const panResponder = useRef(
        PanResponder.create(changeable && {
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gestureState) => {

                const { moveX, moveY } = gestureState;

                //console.log("Gesture pos: X: " + moveX + " Y: " + moveY)

                const { locationX, locationY } = event.nativeEvent;
                //console.log("Gesture event pos: X: " + locationX + " Y: " + locationY)

                const CosTheta = (locationX - radius) / radius;
                const SinTheta = (locationY - radius) / radius;
                const angle = Math.atan2(SinTheta, CosTheta) - (Math.PI / 2);         //We subtract Math.PI/2 to account for the rotated circle in transform={`rotate(90 ${radius} ${radius})`}

                //console.log("Angle: "+(angle*(180/Math.PI)))


                let normalizedProg = angle / (2 * Math.PI);         //changing it to a value between 0 and 1
                if (normalizedProg < 0) normalizedProg += 1;

                prog.value = withSpring(normalizedProg);


                const newTemp = Math.round(normalizedProg * (maxTemp - minTemp) + minTemp);
                setTemp(newTemp);

            },
        })
    ).current;






    return (


        /*
        <View style={[{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }]}>
            <View style={[{ backgroundColor: 'rgb(216, 75, 255)', height: 500, width: 500, borderRadius: 500 }]}>

            </View>
        </View>*/
        <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 20 }]}>

            {changeable==true && <TouchableOpacity
                onPress={() => {
                    changeTemp(1, "plus")
                }}>
                <Text style={{ fontSize: 0.4 * radius }}>+</Text>
            </TouchableOpacity>}
            <View>
                <View style={[styles.container, styles.shadow]}>
                    <Svg width={2 * radius + strokeWidth} height={2 * radius + strokeWidth}>
                        {/* Background Circle */}
                        <Circle
                            cx={radius + strokeWidth / 2}
                            cy={radius + strokeWidth / 2}
                            r={radius}
                            stroke="#ddd"
                            strokeWidth={strokeWidth}
                            fill='rgba(255, 255, 255, 0.9)'
                            style={styles.shadow}
                        />
                        {/* Progress Circle */}
                        <AnimatedCircle
                            cx={radius + strokeWidth / 2}
                            cy={radius + strokeWidth / 2}
                            r={radius}
                            stroke='rgb(255, 3, 184)'
                            //stroke='rgba(216, 75, 255, 1)'
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${circum}`}
                            animatedProps={animatedProps}
                            fill='none'
                            strokeLinecap="round"
                            transform={`rotate(90 ${radius + strokeWidth / 2} ${radius + strokeWidth / 2})`} // Rotate the progress
                        />
                        
                    </Svg>
                    <View
                        style={[styles.centerCircle, { width: radius * 2, height: radius * 2 }]}
                        {...panResponder.panHandlers}
                    >
                        <Text style={[styles.temperature, { fontSize: 0.3 * radius }]}>{temp}°C</Text>
                        <Text style={[styles.temperature, { fontSize: 0.1 * radius }]}>{deviceName}</Text>
                        {/*<Text style={styles.temperature}>Circum:{circum}</Text>*/}
                    </View>
                </View>
            </View>

            {changeable==true && <TouchableOpacity
                onPress={() => {
                    changeTemp(1, "minus")
                }}>
                <Text style={{ fontSize: 0.4 * radius }}>-</Text>
            </TouchableOpacity>}

        </View>



    );
}



const styles = StyleSheet.create({
    testBorder: {
        borderColor: 'red',
        borderWidth: 3,
    },


    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerCircle: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',

    },
    temperature: {
        fontWeight: 'bold',
        //color: 'rgb(216, 75, 255)',
        color:'rgb(255, 3, 184)',
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
        borderRadius:500,
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
