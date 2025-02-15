import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, //CheckBox

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState } from "react";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Register from "./register";

import 'react-native-gesture-handler';    //important for some reason

//import CheckBox from "@react-native-community/checkbox";
import { Checkbox } from 'expo-checkbox';
//import CheckBox from "react-native-community-checkbox";

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
        if (email==="") {
            setVerifyFail(true)
            console.log("Credentials empty")
        }
        else if (password==="") {
            setVerifyFail(true)
            console.log("Credentials empty")
        }
        else {
            setVerifyFail(false)
            console.log("Credentials Verified: "+email + " " + password)
        }
    }










    return (


        <View style={[styles.loginCard]} >
            <View style={[styles.shadow, styles.loginInnerCard]}>

                <View style={{ width: '100%', gap: '10%' }}>
                    <Text style={{ left: '2%', fontWeight: 'bold' }}>Email</Text>
                    <TextInput
                        //style={[styles.shadow, styles.input]}
                        placeholder="Enter your Email"
                        placeholderTextColor={(verifyFail && email==="") ? 'red' : 'rgb(156, 156, 156)'}
                        style={[styles.textInput, (verifyFail && email==="") && {borderColor:'red', borderWidth:1}]}
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={{ width: '100%', gap: '10%' }}>
                    <Text style={{ left: '2%', fontWeight: 'bold' }}>Password</Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TextInput
                            //style={[styles.shadow, styles.input]}
                            placeholder="Enter your Password"
                            placeholderTextColor={(verifyFail && password==="") ? 'red' : 'rgb(156, 156, 156)'}
                            style={[styles.textInput, (verifyFail && password==="") && {borderColor:'red', borderWidth:1}]}
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
                </View>
                <View style={[{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }]}>
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

                <TouchableOpacity style={styles.loginButton} onPress={() => {verify()}}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Login</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                    <Text>Don't have an account?  </Text>
                    <TouchableOpacity onPress={() => { navigation.navigate("Register") }}>
                        <Text style={{ color: 'rgba(48, 164, 218, 0.9)' }}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <View style={{width:'100%', padding:20}}>
                <View style={{borderWidth:1,borderRadius:500, borderColor:'rgb(195, 195, 195)', width:'100%'}} />
                </View>

                <TouchableOpacity style={[styles.loginButton, {width:'50%'}]}  onPress={() => { navigation.navigate("Guest") }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Guest Login</Text>
                </TouchableOpacity>

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
        height: '100%',
        //height:10000,
        backgroundColor: 'rgb(216, 75, 255)',
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row'
    },
    loginCard: {
        height: '100%',
        //width: `${loginCardWidth}%`,
        width: '100%',
        backgroundColor: 'rgb(245, 245, 245)',
        //backgroundColor: 'rgb(1, 1, 1)',
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginInnerCard: {
        backgroundColor: 'white',
        width: '50%',
        //width:900,
        //height:900,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        borderRadius: 50,
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
