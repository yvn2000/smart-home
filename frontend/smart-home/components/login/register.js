import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, Alert

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState } from "react";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Checkbox } from 'expo-checkbox';


import 'react-native-gesture-handler';    //important for some reason


const loginCardWidth = 60

export default function Register() {

    const navigation = useNavigation()

    const [rememberMe, setRememberMe] = useState(false)

    const [showPassword, setPassVisibility] = useState(false)

    const togglePassVisibility = () => {
        setPassVisibility(!showPassword)
    };


    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState('Home Owner');



    const handleRegister = async () => {

        const registerUrl = Platform.OS == 'web' ? "http://127.0.0.1:8000/api/register/" : "http://10.0.2.2:8000/api/register/"

        if (password !== confirmPassword) {
            console.log("Passwords do not match")
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        const response = await fetch(registerUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
                confirm_password: confirmPassword,
                account_type: accountType,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            Alert.alert("Success", "Registration complete!");
            navigation.navigate("Login");
        } else {
            Alert.alert("Error", data.error || "Something went wrong.");
        }
    };










    return (


        <View style={[styles.loginCard]} >
            <View style={[styles.shadow, styles.loginInnerCard]}>

                <View style={[styles.container]}>

                    <View style={{ flexDirection: 'row' }}>

                        <Button title="Home Owner" onPress={() => setAccountType("Home Owner")} />
                        <Button title="Landlord" onPress={() => setAccountType("Landlord")} />

                    </View>

                    <View style={{ flexDirection: 'row', gap: '10%', justifyContent: 'center', width: '100%' }}>

                        <View style={{ width: '45%', gap: '10%' }}>
                            <Text style={{ left: '2%', fontWeight: 'bold' }}>First Name</Text>
                            <TextInput
                                //style={[styles.shadow, styles.input]}
                                placeholder="Enter your first name"
                                placeholderTextColor={'rgb(156, 156, 156)'}
                                style={[styles.textInput, { width: '100%' }]}
                                onChangeText={setFirstName}
                            //value={email}
                            //onChangeText={setEmail}
                            />
                        </View>

                        <View style={{ width: '45%', gap: '10%' }}>
                            <Text style={{ left: '2%', fontWeight: 'bold' }}>Last Name</Text>
                            <TextInput
                                //style={[styles.shadow, styles.input]}
                                placeholder="Enter your last name"
                                placeholderTextColor={'rgb(156, 156, 156)'}
                                style={styles.textInput}
                                onChangeText={setLastName}
                            //value={email}
                            //onChangeText={setEmail}
                            />
                        </View>

                    </View>

                    <View style={{ width: '100%', gap: '10%', marginTop: (Platform.OS == 'web') ? 0 : -40 }}>
                        <Text style={{ left: '2%', fontWeight: 'bold' }}>Email</Text>
                        <TextInput
                            //style={[styles.shadow, styles.input]}
                            placeholder="Enter your Email"
                            placeholderTextColor={'rgb(156, 156, 156)'}
                            style={styles.textInput}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        //value={email}
                        //onChangeText={setEmail}
                        />
                    </View>

                    <View style={{ width: '100%', gap: '10%', marginTop: (Platform.OS == 'web') ? 0 : -40 }}>
                        <Text style={{ left: '2%', fontWeight: 'bold' }}>Password</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TextInput
                                //style={[styles.shadow, styles.input]}
                                placeholder="Enter your Password"
                                placeholderTextColor={'rgb(156, 156, 156)'}
                                style={[styles.textInput, { width: '90%' }]}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}


                            //value={password}
                            //onChangeText={setPassword}
                            />
                            <MaterialCommunityIcons
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={30}
                                color="#aaa"
                                style={{ alignSelf: 'center' }}
                                onPress={togglePassVisibility}
                            />
                        </View>
                    </View>
                    <View style={{ width: '100%', gap: '10%', marginTop: (Platform.OS == 'web') ? 0 : -40 }}>
                        <Text style={{ left: '2%', fontWeight: 'bold' }}>Confirm Password</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TextInput
                                //style={[styles.shadow, styles.input]}
                                placeholder="Re-enter your Password"
                                placeholderTextColor={'rgb(156, 156, 156)'}
                                style={[styles.textInput, { width: '90%' }]}
                                secureTextEntry={!showPassword}
                                onChangeText={setConfirmPassword}

                            //value={password}
                            //onChangeText={setPassword}
                            />
                            <MaterialCommunityIcons
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={30}
                                color="#aaa"
                                style={{ alignSelf: 'center' }}
                                onPress={togglePassVisibility}
                            />
                        </View>
                    </View>
                    <View style={[{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: (Platform.OS == 'web') ? 0 : -40 }]}>
                        <View style={{ flexDirection: 'row', marginLeft: '5%' }}>
                            <Checkbox
                                value={rememberMe}
                                onValueChange={setRememberMe}
                                style={{ alignSelf: 'center', }}
                            />
                            <Text> Remember Me</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Register</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>Already have an account?  </Text>
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Text style={{ color: 'rgba(48, 164, 218, 0.9)' }}>Log In</Text>
                        </TouchableOpacity>
                    </View>

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
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderBottomLeftRadius: Platform.OS == 'web' ? 50 : 0,
        borderBottomRightRadius: Platform.OS == 'web' ? 50 : 0,
        gap: '5%',
        //position: 'absolute',
        //alignSelf: 'center',

    },
    loginButton: {
        backgroundColor: 'rgb(216, 75, 255)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
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
        gap: '5%'
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
