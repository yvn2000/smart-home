import { useNavigation, useRoute } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, CheckBox, NavigationContainer

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState } from "react";
import { useTheme } from "../components/themes/theme";
import Login from "../components/login/login";
import Register from "../components/login/register";
import { LoginStack } from "../navigation/stack";
import DynamicStackNavigator from '../components/stacktest';

import Loader from "../components/react-comps/loader";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { DUMMY_DATA } from "../data/dummy-device-data";

import 'react-native-gesture-handler';    //important for some reason
import { LinearGradient } from 'expo-linear-gradient';

const loginCardWidth = 60
const StackLogin = createStackNavigator();

export default function LoginScreen() {

    const navigation = useNavigation()

    const [rememberMe, setRememberMe] = useState(false)










    return (

        <View style={{ height: '100%', flex: 1 }}>
            <StatusBar style={'light'} />

            {/*Main Screen*/}

            <SafeAreaProvider style={[{ height: '100%', width: '100%' }]}>
                <SafeAreaView style={[{ height: '100%', width: '100%' }]}>



                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']} style={[styles.mainContainer]} >

                        <View style={[{ width: `${100 - loginCardWidth}%`, height: '100%', justifyContent: 'center', alignItems: 'center' }]}>
                            <View
                                style={{
                                    justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
                                    borderRadius: 500, width: 100, height: 100, position: 'absolute',
                                }}
                            >
                                <Text>LOGO?</Text>
                            </View>
                        </View>


                        <View style={[styles.loginCard]} >

                            
                            <LoginStack />


                            {
                            /*
                                <View style={[styles.shadow, styles.loginInnerCard]}>

                                    <View style={{ width: '100%', gap: '10%' }}>
                                        <Text style={{ left: '5%', fontWeight: 'bold' }}>Email</Text>
                                        <TextInput
                                            //style={[styles.shadow, styles.input]}
                                            placeholder="Enter your Email"
                                            placeholderTextColor={'rgb(156, 156, 156)'}
                                            style={styles.textInput}
                                        //value={email}
                                        //onChangeText={setEmail}
                                        />
                                    </View>

                                    <View style={{ width: '100%', gap: '10%' }}>
                                        <Text style={{ left: '5%', fontWeight: 'bold' }}>Password</Text>
                                        <TextInput
                                            //style={[styles.shadow, styles.input]}
                                            placeholder="Enter your Password"
                                            placeholderTextColor={'rgb(156, 156, 156)'}
                                            style={styles.textInput}

                                        //value={password}
                                        //onChangeText={setPassword}
                                        />
                                    </View>
                                    <View style={[{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }]}>
                                        <View style={{ flexDirection: 'row', marginLeft: '5%' }}>
                                            <CheckBox
                                                value={rememberMe}
                                                onValueChange={setRememberMe}
                                                style={{ alignSelf: 'center', }}
                                            />
                                            <Text> Remember Me</Text>
                                        </View>
                                        <TouchableOpacity style={{marginRight:'5%'}}>
                                            <Text style={[{ color: 'rgba(48, 164, 218, 0.9)' }]}>Forgot password?</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity style={styles.loginButton}>
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign In</Text>
                                    </TouchableOpacity>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text>Don't have an account?  </Text>
                                        <TouchableOpacity>
                                            <Text style={{ color: 'rgba(48, 164, 218, 0.9)' }}>Sign Up</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            */
                            }


                        </View>



                    </LinearGradient>




                    <TouchableOpacity
                        style={[styles.testBorder, { height: 100, width: 100, position: 'absolute', left: 0, alignItems: 'center', justifyContent: 'center' }]}
                        onPress={() => { navigation.navigate("Main") }}>
                        {/*Platform.OS=='web' && Platform.OS!='android' && <Loader height={40} width={45} />*/}
                        <Text style={{ position: 'absolute' }}>Login</Text>
                    </TouchableOpacity>







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
        //alignItems:'stretch',
        //gap: 20,
        width: '100%',
        height: '100%',
        //height:10000,
        backgroundColor: 'rgb(216, 75, 255)',
        paddingTop: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        //flex:1
    },
    loginCard: {
        height: '100%',
        width: `${loginCardWidth}%`,
        backgroundColor: 'rgb(245, 245, 245)',
        //backgroundColor: 'rgb(94, 94, 94)',
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        //alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    loginInnerCard: {
        backgroundColor: 'white',
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        borderRadius: 50,
        gap: 20,
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
