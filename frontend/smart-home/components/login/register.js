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
import Modal from "react-native-modal";

import { API_BASE_URL } from "../../src/config";


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

    const [passCheck, setPassCheck] = useState([true, true, true])      //minLength, hasNumber, hasSpecialChar


    const [invalidFirst, setInvalidFirst] = useState(false);
    const [invalidLast, setInvalidLast] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidCheckPass, setInvalidCheckPass] = useState(false);
    const [invalidPass, setInvalidPass] = useState(false);
    const [invalidConPass, setInvalidConPass] = useState(false);


    const validatePassword = (password) => {
        const minLength = /.{8,}/; // At least 8 characters
        const hasNumber = /\d/; // At least one digit (0-9)
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/; // At least one special character

        var check1 = true
        var check2 = true
        var check3 = true

        if (!minLength.test(password)) {
            //return "Password must be at least 8 characters long.";
            check1 = false
        }
        if (!hasNumber.test(password)) {
            //return "Password must contain at least one number.";
            check2 = false
        }
        if (!hasSpecialChar.test(password)) {
            //return "Password must contain at least one special character.";
            check3 = false
        }

        return [check1, check2, check3];
    };


    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return false;
        }

        return true;
    };

    const handleRegister = async () => {

        //const registerUrl = Platform.OS == 'web' ? "http://127.0.0.1:8000/api/register/" : "http://10.0.2.2:8000/api/register/"
        const registerUrl = `${API_BASE_URL}/api/register/`

        let checkFail = false;

        if (firstName == '') {
            setInvalidFirst(true)
            checkFail = true
        }
        else {
            setInvalidFirst(false)
        }


        if (lastName == '') {
            setInvalidLast(true)
            checkFail = true
        }
        else {
            setInvalidLast(false)
        }


        let emailValid = validateEmail(email)

        if (emailValid != true) {
            checkFail = true
            setInvalidEmail(true)
        }
        else {
            setInvalidEmail(false)
        }



        let passValid = validatePassword(password)

        //if (passValid!=[true, true, true]) {
        if ((passValid[0] != true) || (passValid[1] != true) || (passValid[2] != true)) {
            console.log(passValid)
            checkFail = true
            setInvalidCheckPass(true)
            setPassCheck([passValid[0], passValid[1], passValid[2]])
        }
        else {
            setInvalidCheckPass(false)
            setPassCheck([true, true, true])
        }



        if (password !== confirmPassword) {
            //console.log("Passwords do not match")
            setInvalidPass(true);
            setInvalidConPass(true);
            //Alert.alert("Error", "Passwords do not match");
            checkFail = true
        }
        else {
            setInvalidPass(false);
            setInvalidConPass(false);
        }



        if (checkFail) {
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
            //Alert.alert("Success", "Registration complete!");
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('')
            setAccountType('Home Owner')
            navigation.navigate("Login");
        } else {
            //Alert.alert("Error", data.error || "Something went wrong.");
        }
    };


    const [isVis, setVis] = useState(false);







    return (


        <View style={[styles.loginCard]} >
            <View style={[styles.shadow, styles.loginInnerCard]}>

                <View style={[styles.container]}>

                    <View style={{ flexDirection: 'row', gap: 10 }}>

                        <TouchableOpacity
                            style={{
                                backgroundColor: accountType == 'Home Owner' ? 'rgb(255, 3, 184)' : 'white',
                                alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10,
                                borderWidth: accountType == 'Home Owner' ? 0 : 1, borderColor: 'gray',

                            }}
                            onPress={() => setAccountType("Home Owner")}
                        >
                            <Text style={{ fontWeight: 'bold', color: accountType == 'Home Owner' ? 'white' : 'black' }}>
                                Home Owner
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                backgroundColor: accountType == 'Landlord' ? 'rgb(255, 3, 184)' : 'white',
                                alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10,
                                borderWidth: accountType == 'Landlord' ? 0 : 1, borderColor: 'gray',

                            }}
                            onPress={() => setAccountType("Landlord")}
                        >
                            <Text style={{ fontWeight: 'bold', color: accountType == 'Landlord' ? 'white' : 'black' }}>
                                Landlord
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <View style={{ flexDirection: 'row', gap: '10%', justifyContent: 'center', width: '100%' }}>

                        <View style={{ width: '45%', gap: 5 }}>
                            <Text style={{ left: '2%', fontWeight: 'bold' }}>First Name</Text>
                            <TextInput
                                //style={[styles.shadow, styles.input]}
                                placeholder="Enter your first name"
                                placeholderTextColor={invalidFirst ? 'red' : 'rgb(156, 156, 156)'}
                                style={[styles.textInput, { width: '100%' }, invalidFirst && { borderColor: 'red' }]}
                                onChangeText={setFirstName}
                            //value={email}
                            //onChangeText={setEmail}
                            />
                            {invalidFirst && <Text style={{ left: '2%', color: 'red', fontSize: 12 }}>Invalid First Name!</Text>}
                        </View>

                        <View style={{ width: '45%', gap: 5 }}>
                            <Text style={{ left: '2%', fontWeight: 'bold' }}>Last Name</Text>
                            <TextInput
                                //style={[styles.shadow, styles.input]}
                                placeholder="Enter your last name"
                                placeholderTextColor={invalidLast ? 'red' : 'rgb(156, 156, 156)'}
                                style={[styles.textInput, { width: '100%' }, invalidLast && { borderColor: 'red' }]}
                                onChangeText={setLastName}
                            //value={email}
                            //onChangeText={setEmail}
                            />
                            {invalidLast && <Text style={{ left: '2%', color: 'red', fontSize: 12 }}>Invalid Last Name!</Text>}
                        </View>

                    </View>

                    <View style={{ width: '100%', gap: 5, marginTop: (Platform.OS == 'web') ? 0 : 0 }}>
                        <Text style={{ left: '2%', fontWeight: 'bold' }}>Email</Text>
                        <TextInput
                            //style={[styles.shadow, styles.input]}
                            placeholder="Enter your Email"
                            placeholderTextColor={invalidEmail ? 'red' : 'rgb(156, 156, 156)'}
                            style={[styles.textInput, invalidEmail && { borderColor: 'red' }]}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        //value={email}
                        //onChangeText={setEmail}
                        />
                        {invalidEmail && <Text style={{ left: '2%', color: 'red', fontSize: 12 }}>Invalid Email!</Text>}
                    </View>

                    <View style={{ width: '100%', gap: 5, marginTop: (Platform.OS == 'web') ? 0 : 0 }}>
                        <Text style={{ left: '2%', fontWeight: 'bold' }}>Password</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TextInput
                                //style={[styles.shadow, styles.input]}
                                placeholder="Enter your Password"
                                placeholderTextColor={(invalidCheckPass || invalidPass) ? 'red' : 'rgb(156, 156, 156)'}
                                style={[styles.textInput, { width: '90%' }, (invalidCheckPass || invalidPass) && { borderColor: 'red' }]}
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
                        {!passCheck[0] && <Text style={{ left: '2%', color: 'red', fontSize: 12 }}>Must have minimum length of 8!</Text>}
                        {!passCheck[1] && <Text style={{ left: '2%', color: 'red', fontSize: 12 }}>Must have atleast one number!</Text>}
                        {!passCheck[2] && <Text style={{ left: '2%', color: 'red', fontSize: 12 }}>Must have atleast one special character!</Text>}
                        {invalidPass && <Text style={{ left: '2%', color: 'red', fontSize: 12 }}>Passwords do not match!</Text>}
                    </View>
                    <View style={{ width: '100%', gap: 5, marginTop: (Platform.OS == 'web') ? 0 : 0 }}>
                        <Text style={{ left: '2%', fontWeight: 'bold' }}>Confirm Password</Text>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TextInput
                                //style={[styles.shadow, styles.input]}
                                placeholder="Re-enter your Password"
                                placeholderTextColor={invalidConPass ? 'red' : 'rgb(156, 156, 156)'}
                                style={[styles.textInput, { width: '90%' }, invalidConPass && { borderColor: 'red' }]}
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
                        {invalidConPass && <Text style={{ left: '2%', color: 'red', fontSize: 12 }}>Passwords do not match!</Text>}
                    </View>
                    <View style={[{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: (Platform.OS == 'web') ? 0 : 0 }]}>
                        <View style={{ flexDirection: 'row', marginLeft: '5%' }}>
                            <Checkbox
                                value={rememberMe}
                                onValueChange={setRememberMe}
                                style={{ alignSelf: 'center', }}
                            />
                            <Text> Remember Me</Text>
                        </View>

                        <TouchableOpacity style={{ right: '10%' }}
                            onPress={() => { setVis(true) }}
                        >
                            <Text style={{ color: 'rgba(48, 164, 218, 0.9)', fontWeight:'bold' }}>Terms & Conditions</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Register</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>Already have an account?  </Text>
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Text style={{ color: 'rgba(48, 164, 218, 0.9)', fontWeight:'bold' }}>Log In</Text>
                        </TouchableOpacity>
                    </View>

                    <Modal
                        isVisible={isVis}
                        onBackdropPress={() => setVis(false)} // Close when tapping outside
                        animationIn="fadeInDown"
                        animationOut="fadeOutUp"
                        backdropOpacity={0.5}
                        style={[{}]}
                    >

                        <View style={[{
                            maxWidth: 800, alignSelf: 'flex-end', position: 'absolute', backgroundColor: 'white',
                            padding: 30, borderRadius: 50, maxHeight: 500, alignItems: 'center', width:'95%'

                        }]}>

                            <Text style={{ color: 'rgb(255, 3, 184)', fontSize: 20, fontWeight: 'bold' }}>Terms & Conditions</Text>
                            
                            <ScrollView style={[{ width: '100%', gap: 20, maxWidth: 1200 }]}
                                contentContainerStyle={{ alignItems: 'center' }}
                            >

                                <Text style={{
                                    fontSize: 20, fontWeight: 'bold', alignSelf: 'flex-start'
                                }}>
                                    1. Introduction
                                </Text>

                                <Text style={{
                                    fontSize: 15, alignSelf: 'flex-start', marginLeft: 35
                                }}>
                                    These Terms and Conditions govern your use of our products and services. By purchasing from us or using our website, you agree to abide by these terms.
                                </Text>

                                <Text style={{
                                    fontSize: 20, fontWeight: 'bold', alignSelf: 'flex-start'
                                }}>
                                    2. Product and Services {'\n'}
                                </Text>

                                <Text style={{
                                    fontSize: 15, alignSelf: 'flex-start', marginLeft: 35
                                }}>
                                    Our company provides sustainable home solutions, including but not limited to the Smart Home Dashboard System. All products and services are subject to availability and may vary based on region.
                                </Text>

                                <Text style={{
                                    fontSize: 20, fontWeight: 'bold', alignSelf: 'flex-start'
                                }}>
                                    3. Orders and Payments {'\n'}
                                </Text>

                                <Text style={{
                                    fontSize: 15, alignSelf: 'flex-start', marginLeft: 35
                                }}>
                                    All orders must be placed through contacting our authorized representatives. Payment must be made in full at the time of purchase unless otherwise agreed upon. We accept various payment methods, including credit/debit cards and online transactions.
                                </Text>

                                <Text style={{
                                    fontSize: 20, fontWeight: 'bold', alignSelf: 'flex-start'
                                }}>
                                    4. Installation and Warranty {'\n'}
                                </Text>

                                <Text style={{
                                    fontSize: 15, alignSelf: 'flex-start', marginLeft: 35
                                }}>
                                    Installation services, where applicable, will be carried out by our certified professionals. Products come with a limited warranty as specified at the time of purchase. Warranty coverage does not include damages due to improper use, unauthorized modifications, or external factors.
                                </Text>

                                <Text style={{
                                    fontSize: 20, fontWeight: 'bold', alignSelf: 'flex-start'
                                }}>
                                    5. Returns and Refunds {'\n'}
                                </Text>

                                <Text style={{
                                    fontSize: 15, alignSelf: 'flex-start', marginLeft: 35
                                }}>
                                    Customers may return products within 30 days of purchase, subject to inspection and approval. Refunds will be processed in accordance with our refund policy. Installation fees are non-refundable.
                                </Text>

                                <Text style={{
                                    fontSize: 20, fontWeight: 'bold', alignSelf: 'flex-start'
                                }}>
                                    6. Liability and Disclaimer {'\n'}
                                </Text>

                                <Text style={{
                                    fontSize: 15, alignSelf: 'flex-start', marginLeft: 35
                                }}>
                                    We strive to provide high-quality, sustainable solutions, but we do not guarantee specific energy savings or environmental benefits. We are not liable for any indirect, incidental, or consequential damages resulting from product use.
                                </Text>

                                <Text style={{
                                    fontSize: 20, fontWeight: 'bold', alignSelf: 'flex-start'
                                }}>
                                    7. Privacy Policy {'\n'}
                                </Text>

                                <Text style={{
                                    fontSize: 15, alignSelf: 'flex-start', marginLeft: 35
                                }}>
                                    Your personal data is protected under our Privacy Policy. We do not sell or share customer information with third parties without consent.
                                </Text>

                                <Text style={{
                                    fontSize: 20, fontWeight: 'bold', alignSelf: 'flex-start'
                                }}>
                                    8. Governing Law {'\n'}
                                </Text>

                                <Text style={{
                                    fontSize: 15, alignSelf: 'flex-start', marginLeft: 35
                                }}>
                                    These Terms and Conditions are governed by the laws of the UAE. Any disputes shall be resolved in the appropriate legal jurisdiction.
                                </Text>

                                <Text style={{
                                    fontSize: 20, fontWeight: 'bold', alignSelf: 'flex-start'
                                }}>
                                    9. Changes to Terms {'\n'}
                                </Text>

                                <Text style={{
                                    fontSize: 15, alignSelf: 'flex-start', marginLeft: 35
                                }}>
                                    We reserve the right to modify these Terms and Conditions at any time. Customers will be notified of significant changes. For further inquiries, please contact our authorized representatives.
                                </Text>


                            </ScrollView>


                            <TouchableOpacity
                                style={{
                                    backgroundColor: 'rgb(216, 75, 255)', marginTop: 40,
                                    alignItems: 'center', justifyContent: 'center', paddingLeft: 20, paddingRight: 20, padding: 10,
                                    borderRadius: 20,
                                }}
                                onPress={() => {
                                    setVis(false)
                                }}
                            >
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Close</Text>
                            </TouchableOpacity>




                        </View>


                    </Modal>

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
        width: '100%',
        maxHeight: 45,
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        width: '100%',
        gap: Platform.OS == 'web' ? '5%' : '3%'
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
