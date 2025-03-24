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




export default function UserDeleteScreen() {

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

    const { refreshingToken, deleteAccount } = route.params

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
                                    <MaterialCommunityIcons name={"delete"} color={"red"} size={Platform.OS == 'web' ? 60 : 40} />
                                    <Text style={[styles.text, { color: "red", fontSize: Platform.OS == 'web' ? 40 : 25 }]} >Delete Account</Text>
                                </View>

                            </View>

                            <View style={[styles.mainContainer]}>

                                <View style={{height:100}}></View>
<View style={{alignItems:'center', maxWidth:1000}}>
                                <Text style={{
                                    color: theme=='dark' ? 'white' : 'black',
                                    fontSize:Platform.OS == 'web' ? 40 : 25,
                                    fontWeight:'bold', textAlign:'center',
                                }}>
                                    Are you sure you want to delete your account?
                                </Text>

                                <Text style={{
                                    color: theme=='dark' ? 'white' : 'black',
                                    fontSize:Platform.OS == 'web' ? 40 : 25,
                                    fontWeight:'bold', marginTop:40, textAlign:'center',
                                }}>
                                    All houses, rooms and devices associated with this account will be deleted.
                                </Text>

                                <Text style={{
                                    color: 'red',
                                    fontSize:Platform.OS == 'web' ? 40 : 25,
                                    fontWeight:'bold', marginTop:40, textAlign:'center',
                                }}>
                                    This action cannot be reversed.
                                </Text>

                                </View>


                                <TouchableOpacity
                                    style={{
                                        width: '90%', alignItems: 'center', justifyContent: 'center',
                                        maxWidth: 500, borderRadius: 30, marginTop:40
                                    }}

                                    onPress={() => {
                                        deleteAccount();
                                        AsyncStorage.clear(); 
                                        navigation.navigate("LoginMainStack");
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














