import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, CheckBox,

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import React, { useEffect, useState } from "react";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Register from "./register";

import 'react-native-gesture-handler';    //important for some reason

import { LinearGradient } from 'expo-linear-gradient';

import Modal from "react-native-modal";


import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE_URL } from "../../src/config";




export default function Houses() {

    const navigation = useNavigation()

    const route = useRoute()
    const { isNew } = route.params


    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [houseAdded, setHouseAdded] = useState(false)
    const [newHouseName, setNewHouseName] = useState("")

    const [landlords, setLandlords] = useState([]);

    const fetchLandlords = async () => {
        /*
        const apiUrl = Platform.OS === "web"
            ? "http://127.0.0.1:8000/api/landlords/"
            : "http://10.0.2.2:8000/api/landlords/";
            */
        const apiUrl = `${API_BASE_URL}/api/landlords/`;

        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch landlords");
            }

            const data = await response.json();
            setLandlords(data);
        } catch (error) {
            console.error("Error fetching landlords:", error);
        } finally {
            //setLoading(false);
        }
    };

    const [chosenLandlord, setChosenLand] = useState('')


    const refreshingToken = async () => {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (!refreshToken) {
            console.log("fucnction failed to get refresh token")
        }
        else {
            console.log("fucnction got the refresh token: " + refreshToken)
        }
        if (!refreshToken) return;

        //const refreshUrl = Platform.OS == 'web' ? "http://127.0.0.1:8000/api/token/refresh/" : "http://10.0.2.2:8000/api/token/refresh/"
        const refreshUrl = `${API_BASE_URL}/api/token/refresh/`;


        try {
            const response = await fetch(refreshUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            const data = await response.json();
            console.log("Data:" + data)
            if (response.ok) {
                // Save the new access token
                await AsyncStorage.setItem('access_token', data.access_token);
                console.log('Token refreshed');
            } else {
                console.log('Error refreshing token:', data.error);
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    };




    const getHouses = async () => {
        try {
            // Retrieve the token from AsyncStorage
            const token = await AsyncStorage.getItem('access_token');
            const refreshToken = await AsyncStorage.getItem('refresh_token');

            console.log("Verfying Access token: " + token)
            console.log("Verfying Refresh token: " + refreshToken)

            if (!token) {
                console.log('No token found');
                return;
            }

            //const housesUrl = Platform.OS == 'web' ? "http://127.0.0.1:8000/api/houses/" : "http://10.0.2.2:8000/api/houses/"
            const housesUrl = `${API_BASE_URL}/api/houses/`

            const response = await fetch(housesUrl, {
                /*
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Include the token in the Authorization header
                },
                credentials: 'include',  // Include credentials (cookies, etc.)
                */
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token }),  // Send token in the body
                credentials: 'include',
            });
            const data = await response.json();

            if (response.ok) {
                console.log('Houses:', data);
                setHouses(data);
            } else {
                console.log('Token expired, refreshing...');
                const newToken = await refreshingToken();  // Try refreshing the token
                if (newToken) {
                    console.log("Refresh token: " + refreshToken)
                    // Retry with the new token
                    getHouses();  // Recursive call to try again with the new token
                }
                else {
                    console.log("Refresh token failed")
                }
                /*
                if (data.error) {
                    console.log('Token expired, refreshing...');
                    const newToken = await refreshingToken();  // Try refreshing the token
                    if (newToken) {
                        console.log("Refresh token: " + refreshToken)
                        // Retry with the new token
                        getHouses();  // Recursive call to try again with the new token
                    }
                    else {
                        console.log("Refresh token failed")
                    }
                } else {
                    console.log(data.error)
                    //setError(data.error);
                    setLoading(false);
                }
                    */
            }
        } catch (error) {
            console.error('Error fetching houses:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        setError(null)
        setHouseAdded(false)
        getHouses()
    }, [houseAdded])


    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const [isLandDropdownVisible, setLandDropdownVisible] = useState(false);

    const toggleLandDropdown = () => {
        setLandDropdownVisible(!isLandDropdownVisible);
    };


    const [invalidSelection, setInvalid] = useState(false)



    // Function to handle house creation
    const handleAddHouse = async () => {
        if (!newHouseName || !chosenLandlord) {
            //Alert.alert('Error', 'Please provide both house name and landlord email');
            setInvalid(true)
            return;
        }
        setInvalid(false)

        // Retrieve the access token from AsyncStorage
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
            await refreshingToken()
            handleAddHouse();
            //Alert.alert('Error', 'No access token found. Please log in again.');
            //return;
        }

        // Prepare data for the API request
        const requestData = {
            token: token,
            house_name: newHouseName,
            landlord_email: chosenLandlord,
        };

        //setLoading(true);

        //const addHouseUrl = Platform.OS == 'web' ? 'http://127.0.0.1:8000/api/houses/add/' : 'http://10.0.2.2:8000/api/houses/add/'
        const addHouseUrl = `${API_BASE_URL}/api/houses/add/`

        try {
            console.log(requestData)
            const response = await fetch(addHouseUrl, { // Adjust URL as needed
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (response.ok) {
                setHouseAdded(true)
                setChosenLand('')
                setNewHouseName('')
                getHouses()
                setDropdownVisible(false);
                //Alert.alert('Success', `House "${data.house_name}" added successfully!`);
                //navigation.goBack(); // Go back to the previous screen (if needed)
            } else {
                //Alert.alert('Error', data.error || 'Failed to add house');
            }
        } catch (error) {
            console.error('Error adding house:', error);
            //Alert.alert('Error', 'Something went wrong. Please try again later.');
        } finally {
            //setLoading(false);
        }
    };

    const [hasStatisticsAccess, setHasStatisticsAccess] = useState(false);
    const [hasDeviceControlAccess, setHasDeviceControlAccess] = useState(false);
    const [hasPetAccess, setHasPetAccess] = useState(false);


    const getAccess = async () => {
        setHasStatisticsAccess(await AsyncStorage.getItem("statsAccess") === 'true')
        setHasDeviceControlAccess(await AsyncStorage.getItem("petAccess") === 'true')
        setHasPetAccess(await AsyncStorage.getItem("petAccess") === 'true')
        //console.log(hasStatisticsAccess)
        //console.log(hasDeviceControlAccess)
        //console.log(hasPetAccess)
        //setLoading(false)
    }

    useEffect(() => {
        getAccess()
    }, [hasStatisticsAccess])

    const selectHouse = async (houseid) => {
        console.log(houseid)
        await AsyncStorage.setItem("house_id", houseid.toString())
    }





    // If data is still loading, show a loading message
    if (loading) {
        return (
            <View style={styles.centered}>

                <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { navigation.goBack() }}>
                    <MaterialCommunityIcons name="chevron-left" color={'rgb(216, 75, 255)'} size={30} />
                </TouchableOpacity>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>

                <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { navigation.goBack() }}>
                    <MaterialCommunityIcons name="chevron-left" color={'rgb(216, 75, 255)'} size={30} />
                </TouchableOpacity>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }






    return (


        <View style={[styles.loginCard]} >
            <View style={[styles.shadow, styles.loginInnerCard]}>

                <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { navigation.goBack() }}>
                    <MaterialCommunityIcons name="chevron-left" color={'rgb(255, 3, 184)'} size={30} />
                </TouchableOpacity>

                <ScrollView style={{ width: '100%' }}>

                    <View style={[styles.container]}>
                        {houses.map((house) => (
                            <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                key={house.id} style={[styles.houseItem]}>

                                <TouchableOpacity onPress={() => {
                                    selectHouse(house.id);

                                    if (isNew == true) {
                                        navigation.navigate("Tutorial", {
                                            statsAccess: hasStatisticsAccess,
                                            deviceAccess: hasDeviceControlAccess,
                                            petAccess: hasPetAccess,
                                            isNew: isNew,
                                            house: "house",
                                        })
                                    }
                                    else {
                                        navigation.navigate("Main", {
                                            statsAccess: hasStatisticsAccess,
                                            deviceAccess: hasDeviceControlAccess,
                                            petAccess: hasPetAccess,
                                            house: "house",
                                        })
                                    }; console.log(house);
                                }}
                                    style={{ width: '100%', height: '100%', justifyContent: 'center', padding: 16 }}>

                                    <Text style={styles.houseName}>{house.name}</Text>
                                    {/*<Text style={styles.houseDetails}>Owner: {house.owner.first_name} {house.owner.last_name}</Text>*/}
                                    <Text style={styles.houseDetails}>Landlord: {house.landlord.first_name} {house.landlord.last_name}</Text>
                                    <MaterialCommunityIcons name="home" color={'rgb(255, 255, 255)'} size={50} style={{ position: 'absolute', right: 10 }} />

                                </TouchableOpacity>

                            </LinearGradient>
                        ))}

                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']} style={[styles.houseItem]}>

                            <TouchableOpacity onPress={() => { setDropdownVisible(true) }}
                                style={{ width: '100%', height: '100%', justifyContent: 'center', padding: 16 }}>

                                <Text style={styles.houseName}>Add House</Text>
                                {/*<Text style={styles.houseDetails}>Owner: {house.owner.first_name} {house.owner.last_name}</Text>*/}
                                <MaterialCommunityIcons name="plus" color={'rgb(255, 255, 255)'} size={50} style={{ position: 'absolute', right: 10 }} />

                            </TouchableOpacity>

                            <Modal
                                isVisible={isDropdownVisible}
                                onBackdropPress={() => { setDropdownVisible(false); setInvalid(false); }} // Close when tapping outside
                                animationIn="fadeInDown"
                                animationOut="fadeOutUp"
                                backdropOpacity={0.3}
                                style={[{}]}
                            >

                                <View style={[{
                                    backgroundColor: 'white', height: '80%', width: Platform.OS == 'web' ? '35%' : '80%', alignSelf: 'flex-end',
                                    justifyContent: 'center', alignItems: 'center', right: '10.5%', borderRadius: 50,
                                    gap: '8%',

                                }]}>

                                    <TouchableOpacity style={{
                                        alignSelf: 'flex-start', position: 'absolute', top: '10%', left: '5%'
                                    }} onPress={() => { setDropdownVisible(false); setInvalid(false); }}>
                                        <MaterialCommunityIcons name="chevron-left" color={'rgb(255, 3, 184)'} size={30} />
                                    </TouchableOpacity>


                                    <View style={[{ gap: '20%', alignItems: 'center', justifyContent: 'center', marginTop: (Platform.OS == 'web') ? 0 : 10, width:'80%' }]}>
                                        <TextInput
                                            //style={[styles.shadow, styles.input]}
                                            placeholder="Enter House Name"
                                            //placeholderTextColor=
                                            style={[styles.textInput, {}]}
                                            value={newHouseName}
                                            onChangeText={setNewHouseName}
                                        />
                                        <TouchableOpacity onPress={() => { setLandDropdownVisible(true); fetchLandlords(); }}
                                            style={{
                                                backgroundColor: 'white', borderWidth: 1,
                                                padding: 20, flexDirection: 'row', borderRadius: 20, gap: '10%', justifyContent: 'center', alignItems: 'center'
                                            }}>
                                            <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }} >
                                                {chosenLandlord == '' ? "Select Landlord" : chosenLandlord}
                                            </Text>
                                            <MaterialCommunityIcons name="chevron-down" color={'black'} size={30} />
                                        </TouchableOpacity>

                                        <Modal
                                            isVisible={isLandDropdownVisible}
                                            onBackdropPress={() => setLandDropdownVisible(false)} // Close when tapping outside
                                            animationIn="fadeInDown"
                                            animationOut="fadeOutUp"
                                            backdropOpacity={0.3}
                                            style={[{}]}
                                        >

                                            <ScrollView style={[{
                                                padding: 10, backgroundColor: 'white',
                                                position: 'absolute', alignSelf: 'flex-end', right: '20.5%', top: '53%', width: Platform.OS != 'web' ? '60%' : '15%', borderRadius: 20,
                                            }]}>

                                                {landlords.map((landlord) => (
                                                    <TouchableOpacity onPress={() => { setChosenLand(landlord.email); setLandDropdownVisible(false) }}
                                                        key={landlord.id} style={{ padding: 10, borderBottomWidth: 1, width: '100%' }}>
                                                        <Text style={{ fontSize: 18 }}>{landlord.first_name} {landlord.last_name}</Text>
                                                        <Text style={{ color: 'gray' }}>{landlord.email}</Text>
                                                    </TouchableOpacity>
                                                ))}

                                            </ScrollView>

                                        </Modal>
                                    </View>

                                    {invalidSelection && <Text style={{ fontWeight: 'bold', color: 'red' }}>Enter Valid House Name and Landlord!</Text>}

                                    <View style={[{ gap: '20%', alignItems: 'center', justifyContent: 'center', marginTop: (Platform.OS == 'web') ? 0 : 10 }]}>

                                        <TouchableOpacity onPress={() => { handleAddHouse(); }}
                                            style={{
                                                backgroundColor: 'rgb(255, 3, 184)',
                                                padding: 20, flexDirection: 'row', borderRadius: 20, gap: '10%', justifyContent: 'center', alignItems: 'center'
                                            }}>
                                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }} >Add House</Text>

                                        </TouchableOpacity>
                                    </View>


                                </View>


                            </Modal>

                        </LinearGradient>
                    </View>

                </ScrollView>

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

    mainContainer: {
        //alignItems: 'center',     //horizontal
        alignItems: 'flex-end',
        //gap: 20,
        width: '100%',
        height: '70%',
        //height:10000,
        backgroundColor: 'rgb(216, 75, 255)',
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row'
    },
    loginCard: {
        height: Platform.OS == 'web' ? '100%' : '100%',
        //width: `${loginCardWidth}%`,
        width: '100%',
        backgroundColor: 'rgb(245, 245, 245)',
        //backgroundColor: 'rgb(1, 1, 1)',
        borderTopLeftRadius: 50,
        borderTopRightRadius: Platform.OS == 'web' ? 0 : 50,
        borderBottomLeftRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginInnerCard: {
        backgroundColor: 'white',
        width: Platform.OS == 'web' ? '80%' : '100%',
        maxWidth: 600,
        height: Platform.OS == 'web' ? '70%' : '100%',
        //width:900,
        //height:900,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        //borderRadius: 50,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderBottomLeftRadius: Platform.OS == 'web' ? 50 : 0,
        borderBottomRightRadius: Platform.OS == 'web' ? 50 : 0,
        gap: 20,
        position: 'absolute',
        alignSelf: 'center',

    },
    loginButton: {
        backgroundColor: 'rgb(216, 75, 255)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        padding: 20,
    },
    textInput: {
        borderColor: 'rgb(157, 157, 157)',
        borderWidth: 1,
        borderRadius: 12,
        padding: 10,
        width: '100%'
    },


    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        width: '100%',
    },


    houseItem: {
        //width: '70%',
        width: '100%',
        maxWidth: 400,
        maxHeight: 80,
        //padding: 16,
        marginBottom: 10,
        backgroundColor: 'rgb(216, 75, 255)',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
        justifyContent: 'center'
    },
    houseName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    },
    houseDetails: {
        fontSize: 14,
        color: 'rgb(205, 205, 205)',
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
