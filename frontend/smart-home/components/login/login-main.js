import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, Alert, Dimensions, Image

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState } from "react";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Register from "./register";

import 'react-native-gesture-handler';    //important for some reason
import { LinearGradient } from 'expo-linear-gradient';

//import CheckBox from "@react-native-community/checkbox";
import { Checkbox } from 'expo-checkbox';
//import CheckBox from "react-native-community-checkbox";


import AsyncStorage from '@react-native-async-storage/async-storage';




export default function LoginMain() {

    const navigation = useNavigation()

    const [windowDimensions, setWindowDimensions] = useState(Dimensions.get("window"));

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions(Dimensions.get("window"));
        };

        if (Platform.OS == 'web') {
            Dimensions.addEventListener("change", handleResize);        //checks if size changed

            return () => {
                Dimensions.removeEventListener("change", handleResize);       //cleanup
            };

        }
    }, []);




    return (

        <View style={{ height: '100%', flex: 1 }}>
            <StatusBar style={'dark'} />

            {/*Main Screen*/}

            <SafeAreaProvider style={[{ height: '100%', width: '100%' }]}>
                <SafeAreaView style={[{ height: '100%', width: '100%' }]}>
                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                        style={[{
                            height: '100%', backgroundColor: 'rgb(216, 75, 255)', alignItems: 'center', justifyContent: 'center',

                        }]}
                    >

                        <Image style={{
                            position: 'absolute', height: '100%', width: '100%'
                        }}
                            source={require('../../assets/images/app/home.jpg')} />


                        <View style={[{
                            minWidth: 350, width: '80%', maxWidth: 550
                        }]}>



                            <View style={{
                                alignItems: 'center', padding: 50, width: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 50,
                                borderWidth: 3, borderColor: 'rgb(255, 3, 184)',
                            }}
                            >
                                <View style={{ alignItems: 'center', gap: 0.04 * windowDimensions.height }}>
                                    <Text style={{
                                        alignItems: 'center',
                                        fontWeight: 'bold', //fontSize: 0.02 * windowDimensions.width
                                        fontSize: Platform.OS == 'web' ? 30 : 30,
                                        color: 'rgb(255, 3, 184)',
                                    }}>
                                        Welcome to SmartHome!
                                    </Text>

                                    <View
                                        style={{
                                            justifyContent: 'center', alignItems: 'center',
                                            borderRadius: 500, width: 200, height: 200, //position: 'absolute',
                                        }}
                                    >
                                        <Image style={{
                                            width: 350, height: 350
                                        }} source={require('../../assets/images/app/app_logo.png')} />

                                    </View>

                                </View>

                                <View style={{ height: 40, }}></View>



                                <TouchableOpacity style={[{ width: '70%' }]} onPress={() => { navigation.navigate("LoginScreen") }}>
                                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                        style={{
                                            alignItems: 'center', justifyContent: 'center', width: '100%',
                                            backgroundColor: 'rgb(216, 75, 255)',
                                            borderRadius: 30, padding: 15,
                                        }}
                                    >
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Login</Text>
                                    </LinearGradient>

                                </TouchableOpacity>


                                <View style={{ width: '100%', padding: 20 }}>
                                    <View style={{ borderWidth: 1, borderRadius: 500, borderColor: 'rgb(195, 195, 195)', width: '100%' }} >
                                    </View>
                                </View>

                                <TouchableOpacity style={[{ width: '70%' }]} onPress={() => { navigation.navigate("Guest") }}>
                                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                        style={{
                                            alignItems: 'center', justifyContent: 'center', width: '100%',
                                            backgroundColor: 'rgb(216, 75, 255)',
                                            borderRadius: 30, padding: 15,
                                        }}
                                    >
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Guest Login</Text>
                                    </LinearGradient>

                                </TouchableOpacity>

                            </View>


                        </View>



                        <View style={{flexDirection:'row', bottom:0, position:'absolute'}}>

                            <Image style={{
                                width:150, height:150
                            }} source={require('../../assets/images/app/aura_logo.png')} />


                        </View>












                    </LinearGradient>


                </SafeAreaView>
            </SafeAreaProvider>
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
