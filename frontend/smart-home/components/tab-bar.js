
import { useLinkBuilder} from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import React, { useEffect, useState } from "react";

import { navOptions } from '../navigation/options';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Dimensions, View, Image, Text, Platform, StyleSheet, LayoutChangeEvent } from 'react-native';

import Animated, { useSharedValue, useAnimatedStyle, interpolate, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from "../components/themes/theme";







export default function TabBar({ state, descriptors, navigation }) {

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

    //Centering the bar depending on the window size dimensions
    const maxBarWidth = 800;

    const [windowDimensions, setWindowDimensions] = useState(Dimensions.get("window"));
    //console.log("Width: " + windowDimensions.width + ", Height: " + windowDimensions.height)

    const tabBarWidth = Math.min(0.9 * windowDimensions.width, maxBarWidth);
    const tabBarLeft = (windowDimensions.width - tabBarWidth) / 2;

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions(Dimensions.get("window"));
        };

        if (Platform.OS == 'web') {
            Dimensions.addEventListener("change", handleResize);        //checks if size changed

            return () => {
                Dimensions.removeEventListener("change", handleResize);       //cleanup
            };

        }
        /*
        Dimensions.addEventListener("change", handleResize);        //checks if size changed

        return () => {
            Dimensions.removeEventListener("change", handleResize);       //cleanup
        };
        */
    }, []);

    const returnIcon = (isFocused, name) => {
        if (name == "SampleStack") {
            return isFocused ? "male-female" : "male-female-outline"
        }
        else if (name == "SigmaScreen") {
            return isFocused ? 'accessibility' : 'accessibility-outline'
        }
        else if (name == "HomeStack") {
            return isFocused ? 'home' : 'home-outline'
        }
        else if (name == "StatisticsStack") {
            return isFocused ? 'flash' : 'flash-outline'
        }
        else if (name == "DevicesStack") {
            return isFocused ? 'desktop' : 'desktop-outline'
        }
        else if (name == "CustomStack") {
            return isFocused ? 'color-palette' : 'color-palette-outline'
        }
        else if (name == "SettingsStack") {
            return isFocused ? 'settings' : 'settings-outline'
        }
    }



    const [buttonDims, setDims] = useState({ height: 20, width: 100 })

    //const buttonWidth = tabBarWidth.width / state.routes.length
    const buttonWidth = buttonDims.width / state.routes.length

    //console.log("States length: " + state.routes.length)

    const onTabBarLayout = (e) => {
        setDims({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width,
        })
    }


    //Animation
    const buttonProgress = useSharedValue(0)
    const animatedBGStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: buttonProgress.value }]
        }
    })

    useEffect(() => {
        buttonProgress.value = withSpring(buttonWidth * state.index, { duration: 1500 });
    }, [state.index]);






    //const { colors } = useTheme();
    const { buildHref } = useLinkBuilder();

    return (
        <View onLayout={onTabBarLayout}
            style={[styles.tabBar,
            {
                width: Platform.OS == 'web' ? tabBarWidth : '90%',
                maxWidth: maxBarWidth,
                left: Platform.OS == 'web' ? tabBarLeft : '5%',
                height: Platform.OS == 'web' ? 80 : '7%',
                backgroundColor: theme=='dark' ? 'rgb(32, 34, 84)' : 'rgb(255,255,255)',
                shadowColor: theme=='dark' ? 'rgb(49, 49, 88)' : '#7F5Df0',
                shadowOffset: {
                    width: 0,
                    height: 10,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.5,
                elevation: 5,

            }]}>
            <Animated.View style={[animatedBGStyle, {
                position: 'absolute',
                //backgroundColor: 'rgba(75, 219, 255, 0.9)',
                //backgroundColor: 'rgba(216, 75, 255, 0.9)',
                //borderRadius: 30,
                marginHorizontal: 15,
                height: buttonDims.height - 15,
                width: buttonWidth - 30,
            }]} >
                <LinearGradient colors={['rgba(255, 3, 184, 0.9)', 'transparent']}
                    style={{
                        width: '100%', height: '100%',
                        backgroundColor: 'rgba(216, 75, 255, 0.9)',
                        borderRadius: 30,
                    }}

                >

                </LinearGradient>
            </Animated.View>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;


                //Animations
                const scaleProgress = useSharedValue(0)

                const animatedTextStyle = useAnimatedStyle(() => {
                    const opacity = interpolate(scaleProgress.value, [0, 1], [1, 0])

                    return {
                        opacity
                    }

                })

                const animatedIconStyle = useAnimatedStyle(() => {
                    const scale = interpolate(scaleProgress.value, [0, 1], [1, 1.4])
                    const dist = interpolate(scaleProgress.value, [0, 1], [1, 9])

                    return {
                        transform: [
                            { scale: scale }
                        ],
                        top: dist
                    }
                })

                useEffect(() => {
                    scaleProgress.value = withSpring(
                        typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
                        { duration: 350 }
                    )
                }, [scaleProgress, isFocused])

                //End of animations

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <PlatformPressable
                        href={buildHref(route.name, route.params)}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.barItem}
                    >
                        <Animated.View style={[animatedIconStyle]}>
                            <Ionicons
                                name={returnIcon(isFocused, route.name)}
                                size={Platform.OS == 'web' ? (3.2 / 100) * windowDimensions.height : (2.2 / 100) * windowDimensions.height}
                                color={isFocused ? 'rgba(255, 255, 255, 0.9)' : 'rgb(150, 150, 150)'}
                            />
                        </Animated.View>
                        <Animated.Text style={[{
                            color: isFocused ? 'rgba(75, 219, 255, 0.9)' : 'rgb(150, 150, 150)',
                            fontSize: Platform.OS == "web" ? 12 : 9
                        }, animatedTextStyle]}>
                            {label}
                        </Animated.Text>
                    </PlatformPressable>
                );
            })}
        </View>
    );
}


const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        //marginHorizontal: 80,
        borderRadius: 75,

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
    barItem: {
        //borderWidth: 3,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,

    },

})

