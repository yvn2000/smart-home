import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, Image

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState } from "react";
import { useTheme } from "../components/themes/theme";
import LavaLampBackground from "../components/themes/lava-lamp-bg";

import Pet from "../components/cat";
import Rewards from "../components/rewardProgress";
import { MaterialCommunityIcons } from "@expo/vector-icons";


export default function SettingsScreen() {

    const navigation = useNavigation()

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



    const [hats, setHats] = useState(['hat0', 'hat1', 'hat2'])
    const [bgs, setBGs] = useState(['bg1', 'bg2', 'bg3'])


    const [moodStates, setMood] = useState({
        happy: true,
        sad: false,
        death: false,
        joy: false,
    });

    const [imageDisplays, setImageDisplays] = useState({
        bg1: true,
        bg2: false,
        bg3: false,
        hat0: true,
        hat1: false,
        hat2: false,
    });

    const [prevBG, setPrevBG] = useState('bg1')
    const [prevHat, setPrevHat] = useState('hat0')

    const changeSetting = (newBG, newHat) => {
        setImageDisplays((prevDisplays) => ({
            ...prevDisplays,
            [prevBG]: !prevDisplays[prevBG],
            [prevHat]: !prevDisplays[prevHat],
            [newBG]: true,
            [newHat]: true,
        }));

        setPrevBG(newBG);
        setPrevHat(newHat)

    }

    const [prevMood, setPrevMood] = useState('happy')

    const changeMood = (newMood) => {
        setMood((prevMoods) => ({
            ...prevMoods,
            [prevMood]: !prevMoods[prevMood],
            [newMood]: true,
        }));

        setPrevMood(newMood)
    }

    useEffect(() => {

    }, [moodStates, imageDisplays])




    const [rewardStatus, setRewardStatus] = useState({
        'hat1': false,
        'bg2': false,
        'hat2': false,
        'bg3': false,
    })

    const [rewardsForLeveling, setRewards] = useState([
        require("../assets/CatAssets/Hats/hat1.png"),
        require("../assets/CatAssets/Backgrounds/bg2.png"),
        require("../assets/CatAssets/Hats/hat2.png"),
        require("../assets/CatAssets/Backgrounds/bg3.png"),
    ])


    const [rewardsHats, setRewardsHats] = useState([
        require("../assets/CatAssets/Hats/blocked.png"),
        require("../assets/CatAssets/Hats/hat1.png"),
        require("../assets/CatAssets/Hats/hat2.png"),
    ])

    const [rewardsBG, setRewardsBG] = useState([
        require("../assets/CatAssets/Backgrounds/bg1.png"),
        require("../assets/CatAssets/Backgrounds/bg2.png"),
        require("../assets/CatAssets/Backgrounds/bg3.png"),
    ])


    const [leftIndex, setLeftIndex] = useState(0)
    const [rightIndex, setRightIndex] = useState(0)

    useEffect(() => {

        changeSetting(bgs[rightIndex], hats[leftIndex])


    }, [leftIndex, rightIndex])


    const updateRewardStatus = (newStatus) => {
        var i = 0
        Object.keys(rewardStatus).forEach((key) => {
            //console.log(`Key: ${key}, Value: ${rewardStatus[key]}`);
            rewardStatus[key] = newStatus[i]
            i++
        });
        //console.log(rewardStatus)

    }

    useEffect(() => {
        //console.log(rewardStatus)
    }, [rewardStatus])


    const getValidIndices = (items) => {
        return items.reduce((validIndices, item, index) => {
            if (rewardStatus[item] || (item == 'hat0' || item == 'bg1')) validIndices.push(index);
            return validIndices;
        }, []);
    };

    const handleLeftHatArrow = () => {
        const validIndices = getValidIndices(hats);
        const currentIndex = validIndices.indexOf(leftIndex);
        const nextIndex = (currentIndex - 1 + validIndices.length) % validIndices.length; //looparound
        setLeftIndex(validIndices[nextIndex]);
    };

    const handleRightHatArrow = () => {
        const validIndices = getValidIndices(hats);
        const currentIndex = validIndices.indexOf(leftIndex);
        const nextIndex = (currentIndex + 1) % validIndices.length;
        setLeftIndex(validIndices[nextIndex]);
    };

    const handleLeftBGArrow = () => {
        const validIndices = getValidIndices(bgs);
        const currentIndex = validIndices.indexOf(rightIndex);
        const nextIndex = (currentIndex - 1 + validIndices.length) % validIndices.length;
        setRightIndex(validIndices[nextIndex]);
    };

    const handleRightBGArrow = () => {
        const validIndices = getValidIndices(bgs);
        const currentIndex = validIndices.indexOf(rightIndex);
        const nextIndex = (currentIndex + 1) % validIndices.length;
        setRightIndex(validIndices[nextIndex]);
    };


    return (

        <View style={{ height: '100%' }}>
            <View style={{ height: '100%', width: '100%', display: 'flex' }}>
                <LavaLampBackground />
            </View>

            {/*Main Screen*/}
            <View style={[styles.screen, themeMode, { position: 'absolute' }]}>

                <ScrollView style={[{ height: '100%' }]}>

                    <SafeAreaProvider style={[{ height: '100%', width: '100%' }]}>
                        <SafeAreaView style={[{ height: '100%', width: '100%' }]}>

                            <View style={[{ width: '100%', alignItems: 'center', padding: 20 }]}>
                                <Text style={{ fontSize: Platform.OS == 'web' ? 35 : 15, fontWeight: 'bold' }}>
                                    Pet Customisation
                                </Text>
                            </View>

                            <View style={[styles.bigContainer]}>

                                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 100 }}>

                                    <View style={[styles.shadow, styles.rewardBoxOuter]}>

                                        <Text style={{ fontWeight: 'bold', color: 'rgb(147, 51, 174)', fontSize: 30 }}>Hats</Text>

                                        <View style={[styles.rewardBox]}>

                                            <TouchableOpacity
                                                onPress={() => {
                                                    handleLeftHatArrow()
                                                }}>
                                                <MaterialCommunityIcons name="chevron-left" size={50} />
                                            </TouchableOpacity>

                                            <View style={{ alignItems: 'center' }}>
                                                <Image
                                                    style={{ height: 100, width: 100, borderRadius: 10 }}
                                                    source={rewardsHats[leftIndex]}
                                                />
                                            </View>


                                            <TouchableOpacity
                                                onPress={() => {
                                                    handleRightHatArrow()
                                                }}>
                                                <MaterialCommunityIcons name="chevron-right" size={50} />
                                            </TouchableOpacity>
                                        </View>


                                    </View>

                                    <View style={[{ width: '90%', maxWidth: 500 }]}>

                                        <Pet moodStates={moodStates} imageDisplays={imageDisplays} />

                                    </View>


                                    <View style={[styles.shadow, styles.rewardBoxOuter]}>

                                        <Text style={{ fontWeight: 'bold', color: 'rgb(147, 51, 174)', fontSize: 30 }}>Background</Text>

                                        <View style={[styles.rewardBox]}>

                                            <TouchableOpacity
                                                onPress={() => {
                                                    handleLeftBGArrow()
                                                }}>
                                                <MaterialCommunityIcons name="chevron-left" size={50} />
                                            </TouchableOpacity>

                                            <View>
                                                <Image
                                                    style={{ height: 100, width: 100, borderRadius: 10 }}
                                                    source={rewardsBG[rightIndex]}
                                                />
                                            </View>


                                            <TouchableOpacity
                                                onPress={() => {
                                                    handleRightBGArrow()
                                                }}>
                                                <MaterialCommunityIcons name="chevron-right" size={50} />
                                            </TouchableOpacity>

                                        </View>
                                    </View>

                                </View>

                                {Platform.OS == 'android' &&

                                    <View style={{ flexDirection: 'column', gap:20 }}>
                                        <View style={[styles.shadow, styles.rewardBoxOuter]}>

                                            <Text style={{ fontWeight: 'bold', color: 'rgb(147, 51, 174)', fontSize: 30 }}>Hats</Text>

                                            <View style={[styles.rewardBox]}>

                                                <TouchableOpacity
                                                    onPress={() => {
                                                        handleLeftHatArrow()
                                                    }}>
                                                    <MaterialCommunityIcons name="chevron-left" size={50} />
                                                </TouchableOpacity>

                                                <View style={{ alignItems: 'center' }}>
                                                    <Image
                                                        style={{ height: 100, width: 100, borderRadius: 10 }}
                                                        source={rewardsHats[leftIndex]}
                                                    />
                                                </View>


                                                <TouchableOpacity
                                                    onPress={() => {
                                                        handleRightHatArrow()
                                                    }}>
                                                    <MaterialCommunityIcons name="chevron-right" size={50} />
                                                </TouchableOpacity>
                                            </View>


                                        </View>

                                        <View style={[styles.shadow, styles.rewardBoxOuter]}>

                                            <Text style={{ fontWeight: 'bold', color: 'rgb(147, 51, 174)', fontSize: 30 }}>Background</Text>

                                            <View style={[styles.rewardBox]}>

                                                <TouchableOpacity
                                                    onPress={() => {
                                                        handleLeftBGArrow()
                                                    }}>
                                                    <MaterialCommunityIcons name="chevron-left" size={50} />
                                                </TouchableOpacity>

                                                <View>
                                                    <Image
                                                        style={{ height: 100, width: 100, borderRadius: 10 }}
                                                        source={rewardsBG[rightIndex]}
                                                    />
                                                </View>


                                                <TouchableOpacity
                                                    onPress={() => {
                                                        handleRightBGArrow()
                                                    }}>
                                                    <MaterialCommunityIcons name="chevron-right" size={50} />
                                                </TouchableOpacity>

                                            </View>
                                        </View>


                                    </View>


                                }

                            <View style={[{ width: '100%', maxWidth: 600 }]}>
                                <Rewards rewards={rewardsForLeveling} updateRewardStatus={updateRewardStatus} />
                            </View>

                            {/*
                                <View style={styles.buttonsContainer}>
                                    <TouchableOpacity style={styles.buttons1} onPress={() => { changeSetting(prevBG, 'hat0') }}>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttons1} onPress={() => { changeSetting(prevBG, 'hat1') }}>
                                        <Image
                                            style={{ width: 100, height: 100 }}
                                            source={require("../assets/CatAssets/Hats/hat1.png")}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttons1} onPress={() => { changeSetting(prevBG, 'hat2') }}>
                                        <Image
                                            style={{ width: 100, height: 100 }}
                                            source={require("../assets/CatAssets/Hats/hat2.png")}
                                        />
                                    </TouchableOpacity>

                                </View>

                                <View style={styles.buttonsContainer}>
                                    <TouchableOpacity style={styles.buttons2} onPress={() => { changeSetting('bg1', prevHat) }}>
                                        <Image
                                            style={{ width: 80, height: 80 }}
                                            source={require("../assets/CatAssets/Backgrounds/bg1.png")}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttons2} onPress={() => { changeSetting('bg2', prevHat) }}>
                                        <Image
                                            style={{ width: 80, height: 80 }}
                                            source={require("../assets/CatAssets/Backgrounds/bg2.png")}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttons2} onPress={() => { changeSetting('bg3', prevHat) }}>
                                        <Image
                                            style={{ width: 80, height: 80 }}
                                            source={require("../assets/CatAssets/Backgrounds/bg3.png")}
                                        />
                                    </TouchableOpacity>

                                </View>
                                */}

                            <View style={styles.buttonsContainer}>
                                <TouchableOpacity style={[styles.buttons2, { justifyContent: 'center', alignItems: 'center', }]} onPress={() => { changeMood('happy') }}>
                                    <Text>Happy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.buttons2, { justifyContent: 'center', alignItems: 'center', }]} onPress={() => { changeMood('joy') }}>
                                    <Text>Joy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.buttons2, { justifyContent: 'center', alignItems: 'center', }]} onPress={() => { changeMood('sad') }}>
                                    <Text>Sad</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.buttons2, { justifyContent: 'center', alignItems: 'center', }]} onPress={() => { changeMood('death') }}>
                                    <Text>Death</Text>
                                </TouchableOpacity>

                            </View>

                        </View>

                        <View style={{ height: 150 }}>{/*To allow space for tab bar to not overlap elements*/}</View>

                    </SafeAreaView>
                </SafeAreaProvider>
            </ScrollView>

        </View>
        </View >


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
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    screen: {
        height: '100%',
        width: '100%',
        //display:'none',
    },
    bigContainer: {
        width: '100%',
        //justifyContent:'center',
        alignItems: 'center',
        gap: 20,
    },

    buttonsContainer: {
        padding: 10,
        flexDirection: 'row',
    },
    buttons1: {
        height: 80,
        width: 100,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: '#c5c5c5',
        marginHorizontal: 10,
        backgroundColor: 'white',
    },
    buttons2: {
        padding: 2,
        height: 90,
        width: 90,
        borderRadius: 5,
        borderWidth: 3,
        borderColor: '#c5c5c5',
        marginHorizontal: 10,
        backgroundColor: 'white',
    },

    rewardBox: {
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rewardBoxOuter: {
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 50,
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
