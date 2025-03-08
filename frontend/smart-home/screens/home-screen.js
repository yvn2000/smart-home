import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "../components/themes/theme";
import LavaLampBackground from "../components/themes/lava-lamp-bg";

import Pet from "../components/cat";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import ThermoDial from "../components/thermodial";

import { LinearGradient } from 'expo-linear-gradient';

import Modal from "react-native-modal";
import { Knob } from 'primereact/knob';


export default function HomeScreen() {

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

    const [firstName, setFirstName] = useState("name")
    const [house_id, setHouseId] = useState(0)
    const [loading, setLoading] = useState(true);

    const getFirstName = async () => {
        setFirstName(await AsyncStorage.getItem("first_name"))
    }

    const getHouse = async () => {
        const storedHouseId = await AsyncStorage.getItem("house_id")
        console.log("Stored House ID:", storedHouseId)
        setHouseId(storedHouseId)
        return storedHouseId // Return the value directly
    }

    useEffect(() => {
        getFirstName()
        getHouse()
    }, [firstName])

    useEffect(() => {
        getThermo()
        //setBoolThermo(true)
    }, [house_id])


    //Pet state values
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



    //Thermostat

    const [isThermoAdd, setThermoAdd] = useState(false);

    const toggleThermoAdd = () => {
        setThermoAdd(!isThermoAdd);
    };

    const [boolThermo, setBoolThermo] = useState(false);

    const [thermoTemp, setThermoTemp] = useState(22)
    const [thermoMode, setThermoMode] = useState('Cool')
    const [thermoCode, setThermoCode] = useState('')



    const getThermo = async () => {

        try {
            const url = Platform.OS == 'web' ? `http://127.0.0.1:8000/api/houses/${house_id}/get-thermostat/` : `http://10.0.2.2:8000/api/houses/${house_id}/get-thermostat/`

            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setThermoTemp(data.temperature)
                setThermoMode(data.mode)
                setThermoCode(data.code)
                setBoolThermo(true)
            }
            else {
                setBoolThermo(false)
            }


        }

        catch (error) {
            //setError("Network error, please try again.");
            console.log(error)
            setBoolThermo(false)
        }
        finally {

        }



    }


    const addThermo = async () => {
        try {
            const url = Platform.OS == 'web' ? `http://127.0.0.1:8000/api/houses/${house_id}/add-thermostat/` : `http://10.0.2.2:8000/api/houses/${house_id}/add-thermostat/`

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: thermoCode }),
            });
            const data = await response.json();

            if (response.ok) {
                setThermoTemp(data.temperature)
                setThermoMode(data.mode)
                setThermoCode(data.code)
                setBoolThermo(true)
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

    const deleteThermo = async () => {
        try {
            const url = Platform.OS == 'web' ? `http://127.0.0.1:8000/api/houses/${house_id}/delete-thermostat/` : `http://10.0.2.2:8000/api/houses/${house_id}/delete-thermostat/`

            const response = await fetch(url, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });
            //const data = await response.json();

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






    //Pet
    const [pet, setPet] = useState(null)

    const awaitTimeout = delay =>
        new Promise(resolve => setTimeout(resolve, delay));


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




    const [hatIndex, setHatIndex] = useState(0)
    const [bgIndex, setBGIndex] = useState(0)
    const [xp, setXP] = useState(0)

    const [sickDeviceCount, setSickDeviceCount] = useState(0);
    const [petHealthStatus, setPetHealthStatus] = useState('healthy');

    const [hats, setHats] = useState(['hat0', 'hat1', 'hat2'])
    const [bgs, setBGs] = useState(['bg1', 'bg2', 'bg3'])

    const [prevBG, setPrevBG] = useState('bg1')
    const [prevHat, setPrevHat] = useState('hat0')

    const [prevMood, setPrevMood] = useState('happy')

    useEffect(() => {

    }, [moodStates, imageDisplays])

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



    const [isUpdatingMood, setIsUpdatingMood] = useState(false);

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











    return (



        <View style={{ height: '100%' }}>
            <StatusBar style={theme == 'light' ? 'dark' : 'light'} />
            <View style={{ height: '100%', width: '100%', display: 'flex' }}>
                <LavaLampBackground />
            </View>

            {/*Main Screen*/}
            <View style={[styles.screen, themeMode, { position: 'absolute', /*flexDirection: 'row'*/ }]}>
                <ScrollView style={[{ height: '100%' }]}>

                    <SafeAreaProvider style={[{ height: '100%', width: '100%' }]}>
                        <SafeAreaView style={[{ height: '100%', width: '100%' }]}>

                            <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                style={[styles.helloBar, {
                                    backgroundColor: 'rgb(216, 75, 255)', height: 125, borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
                                }]}>
                                <View style={{ flexDirection: 'row', left: '3%', alignItems: 'center' }}>
                                    <Text style={{ color: 'rgb(232, 232, 232)', fontSize: Platform.OS == 'web' ? 35 : 15, }}>Welcome, </Text>
                                    <Text style={{ color: 'white', fontSize: Platform.OS == 'web' ? 35 : 15, fontWeight: 'bold' }}>
                                        {(firstName) ? firstName : 'Guest'}!
                                    </Text>
                                    <Text style={{ color: 'rgb(232, 232, 232)', fontSize: Platform.OS == 'web' ? 45 : 25, }}>👋🏻</Text>
                                </View>


                                <View style={{
                                    justifyContent: 'center', alignItems: 'center',
                                    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 500,
                                    right: '3%', aspectRatio: 1,
                                    //height: '100%',
                                }}>
                                    <Ionicons name="person-circle-outline" size={Platform.OS == 'web' ? 70 : 40} />
                                </View>
                            </LinearGradient>
                            <View style={{ height: '3%' }}>

                            </View>

                            <View style={[styles.mainContainer]}>

                                {/*
                                <View style={[styles.baseStatsBar]}>


                                    <View style={[{ width: '50%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', padding: 10 }]}>
                                        <Ionicons name="flash" size={Platform.OS == 'web' ? 60 : 40} color={'rgba(216, 75, 255, 0.9)'} />
                                        <View style={[]} >
                                            <Text style={{

                                                fontSize: Platform.OS == 'web' ? 20 : 10,
                                                color: 'rgb(165, 165, 165)'
                                            }} >
                                                Energy
                                            </Text>
                                            <Text style={{
                                                
                                                fontWeight: 'bold',
                                                fontSize: Platform.OS == 'web' ? 30 : 15,
                                            }} >
                                                50 kwh
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[{ width: '50%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', padding: 5 }]}>
                                        <Ionicons name="thermometer" size={Platform.OS == 'web' ? 60 : 40} color={'rgba(216, 75, 255, 0.9)'} />
                                        <View style={[]} >
                                            <Text style={{
                                                width: Platform.OS == 'web' ? 70 : 60,
                                                fontSize: Platform.OS == 'web' ? 20 : 10,
                                                color: 'rgb(165, 165, 165)'
                                            }} >
                                                Temp
                                            </Text>
                                            <Text style={{
                                                
                                                fontWeight: 'bold',
                                                fontSize: Platform.OS == 'web' ? 30 : 15,
                                            }} >
                                                21°C
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                */}


                                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', gap: '3%', alignItems: 'center' }}>
                                    <View style={[{ width: '60%', maxWidth: 400 }]}>

                                        <Pet moodStates={moodStates} imageDisplays={imageDisplays} />

                                    </View>

                                    <View style={[{
                                        justifyContent: 'center', alignItems: 'center', height: '100%',
                                        backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white',
                                        aspectRatio: 1, borderWidth: 1, borderColor: 'rgb(255, 3, 184)', borderRadius: 40,
                                    }]}>

                                        {!boolThermo &&

                                            <TouchableOpacity
                                                style={{
                                                    width: '50%', height: '20%', borderRadius: 30,
                                                }}
                                                onPress={() => {
                                                    toggleThermoAdd()
                                                }}
                                            >
                                                <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                                    style={{
                                                        backgroundColor: 'rgb(216, 75, 255)', height: '100%', width: '100%', alignItems: 'center',
                                                        justifyContent: 'center', borderRadius: 30,
                                                    }}
                                                >
                                                    <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 20 }}>Add Thermostat</Text>
                                                </LinearGradient>

                                            </TouchableOpacity>




                                        }

                                        {boolThermo &&
                                            <View style={[{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}>



                                                <ThermoDial

                                                    changeable={true}
                                                    tempValue={thermoTemp}
                                                    minValueIn={0}
                                                    maxValueIn={60}
                                                    radiusIn={150}
                                                    house_id={house_id}
                                                    themMode={thermoMode}


                                                />

                                                <TouchableOpacity
                                                    style={{
                                                        aspectRatio: 1, position: 'absolute', top: 0, right: 15,
                                                    }}
                                                    onPress={() => {
                                                        deleteThermo()
                                                    }}

                                                >

                                                    <LinearGradient colors={['red', 'transparent']}
                                                        style={{
                                                            backgroundColor: 'red',
                                                            justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', padding: 3, borderRadius: 10
                                                        }}
                                                    >
                                                        <MaterialCommunityIcons name={"delete"} size={30} color={'white'} />

                                                    </LinearGradient>

                                                </TouchableOpacity>





                                            </View>
                                        }

                                        <Modal
                                            isVisible={isThermoAdd}
                                            onBackdropPress={() => setThermoAdd(false)} // Close when tapping outside
                                            animationIn="zoomInRight"
                                            animationOut="zoomOutRight"
                                            backdropOpacity={0.4}
                                            style={[{}]}
                                        >

                                            <View style={[styles.shadow, {
                                                borderRadius: 30,
                                                width: '60%',
                                                backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white',
                                                alignSelf: 'center', alignItems: 'center', justifyContent: 'center',
                                                padding: 30, gap: 40,
                                            }]}>

                                                <TouchableOpacity style={[{ position: 'absolute', right: 20, top: 20, }]} >
                                                    <MaterialCommunityIcons name="close" color='rgb(255, 3, 184)' size={50} onPress={() => toggleThermoAdd()} />
                                                </TouchableOpacity>



                                                <TextInput
                                                    //style={[styles.shadow, styles.input]}
                                                    placeholder="Enter Thermostat Code"
                                                    placeholderTextColor={'gray'}
                                                    style={[{
                                                        borderWidth: 1, borderColor: 'gray', padding: 20, width: '60%', marginTop: 50, borderRadius: 20,
                                                        color: theme == 'dark' ? 'white' : 'black', fontWeight: 'bold', fontSize: 20,
                                                    }]}
                                                    maxLength={10}
                                                    value={thermoCode}
                                                    onChangeText={setThermoCode}
                                                />

                                                <TouchableOpacity
                                                    style={{
                                                        width: '50%', borderRadius: 30, marginBottom: 50,
                                                    }}
                                                    onPress={async () => {  // Make the handler async
                                                        try {
                                                            await addThermo();

                                                            toggleThermoAdd();

                                                            await getThermo();

                                                        } catch (error) {
                                                            // Handle errors without closing the modal
                                                            console.log('Error adding thermostat:', error);
                                                            //setError(error.message);
                                                        }
                                                    }}
                                                >
                                                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                                        style={{
                                                            backgroundColor: 'rgb(216, 75, 255)', height: '100%', width: '100%', alignItems: 'center',
                                                            justifyContent: 'center', borderRadius: 30, padding: 20,
                                                        }}
                                                    >
                                                        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 20 }}>Add Thermostat</Text>
                                                    </LinearGradient>

                                                </TouchableOpacity>


                                            </View>


                                        </Modal>



                                    </View>

                                </View>

                                <View style={{ flexDirection: 'row', gap: 20 }}>

                                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                        style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', borderRadius: 20, }]}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                height: '100%', width: '100%', padding: 10, paddingLeft: 20, paddingRight: 20,
                                                justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 5
                                            }}
                                            onPress={() => { navigation.navigate("StatisticsStack") }}
                                        >
                                            <Ionicons
                                                name={"flash"}
                                                size={20}
                                                color={'white'}
                                            />
                                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Statistics</Text>
                                        </TouchableOpacity>
                                    </LinearGradient>

                                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                        style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', borderRadius: 20, }]}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                height: '100%', width: '100%', padding: 10, paddingLeft: 20, paddingRight: 20,
                                                justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 5
                                            }}
                                            onPress={() => { navigation.navigate("DevicesStack") }}
                                        >
                                            <Ionicons
                                                name={"desktop"}
                                                size={20}
                                                color={'white'}
                                            />
                                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Device Control</Text>
                                        </TouchableOpacity>
                                    </LinearGradient>

                                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                        style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', borderRadius: 20, }]}
                                    >
                                        <TouchableOpacity
                                            style={{
                                                height: '100%', width: '100%', padding: 10, paddingLeft: 20, paddingRight: 20,
                                                justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 5
                                            }}
                                            onPress={() => { navigation.navigate("CustomStack") }}
                                        >
                                            <Ionicons
                                                name={"color-palette"}
                                                size={20}
                                                color={'white'}
                                            />
                                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Pet Customization</Text>
                                        </TouchableOpacity>
                                    </LinearGradient>

                                </View>




                                <View style={[styles.weather, styles.shadow, {}]}>


                                    <LinearGradient colors={['rgb(3, 188, 255)', 'transparent']}
                                        style={{
                                            height: '50%', width: '100%', borderTopLeftRadius: 50, borderTopRightRadius: 50,
                                            backgroundColor: 'rgb(14, 90, 255)', flexDirection: 'row', alignItems: 'center'
                                        }}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: '5%' }}>

                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 90 }}>22°</Text>

                                            <View style={{ justifyContent: 'center', marginLeft: '15%' }}>
                                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 35 }}>Clear Skies</Text>
                                                <Text style={{ color: 'rgb(189, 203, 223)', fontSize: 25 }}>Dubai, UAE</Text>

                                            </View>

                                        </View>

                                        <View style={{ position: 'absolute', right: 50 }}>
                                            <MaterialCommunityIcons name="cloud" color='white' size={150} />
                                        </View>

                                    </LinearGradient>

                                    <View style={{
                                        height: '50%', width: '100%', borderBottomLeftRadius: 50, borderBottomRightRadius: 50,
                                        backgroundColor: 'rgb(17, 0, 103)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                        gap: '10%'
                                    }}>

                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}>10 km/h</Text>
                                            <Text style={{ color: 'rgb(189, 203, 223)', fontSize: 20 }}>Wind</Text>
                                        </View>

                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}>33%</Text>
                                            <Text style={{ color: 'rgb(189, 203, 223)', fontSize: 20 }}>Humidity</Text>
                                        </View>

                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}>5%</Text>
                                            <Text style={{ color: 'rgb(189, 203, 223)', fontSize: 20 }}>Precipitation</Text>
                                        </View>




                                    </View>

                                </View>

                                <Text>Mumbo Jumbo</Text>




                            </View>



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
    screen: {
        //padding: 20,
        height: '100%',
        width: '100%',
        //display:'none',
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

    helloBar: {
        width: '100%',
        height: '8%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    mainContainer: {
        alignItems: 'center',     //horizontal
        gap: 30,
    },
    baseStatsBar: {
        width: '90%',
        maxWidth: 900,
        flexDirection: 'row',
        backgroundColor: "rgb(255, 255, 255)",
        borderRadius: 70,

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



    weather: {
        width: '95%',
        maxWidth: 800,
        height: 300,     //temp
        backgroundColor: 'rgb(247, 247, 247)',
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
