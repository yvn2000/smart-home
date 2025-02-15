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


const loginCardWidth = 60

export default function Guest() {

    const navigation = useNavigation()

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









    return (


        <View style={[styles.loginCard]} >
            <View style={[styles.shadow, styles.loginInnerCard]}>

                <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { navigation.goBack() }}>
                    <MaterialCommunityIcons name="chevron-left" color={'rgb(216, 75, 255)'} size={30} />
                </TouchableOpacity>


                <View style={styles.container}>
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
                    <TouchableOpacity style={[styles.loginButton, {marginTop: 24,}]} onPress={handleVerify}>
                        <Text style={{color:'white', fontWeight:'bold'}}>Enter</Text>
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
        justifyContent:'center',
        //height:'100%'
    },
    input: {
        width: '8%',
        height:60,
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
