import { useNavigation, useRoute, useFocusEffect, useRef } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, Image, ActivityIndicator

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "../components/themes/theme";
import LavaLampBackground from "../components/themes/lava-lamp-bg";

import Pet from "../components/cat";
import Rewards from "../components/rewardProgress";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AsyncStorage from '@react-native-async-storage/async-storage';

import Modal from "react-native-modal";


export default function PetCustomScreen() {

    const navigation = useNavigation()

    const awaitTimeout = delay =>
        new Promise(resolve => setTimeout(resolve, delay));

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


    const [house_id, setHouseId] = useState(null)

    const [pet, setPet] = useState(null)

    const [loading, setLoading] = useState(true);

    const getHouse = async () => {
        const storedHouseId = await AsyncStorage.getItem("house_id")
        console.log("Stored House ID:", storedHouseId)
        setHouseId(storedHouseId)
        return storedHouseId // Return the value directly
    }

    /*
    useEffect(() => {
        const loadData = async () => {
            const id = await getHouse() // Wait for house ID
            if (id) {
                console.log("Loading data for house:", id)
                await fetchPet(id)
                await fetchSickDevices(id)
                //setLoading(false);
            }
        }
        loadData()
    }, []) // Empty dependency array - runs once on mount
    */




    // Modified useFocusEffect
    useFocusEffect(
        useCallback(() => {
            const reloadData = async () => {
                const id = await getHouse() // Get fresh ID on focus
                if (id) {
                    console.log("Reloading data for house:", id)
                    const fetchedPet = await fetchPet(id)
                    if (fetchedPet) {
                        await fetchSickDevices(id, fetchedPet)
                    }
                    //await fetchSickDevices(id)
                    //console.log("Callback: ")
                    //console.log(moodStates)
                    //setLoading(false);
                }
            }
            reloadData()
        }, []) // Still empty array - we're using latest state in callbacks
    )




    const [sickDeviceCount, setSickDeviceCount] = useState(0);
    const [petHealthStatus, setPetHealthStatus] = useState('healthy');


    const [isResetting, setIsResetting] = useState(false);
    const [isUpdatingMood, setIsUpdatingMood] = useState(false);

    const resetPet = async () => {

        console.log("Pet Resetting")
        if (isResetting) return;
        setIsResetting(true);
        try {
            const url = Platform.OS === 'web'
                ? `http://127.0.0.1:8000/api/pets/${pet.pet_id}/reset/`
                : `http://10.0.2.2:8000/api/pets/${pet.pet_id}/reset/`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to reset pet');
            }

            // Refresh all data
            await fetchPet(house_id);
            await fetchSickDevices(house_id);
        } catch (error) {
            console.error('Pet reset error:', error);
        } finally {
            setIsResetting(false);
        }
    };





    const [hatIndex, setHatIndex] = useState(0)
    const [bgIndex, setBGIndex] = useState(0)
    const [xp, setXP] = useState(0)

    const fetchPet = async (house_id) => {
        try {

            const url = Platform.OS == 'web' ? `http://127.0.0.1:8000/api/house/${house_id}/pet/` : `http://10.0.2.2:8000/api/house/${house_id}/pet/`

            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {

                const newHats = data.unlocked_hats;
                const newBgs = data.unlocked_bgs;
                const newHatIndex = newHats.indexOf(data.current_hat);
                const newBgIndex = newBgs.indexOf(data.current_bg);

                //const newPet = data;

                const newXP = data.actual_xp;

                setXP(newXP)

                setPet(data)
                awaitTimeout(1000)
                console.log("Pet:")
                console.log(pet)

                setPrevMood(data.pet_state)
                setPrevBG(data.current_bg)
                setPrevHat(data.current_hat)

                setHats(newHats);
                setBGs(newBgs);


                setMood({
                    happy: data.pet_state == 'happy',
                    sad: data.pet_state == 'sad',
                    death: data.pet_state == 'death',
                    joy: data.pet_state == 'joy'
                })


                setImageDisplays({
                    bg1: data.current_bg == 'bg1',
                    bg2: data.current_bg == 'bg2',
                    bg3: data.current_bg == 'bg3',
                    hat0: data.current_hat == 'hat0',
                    hat1: data.current_hat == 'hat1',
                    hat2: data.current_hat == 'hat2',
                })

                setHatIndex(newHatIndex);
                setBGIndex(newBgIndex);


                const updatedHatsRewards = data.unlocked_hats.map(hat =>
                    hat === 'hat0' ? require("../assets/CatAssets/Hats/blocked.png") :
                        hat === 'hat1' ? require("../assets/CatAssets/Hats/hat1.png") :
                            require("../assets/CatAssets/Hats/hat2.png")
                );
                setRewardsHats(updatedHatsRewards);




                return data;




                //console.log("Hat Index: "+ hatIndex)
                //console.log("BG Index: "+ bgIndex)

                //console.log("Prev Mood: " + prevMood)
                //console.log("Prev BG: "+prevBG)
                //console.log("Prev Hat: "+prevHat)
                //console.log("Hats: "+hats)
                //console.log("Bgs: "+bgs)
                //console.log("Mood States: "+moodStates)
                //console.log("Image Displays: "+imageDisplays)





            } else {
                //setError(data.error || "Failed to fetch rooms");
                console.log(data.error || "Failed to fetch rooms")
            }

        }
        catch (error) {
            //setError("Network error, please try again.");
            console.log(error)
        } finally {

            //setLoading(false);
        }
    }

    const updatePet = async (pet_id, newMood, newHat, newBG) => {
        try {

            const url = Platform.OS == 'web' ? `http://127.0.0.1:8000/api/${pet_id}/update-pet/` : `http://10.0.2.2:8000/api/${pet_id}/update-pet/`

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    newMood: newMood,
                    newHat: newHat,
                    newBG: newBG,
                }),
            });

            if (response.ok) {
                //Alert.alert("Success", "Room added!");
                //await fetchPet()
            } else {
                //Alert.alert("Error", "Failed to add room");
                console.log("Error, pet update function failed.")
            }
        } catch (error) {
            console.error("Error updatin pet:", error);
        } finally {

        }
    }

    const fetchSickDevices = async (house_id, pet) => {
        /*
        if (!house_id || !pet) {
            console.log('Waiting for pet data...');
            return;
        }
        */
        try {
            //await getHouse()
            const url = Platform.OS === 'web'
                ? `http://127.0.0.1:8000/api/house/${house_id}/sick-devices/`
                : `http://10.0.2.2:8000/api/house/${house_id}/sick-devices/`;

            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setSickDeviceCount(data.sick_device_count);
                setPetHealthStatus(data.pet_status);

                console.log("Pet Status: " + data.pet_status)

                if (data.pet_status === 'death') {
                    // Force death mood regardless of previous state
                    setMood({
                        happy: false,
                        sad: false,
                        death: true,
                        joy: false
                    });
                    await updatePetMood('death', pet, house_id);
                }

                else if (data.pet_status === 'healthy' && pet.is_dead) {
                    // Trigger full reset
                    await resetPet();
                    await updatePetMood(data.pet_status === 'healthy' ? 'happy' : 'sad', pet, house_id);
                }


                else {
                    // Update pet mood based on status
                    setMood({
                        happy: data.pet_status === 'healthy',
                        sad: data.pet_status === 'sick',
                        death: false,
                        joy: false // Add if needed
                    });
                    //console.log("Fetch Sicks: ")
                    //console.log(moodStates)
                    //')
                    if (data.pet_status !== 'death') { // Prevent redundant updates
                        await updatePetMood(data.pet_status === 'healthy' ? 'happy' : 'sad', pet, house_id);
                    }
                }
            } else {
                console.error('Failed to fetch sick devices:', data.error);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };



    const updatePetMood = async (newMood, pet, house_id) => {
        /*
        if (!pet || !pet.pet_id) {
            //console.error('Cannot update mood - pet not loaded');
            //return;
            //fetchPet(house_id)
        }
        */
        if (!pet?.pet_id) {
            console.log('Waiting for pet data, retrying in 1s...');
            //await awaitTimeout(1000)
            console.log(newMood)
            //updatePetMood(newMood); // Retry
            //return;
        }

        if (isUpdatingMood) return;
        setIsUpdatingMood(true);
        try {
            
            const url = Platform.OS === 'web'
                ? `http://127.0.0.1:8000/api/pets/${pet.pet_id}/update-mood/`
                : `http://10.0.2.2:8000/api/pets/${pet.pet_id}/update-mood/`;
            
           /*
            const url = Platform.OS === 'web'
                ? `http://127.0.0.1:8000/api/pets/${pet_id}/update-mood/`
                : `http://10.0.2.2:8000/api/pets/${pet_id}/update-mood/`;
                */

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mood: newMood
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update mood');
            }
            setLoading(false)


            // Refresh pet data after update
            console.log("FetchPet inside updatePetMood")
            await fetchPet(house_id);
        } catch (error) {
            console.error('Mood update error:', error);
            //setLoading(false)
        } finally {

            setIsUpdatingMood(false);
        }
    };

    const handleMoodChange = (newMood) => {
        setMood(prev => ({
            ...prev,
            [prevMood]: false,
            [newMood]: true
        }));
        setPrevMood(newMood);
        updatePetMood(newMood);  // Send to backend
    };




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
        setPrevBG(newBG);
        setPrevHat(newHat);
        setImageDisplays((prevDisplays) => ({
            ...prevDisplays,
            [prevBG]: !prevDisplays[prevBG],
            [prevHat]: !prevDisplays[prevHat],
            [newBG]: true,
            [newHat]: true,
        }));

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



    function getUnlockedCosmetics(rewardStatus) {
        // Always include base cosmetics
        const unlockedHats = ['hat0'];
        const unlockedBgs = ['bg1'];

        // Convert object to arrays
        Object.entries(rewardStatus).forEach(([key, value]) => {
            if (key.startsWith('hat') && value) {
                unlockedHats.push(key);
            }
            if (key.startsWith('bg') && value) {
                unlockedBgs.push(key);
            }
        });

        // Sort numerically (hat0, hat1, hat2... / bg1, bg2, bg3...)
        unlockedHats.sort((a, b) =>
            parseInt(a.replace('hat', '')) - parseInt(b.replace('hat', ''))
        );
        unlockedBgs.sort((a, b) =>
            parseInt(a.replace('bg', '')) - parseInt(b.replace('bg', ''))
        );

        return { unlockedHats, unlockedBgs };
    }



    const updatePetRewards = async (rewardStatus) => {

        try {

            const { unlockedHats, unlockedBgs } = getUnlockedCosmetics(rewardStatus);

            // Validate before sending
            if (!Array.isArray(unlockedHats) || !Array.isArray(unlockedBgs)) {
                throw new Error('Invalid cosmetic data format');
            }

            //console.log(unlockedBgs, unlockedHats)

            const url = Platform.OS == 'web' ? `http://127.0.0.1:8000/api/${pet.pet_id}/update-pet-rewards/` : `http://10.0.2.2:8000/api/${pet.pet_id}/update-pet-rewards/`

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    unlocked_hats: unlockedHats,
                    unlocked_bgs: unlockedBgs
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update cosmetics');
            }

            // Refresh pet data after successful update
            await fetchPet(house_id);


        }
        catch (error) {
            console.error('Update cosmetics error:', error);
        }
        finally {

        }

    }



    useEffect(() => {
        //updatePetRewards(rewardStatus)
    }, [rewardStatus])


    // Add this useEffect to sync initial state
    useEffect(() => {
        if (pet) {
            // Initialize rewardStatus from backend data
            const initialStatus = {
                'hat1': pet.unlocked_hats.includes('hat1'),
                'bg2': pet.unlocked_bgs.includes('bg2'),
                'hat2': pet.unlocked_hats.includes('hat2'),
                'bg3': pet.unlocked_bgs.includes('bg3'),
            };
            setRewardStatus(initialStatus);
        }
    }, [pet]);

    useEffect(() => {
        if (pet) {
            // Set mood from backend data
            if (pet.is_dead) {
                setMood({
                    happy: false,
                    sad: false,
                    death: true,
                    joy: false
                });
                //updatePetMood('death')
            } else {
                setMood({
                    happy: pet.pet_state === 'happy',
                    sad: pet.pet_state === 'sad',
                    death: pet.pet_state === 'death',
                    joy: false
                });
                //updatePetMood(pet.pet_state === 'happy' ? 'happy' : 'sad')
            }
        }
    }, [pet]);


    useEffect(() => {
        console.log(moodStates)
    }, [moodStates])



    const updateRewardStatus = (newStatusArray) => {

        setRewardStatus(prev => {
            // Convert array to object with proper keys
            const keys = Object.keys(prev);
            const newStatus = keys.reduce((acc, key, index) => {
                acc[key] = newStatusArray[index];
                return acc;
            }, {});

            // Update backend with the new status
            updatePetRewards(newStatus);

            return newStatus;
        });


        /*
        var i = 0
        Object.keys(rewardStatus).forEach((key) => {
            //console.log(`Key: ${key}, Value: ${rewardStatus[key]}`);
            rewardStatus[key] = newStatus[i]
            i++
        });
        */

        //console.log(rewardStatus)
        //updatePetRewards(rewardStatus)

    }









    const getValidIndices = (items) => {
        return items.reduce((validIndices, item, index) => {
            if (rewardStatus[item] || (item == 'hat0' || item == 'bg1')) validIndices.push(index);
            //console.log(validIndices)
            return validIndices;
        }, []);
    };

    const handleLeftHatArrow = () => {

        //console.log(rewardStatus)

        setHatIndex(prevIndex => {
            const validIndices = getValidIndices(hats);
            //console.log("Valid Indices: " + validIndices)
            const currentValidIndex = validIndices.indexOf(prevIndex);
            const nextValidIndex = (currentValidIndex - 1 + validIndices.length) % validIndices.length;
            const newIndex = validIndices[nextValidIndex];
            //console.log("Old Hat Index: "+hatIndex)
            //console.log("Current Index: "+currentValidIndex)
            //console.log("Next Index: "+newIndex)

            // Update the setting with the NEW value
            changeSetting(bgs[bgIndex], hats[newIndex]);
            console.log("Prev Hat: " + prevHat)
            console.log("Prev BG: " + prevBG)
            updatePet(pet.pet_id, prevMood, hats[newIndex], bgs[bgIndex])

            return newIndex;
        });
    };

    const handleRightHatArrow = () => {
        /*
        const validIndices = getValidIndices(hats);
        console.log("Valid Indices: " + validIndices)
        const currentIndex = validIndices.indexOf(hatIndex);
        const nextIndex = (currentIndex + 1) % validIndices.length;
        setHatIndex(validIndices[nextIndex]);

        console.log("New Hat Index: " + hatIndex)
        //updatePet(pet.pet_id, prevMood, prevHat, prevBG)
        */

        setHatIndex(prevIndex => {
            const validIndices = getValidIndices(hats);
            const currentValidIndex = validIndices.indexOf(prevIndex);
            const nextValidIndex = (currentValidIndex + 1) % validIndices.length;
            const newIndex = validIndices[nextValidIndex];

            // Update the setting with the NEW value
            changeSetting(bgs[bgIndex], hats[newIndex]);
            updatePet(pet.pet_id, prevMood, hats[newIndex], bgs[bgIndex])

            return newIndex;
        });
    };

    const handleLeftBGArrow = () => {
        /*
        const validIndices = getValidIndices(bgs);
        console.log("Valid Indices: " + validIndices)
        const currentIndex = validIndices.indexOf(bgIndex);
        const nextIndex = (currentIndex - 1 + validIndices.length) % validIndices.length;
        setBGIndex(validIndices[nextIndex]);

        console.log("New BG Index: " + bgIndex)
        */

        setBGIndex(prevIndex => {
            const validIndices = getValidIndices(bgs);
            const currentValidIndex = validIndices.indexOf(prevIndex);
            const nextValidIndex = (currentValidIndex - 1 + validIndices.length) % validIndices.length;
            const newIndex = validIndices[nextValidIndex];

            // Update the setting with the NEW value
            changeSetting(bgs[newIndex], hats[hatIndex]);
            updatePet(pet.pet_id, prevMood, hats[hatIndex], bgs[newIndex])

            return newIndex;
        });


    };

    const handleRightBGArrow = () => {
        /*
        const validIndices = getValidIndices(bgs);
        console.log("Valid Indices: " + validIndices)
        const currentIndex = validIndices.indexOf(bgIndex);
        const nextIndex = (currentIndex + 1) % validIndices.length;
        setBGIndex(validIndices[nextIndex]);

        console.log("New BG Index: " + bgIndex)
        */

        setBGIndex(prevIndex => {
            const validIndices = getValidIndices(bgs);
            const currentValidIndex = validIndices.indexOf(prevIndex);
            const nextValidIndex = (currentValidIndex + 1) % validIndices.length;
            const newIndex = validIndices[nextValidIndex];

            // Update the setting with the NEW value
            changeSetting(bgs[newIndex], hats[hatIndex]);
            updatePet(pet.pet_id, prevMood, hats[hatIndex], bgs[newIndex])

            return newIndex;
        });
    };



    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    /*
    if (!pet) {
        return <Text>No pet data found</Text>;
    }
    */


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
                                <Text style={{ fontSize: Platform.OS == 'web' ? 35 : 15, fontWeight: 'bold',  color:theme=='crazy' ? 'white' : 'rgb(255, 3, 184)' }}>
                                    Pet Customisation
                                </Text>
                            </View>

                            <View style={[styles.bigContainer]}>

                                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 100 }}>

                                    {Platform.OS == 'web' &&

                                        <View style={[styles.shadow, styles.rewardBoxOuter, {backgroundColor:theme=='dark' ? 'rgb(26, 28, 77)' : 'rgb(255,255,255)'}]}>

                                            <Text style={{ fontWeight: 'bold', color: 'rgb(147, 51, 174)', fontSize: 30 }}>Hats</Text>

                                            <View style={[styles.rewardBox]}>

                                                <TouchableOpacity
                                                    onPress={() => {
                                                        handleLeftHatArrow()
                                                    }}>
                                                    <MaterialCommunityIcons name="chevron-left" size={50} color={theme=='dark' ? 'white' : 'dark'} />
                                                </TouchableOpacity>

                                                <View style={{ alignItems: 'center' }}>
                                                    <Image
                                                        style={{ height: 100, width: 100, borderRadius: 10 }}
                                                        source={rewardsHats[hatIndex]}
                                                    />
                                                </View>


                                                <TouchableOpacity
                                                    onPress={() => {
                                                        handleRightHatArrow()
                                                    }}>
                                                    <MaterialCommunityIcons name="chevron-right" size={50} color={theme=='dark' ? 'white' : 'dark'} />
                                                </TouchableOpacity>
                                            </View>


                                        </View>

                                    }

                                    <View style={[{ width: '80%', maxWidth: 500, marginTop: (Platform.OS == 'web') ? 0 : -20 }]}>

                                        <Pet moodStates={moodStates} imageDisplays={imageDisplays} />

                                    </View>
                                    {Platform.OS == 'web' &&

                                        <View style={[styles.shadow, styles.rewardBoxOuter, {backgroundColor:theme=='dark' ? 'rgb(26, 28, 77)' : 'rgb(255,255,255)'}]}>

                                            <Text style={{ fontWeight: 'bold', color: 'rgb(147, 51, 174)', fontSize: 30 }}>Background</Text>

                                            <View style={[styles.rewardBox]}>

                                                <TouchableOpacity
                                                    onPress={() => {
                                                        handleLeftBGArrow()
                                                    }}>
                                                    <MaterialCommunityIcons name="chevron-left" size={50} color={theme=='dark' ? 'white' : 'dark'} />
                                                </TouchableOpacity>

                                                <View>
                                                    <Image
                                                        style={{ height: 100, width: 100, borderRadius: 10 }}
                                                        source={rewardsBG[bgIndex]}
                                                    />
                                                </View>


                                                <TouchableOpacity
                                                    onPress={() => {
                                                        handleRightBGArrow()
                                                    }}>
                                                    <MaterialCommunityIcons name="chevron-right" size={50} color={theme=='dark' ? 'white' : 'dark'} />
                                                </TouchableOpacity>

                                            </View>
                                        </View>

                                    }

                                </View>

                                {Platform.OS == 'android' &&

                                    <View style={{ flexDirection: 'row', gap: '5%', marginTop: -10 }}>
                                        <View style={[styles.shadow, styles.rewardBoxOuter, { width: '45%', backgroundColor:theme=='dark' ? 'rgb(26, 28, 77)' : 'rgb(255,255,255)' }]}>

                                            <Text style={{ fontWeight: 'bold', color: 'rgb(147, 51, 174)', fontSize: 20 }}>Hats</Text>

                                            <View style={[styles.rewardBox]}>

                                                <TouchableOpacity
                                                    onPress={() => {
                                                        handleLeftHatArrow()
                                                    }}>
                                                    <MaterialCommunityIcons name="chevron-left" size={40} color={theme=='dark' ? 'white' : 'dark'} />
                                                </TouchableOpacity>

                                                <View style={{ alignItems: 'center' }}>
                                                    <Image
                                                        style={{ height: 70, aspectRatio: 1, borderRadius: 10 }}
                                                        source={rewardsHats[hatIndex]}
                                                    />
                                                </View>


                                                <TouchableOpacity
                                                    onPress={() => {
                                                        handleRightHatArrow()
                                                    }}>
                                                    <MaterialCommunityIcons name="chevron-right" size={40} color={theme=='dark' ? 'white' : 'dark'} />
                                                </TouchableOpacity>
                                            </View>


                                        </View>

                                        <View style={[styles.shadow, styles.rewardBoxOuter, { width: '45%', backgroundColor:theme=='dark' ? 'rgb(26, 28, 77)' : 'rgb(255,255,255)' }]}>

                                            <Text style={{ fontWeight: 'bold', color: 'rgb(147, 51, 174)', fontSize: 20 }}>Background</Text>

                                            <View style={[styles.rewardBox]}>

                                                <TouchableOpacity
                                                    onPress={() => {
                                                        handleLeftBGArrow()
                                                    }}>
                                                    <MaterialCommunityIcons name="chevron-left" size={40} color={theme=='dark' ? 'white' : 'dark'} />
                                                </TouchableOpacity>

                                                <View>
                                                    <Image
                                                        style={{ height: 70, aspectRatio: 1, borderRadius: 10 }}
                                                        source={rewardsBG[bgIndex]}
                                                    />
                                                </View>


                                                <TouchableOpacity
                                                    onPress={() => {
                                                        handleRightBGArrow()
                                                    }}>
                                                    <MaterialCommunityIcons name="chevron-right" size={40} color={theme=='dark' ? 'white' : 'dark'} />
                                                </TouchableOpacity>

                                            </View>
                                        </View>


                                    </View>


                                }

                                <View style={[{ width: '100%', maxWidth: 700, marginTop: -10 }]}>
                                    <Rewards
                                        rewards={rewardsForLeveling}
                                        updateRewardStatus={updateRewardStatus}
                                        actual_xp={xp <= 100 ? xp : 100}
                                        max_xp={100}
                                    />
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

                                
                                {/*
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
                                */}

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
        //height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rewardBoxOuter: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 50,
    },


    darkMode: {
        backgroundColor: 'rgb(17, 18, 44)',
    },
    lightMode: {
        backgroundColor: "rgb(245, 238, 246)",
    },
    crazyMode: {
        backgroundColor: 'rgba(216, 83, 196, 0)'
    }
});
