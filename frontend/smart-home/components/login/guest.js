import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, CheckBox

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import React, { useEffect, useState } from "react";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Register from "./register";

import 'react-native-gesture-handler';    //important for some reason

import AsyncStorage from '@react-native-async-storage/async-storage';


const loginCardWidth = 60

export default function Guest() {

    const navigation = useNavigation()

    const [house_id, setHouseId] = useState(0)

    const [focusedIndex, setFocusedIndex] = useState(null);

    const inputRefs = [
        React.createRef(),
        React.createRef(),
        React.createRef(),
        React.createRef(),
    ];


    const [code, setCode] = useState(['', '', '', '']);

    const handleChange = (index, value) => {
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 3) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleVerify = () => {
        console.log('Code:', code.join(''));
    };
    

    const apiUrl = Platform.OS === "web" ? "http://127.0.0.1:8000" : "http://10.0.2.2:8000";

    // ✅ Verify Guest Code
    const handleGuestLogin = async () => {
        if (!house_id.trim() || (!code.join(''))) {
            console.log("Error", "Please enter both House ID and Guest Code.");
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/houses/${house_id}/list-guests/`);
            const data = await response.json();

            if (response.ok) {
                const guestCodes = data.guest_codes.map(item => item.code); // Extract codes

                if (guestCodes.includes(code.join(''))) {
                    console.log("Success", "Login successful!");
                    //navigation.navigate("GuestDashboard", { house_id, code }); // Navigate to Guest Home
                    await AsyncStorage.setItem('guestCode', code.join(''));
                    await AsyncStorage.setItem('deviceAccess', true);
                    await AsyncStorage.setItem('statsAccess', false);
                    await AsyncStorage.setItem('petAccess', true);
                    navigation.navigate("Main", {
                        statsAccess:false, 
                        deviceAccess:true,
                        petAccess:true,
                        house: "house",
                    })
                } else {
                    console.log("Error", "Invalid Guest Code for this house.");
                    console.log()
                }
            } else {
                console.log("Error", "House not found or failed to fetch guest codes.");
            }
        } catch (error) {
            console.error("Guest login error:", error);
            //Alert.alert("Error", "Network issue. Please try again.");
        }
    };









    return (


        <View style={[styles.loginCard]} >
            <View style={[styles.shadow, styles.loginInnerCard]}>

                <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { navigation.goBack() }}>
                    <MaterialCommunityIcons name="chevron-left" color={'rgb(216, 75, 255)'} size={30} />
                </TouchableOpacity>


                <View style={styles.container}>
                    <Text style={styles.subtitle}>House ID</Text>
                    <TextInput
                        style={[
                            styles.input,
                            { borderColor: 'rgb(175, 175, 175)', } // Conditional border color
                        ]}
                        selectionColor={'rgb(216, 75, 255)'}
                        value={house_id}
                        onChangeText={(text) => setHouseId(text)}
                        //maxLength={1}
                        keyboardType="numeric"
                    />
                    <View style={{ height: '10%' }}></View>
                    <Text style={styles.subtitle}>Guest Access Code</Text>
                    <Text style={styles.message}>
                        Enter the access code from the Home Owner
                    </Text>
                    <View style={styles.inputs}>
                        {code.map((value, index) => (
                            <TextInput
                                key={index}
                                style={[
                                    styles.input,
                                    { borderColor: focusedIndex === index ? 'rgb(216, 75, 255)' : 'rgb(175, 175, 175)', } // Conditional border color
                                ]}
                                selectionColor={'rgb(216, 75, 255)'}
                                value={value}
                                onChangeText={(text) => handleChange(index, text)}
                                maxLength={1}
                                keyboardType="numeric"
                                ref={inputRefs[index]}
                            />
                        ))}
                    </View>
                    <TouchableOpacity style={[styles.loginButton, { marginTop: 24, }]} onPress={()=>{handleVerify(); handleGuestLogin();}}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Enter</Text>
                    </TouchableOpacity>
                </View>

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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    message: {
        color: '#a3a3a3',
        fontSize: 14,
        marginTop: 4,
        textAlign: 'center',
    },
    inputs: {
        flexDirection: 'row',
        marginTop: 10,
        //alignItems:'center',
        justifyContent: 'center',
        //height:'100%'
    },
    input: {
        width: '8%',
        height: 60,
        //height:'80%',
        textAlign: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: '#d2d2d2',
        marginHorizontal: 5,
    },
    button: {
        marginTop: 24,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: 'royalblue',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
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
