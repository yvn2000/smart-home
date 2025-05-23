import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, Image

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "../components/themes/theme";
import LavaLampBackground from "../components/themes/lava-lamp-bg";


import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Modal from "react-native-modal";
import { Line } from "react-native-svg";

import { API_BASE_URL } from "../src/config";



export default function SettingsItemScreen() {

    const navigation = useNavigation()

    const route = useRoute();

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

    const { house_id, setting_name, logo } = route.params


    const [loading, setLoading] = useState(true);




    //Language & Region
    const [language, setLanguage] = useState("English")
    const [region, setRegion] = useState("Dubai")






    //Guest Codes

    useEffect(() => {
        fetchGuestCodes()
        fetchProfile()
    }, [house_id])

    useEffect(() => {
        fetchGuestCodes()
        fetchProfile()
    }, [])

    useFocusEffect(
        useCallback(() => {
            let isActive = true;


            const refresh = async () => {

                fetchGuestCodes()
                fetchProfile()

            };

            refresh();

            return () => {
                isActive = false;
            };
        }, [])
    );



    const [guestCodes, setGuestCodes] = useState([]);
    //const apiUrl = Platform.OS === "web" ? "http://127.0.0.1:8000" : "http://10.0.2.2:8000";
    const apiUrl = API_BASE_URL;


    const fetchGuestCodes = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/houses/${house_id}/list-guests/`);
            const data = await response.json();

            if (response.ok) {
                setGuestCodes(data.guest_codes.map(item => item.code)); // Extract only codes
            } else {
                //Alert.alert("Error", "Failed to fetch guest codes.");
            }
        } catch (error) {
            console.error("Error fetching guest codes:", error);
        }
    };


    const generateUniqueGuestCode = () => {
        let newCode;
        do {
            newCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit number
        } while (guestCodes.includes(newCode)); // Ensure it's unique
        return newCode;
    };


    const addGuestCode = async () => {
        await fetchGuestCodes(); // Refresh guest codes first
        const newCode = generateUniqueGuestCode();

        try {
            const response = await fetch(`${apiUrl}/api/houses/${house_id}/add-guest/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: newCode }),
            });

            const data = await response.json();
            if (response.ok) {
                //Alert.alert("Success", `Guest code ${newCode} added!`);
                setGuestCodes(prev => [...prev, newCode]); // Update state
            } else {
                //Alert.alert("Error", data.error || "Failed to add guest code.");
            }
        } catch (error) {
            console.error("Error adding guest code:", error);
        }
    };

    const deleteGuestCode = async (code) => {

        try {
            const response = await fetch(`${apiUrl}/api/houses/${house_id}/delete-guest/`, {
                method: "DELETE",  // Changed to DELETE
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: code }),
            });

            const data = await response.json();
            if (response.ok) {
                //Alert.alert("Success", `Guest code ${newCode} added!`);
                setGuestCodes(prev => prev.filter(c => c !== code));
            } else {
                const data = await response.json();
                console.log(data)
                //Alert.alert("Error", data.error || "Failed to add guest code.");
            }
        } catch (error) {
            console.error("Error adding guest code:", error);
        }
    };




    //Account

    const [profileLoading, setProfileLoading] = useState(true)

    const [guest, setGuest] = useState(false)
    const [guestCode, setGuestCode] = useState('')

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [userType, setUserType] = useState('Home Owner')

    useEffect(() => {
        console.log(userType)
    }, [userType])


    const refreshingToken = async () => {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (!refreshToken) {
            console.log("fucnction failed to get refresh token")
            return;
        }
        else {
            console.log("fucnction got the refresh token: " + refreshToken)
        }


        //const refreshUrl = Platform.OS == 'web' ? "http://127.0.0.1:8000/api/token/refresh/" : "http://10.0.2.2:8000/api/token/refresh/"
        const refreshUrl = `${API_BASE_URL}/api/token/refresh/`

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
                return true;
            } else {
                console.log('Error refreshing token:', data.error);
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    };


    const fetchProfile = async () => {
        try {

            const guestCode = await AsyncStorage.getItem('guestCode')
            if (guestCode && guestCode != null && guestCode != 'null') {
                if (guestCode.length == 4) {
                    console.log("Guest Code: " + guestCode)
                    setGuestCode(guestCode)
                    setGuest(true)
                    setUserType('Guest')
                    return;
                }

            }

            setGuest(false)
            //setProfileLoading(false);



            // Retrieve the token from AsyncStorage
            const token = await AsyncStorage.getItem('access_token');
            const refreshToken = await AsyncStorage.getItem('refresh_token');

            console.log("Verfying Access token: " + token)
            console.log("Verfying Refresh token: " + refreshToken)

            /*
            if (!token) {
                await refreshingToken()
                console.log('No token found');
                fetchProfile()
                //return;
            }
            */

            //const profileUrl = Platform.OS == 'web' ? "http://127.0.0.1:8000/api/get-profile/" : "http://10.0.2.2:8000/api/get-profile/"

            const profileUrl = `${API_BASE_URL}/api/get-profile/`

            const response = await fetch(profileUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token }),  // Send token in the body
                credentials: 'include',
            });

            const data = await response.json()
            //const data = JSON.stringify(respData);

            if (response.ok) {
                //console.log('UserProfile:', data);
                //console.log(data.first_name)
                setFirstName(data.first_name)
                setLastName(data.last_name)
                setUserType(data.user_type == 'home_owner' ? 'Home Owner' : 'Landlord')
                console.log("Info Set")
            } else {
                console.log('Token expired, refreshing...');
                const newToken = await refreshingToken();  // Try refreshing the token
                if (newToken) {
                    console.log("Refresh token: " + refreshToken)
                    // Retry with the new token
                    await fetchProfile()
                    setProfileLoading(false);
                }
                else {
                    console.log("Refresh token failed")
                }
            }
        } catch (error) {
            console.error('Error :', error);
        } finally {
            setProfileLoading(false);
        }
    }


    const deleteAccount = async () => {
        try {

            // Retrieve the token from AsyncStorage
            const token = await AsyncStorage.getItem('access_token');
            const refreshToken = await AsyncStorage.getItem('refresh_token');

            console.log("Verfying Access token: " + token)
            console.log("Verfying Refresh token: " + refreshToken)

            /*
            if (!token) {
                await refreshingToken()
                console.log('No token found');
                fetchProfile()
                //return;
            }
            */

            //const deleteUrl = Platform.OS == 'web' ? "http://127.0.0.1:8000/api/delete-user/" : "http://10.0.2.2:8000/api/delete-user/"
            const deleteUrl = `${API_BASE_URL}/api/delete-user/`
            const response = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token }),  // Send token in the body
                credentials: 'include',
            });

            const data = await response.json()
            //const data = JSON.stringify(respData);

            if (response.ok) {
                AsyncStorage.clear();
                navigation.navigate("LoginMainStack");
            } else {
                console.log('Token expired, refreshing...');
                const newToken = await refreshingToken();  // Try refreshing the token
                if (newToken) {
                    console.log("Refresh token: " + refreshToken)
                    // Retry with the new token
                    await deleteAccount()
                }
                else {
                    console.log("Refresh token failed")
                }
            }
        } catch (error) {
            console.error('Error :', error);
        } finally {

        }
    }


    const updateUserName = async () => {
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

            //const url = Platform.OS == 'web' ? "http://127.0.0.1:8000/api/update-user-name/" : "http://10.0.2.2:8000/api/update-user-name/"
            const url = `${API_BASE_URL}/api/update-user-name/`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token, firstName: firstName, lastName: lastName }),  // Send token in the body
                credentials: 'include',
            });

            const data = await response.json()
            //const data = JSON.stringify(respData);

            if (response.ok) {
                console.log("User Name Updated")
                await AsyncStorage.setItem("first_name", firstName);
                await fetchProfile()
            } else {
                console.log('Token expired, refreshing...');
                const newToken = await refreshingToken();  // Try refreshing the token
                if (newToken) {
                    console.log("Refresh token: " + refreshToken)
                    // Retry with the new token
                    updateUserName()
                }
                else {
                    console.log("Refresh token failed")
                }
            }
        } catch (error) {
            console.error('Error :', error);
        } finally {
            setProfileLoading(false);
        }
    }





    const [indexWeb, setIndexWeb] = useState(0);

    const changeIndexWeb = (val) => {
        if (indexWeb + val < 0) {
            setIndexWeb(indexWeb)
        }
        else if (indexWeb + val >= screensWeb.length) {
            setIndexWeb(indexWeb)
        }
        else {
            setIndexWeb(indexWeb + val)
        }
    }

    const screensWeb = [
        require("../assets/images/app/web-tutorial/Home_pet.jpg"),
        require("../assets/images/app/web-tutorial/Home_bar.jpg"),
        require("../assets/images/app/web-tutorial/Home_thermo.jpg"),
        require("../assets/images/app/web-tutorial/Stats_panel.jpg"),
        require("../assets/images/app/web-tutorial/Stats_energy_graph.jpg"),
        require("../assets/images/app/web-tutorial/Stats_weekly.jpg"),
        require("../assets/images/app/web-tutorial/Stats_share.jpg"),
        require("../assets/images/app/web-tutorial/Stats_daily.jpg"),
        require("../assets/images/app/web-tutorial/Stats_device.jpg"),
        require("../assets/images/app/web-tutorial/Stats_excl.jpg"),
        require("../assets/images/app/web-tutorial/DC_room.jpg"),
        require("../assets/images/app/web-tutorial/DC_device.jpg"),
        require("../assets/images/app/web-tutorial/PC_custom.jpg"),
        require("../assets/images/app/web-tutorial/PC_level.jpg"),
        require("../assets/images/app/web-tutorial/PC_death.jpg"),
    ]




    const [indexMob, setIndexMob] = useState(0);

    const changeIndexMob = (val) => {
        if (indexMob + val < 0) {
            setIndexMob(indexMob)
        }
        else if (indexMob + val >= screensMob.length) {
            setIndexMob(indexMob)
        }
        else {
            setIndexMob(indexMob + val)
        }
    }

    const screensMob = [
        require("../assets/images/app/mobile-tutorial/Home_pet.jpg"),
        require("../assets/images/app/mobile-tutorial/Home_bar.jpg"),
        require("../assets/images/app/mobile-tutorial/Home_thermo.jpg"),
        require("../assets/images/app/mobile-tutorial/Stats_panel.jpg"),
        require("../assets/images/app/mobile-tutorial/Stats_energy_graph.jpg"),
        require("../assets/images/app/mobile-tutorial/Stats_weekly.jpg"),
        require("../assets/images/app/mobile-tutorial/Stats_device.jpg"),
        require("../assets/images/app/mobile-tutorial/Stats_excl.jpg"),
        require("../assets/images/app/mobile-tutorial/DC_room.jpg"),
        require("../assets/images/app/mobile-tutorial/DC_device.jpg"),
        require("../assets/images/app/mobile-tutorial/PC_custom.jpg"),
        require("../assets/images/app/mobile-tutorial/PC_level.jpg"),
        require("../assets/images/app/mobile-tutorial/PC_death.jpg"),
    ]



    const handleDelHouse = async () => {

        // Retrieve the access token from AsyncStorage
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
            await refreshingToken()
            handleDelHouse();
            //Alert.alert('Error', 'No access token found. Please log in again.');
            //return;
        }

        // Prepare data for the API request
        const requestData = {
            token: token,
        };

        //setLoading(true);

        //const delHouseUrl = Platform.OS == 'web' ? `http://127.0.0.1:8000/api/houses/delete/${house_id}/` : `http://10.0.2.2:8000/api/houses/delete/${house_id}/`
const delHouseUrl = `${API_BASE_URL}/api/houses/delete/${house_id}/`
        try {
            console.log(requestData)
            const response = await fetch(delHouseUrl, { // Adjust URL as needed
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            //const data = await response.json();

            if (response.ok) {
                await AsyncStorage.clear();
                navigation.navigate("LoginMainStack");

            } else {
                //Alert.alert('Error', data.error || 'Failed to add house');
                console.log("failed to delete house")
            }
        } catch (error) {
            console.error('Error deleting house:', error);
            //Alert.alert('Error', 'Something went wrong. Please try again later.');
        } finally {
            //setLoading(false);
        }
    };






    const returnSetting = () => {
        if (setting_name === "Guest Codes") {

            if (guest || (userType == 'Landlord')) {
                return (
                    <Text style={[styles.text, { fontSize: 20, color: 'rgb(255, 3, 184)', fontWeight: 'bold' }]} >No Access For {userType}s</Text>
                )
            }

            return (
                <View style={[{ marginTop: 50, width: '100%', alignItems: 'center' }]}>
                    <Text style={[styles.text, { fontSize: 30, color: 'rgb(255, 3, 184)', fontWeight: 'bold' }]} >House ID: {house_id}</Text>

                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={[{
                            alignItems: 'center', flexDirection: 'row',
                            backgroundColor: 'rgb(216, 75, 255)', borderRadius: 30,
                            padding: 30, width: '30%', minWidth: 300, marginTop: 30,
                        }]}>
                        <TouchableOpacity onPress={() => { addGuestCode() }}
                            style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={[styles.text, { fontSize: 20, color: 'white', fontWeight: 'bold' }]} >Generate Guest Codes</Text>
                        </TouchableOpacity>

                    </LinearGradient>
                    <ScrollView style={{ marginBottom: 10, width: '90%', marginTop: 50, }}
                        contentContainerStyle={{ alignItems: 'center', gap: 20 }}
                    >
                        {guestCodes.length > 0 ? (
                            guestCodes.map((code, index) => (
                                <View key={index} style={{
                                    backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255, 255, 255)',
                                    width: '90%', maxWidth: 1000, justifyContent: 'center', borderRadius: 25,
                                }}>
                                    <Text style={{ fontSize: 36, padding: 30, fontWeight: 'bold', color: theme == 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)' }}>
                                        {code}
                                    </Text>

                                    <TouchableOpacity
                                        style={{
                                            position: 'absolute', padding: 8,
                                            right: '3%', backgroundColor: 'red',
                                            borderRadius: 10,
                                        }}
                                        onPress={async () => {
                                            try {
                                                await deleteGuestCode(code);

                                                await fetchGuestCodes();

                                            } catch (error) {

                                                console.log('Error:', error);
                                                setError(error.message);
                                            }
                                        }}
                                    >
                                        <MaterialCommunityIcons name="delete" color='white' size={50} />
                                    </TouchableOpacity>
                                </View>

                            ))
                        ) : (
                            <Text>No guest codes found.</Text>
                        )}
                    </ScrollView>
                </View>

            )
        }

        else if (setting_name === "Language & Region") {


            return (
                <View style={[{ marginTop: 80, width: '100%', alignItems: 'center', gap: 50 }]}>


                    <View style={{ flexDirection: 'row', gap: '2%', justifyContent: 'center', width: '90%', alignItems: 'center' }}>

                        <Text style={[styles.text, { color: theme == 'crazy' ? 'white' : 'rgb(255, 3, 184)', fontSize: Platform.OS == 'web' ? 35 : 25 }]}>
                            Language</Text>
                        <View style={{
                            padding: 20, paddingRight: 60, borderRadius: 20,
                            backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255, 255, 255)'
                        }}>
                            <Text style={[styles.text, { color: theme == 'dark' ? 'white' : 'black', fontSize: Platform.OS == 'web' ? 35 : 25 }]}>
                                {language}
                            </Text>
                        </View>

                    </View>

                    <View style={{ flexDirection: 'row', gap: '2%', justifyContent: 'center', width: '90%', alignItems: 'center' }}>

                        <Text style={[styles.text, { color: theme == 'crazy' ? 'white' : 'rgb(255, 3, 184)', fontSize: Platform.OS == 'web' ? 35 : 25 }]}>Region</Text>
                        <View style={{
                            padding: 20, paddingRight: 60, borderRadius: 20,
                            backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255, 255, 255)'
                        }}>
                            <Text style={[styles.text, { color: theme == 'dark' ? 'white' : 'black', fontSize: Platform.OS == 'web' ? 35 : 25 }]}>
                                {region}
                            </Text>
                        </View>

                    </View>



                </View>
            )
        }


        else if (setting_name === "Social") {

            if ((userType != 'Home Owner')) {
                return (
                    <Text style={[styles.text, { fontSize: 20, color: 'rgb(255, 3, 184)', fontWeight: 'bold' }]} >No Access For {userType}s</Text>
                )
            }
            return (
                <View style={[{ marginTop: 80, width: '100%', alignItems: 'center', gap: 50, flexDirection: Platform.OS == 'web' ? 'row' : 'column', justifyContent: 'center' }]}>


                    <View style={{
                        alignItems: 'center', justifyContent: 'center', borderRadius: 30,
                        backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255, 255, 255)',
                        height: Platform.OS == 'web' ? 320 : 100, padding: Platform.OS == 'web' ? 40 : 10,
                        flexDirection: Platform.OS == 'web' ? 'column' : 'row', gap: Platform.OS == 'web' ? 0 : 15,

                    }}>

                        <MaterialCommunityIcons name={"instagram"} color={'rgb(255, 3, 184)'} size={Platform.OS == 'web' ? 100 : 50} />

                        <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'rgb(255, 3, 184)' }}>Instagram</Text>

                        <View style={{ flexDirection: 'row', marginTop: Platform.OS == 'web' ? 40 : 0, alignItems: 'center' }}>
                            <MaterialCommunityIcons name={"check-bold"} color={'rgb(3, 255, 11)'} size={Platform.OS == 'web' ? 50 : 30} style={{}} />

                            <View style={{
                                backgroundColor: 'red', padding: 5, marginLeft: 20, alignItems: 'center',
                                justifyContent: 'center', aspectRatio: 1, borderRadius: 20,
                            }}>
                                <MaterialCommunityIcons name={"delete"} color={'rgb(255, 255, 255)'} size={Platform.OS == 'web' ? 40 : 25} />
                            </View>
                        </View>


                    </View>


                    <View style={{
                        alignItems: 'center', justifyContent: 'center', borderRadius: 30,
                        backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255, 255, 255)',
                        height: Platform.OS == 'web' ? 320 : 100, padding: Platform.OS == 'web' ? 40 : 10,
                        flexDirection: Platform.OS == 'web' ? 'column' : 'row', gap: Platform.OS == 'web' ? 0 : 15,

                    }}>

                        <MaterialCommunityIcons name={"twitter"} color={'rgb(255, 3, 184)'} size={Platform.OS == 'web' ? 100 : 50} />

                        <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'rgb(255, 3, 184)' }}>Twitter</Text>

                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                            style={{
                                flexDirection: 'row', marginTop: Platform.OS == 'web' ? 40 : 0, alignItems: 'center', padding: 10,
                                backgroundColor: 'rgb(216, 75, 255)', width: Platform.OS == 'web' ? '100%' : '35%', borderRadius: 20, justifyContent: 'center'
                            }}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, alignSelf: 'center', textAlign: 'center' }}>Setup</Text>
                        </LinearGradient>

                    </View>


                    <View style={{
                        alignItems: 'center', justifyContent: 'center', borderRadius: 30,
                        backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255, 255, 255)',
                        height: Platform.OS == 'web' ? 320 : 100, padding: Platform.OS == 'web' ? 40 : 10,
                        flexDirection: Platform.OS == 'web' ? 'column' : 'row', gap: Platform.OS == 'web' ? 0 : 15,

                    }}>

                        <MaterialCommunityIcons name={"facebook"} color={'rgb(255, 3, 184)'} size={Platform.OS == 'web' ? 100 : 50} />

                        <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'rgb(255, 3, 184)' }}>Facebook</Text>

                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                            style={{
                                flexDirection: 'row', marginTop: Platform.OS == 'web' ? 40 : 0, alignItems: 'center', padding: 10,
                                backgroundColor: 'rgb(216, 75, 255)', width: Platform.OS == 'web' ? '100%' : '35%', borderRadius: 20, justifyContent: 'center'
                            }}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, }}>Setup</Text>
                        </LinearGradient>

                    </View>



                </View>
            )
        }

        else if (setting_name === "Account") {

            if (guest && guestCode != 'null') {
                return (
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 50, gap: 30, }}>
                        <Text style={{ fontSize: 60, color: theme == 'crazy' ? 'white' : 'rgb(255, 3, 184)', fontWeight: 'bold' }}>Guest {guestCode}</Text>
                        <Text style={{ color: theme == 'dark' ? 'white' : 'black', fontSize: 20, fontWeight: 'bold' }}>No Account Settings for Guests</Text>
                    </View>
                )
            }

            if (profileLoading) {
                return (
                    <View>
                        <Text>Still Loading...</Text>
                    </View>
                )
            }

            return (
                <View style={[{ marginTop: 40, width: '100%', alignItems: 'center', gap: Platform.OS == 'web' ? 50 : 20, justifyContent: 'center' }]}>

                    <View style={{ borderRadius: 1000, backgroundColor: 'rgb(114, 114, 114)' }}>
                        <MaterialCommunityIcons name={"account-circle"} color={'rgb(184, 184, 184)'} size={Platform.OS == 'web' ? 250 : 170} />
                    </View>


                    <View>
                        <Text style={{ color: theme == 'crazy' ? 'white' : 'rgb(255, 3, 184)', fontWeight: 'bold', fontSize: Platform.OS == 'web' ? 40 : 30, }}>{userType}</Text>
                    </View>

                    {Platform.OS == 'web' && <View style={{ flexDirection: 'row', gap: 30, alignItems: 'center', justifyContent: 'center', width: '90%', marginBottom: 40, }}>


                        <TextInput
                            //style={[styles.shadow, styles.input]}
                            placeholder="Should be Empty"
                            placeholderTextColor={'red'}
                            style={[{
                                width: '15%',
                                backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white',
                                color: theme == 'dark' ? 'white' : 'black', padding: 20,
                                fontSize: 30, borderRadius: 30, fontWeight: 'bold',
                            }]}
                            value={firstName}
                            onChangeText={setFirstName}
                        />

                        <TextInput
                            //style={[styles.shadow, styles.input]}
                            placeholder="Should be Empty"
                            placeholderTextColor={'red'}
                            style={[{
                                width: '15%',
                                backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white',
                                color: theme == 'dark' ? 'white' : 'black', padding: 20,
                                fontSize: 30, borderRadius: 30, fontWeight: 'bold',
                            }]}
                            value={lastName}
                            onChangeText={setLastName}
                        />

                        <TouchableOpacity
                            style={{
                                width: '10%', alignItems: 'center', justifyContent: 'center',
                                maxWidth: 500, borderRadius: 30,
                            }}

                            onPress={() => {
                                updateUserName()
                            }}

                        >
                            <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                style={{
                                    width: '100%', alignItems: 'center', justifyContent: 'center',
                                    borderRadius: 30, backgroundColor: 'rgb(216, 75, 255)', padding: 20,
                                }}
                            >

                                <Text style={{
                                    fontWeight: 'bold', fontSize: 30,
                                    color: 'white'
                                }}>
                                    Save
                                </Text>

                            </LinearGradient>
                        </TouchableOpacity>

                    </View>}

                    {Platform.OS != 'web' && <View style={{ width: '90%', alignItems: 'center', gap: 20, marginBottom: 40, }}>

                        <View style={{ flexDirection: 'row', gap: 30, alignItems: 'center', justifyContent: 'center', width: '90%' }}>
                            <TextInput
                                //style={[styles.shadow, styles.input]}
                                placeholder="Should be Empty"
                                placeholderTextColor={'red'}
                                style={[{
                                    width: '48%',
                                    backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white',
                                    color: theme == 'dark' ? 'white' : 'black', padding: 20,
                                    fontSize: 20, borderRadius: 30, fontWeight: 'bold',
                                }]}
                                value={firstName}
                                onChangeText={setFirstName}
                            />

                            <TextInput
                                //style={[styles.shadow, styles.input]}
                                placeholder="Should be Empty"
                                placeholderTextColor={'red'}
                                style={[{
                                    width: '48%',
                                    backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white',
                                    color: theme == 'dark' ? 'white' : 'black', padding: 20,
                                    fontSize: 20, borderRadius: 30, fontWeight: 'bold',
                                }]}
                                value={lastName}
                                onChangeText={setLastName}
                            />

                        </View>

                        <TouchableOpacity
                            style={{
                                width: '40%', alignItems: 'center', justifyContent: 'center',
                                maxWidth: 500, borderRadius: 30,
                            }}

                            onPress={() => {
                                updateUserName()
                            }}

                        >
                            <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                style={{
                                    width: '100%', alignItems: 'center', justifyContent: 'center',
                                    borderRadius: 30, backgroundColor: 'rgb(216, 75, 255)', padding: 10,
                                }}
                            >

                                <Text style={{
                                    fontWeight: 'bold', fontSize: 20,
                                    color: 'white'
                                }}>
                                    Save
                                </Text>

                            </LinearGradient>
                        </TouchableOpacity>

                    </View>}



                    <TouchableOpacity
                        style={{
                            width: '90%', alignItems: 'center', justifyContent: 'center',
                            maxWidth: 500, borderRadius: 30,
                        }}

                        onPress={() => {

                        }}

                    >

                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                            style={{
                                width: '100%', alignItems: 'center', justifyContent: 'center',
                                borderRadius: 30, backgroundColor: 'rgb(216, 75, 255)', padding: 25,
                            }}>
                            <Text style={{
                                fontWeight: 'bold', fontSize: Platform.OS == 'web' ? 30 : 24,
                                color: 'white', textAlign: 'center',
                            }}>
                                Change Login Credentials
                            </Text>
                            <Text style={{
                                fontWeight: 'bold', fontSize: Platform.OS == 'web' ? 15 : 12,
                                color: 'white', textAlign: 'center',
                            }}>
                                (An Email Will Be Sent)
                            </Text>
                        </LinearGradient>


                    </TouchableOpacity>


                    <TouchableOpacity
                        style={{
                            width: '90%', alignItems: 'center', justifyContent: 'center',
                            maxWidth: 500, borderRadius: 30,
                        }}

                        onPress={() => {

                            //AsyncStorage.clear(); 
                            navigation.navigate("UserDelete", {
                                refreshingToken: refreshingToken,
                                deleteAccount: deleteAccount,
                            });
                        }}

                    >

                        <LinearGradient colors={['rgb(255, 0, 0)', 'transparent']}
                            style={{
                                width: '100%', alignItems: 'center', justifyContent: 'center',
                                borderRadius: 30, backgroundColor: 'rgb(255, 0, 0)', padding: 20,
                            }}>
                            <Text style={{
                                fontWeight: 'bold', fontSize: 25,
                                color: 'white'
                            }}>
                                Delete Account
                            </Text>
                        </LinearGradient>


                    </TouchableOpacity>


                </View>
            )



        }

        else if (setting_name === "Tutorial") {

            if (Platform.OS == 'web') {
                return (
                    <View style={[styles.screen, { alignItems: 'center', justifyContent: 'center', gap: 20, height: 600 }]}>



                        <View style={[{ height: '70%', aspectRatio: 2 / 1.3, alignItems: 'center', justifyContent: 'center' }]}>
                            <Image style={{ height: '100%', width: '100%' }} source={screensWeb[indexWeb]} />
                        </View>

                        <View style={{ flexDirection: 'row', gap: 250, alignItems: 'center' }}>

                            {indexWeb > 0 && <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                style={{ backgroundColor: 'rgb(216, 75, 255)', borderRadius: 40, }}>

                                <TouchableOpacity
                                    style={{ padding: 20 }}
                                    onPress={() => { changeIndexWeb(-1) }}
                                >
                                    <MaterialCommunityIcons name={"undo"} size={40} color={'rgb(255, 255, 255)'} />

                                </TouchableOpacity>

                            </LinearGradient>}

                            <Text style={{ color: theme == 'crazy' ? 'white' : 'rgb(255, 3, 184)', fontSize: 30, fontWeight: 'bold' }}>Page {indexWeb + 1}</Text>

                            {indexWeb < screensWeb.length - 1 && <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                style={{ backgroundColor: 'rgb(216, 75, 255)', borderRadius: 40, }}>

                                <TouchableOpacity
                                    style={{ padding: 20 }}
                                    onPress={() => { changeIndexWeb(1) }}
                                >
                                    <MaterialCommunityIcons name={"redo"} size={40} color={'rgb(255, 255, 255)'} />

                                </TouchableOpacity>

                            </LinearGradient>}



                        </View>




                    </View>
                )
            }

            else {
                return (
                    <View style={[styles.screen, { alignItems: 'center', justifyContent: 'center', gap: 20, }]}>



                        <View style={{ height: '80%', aspectRatio: 1 / 2.1, alignItems: 'center', justifyContent: 'center', marginTop: -60 }}>
                            <Image style={{ height: '100%', width: '100%' }} source={screensMob[indexMob]} />
                        </View>

                        <View style={{ flexDirection: 'row', gap: 50, alignItems: 'center' }}>

                            {indexMob > 0 && <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                style={{ backgroundColor: 'rgb(216, 75, 255)', borderRadius: 40, }}>

                                <TouchableOpacity
                                    style={{ padding: 15 }}
                                    onPress={() => { changeIndexMob(-1) }}
                                >
                                    <MaterialCommunityIcons name={"undo"} size={25} color={'rgb(255, 255, 255)'} />

                                </TouchableOpacity>

                            </LinearGradient>}

                            <Text style={{ color: theme == 'crazy' ? 'white' : 'rgb(255, 3, 184)', fontSize: 25, fontWeight: 'bold' }}>Page {indexMob + 1}</Text>

                            {indexMob < screensMob.length - 1 && <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                style={{ backgroundColor: 'rgb(216, 75, 255)', borderRadius: 40, }}>

                                <TouchableOpacity
                                    style={{ padding: 15 }}
                                    onPress={() => { changeIndexMob(1) }}
                                >
                                    <MaterialCommunityIcons name={"redo"} size={25} color={'rgb(255, 255, 255)'} />

                                </TouchableOpacity>

                            </LinearGradient>}



                        </View>




                    </View>
                )
            }

        }


        else if (setting_name === "Delete House") {
            if (userType != 'Home Owner') {
                return (
                    <Text style={[styles.text, { fontSize: 20, color: 'rgb(255, 3, 184)', fontWeight: 'bold' }]} >No Access For Non Home Owners</Text>
                )
            }


            return (
                <View style={[{ marginTop: 80, width: '100%', alignItems: 'center', gap: 50, maxWidth: 600 }]}>


                    <Text style={[styles.text, { color: 'rgb(255, 3, 3)', textAlign: 'center' }]}>Are you sure you want to DELETE this house?</Text>
                    <Text style={[styles.text, { color: theme == 'crazy' ? 'white' : 'rgb(255, 3, 184)', textAlign: 'center', fontSize: 25, }]}>
                        All rooms and devices, along with your cute precious little pet will be DELETED!!
                    </Text>

                    <Text style={[styles.text, { color: theme == 'crazy' ? 'white' : 'rgb(255, 3, 184)', textAlign: 'center', fontSize: 25, }]}>
                        You will also be logged out.
                    </Text>



                    <TouchableOpacity onPress={() => {
                        handleDelHouse()
                    }}
                        style={{

                            alignItems: 'center', justifyContent: 'center',
                            backgroundColor: 'rgb(255, 0, 0)', borderRadius: 30,
                            width: '30%', marginTop: 30, minWidth: 300,
                        }}>

                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                            style={[{
                                width: '100%', alignItems: 'center', justifyContent: 'center',
                                backgroundColor: 'rgb(255, 0, 0)', borderRadius: 30,
                                padding: 30,
                            }]}>
                            <Text style={[styles.text, { fontSize: 30, color: 'white', fontWeight: 'bold', textAlign: 'center' }]} >DELETE HOUSE</Text>

                        </LinearGradient>
                    </TouchableOpacity>






                </View>
            )
        }

        else if (setting_name === "Terms & Conditions") {


            return (
                <View style={[{ marginTop: 80, width: '100%', alignItems: 'center', gap: 20, maxWidth: 1200 }]}>

                    <Text style={{
                        color: theme == 'dark' ? 'white' : 'black',
                        fontSize: 30, fontWeight: 'bold', alignSelf: 'flex-start'
                    }}>
                        1. Introduction
                    </Text>

                    <Text style={{
                        color: theme == 'dark' ? 'white' : 'black',
                        fontSize: 20, alignSelf: 'flex-start', marginLeft: 35
                    }}>
                        These Terms and Conditions govern your use of our products and services. By purchasing from us or using our website, you agree to abide by these terms.
                    </Text>

                    <Text style={{
                        color: theme == 'dark' ? 'white' : 'black',
                        fontSize: 30, fontWeight: 'bold', alignSelf: 'flex-start'
                    }}>
                        2. Product and Services {'\n'}
                    </Text>

                    <Text style={{
                        color: theme == 'dark' ? 'white' : 'black',
                        fontSize: 20, alignSelf: 'flex-start', marginLeft: 35
                    }}>
                        Our company provides sustainable home solutions, including but not limited to the Smart Home Dashboard System. All products and services are subject to availability and may vary based on region.
                    </Text>

                    <Text style={{
                        color: theme == 'dark' ? 'white' : 'black',
                        fontSize: 30, fontWeight: 'bold', alignSelf: 'flex-start'
                    }}>
                        3. Orders and Payments {'\n'}
                    </Text>

                    <Text style={{
                        color: theme == 'dark' ? 'white' : 'black',
                        fontSize: 20, alignSelf: 'flex-start', marginLeft: 35
                    }}>
                        All orders must be placed through contacting our authorized representatives. Payment must be made in full at the time of purchase unless otherwise agreed upon. We accept various payment methods, including credit/debit cards and online transactions.
                    </Text>

                    <Text style={{
                        color: theme == 'dark' ? 'white' : 'black',
                        fontSize: 30, fontWeight: 'bold', alignSelf: 'flex-start'
                    }}>
                        4. Installation and Warranty {'\n'}
                    </Text>

                    <Text style={{
                        color: theme == 'dark' ? 'white' : 'black',
                        fontSize: 20, alignSelf: 'flex-start', marginLeft: 35
                    }}>
                        Installation services, where applicable, will be carried out by our certified professionals. Products come with a limited warranty as specified at the time of purchase. Warranty coverage does not include damages due to improper use, unauthorized modifications, or external factors.
                    </Text>

                    <Text style={{
                        color: theme == 'dark' ? 'white' : 'black',
                        fontSize: 30, fontWeight: 'bold', alignSelf: 'flex-start'
                    }}>
                        5. Returns and Refunds {'\n'}
                    </Text>

                    <Text style={{
                        color: theme == 'dark' ? 'white' : 'black',
                        fontSize: 20, alignSelf: 'flex-start', marginLeft: 35
                    }}>
                        Customers may return products within 30 days of purchase, subject to inspection and approval. Refunds will be processed in accordance with our refund policy. Installation fees are non-refundable.
                    </Text>

                    <Text style={{
                        color: theme == 'dark' ? 'white' : 'black',
                        fontSize: 30, fontWeight: 'bold', alignSelf: 'flex-start'
                    }}>
                        6. Liability and Disclaimer {'\n'}
                    </Text>

                    <Text style={{
                        color: theme == 'dark' ? 'white' : 'black',
                        fontSize: 20, alignSelf: 'flex-start', marginLeft: 35
                    }}>
                        We strive to provide high-quality, sustainable solutions, but we do not guarantee specific energy savings or environmental benefits. We are not liable for any indirect, incidental, or consequential damages resulting from product use.
                    </Text>

                    <Text style={{
                        color: theme == 'dark' ? 'white' : 'black',
                        fontSize: 30, fontWeight: 'bold', alignSelf: 'flex-start'
                    }}>
                        7. Privacy Policy {'\n'}
                    </Text>

                    <Text style={{
                        color: theme == 'dark' ? 'white' : 'black',
                        fontSize: 20, alignSelf: 'flex-start', marginLeft: 35
                    }}>
                        Your personal data is protected under our Privacy Policy. We do not sell or share customer information with third parties without consent.
                    </Text>

                    <Text style={{
                        color: theme == 'dark' ? 'white' : 'black',
                        fontSize: 30, fontWeight: 'bold', alignSelf: 'flex-start'
                    }}>
                        8. Governing Law {'\n'}
                    </Text>

                    <Text style={{
                        color: theme == 'dark' ? 'white' : 'black',
                        fontSize: 20, alignSelf: 'flex-start', marginLeft: 35
                    }}>
                        These Terms and Conditions are governed by the laws of the UAE. Any disputes shall be resolved in the appropriate legal jurisdiction.
                    </Text>

                    <Text style={{
                        color: theme == 'dark' ? 'white' : 'black',
                        fontSize: 30, fontWeight: 'bold', alignSelf: 'flex-start'
                    }}>
                        9. Changes to Terms {'\n'}
                    </Text>

                    <Text style={{
                        color: theme == 'dark' ? 'white' : 'black',
                        fontSize: 20, alignSelf: 'flex-start', marginLeft: 35
                    }}>
                        We reserve the right to modify these Terms and Conditions at any time. Customers will be notified of significant changes. For further inquiries, please contact our authorized representatives.
                    </Text>


                </View>
            )
        }


        else {
            return (
                <View>
                    <Text style={{ color: 'white', fontSize: 70 }}>No Setting :(</Text>
                </View>

            )
        }
    }





    return (



        <View style={{ height: '100%', flex: 1 }}>
            <StatusBar style={theme == 'light' ? 'dark' : 'light'} />
            <View style={{ height: '100%', width: '100%', display: 'flex' }}>
                {(theme == 'crazy') && <LavaLampBackground />}
            </View>

            {/*Main Screen*/}
            <View style={[styles.screen, themeMode, { position: 'absolute', /*flexDirection: 'row'*/ }]}>

                <ScrollView style={[{ height: '100%' }]}>

                    <SafeAreaProvider style={[{ height: '100%', width: '100%' }]}>
                        <SafeAreaView style={[{ height: '100%', width: '100%' }]}>

                            <View style={[{ flexDirection: 'row', alignItems: 'center', marginTop: 20, width: '100%' }]}>

                                <TouchableOpacity style={[styles.backButton, { maxHeight: 100, position: 'absolute' }, Platform.OS != 'web' && { left: -30 }]} >
                                    <MaterialCommunityIcons name="chevron-left" color={theme == 'crazy' ? 'white' : 'rgb(255, 3, 184)'} size={50} onPress={() => navigation.goBack()} />
                                </TouchableOpacity>

                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: '2%', left: Platform.OS == 'web' ? '7%' : 40, width: '60%' }}>
                                    <MaterialCommunityIcons name={logo} color={theme == 'crazy' ? 'white' : 'rgb(255, 3, 184)'} size={Platform.OS == 'web' ? 60 : 40} />
                                    <Text style={[styles.text, { color: theme == 'crazy' ? 'white' : 'rgb(255, 3, 184)', fontSize: Platform.OS == 'web' ? 40 : 25 }]} >{setting_name}</Text>
                                </View>

                            </View>

                            <View style={[styles.mainContainer]}>




                                {returnSetting()}

                                <View style={{ height: 300 }}>

                                </View>




                            </View>

                            <View style={[{ height: 30 }]}></View>



                        </SafeAreaView>
                    </SafeAreaProvider>

                </ScrollView >



            </View>
        </View>


    );
}



const styles = StyleSheet.create({
    testBorder: {
        borderColor: 'red',
        borderWidth: 3,
    },
    mainContainer: {
        alignItems: 'center',     //horizontal
        //gap: 20,
        width: '100%',
    },
    flatlist: {
        //justifyContent: 'center',
        //alignItems: 'center',
        height: '100%',
        width: '100%',
        gap: '5%',
    },
    screen: {
        padding: 20,
        height: '100%',
        width: '100%',
        //display:'none',
    },

    text: {
        fontSize: 35,
        fontWeight: 'bold',
    },


    backButton: {
        //width:'10%',
        maxWidth: 80,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
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
