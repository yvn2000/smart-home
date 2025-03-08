import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet, View, Text, Button, TouchableOpacity,
    Dimensions, TextInput, ScrollView, Image,
    Platform, //Animated
} from 'react-native';

//import Animated, { } from "react-native-reanimated";

import { DUMMY_DATA } from "../data/dummy-device-data";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { Easing, useSharedValue, withTiming, useAnimatedStyle, runOnJS } from 'react-native-reanimated';


import Sparkle from "../components/sparkle";
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from "../components/themes/theme";


export default function Rewards({ rewards, updateRewardStatus, actual_xp, max_xp }) {

    const navigation = useNavigation()

    const { theme, toggleTheme } = useTheme()

    const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));
    const scrollViewRef = useRef(null);//so that the scrollview autoscrolls based on the progress circle point

    useEffect(() => {
        setWindowDimensions(Dimensions.get('window'))
    }, [windowDimensions])



    const numRewards = 4;
    const [rewardsGained, setRewardsGained] = useState([false, false, false, false]);
    const rewardScales = Array(numRewards).fill().map(() => useSharedValue(1));

    

    const maxXP = max_xp;
    const [xpGained, setXP] = useState(actual_xp)
    //const slideProg = useSharedValue((xpGained / maxXP) * 100)
    const slideProg = useSharedValue((actual_xp / max_xp) * 100);

    const addXP = (value) => {
        //setXP(xpGained + value)
        setXP((prev) => {
            const newXP = xpGained + value
            slideProg.value = withTiming((newXP / maxXP) * 100, {
                duration: 500,
                easing: Easing.out(Easing.quad),
            });
            return newXP;
        });
    }



    useEffect(() => {
        // Animate progress bar to current XP
        slideProg.value = withTiming((actual_xp / max_xp) * 100, {
            duration: 2000,
            easing: Easing.out(Easing.quad),
        });

        // Calculate unlocked rewards
        const rewardThresholds = Array.from(
            { length: numRewards },
            (_, index) => ((index + 1) / numRewards) * max_xp
        );

        const updatedRewards = rewardThresholds.map(threshold => 
            actual_xp >= threshold
        );

        setRewardsGained(updatedRewards);
        updateRewardStatus(updatedRewards);
    }, [actual_xp, max_xp]);




    useEffect(() => {
        const rewardThresholds = Array.from(
            { length: numRewards },
            (_, index) => ((index + 1) / numRewards) * maxXP
        );

        //const updatedRewards = rewardThresholds.map((threshold) => xpGained >= threshold);
        const updatedRewards = rewardThresholds.map((threshold, index) => {
            if (xpGained >= threshold && !rewardsGained[index]) {
                rewardScales[index].value = withTiming(1.5, {
                    duration: 1000,
                }, () => {
                    rewardScales[index].value = withTiming(1, {
                        duration: 1000,
                    });
                });
            }
            return xpGained >= threshold;
        });

        setRewardsGained(updatedRewards);
    }, [xpGained]);


    const animatedSlideStyle = useAnimatedStyle(() => {
        return {
            width: `${slideProg.value}%`,
        }
    })

    //autoscrolling
    useEffect(() => {
        if (scrollViewRef.current) {
            const center = windowDimensions.width / 2;
            //const progressPointPosition = (xpGained / maxXP) * windowDimensions.width;
            const progressPointPosition = (actual_xp / max_xp) * windowDimensions.width;

            
            if (progressPointPosition > center) {
                scrollViewRef.current.scrollTo({ x: progressPointPosition - center, animated: true });
            } else if (progressPointPosition < center) {
                scrollViewRef.current.scrollTo({ x: progressPointPosition - center, animated: true });
            }
            
            /*
            scrollViewRef.current.scrollTo({
                x: progressPointPosition - center,
                animated: true
            });
            */


        }
    }, [actual_xp, max_xp, xpGained, windowDimensions.width]);


    useEffect(() => {

        updateRewardStatus(rewardsGained)

    }, [rewardsGained])












    return (
        <View style={styles.container}>

            <ScrollView
                ref={scrollViewRef}     //for autoscroll
                horizontal={true}
                style={[styles.shadow, styles.progressCard, {backgroundColor:theme=='dark' ? 'rgb(26, 28, 77)' : 'white'}]}
                contentContainerStyle={{ alignItems: 'center' }}
            >

                <View style={[styles.progressBar, { justifyContent: 'center' }]}>
                    {Array.from({ length: numRewards }, (_, index) => {
                        const progress = ((numRewards - (index + 1)) / numRewards) * 100;
                        const rewardBoxHeight = 120;

                        const animatedRewardStyle = useAnimatedStyle(() => {
                            return {
                                transform: [{ scale: rewardScales[index].value }],
                            }
                        })

                        return (
                            <View
                                key={`rewardMark-${index}`}
                                style={[styles.rewardMark, { right: `${progress}%` }]}
                            >

                                {rewardsGained[index] && <View style={{ height: '100%', width: '100%', backgroundColor: 'rgb(216, 75, 255)', borderRadius: 500, overflow: 'hidden' }}>
                                    <View
                                        style={{
                                            height: '50%', width: '100%', backgroundColor: 'rgb(212, 159, 255)'
                                        }}>
                                    </View>
                                </View>}

                                <Animated.View
                                    style={[styles.shadow, animatedRewardStyle, {
                                        backgroundColor: (rewardsGained[index] == true) ? 'rgb(123, 247, 110)' : 'rgb(219, 219, 219)',
                                        height: `${rewardBoxHeight}%`, aspectRatio: 1, position: 'absolute',
                                        [index % 2 == 0 ? 'top' : 'bottom']: `${-rewardBoxHeight - 10}%`,
                                        alignItems: 'center', justifyContent: 'center',
                                        borderRadius: 10,
                                        //overflow:'hidden'
                                    }]}
                                >
                                    <View style={{ height: `90%`, width: `90%`, backgroundColor: 'white', borderRadius: 10, }}>
                                        <Image
                                            style={{ height: `100%`, width: `100%`, borderRadius:10 }}
                                            //source={require("../assets/CatAssets/Hats/hat1.png")}
                                            source={rewards[index]}
                                        />
                                    </View>

                                </Animated.View>

                            </View>
                        );
                    })}

                    <Animated.View style={[styles.progressLevel, animatedSlideStyle, { justifyContent: 'flex-end', width: `${(actual_xp / max_xp) * 100}%` }]}>

                        <View style={{
                            position: 'absolute',
                            width: '100%',
                            height: '50%',
                            backgroundColor: 'rgb(212, 159, 255)',
                            borderTopLeftRadius: 500,
                            borderTopRightRadius: 500,
                            top: 0,

                        }}>
                        </View>

                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']} style={[styles.progressPoint]}>

                            <Sparkle />

                        </LinearGradient>

                    </Animated.View>

                </View>
            </ScrollView>
            
            {/*
            <View style={[{flexDirection: 'row', gap:10, top:10 }]}>
                <TouchableOpacity
                    style={{ height: 20, width: 50, backgroundColor: 'gray', alignItems: 'center' }}
                    onPress={() => (xpGained - 5 < ((5 / 100) * maxXP)) ? setXP(((5 / 100) * maxXP)) : addXP(-5)}
                >
                    <Text style={{ color: 'white' }}>-5</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ height: 20, width: 50, backgroundColor: 'gray', alignItems: 'center' }}
                    onPress={() => (xpGained + 5 > maxXP) ? setXP(maxXP) : addXP(+5)}
                >
                    <Text style={{ color: 'white' }}>+5</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ height: 20, width: 50, backgroundColor: 'gray', alignItems: 'center' }}
                    onPress={() => addXP(Math.sign(xpGained) == 1 ? -1 * xpGained + (5 / 100) * maxXP : xpGained + (5 / 100) * maxXP)}
                >
                    <Text style={{ color: 'white' }}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ height: 20, width: 50, backgroundColor: 'gray', alignItems: 'center' }}
                    onPress={() => addXP(maxXP - xpGained)}
                >
                    <Text style={{ color: 'white' }}>Max</Text>
                </TouchableOpacity>
            </View>
            */}

        </View>
    );
}

const styles = StyleSheet.create({
    testBorder: {
        borderColor: 'red',
        borderWidth: 3,
    },
    shadow: {
        //shadow
        shadowColor: '#7F5Df0',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },

    progressCard: {
        padding: 30,
        backgroundColor: 'white',
        width: '100%',
        //height: 200,         //manual height set only for testing purposes
        aspectRatio: 2 / 1,
        borderRadius: 20,
        borderColor:'rgb(255, 3, 184)',
        borderWidth:3,
    },
    progressBar: {
        borderRadius: 500,
        //borderWidth:1,
        width: 1000,
        height: '25%',
        maxHeight: 40,
        //padding:20,
        backgroundColor: 'rgb(220, 220, 220)'
    },
    progressLevel: {
        borderRadius: 500,
        height: '100%',
        backgroundColor: 'rgb(216, 75, 255)',
        //width: '10%',
        //padding:20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    progressPoint: {
        position: 'absolute',
        borderRadius: 500,
        backgroundColor: 'rgb(244, 142, 247)',
        //padding: 20,
        height: '150%',
        //width: '7%',
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: 'rgb(255, 234, 0)',
        //display:'none',

    },
    rewardMark: {
        position: 'absolute',
        borderRadius: 500,
        height: '150%',
        aspectRatio: 1,
        //width:200,
        //padding:20,
        backgroundColor: 'rgb(220, 220, 220)',
        alignItems: 'center'
        //overflow: 'hidden',
    },


});