import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, Alert

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState } from "react";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Register from "./register";

import 'react-native-gesture-handler';    //important for some reason

//import CheckBox from "@react-native-community/checkbox";
import { Checkbox } from 'expo-checkbox';
//import CheckBox from "react-native-community-checkbox";


import AsyncStorage from '@react-native-async-storage/async-storage';

console.log(Checkbox)


const loginCardWidth = 60

export default function Login() {

    const navigation = useNavigation()

    const [rememberMe, setRememberMe] = useState(false)


    const [showPassword, setPassVisibility] = useState(false)

    const togglePassVisibility = () => {
        setPassVisibility(!showPassword)
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [verifyFail, setVerifyFail] = useState(false)



    const verify = () => {
        if (email === "") {
            setVerifyFail(true)
            //console.log("Credentials empty")
        }
        else if (password === "") {
            setVerifyFail(true)
            //console.log("Credentials empty")
        }
        else {
            setVerifyFail(false)
            //console.log("Credentials Verified: "+email + " " + password)
        }
    }



    const handleLogin = async () => {

        if (!email || !password) {
            //Alert.alert("Error", "Please enter email and password.");
            return;
        }


        const loginUrl = Platform.OS == 'web' ? "http://127.0.0.1:8000/api/login/" : "http://10.0.2.2:8000/api/login/"
        //const loginUrl = Platform.OS == 'web' ? "http://10.6.141.213:8000/api/login/" : "http://10.6.141.213:8000/api/login/"

        try {
            const response = await fetch(loginUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                //body: JSON.stringify({ email: email, password: password })
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (response.ok) {
                setVerifyFail(false)
                console.log("Logged In")
                //Alert.alert("Success", "Login successful!");
                //console.log(data)
                //console.log("Token:", data.access_token);
                console.log("Sending Access token: " + data.access_token)
                console.log("Sending Refresh token: " + data.refresh_token)
                await AsyncStorage.setItem('access_token', data.access_token);
                await AsyncStorage.setItem('refresh_token', data.refresh_token);
                await AsyncStorage.setItem('deviceAccess', data.has_device_access.toString());
                await AsyncStorage.setItem('statsAccess', data.has_stats_access.toString());
                await AsyncStorage.setItem('petAccess', data.has_pet_access.toString());
                await AsyncStorage.setItem('first_name', data.user_name);
                await AsyncStorage.setItem('last_name', data.last_name);
                await AsyncStorage.setItem('user_type', data.user_type);
                await AsyncStorage.setItem('guestCode', "null");
                //console.log(data.isNew);
                navigation.navigate("Houses", {
                    isNew: data.isNew,
                })
            } else {
                console.log("Login else:");
                setVerifyFail(true)
            }
        } catch (error) {
            setVerifyFail(true)
            console.log("Login error:", error);
            //Alert.alert("Error", "Something went wrong.");
        }

    };










    return (


        <View style={[styles.loginCard]} >
            <View style={[styles.shadow, styles.loginInnerCard]}>

                <View style={[{ width: '100%', gap: '10%', marginTop: (Platform.OS == 'web') ? 0 : 10 }]}>
                    <Text style={{ left: '2%', fontWeight: 'bold' }}>Email</Text>
                    <TextInput
                        //style={[styles.shadow, styles.input]}
                        placeholder="Enter your Email"
                        placeholderTextColor={(verifyFail || email === "") ? 'red' : 'rgb(156, 156, 156)'}
                        style={[styles.textInput, (verifyFail || email === "") && { borderColor: 'red', borderWidth: 1 }]}
                        value={email}
                        onChangeText={setEmail}
                    />
                    {verifyFail && <Text style={{ left: '2%', color:'red' }}>Email Address and Password do not match any account!</Text>}
                </View>

                <View style={{ width: '100%', gap: '10%', marginTop: (Platform.OS == 'web') ? 0 : -20 }}>
                    <Text style={{ left: '2%', fontWeight: 'bold' }}>Password</Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TextInput
                            //style={[styles.shadow, styles.input]}
                            placeholder="Enter your Password"
                            placeholderTextColor={(verifyFail || password === "") ? 'red' : 'rgb(156, 156, 156)'}
                            style={[styles.textInput, (verifyFail || password === "") && { borderColor: 'red', borderWidth: 1 }, { width: '90%' }]}
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <MaterialCommunityIcons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={30}
                            color="#aaa"
                            style={{ alignSelf: 'center' }}
                            onPress={togglePassVisibility}
                        />
                    </View>
                    {verifyFail && <Text style={{ left: '2%', color:'red' }}>Email Address and Password do not match any account!</Text>}
                </View>
                <View style={[{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: (Platform.OS == 'web') ? 0 : -20 }]}>
                    <View style={{ flexDirection: 'row', marginLeft: '5%' }}>

                        <Checkbox
                            value={rememberMe}
                            //onValueChange={setRememberMe}
                            onValueChange={(newValue) => setRememberMe(newValue)}
                            style={{ alignSelf: 'center', }}
                        />

                        <Text> Remember Me</Text>
                    </View>
                    <TouchableOpacity style={{ marginRight: '5%' }} onPress={() => { navigation.navigate("Forgot") }}>
                        <Text style={[{ color: 'rgba(48, 164, 218, 0.9)' }]}>Forgot password?</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={() => { verify(); handleLogin() }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Login</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Don't have an account?  </Text>
                    <TouchableOpacity onPress={() => { navigation.navigate("Register") }}>
                        <Text style={{ color: 'rgba(48, 164, 218, 0.9)' }}>Sign Up</Text>
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
        borderTopRightRadius: Platform.OS == 'web' ? 0 : 50,
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
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
        paddingTop: 100,
        paddingBottom: 100,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderBottomLeftRadius: Platform.OS == 'web' ? 50 : 0,
        borderBottomRightRadius: Platform.OS == 'web' ? 50 : 0,
        gap: '5%',
        //position: 'absolute',
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
