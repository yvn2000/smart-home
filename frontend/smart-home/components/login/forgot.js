import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, CheckBox

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState } from "react";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Register from "./register";

import 'react-native-gesture-handler';    //important for some reason
import { API_BASE_URL } from "../../src/config";

const loginCardWidth = 60

export default function Forgot() {

    const navigation = useNavigation()



    const [email, setEmail] = useState("");

    const [verifyFail, setVerifyFail] = useState(false)



    const verify = () => {
        if (email === "") {
            setVerifyFail(true)
            console.log("Credentials empty")
        }
        else {
            setVerifyFail(false)
            console.log("Credentials Verified: " + email)
        }
    }










    return (


        <View style={[styles.loginCard]} >
            <View style={[styles.shadow, styles.loginInnerCard]}>

                <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { navigation.goBack() }}>
                    <MaterialCommunityIcons name="chevron-left" color={'rgb(216, 75, 255)'} size={30} />
                </TouchableOpacity>

                <View style={[styles.container, {gap:'3%'}]}>


                    <View style={{ width: '100%', gap: '10%' }}>
                        <Text style={{ left: '2%', fontWeight: 'bold' }}>Email</Text>
                        <TextInput
                            //style={[styles.shadow, styles.input]}
                            placeholder="Enter your Email"
                            placeholderTextColor={(verifyFail && email === "") ? 'red' : 'rgb(156, 156, 156)'}
                            style={[styles.textInput, (verifyFail && email === "") && { borderColor: 'red', borderWidth: 1 }]}
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <Text>We will send you an email that will contain instructions to reset your password.</Text>
                    <Text />

                    <TouchableOpacity style={styles.loginButton} onPress={() => { verify() }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Send Password Reset Email</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>Don't have an account?  </Text>
                        <TouchableOpacity onPress={() => { navigation.navigate("Register") }}>
                            <Text style={{ color: 'rgba(48, 164, 218, 0.9)' }}>Sign Up</Text>
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
