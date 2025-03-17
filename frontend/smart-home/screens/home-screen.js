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

    const themes = ['dark', 'light', 'crazy'];
    const [themeIndex, setThemeIndex] = useState(0)

    const changeTheme = (val) => {
        let index = themeIndex;
        if (themeIndex + val > 2) {
            index = 0
            setThemeIndex(0)
        }
        else {
            index = themeIndex + val
            setThemeIndex(themeIndex + val)
        }
        toggleTheme(themes[index])
    }



    //Time
    const [currentTime, setCurrentTime] = useState(getFormattedTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(getFormattedTime());
        }, 10000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    function getFormattedTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // HH:MM format
    }



    const [firstName, setFirstName] = useState("name")
    const [lastName, setLastName] = useState("name")
    const [userType, setUserType] = useState("name")
    const [house_id, setHouseId] = useState(0)
    const [loading, setLoading] = useState(true);

    const getFirstName = async () => {
        setFirstName(await AsyncStorage.getItem("first_name"))
        setLastName(await AsyncStorage.getItem("last_name"))
        setUserType(await AsyncStorage.getItem("user_type"))
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


    const [isVisible, setDropdownVisible] = useState(true);


    const [isShortDropdownVisible, setSDP] = useState(false)


    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

    const API_KEY = 'e74a752c81684094463e38f68e07d288';
    const CITY = 'Dubai';

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }

                const data = await response.json();
                console.log(data)

                setWeatherData({
                    temp: data.main.temp,
                    humidity: data.main.humidity,
                    wind: data.wind.speed,
                    visibility: data.visibility,
                    description: data.weather[0].description,
                    icon: data.weather[0].icon
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    const iconMap = {
        '01d': 'weather-sunny',
        '01n': 'weather-night',
        '02d': 'weather-partly-cloudy',
        '02n': 'weather-night-partly-cloudy',
        '03d': 'weather-cloudy',
        '03n': 'weather-cloudy',
        '04d': 'weather-cloudy',
        '04n': 'weather-cloudy',
        '09d': 'weather-pouring',
        '09n': 'weather-pouring',
        '10d': 'weather-rainy',
        '10n': 'weather-rainy',
        '11d': 'weather-lightning',
        '11n': 'weather-lightning',
        '13d': 'weather-snowy',
        '13n': 'weather-snowy',
        '50d': 'weather-fog',
        '50n': 'weather-fog',
    };


    const returnWeatherIcon = (iconCode) => {
        return iconMap[iconCode] || 'weather-sunny'
    }


    const capitalize = (str) => {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }




    if (Platform.OS != 'web') {

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
                                        backgroundColor: 'rgb(216, 75, 255)', height: 72, borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
                                    }]}>
                                    <View style={{ flexDirection: 'row', left: '3%', alignItems: 'center' }}>
                                        <Text style={{ color: 'rgb(232, 232, 232)', fontSize: Platform.OS == 'web' ? 35 : 15, }}>Welcome, </Text>
                                        <Text style={{ color: 'white', fontSize: Platform.OS == 'web' ? 35 : 15, fontWeight: 'bold' }}>
                                            {(firstName) ? firstName : 'Guest'}!
                                        </Text>
                                        <Text style={{ color: 'rgb(232, 232, 232)', fontSize: Platform.OS == 'web' ? 45 : 25, }}>👋🏻</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', right: '3%', alignItems: 'center', gap: 30 }}>
                                        <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>{currentTime}</Text>
                                        <TouchableOpacity

                                            onPress={() => {
                                                setSDP(true)
                                            }}

                                            style={{
                                                justifyContent: 'center', alignItems: 'center',
                                                backgroundColor: 'rgba(255,255,255,1)', borderRadius: 500,
                                                aspectRatio: 1,
                                                //height: '100%',
                                            }}>

                                            <Ionicons name="person-circle-outline" size={Platform.OS == 'web' ? 70 : 40} />
                                        </TouchableOpacity>
                                    </View>
                                    <Modal
                                        isVisible={isShortDropdownVisible}
                                        onBackdropPress={() => setSDP(false)} // Close when tapping outside
                                        animationIn="fadeInDown"
                                        animationOut="fadeOutUp"
                                        backdropOpacity={0.5}
                                        style={[{}]}
                                    >

                                        <View style={[{
                                            minWidth: 400, alignSelf: 'flex-end', position: 'absolute',
                                            top: 0
                                        }]}>

                                            <View style={{
                                                backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white', padding: 20,
                                                alignItems: 'center', gap: 5, justifyContent: 'center',
                                                borderTopLeftRadius: Platform.OS == 'web' ? 30 : 20,
                                                borderTopRightRadius: Platform.OS == 'web' ? 30 : 20
                                            }}>
                                                <Text style={{
                                                    color: 'rgb(255, 3, 184)', fontWeight: 'bold',
                                                    fontSize: 30,
                                                }}>
                                                    {firstName + " " + lastName}
                                                </Text>
                                                <Text style={{
                                                    color: 'rgb(199, 199, 199)', fontWeight: 'bold',
                                                    fontSize: 20,
                                                }}>
                                                    {userType == 'home_owner' ? "Home Owner" : "Landlord"}
                                                </Text>

                                            </View>

                                            <TouchableOpacity style={{}}
                                                onPress={() => {
                                                    changeTheme(1)
                                                }}
                                            >
                                                <View style={{
                                                    backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white', padding: 10,
                                                    flexDirection: 'row', alignItems: 'center', gap: 10,
                                                }}>
                                                    <MaterialCommunityIcons name="theme-light-dark" size={Platform.OS == 'web' ? 50 : 20} color={theme == 'dark' ? 'white' : 'rgb(255, 3, 184)'} />
                                                    <Text style={{ color: theme == 'dark' ? 'white' : 'rgb(255, 3, 184)', fontWeight: 'bold', fontSize: 18 }}>
                                                        Toggle Theme ({theme == 'dark' ? "Dark" : (theme == 'light' ? "Light" : "Freaky")})
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{}}
                                                onPress={() => {
                                                    setSDP(false);
                                                    navigation.navigate("SettingsStack")
                                                }}
                                            >
                                                <View style={{
                                                    backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white', padding: 10,
                                                    flexDirection: 'row', alignItems: 'center', gap: 10,
                                                }}>
                                                    <MaterialCommunityIcons name="cog" size={Platform.OS == 'web' ? 50 : 20} color={theme == 'dark' ? 'white' : 'rgb(255, 3, 184)'} />
                                                    <Text style={{ color: theme == 'dark' ? 'white' : 'rgb(255, 3, 184)', fontWeight: 'bold' }}>Settings</Text>
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{}}
                                                onPress={() => {
                                                    setSDP(false);
                                                    AsyncStorage.clear();
                                                    navigation.navigate("LoginMainStack");
                                                }}
                                            >
                                                <View style={{
                                                    backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white', padding: 10,
                                                    flexDirection: 'row', alignItems: 'center', gap: 10,
                                                    borderBottomLeftRadius: Platform.OS == 'web' ? 30 : 20,
                                                    borderBottomRightRadius: Platform.OS == 'web' ? 30 : 20
                                                }}>
                                                    <MaterialCommunityIcons name="logout" size={Platform.OS == 'web' ? 50 : 20} color={theme == 'dark' ? 'white' : 'rgb(255, 3, 184)'} />
                                                    <Text style={{ color: theme == 'dark' ? 'white' : 'rgb(255, 3, 184)', fontWeight: 'bold' }}>Logout</Text>
                                                </View>
                                            </TouchableOpacity>


                                        </View>


                                    </Modal>
                                </LinearGradient>

                                <View style={[styles.mainContainer]}>




                                    <View style={[{ width: '100%', justifyContent: 'center', gap: '3%', alignItems: 'center', marginTop: -10 }]}>
                                        <View style={[{ width: '60%', maxWidth: 400 }]}>

                                            <Pet moodStates={moodStates} imageDisplays={imageDisplays} />

                                        </View>

                                        <View style={{ flexDirection: 'row', gap: 10, marginTop: -10 }}>

                                            <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                                style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', borderRadius: 20, }]}
                                            >

                                                <TouchableOpacity
                                                    style={{
                                                        padding: 5, paddingLeft: 10, paddingRight: 10,
                                                        justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 5
                                                    }}
                                                    onPress={() => { navigation.navigate("StatisticsStack") }}
                                                >
                                                    <Ionicons
                                                        name={"flash"}
                                                        size={14}
                                                        color={'white'}
                                                    />
                                                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'white' }}>Statistics</Text>
                                                </TouchableOpacity>
                                            </LinearGradient>

                                            <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                                style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', borderRadius: 20, }]}
                                            >
                                                <TouchableOpacity
                                                    style={{
                                                        padding: 5, paddingLeft: 10, paddingRight: 10,
                                                        justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 5
                                                    }}
                                                    onPress={() => { navigation.navigate("DevicesStack") }}
                                                >
                                                    <Ionicons
                                                        name={"desktop"}
                                                        size={14}
                                                        color={'white'}
                                                    />
                                                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'white' }}>Device Control</Text>
                                                </TouchableOpacity>
                                            </LinearGradient>

                                            <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                                style={[styles.shadow, { backgroundColor: 'rgb(216, 75, 255)', borderRadius: 20, }]}
                                            >
                                                <TouchableOpacity
                                                    style={{
                                                        padding: 5, paddingLeft: 10, paddingRight: 10,
                                                        justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 5
                                                    }}
                                                    onPress={() => { navigation.navigate("CustomStack") }}
                                                >
                                                    <Ionicons
                                                        name={"color-palette"}
                                                        size={14}
                                                        color={'white'}
                                                    />
                                                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'white' }}>Pet Customization</Text>
                                                </TouchableOpacity>
                                            </LinearGradient>


                                        </View>

                                        <View style={[{
                                            justifyContent: 'center', alignItems: 'center',
                                            padding: 10,
                                            minWidth: 200,
                                            minHeight: 200,
                                            //width:'90%',
                                            backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white',
                                            aspectRatio: 1, borderWidth: 1, borderColor: 'rgb(255, 3, 184)', borderRadius: 40,
                                        }]}>

                                            {!boolThermo &&

                                                <TouchableOpacity
                                                    style={{
                                                        width: '80%', height: '20%',
                                                        borderRadius: 30,
                                                        justifyContent: 'center', alignItems: 'center',
                                                    }}
                                                    onPress={() => {
                                                        toggleThermoAdd()
                                                    }}
                                                >
                                                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                                        style={{
                                                            backgroundColor: 'rgb(216, 75, 255)',
                                                            //height: '100%', width: '100%', 
                                                            alignItems: 'center',
                                                            justifyContent: 'center', borderRadius: 30,
                                                            padding: 10,
                                                        }}
                                                    >
                                                        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 15 }}>Add Thermostat</Text>
                                                    </LinearGradient>

                                                </TouchableOpacity>




                                            }

                                            {boolThermo &&
                                                <View style={[{ justifyContent: 'center', alignItems: 'center', padding: 15, }]}>



                                                    <ThermoDial

                                                        changeable={true}
                                                        tempValue={thermoTemp}
                                                        minValueIn={0}
                                                        maxValueIn={60}
                                                        radiusIn={110}
                                                        house_id={house_id}
                                                        themMode={thermoMode}


                                                    />

                                                    <TouchableOpacity
                                                        style={{
                                                            aspectRatio: 1, position: 'absolute', top: 10, right: 40,
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
                                                            <MaterialCommunityIcons name={"delete"} size={Platform.OS == 'web' ? 30 : 20} color={'white'} />

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
                                                    width: '90%',
                                                    maxWidth: 800,
                                                    backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white',
                                                    alignSelf: 'center', alignItems: 'center', justifyContent: 'center',
                                                    padding: 30, gap: 40,
                                                }]}>

                                                    <TouchableOpacity style={[{ position: 'absolute', right: 20, top: 20, }]} >
                                                        <MaterialCommunityIcons name="close" color='rgb(255, 3, 184)' size={50} onPress={() => { toggleThermoAdd(); setThermoCode(''); }} />
                                                    </TouchableOpacity>



                                                    <TextInput
                                                        //style={[styles.shadow, styles.input]}
                                                        placeholder="Enter Thermostat Code"
                                                        placeholderTextColor={'gray'}
                                                        style={[{
                                                            borderWidth: 1, borderColor: 'gray', padding: 20, width: '90%', maxWidth: 500, marginTop: 50, borderRadius: 20,
                                                            color: theme == 'dark' ? 'white' : 'black', fontWeight: 'bold', fontSize: 20,
                                                        }]}
                                                        maxLength={10}
                                                        value={thermoCode}
                                                        onChangeText={setThermoCode}
                                                    />

                                                    <TouchableOpacity
                                                        style={{
                                                            width: '80%', maxWidth: 500, borderRadius: 30, marginBottom: 50, alignItems: 'center'
                                                        }}
                                                        onPress={async () => {  // Make the handler async
                                                            try {
                                                                await addThermo();

                                                                toggleThermoAdd();

                                                                await getThermo();
                                                                setThermoCode('');

                                                            } catch (error) {
                                                                // Handle errors without closing the modal
                                                                console.log('Error adding thermostat:', error);
                                                                //setError(error.message);
                                                            }
                                                        }}
                                                    >
                                                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                                            style={{
                                                                backgroundColor: 'rgb(216, 75, 255)', width: '100%', alignItems: 'center',
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






                                    <View style={[styles.weather, styles.shadow, { height: 200, }]}>


                                        <LinearGradient colors={['rgb(3, 188, 255)', 'transparent']}
                                            style={{
                                                height: '50%', width: '100%', borderTopLeftRadius: 50, borderTopRightRadius: 50,
                                                backgroundColor: 'rgb(14, 90, 255)', flexDirection: 'row', alignItems: 'center'
                                            }}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: '8%' }}>

                                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 55 }}>{weatherData ? Math.floor(weatherData.temp) + "°" : "22°"}</Text>

                                                <View style={{ justifyContent: 'center', marginLeft: '5%' }}>
                                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 23 }}>{capitalize(weatherData ? weatherData.description : "clear skies")}</Text>
                                                    <Text style={{ color: 'rgb(189, 203, 223)', fontSize: 15 }}>Dubai, UAE</Text>

                                                </View>

                                            </View>

                                            <View style={{ position: 'absolute', right: 35 }}>
                                                <MaterialCommunityIcons name={weatherData ? returnWeatherIcon(weatherData.icon) : "weather-sunny"} color='white' size={80} />
                                            </View>

                                        </LinearGradient>

                                        <View style={{
                                            height: '50%', width: '100%', borderBottomLeftRadius: 50, borderBottomRightRadius: 50,
                                            backgroundColor: 'rgb(17, 0, 103)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                            gap: '10%'
                                        }}>

                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24 }}>{weatherData ? Math.floor(weatherData.wind) : "10"} m/s</Text>
                                                <Text style={{ color: 'rgb(189, 203, 223)', fontSize: 14 }}>Wind</Text>
                                            </View>

                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24 }}>{weatherData ? Math.floor(weatherData.humidity) : "33"}%</Text>
                                                <Text style={{ color: 'rgb(189, 203, 223)', fontSize: 14 }}>Humidity</Text>
                                            </View>

                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 24 }}>{weatherData ? Math.floor(weatherData.visibility) : "10000"} m</Text>
                                                <Text style={{ color: 'rgb(189, 203, 223)', fontSize: 14 }}>Visibility</Text>
                                            </View>




                                        </View>

                                    </View>

                                    <View style={{ height: 300 }}>


                                    </View>





                                </View>





                            </SafeAreaView>
                        </SafeAreaProvider>

                    </ScrollView>



                </View>
            </View >

        )
    }





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



                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 30, right: '3%' }}>
                                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>{currentTime}</Text>
                                    <TouchableOpacity

                                        onPress={() => {
                                            setSDP(true)
                                        }}

                                        style={{
                                            justifyContent: 'center', alignItems: 'center',
                                            backgroundColor: 'rgba(255,255,255,1)', borderRadius: 500,
                                            aspectRatio: 1,
                                            //height: '100%',
                                        }}>

                                        <Ionicons name="person-circle-outline" size={Platform.OS == 'web' ? 70 : 40} />
                                    </TouchableOpacity>

                                    <Modal
                                        isVisible={isShortDropdownVisible}
                                        onBackdropPress={() => setSDP(false)} // Close when tapping outside
                                        animationIn="fadeInDown"
                                        animationOut="fadeOutUp"
                                        backdropOpacity={0.5}
                                        style={[{}]}
                                    >

                                        <View style={[{
                                            minWidth: 400, alignSelf: 'flex-end', position: 'absolute',
                                            top: 0
                                        }]}>

                                            <View style={{
                                                backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white', padding: 20,
                                                alignItems: 'center', gap: 5, justifyContent: 'center',
                                                borderTopLeftRadius: Platform.OS == 'web' ? 30 : 20,
                                                borderTopRightRadius: Platform.OS == 'web' ? 30 : 20
                                            }}>
                                                <Text style={{
                                                    color: 'rgb(255, 3, 184)', fontWeight: 'bold',
                                                    fontSize: 30,
                                                }}>
                                                    {firstName + " " + lastName}
                                                </Text>
                                                <Text style={{
                                                    color: 'rgb(199, 199, 199)', fontWeight: 'bold',
                                                    fontSize: 20,
                                                }}>
                                                    {userType == 'home_owner' ? "Home Owner" : "Landlord"}
                                                </Text>

                                            </View>

                                            <TouchableOpacity style={{}}
                                                onPress={() => {
                                                    changeTheme(1)
                                                }}
                                            >
                                                <View style={{
                                                    backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white', padding: 10,
                                                    flexDirection: 'row', alignItems: 'center', gap: 10,
                                                }}>
                                                    <MaterialCommunityIcons name="theme-light-dark" size={Platform.OS == 'web' ? 50 : 20} color={theme == 'dark' ? 'white' : 'rgb(255, 3, 184)'} />
                                                    <Text style={{ color: theme == 'dark' ? 'white' : 'rgb(255, 3, 184)', fontWeight: 'bold', fontSize: 18 }}>
                                                        Toggle Theme ({theme == 'dark' ? "Dark" : (theme == 'light' ? "Light" : "Freaky")})
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{}}
                                                onPress={() => {
                                                    setSDP(false);
                                                    navigation.navigate("SettingsStack")
                                                }}
                                            >
                                                <View style={{
                                                    backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white', padding: 10,
                                                    flexDirection: 'row', alignItems: 'center', gap: 10,
                                                }}>
                                                    <MaterialCommunityIcons name="cog" size={Platform.OS == 'web' ? 50 : 20} color={theme == 'dark' ? 'white' : 'rgb(255, 3, 184)'} />
                                                    <Text style={{ color: theme == 'dark' ? 'white' : 'rgb(255, 3, 184)', fontWeight: 'bold' }}>Settings</Text>
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{}}
                                                onPress={() => {
                                                    setSDP(false);
                                                    AsyncStorage.clear();
                                                    navigation.navigate("LoginMainStack");
                                                }}
                                            >
                                                <View style={{
                                                    backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white', padding: 10,
                                                    flexDirection: 'row', alignItems: 'center', gap: 10,
                                                    borderBottomLeftRadius: Platform.OS == 'web' ? 30 : 20,
                                                    borderBottomRightRadius: Platform.OS == 'web' ? 30 : 20
                                                }}>
                                                    <MaterialCommunityIcons name="logout" size={Platform.OS == 'web' ? 50 : 20} color={theme == 'dark' ? 'white' : 'rgb(255, 3, 184)'} />
                                                    <Text style={{ color: theme == 'dark' ? 'white' : 'rgb(255, 3, 184)', fontWeight: 'bold' }}>Logout</Text>
                                                </View>
                                            </TouchableOpacity>


                                        </View>


                                    </Modal>
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
                                                        borderWidth: 1, borderColor: 'gray', padding: 20, width: '90%', maxWidth: 600, marginTop: 50, borderRadius: 20,
                                                        color: theme == 'dark' ? 'white' : 'black', fontWeight: 'bold', fontSize: 20,
                                                    }]}
                                                    maxLength={10}
                                                    value={thermoCode}
                                                    onChangeText={setThermoCode}
                                                />

                                                <TouchableOpacity
                                                    style={{
                                                        width: '50%', borderRadius: 30, marginBottom: 50, alignItems: 'center'
                                                    }}
                                                    onPress={async () => {  // Make the handler async
                                                        try {
                                                            await addThermo();

                                                            toggleThermoAdd();

                                                            await getThermo();

                                                            setThermoCode('');

                                                        } catch (error) {
                                                            // Handle errors without closing the modal
                                                            console.log('Error adding thermostat:', error);
                                                            //setError(error.message);
                                                        }
                                                    }}
                                                >
                                                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                                        style={{
                                                            backgroundColor: 'rgb(216, 75, 255)', width: '80%', maxWidth: 500, alignItems: 'center',
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

                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 90 }}>{weatherData ? Math.floor(weatherData.temp) + "°" : "22°"}</Text>

                                            <View style={{ justifyContent: 'center', marginLeft: '15%' }}>
                                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 35 }}>{capitalize(weatherData ? weatherData.description : "clear skies")}</Text>
                                                <Text style={{ color: 'rgb(189, 203, 223)', fontSize: 25 }}>Dubai, UAE</Text>

                                            </View>

                                        </View>

                                        <View style={{ position: 'absolute', right: 50 }}>
                                            <MaterialCommunityIcons name={weatherData ? returnWeatherIcon(weatherData.icon) : "weather-sunny"} color='white' size={120} />
                                        </View>

                                    </LinearGradient>

                                    <View style={{
                                        height: '50%', width: '100%', borderBottomLeftRadius: 50, borderBottomRightRadius: 50,
                                        backgroundColor: 'rgb(17, 0, 103)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                        gap: '10%'
                                    }}>

                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}>{weatherData ? Math.floor(weatherData.wind) : "10"} m/s</Text>
                                            <Text style={{ color: 'rgb(189, 203, 223)', fontSize: 20 }}>Wind</Text>
                                        </View>

                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}>{weatherData ? Math.floor(weatherData.humidity) : "33"}%</Text>
                                            <Text style={{ color: 'rgb(189, 203, 223)', fontSize: 20 }}>Humidity</Text>
                                        </View>

                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}>{weatherData ? Math.floor(weatherData.visibility) : "10000"} m</Text>
                                            <Text style={{ color: 'rgb(189, 203, 223)', fontSize: 20 }}>Visibility</Text>
                                        </View>




                                    </View>

                                </View>

                                <View style={{ height: 300 }}>


                                </View>

                                <Text style={{ color: theme == 'dark' ? 'white' : 'black' }}>Mumbo Jumbo</Text>







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
