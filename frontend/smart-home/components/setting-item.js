import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, StyleSheet, Image, Dimensions, Platform, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from "../components/themes/theme";



//const EventItem = ({id, title, description}) => {
const SettingItem = ({ id, name, description, link }) => {

    const { theme, toggleTheme } = useTheme()

    const [themeMode, setTheme] = useState(styles.lightMode)




    const navigation = useNavigation()

    //Centering the bar depending on the window size dimensions
    const maxItemWidth = 1200;

    const [windowDimensions, setWindowDimensions] = useState(Dimensions.get("window"));
    console.log("Width: " + windowDimensions.width + ", Height: " + windowDimensions.height)

    const itemWidth = Math.min(0.9 * windowDimensions.width, maxItemWidth);
    const itemLeft = (windowDimensions.width - itemWidth) / 2;

    const inStyles = StyleSheet.create({
        resize: {
            width: Platform.OS == 'web' ? itemWidth : '90%',
            maxWidth: maxItemWidth,
            left: Platform.OS == 'web' ? itemLeft : '5%',
            //height: Platform.OS == 'web' ? 80 : '7%',
        }
    })


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

    if (name === "Theme") {
        return (
            <View style={[styles.card, inStyles.resize, {justifyContent:'space-between'}]}>
                <View style={[{ alignItems: 'center', flexDirection: 'row' }]}>
                    <Text style={styles.text} >{name}</Text>
                    <Ionicons name="caret-forward-outline" size={22} color={'rgba(33, 32, 32, 0.9)'} />
                </View>
                <View style={[styles.buttonContainer]}>
                    <TouchableOpacity style={[styles.buttonLight]} onPress={() => { toggleTheme("light") }} >
                        <Text style={styles.buttonText}>Light</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttonDark]} onPress={() => { toggleTheme("dark") }} >
                        <Text style={[styles.buttonText, {color: 'white'}]}>Dark</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttonCrazy]} onPress={() => { toggleTheme("crazy") }} >
                        <Text style={styles.buttonText}>𝓯𝓻𝓮𝓪𝓴𝔂</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    else if (name=="Logout") {
        return (
            <TouchableOpacity style={[styles.card, inStyles.resize]} onPress={() => {//console.log(`Opening setting card for ${id}`); 
                navigation.navigate(link);
            }}>
                <Text style={styles.text} >{name}</Text>
                <Ionicons name="caret-forward-outline" size={22} color={'rgba(33, 32, 32, 0.9)'} />
            </TouchableOpacity>
        )
    }

    else if (name=="") {
        return (
            <View style={{ height: 80 }}></View>
        )
    }

    else {


        return (
            <TouchableOpacity style={[styles.card, inStyles.resize]} onPress={() => {//console.log(`Opening setting card for ${id}`); 
                navigation.navigate(link);
            }}>
                <Text style={styles.text} >{name}</Text>
                <Ionicons name="caret-forward-outline" size={22} color={'rgba(33, 32, 32, 0.9)'} />
            </TouchableOpacity>
        );

    }
}


const styles = StyleSheet.create({
    testBorder: {
        borderColor: 'red',
        borderWidth: 3,
    },
    text: {
        fontSize: 35,
    },
    card: {
        //width:'100%',
        //maxWidth: 800,
        backgroundColor: 'rgb(246, 246, 246)',
        borderWidth: 1,
        borderColor: '#c5c5c5',
        borderRadius: 10,
        marginVertical: 5,
        paddingTop: 30,
        paddingBottom: 30,
        paddingLeft: 30,
        flexDirection: 'row',
        //justifyContent:'center',
        //justifyContent:'space-between',
        alignItems: 'center'

    },
    buttonContainer: {
        alignItems:'center',
        flexDirection:'row',
        gap:30,
        right:50,
    },
    buttonLight: {
        height:100,
        width:100,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'rgb(255, 255, 255)',
        borderWidth: 1,
        borderColor: 'rgb(167, 167, 167)',
        borderRadius: 10,

    },
    buttonDark: {
        height:100,
        width:100,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'rgb(83, 83, 83)',
        borderWidth: 1,
        borderColor: 'rgb(167, 167, 167)',
        borderRadius: 10,
    },
    buttonCrazy: {
        height:100,
        width:100,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'rgb(255, 100, 239)',
        borderWidth: 1,
        borderColor: 'rgb(167, 167, 167)',
        borderRadius: 10,
    },
    buttonText: {
        fontSize:20,
        fontFamily:'monospace'
    },
})


export default SettingItem;