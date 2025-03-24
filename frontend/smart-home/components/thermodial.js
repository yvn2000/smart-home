import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, Text, View, Button,
    TouchableOpacity, PanResponder, Dimensions,
    Alert, ActivityIndicator,

} from "react-native";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "../components/themes/theme";
import LavaLampBackground from "../components/themes/lava-lamp-bg";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { DUMMY_DATA } from "../data/dummy-device-data";

import Svg, { Circle, Line, Path } from 'react-native-svg';

import Animated, {
    useSharedValue, useAnimatedStyle, withRepeat, withTiming,
    withDelay, withSpring, withSequence, Easing, useAnimatedProps,
    interpolate, Extrapolation
} from 'react-native-reanimated';

import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE_URL } from "../src/config";


export default function ThermoDial({ changeable, radiusIn, minValueIn, maxValueIn, tempValue, house_id, thermMode }) {

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






    const [boolThermo, setBoolThermo] = useState(false);

    const [thermoTemp, setThermoTemp] = useState(tempValue)
    const [thermoMode, setThermoMode] = useState(thermMode)
    const [thermoCode, setThermoCode] = useState('')



    useEffect(()=> {
        updateThermo(thermoMode)
    }, [thermoMode])




    useEffect(() => {
        getThermo()
    }, [house_id])

    useEffect(() => {
        setVal(thermoTemp)
    }, [thermoTemp])






    const getThermo = async () => {

        try {
            //const url = Platform.OS == 'web' ? `http://127.0.0.1:8000/api/houses/${house_id}/get-thermostat/` : `http://10.0.2.2:8000/api/houses/${house_id}/get-thermostat/`
            const url = `${API_BASE_URL}/api/houses/${house_id}/get-thermostat/`

            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setThermoTemp(data.temperature)
                setThermoMode(data.mode)
                setThermoCode(data.code)
                setBoolThermo(true)
            }


        }

        catch (error) {
            //setError("Network error, please try again.");
            console.log(error)
        }
        finally {

        }



    }

    const updateThermo = async (mode) => {
        try {
            //const url = Platform.OS == 'web' ? `http://127.0.0.1:8000/api/houses/${house_id}/update-thermostat/` : `http://10.0.2.2:8000/api/houses/${house_id}/update-thermostat/`
            const url = `${API_BASE_URL}/api/houses/${house_id}/update-thermostat/`

            //console.log(mode)
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ temperature: value, mode: mode }),
            });
            const data = await response.json();

            if (response.ok) {
                await getThermo()
            }


        }

        catch (error) {
            //setError("Network error, please try again.");
            console.log(error)
        }
        finally {

        }
    }





    const [loading, setLoading] = useState(true); // Track loading state






    const [value, setVal] = useState(tempValue);
    const minValue = minValueIn;
    const maxValue = maxValueIn;
    const prog = useSharedValue(value / maxValue);

    useEffect(() => {
        updateThermo(thermoMode)
    }, [value])

    //const [radius, setRadius] = useState(Platform.OS == 'web' ? (((windowDimensions.width / 10) < 1500) ? windowDimensions.width / 12 : 100) : 0.25 * windowDimensions.width)
    const radius = radiusIn;

    /*
    useEffect(() => {
        setWindowDimensions(Dimensions.get("window"))
        setRadius(Platform.OS == 'web' ? (((windowDimensions.width / 10) < 1500) ? windowDimensions.width / 12 : 100) : 0.25 * windowDimensions.width)
    }, [windowDimensions])
    */



    //console.log("Radius: " + radius)
    const strokeWidth = 0.2 * radius
    const circum = 2 * Math.PI * radius

    const AnimatedCircle = Animated.createAnimatedComponent(Circle)

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: circum * (1 - prog.value)           //offset removes the percentage
        //strokeDashoffset: circum * (1 - 0.35)           
    }))

    //For the + and - buttons
    const changeValue = (change, type) => {
        //console.log("Type: " + type)
        if (type == "plus" && value < maxValue) {
            setVal(value + change)
        }
        else if (type == "minus" && value > minValue) {
            setVal(value - change)
        }

    }
    useEffect(() => {
        prog.value = withSpring(value / maxValue)
    }, [value])

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


                const newTemp = Math.round(normalizedProg * (maxValue - minValue) + minValue);
                setVal(newTemp);

            },
        })
    ).current;









    return (


        /*
        <View style={[{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }]}>
            <View style={[{ backgroundColor: 'rgb(216, 75, 255)', height: 500, width: 500, borderRadius: 500 }]}>

            </View>
        </View>*/
        <View style={{ alignItems: 'center', justifyContent: 'center', gap: Platform.OS=='web' ? 30 : 20, }}>
            <View style={[{ flexDirection: 'row', alignItems: 'center', gap: Platform.OS=='web' ? 30 : 10, }]}>

                {changeable == true && <TouchableOpacity style={{ marginLeft: Platform.OS!='web' ? 0 : 5, }}
                    onPress={() => {
                        changeValue(1, "plus")
                    }}>
                    <MaterialCommunityIcons name={"plus"} size={Platform.OS=='web' ? 50 : 30} color={'rgb(255, 3, 184)'} />
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
                            <Text style={[styles.temperature, { fontSize: 0.3 * radius }]}>{value}°C</Text>
                            <Text style={[styles.temperature, { fontSize: 0.1 * radius }]}>Thermostat</Text>

                            <View style={{ position: 'absolute', bottom: 0.4 * radius }}>
                                <MaterialCommunityIcons name={value > (maxValue / 2) ? "weather-sunny" : "snowflake"} color='rgb(255, 3, 184)' size={0.2 * radius} />
                            </View>

                            {/*<Text style={styles.temperature}>Circum:{circum}</Text>*/}
                        </View>
                    </View>
                </View>

                {changeable == true && <TouchableOpacity style={{ marginRight: Platform.OS!='web' ? 0 : 5, }}
                    onPress={() => {
                        changeValue(1, "minus")
                    }}>
                    <MaterialCommunityIcons name={"minus"} size={Platform.OS=='web' ? 50 : 30} color={'rgb(255, 3, 184)'} />
                </TouchableOpacity>}

            </View>



            <View style={{ flexDirection: 'row', gap: 15 }}>

                <TouchableOpacity
                    style={{
                        aspectRatio: 1
                    }}
                    onPress={() => {
                        updateThermo('Cool')
                    }}

                >

                    <LinearGradient colors={[thermoMode=='Cool' ? 'rgb(255, 3, 184)' : 'rgb(95, 95, 95)', 'transparent']}
                        style={{
                            backgroundColor: thermoMode=='Cool' ? 'rgb(216, 75, 255)' : 'rgb(95, 95, 95)',
                            justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', padding:3, borderRadius:Platform.OS=='web' ? 20 : 10
                        }}
                    >
                        <MaterialCommunityIcons name={"snowflake"} size={Platform.OS=='web' ? 50 : 30} color={'white'} />

                    </LinearGradient>

                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        aspectRatio: 1
                    }}
                    onPress={() => {
                        updateThermo('Heat')
                    }}

                >

                    <LinearGradient colors={[thermoMode=='Heat' ? 'rgb(255, 3, 184)' : 'rgb(95, 95, 95)', 'transparent']}
                        style={{
                            backgroundColor: thermoMode=='Heat' ? 'rgb(216, 75, 255)' : 'rgb(95, 95, 95)',
                            justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', padding:3, borderRadius:Platform.OS=='web' ? 20 : 10
                        }}
                    >
                        <MaterialCommunityIcons name={"weather-sunny"} size={Platform.OS=='web' ? 50 : 30} color={'white'} />

                    </LinearGradient>

                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        aspectRatio: 1
                    }}
                    onPress={() => {
                        updateThermo('Fan')
                    }}

                >

                    <LinearGradient colors={[thermoMode=='Fan' ? 'rgb(255, 3, 184)' : 'rgb(95, 95, 95)', 'transparent']}
                        style={{
                            backgroundColor: thermoMode=='Fan' ? 'rgb(216, 75, 255)' : 'rgb(95, 95, 95)',
                            justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', padding:3, borderRadius:Platform.OS=='web' ? 20 : 10
                        }}
                    >
                        <MaterialCommunityIcons name={"fan"} size={Platform.OS=='web' ? 50 : 30} color={'white'} />

                    </LinearGradient>

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
        color: 'rgb(255, 3, 184)',
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
        borderRadius: 500,
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
