import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
  Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
  TouchableOpacity, FlatList

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState } from "react";
import { useTheme } from "../components/themes/theme";
import LavaLampBackground from "../components/themes/lava-lamp-bg";


import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import AsyncStorage from '@react-native-async-storage/async-storage';



export default function SettingsScreen() {

  const navigation = useNavigation()

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




  const [house_id, setHouseId] = useState(0)
  const [loading, setLoading] = useState(true);


  const getHouse = async () => {
    setHouseId(await AsyncStorage.getItem("house_id"))
  }

  useEffect(() => {
    getHouse()
    fetchGuestCodes();
  }, [house_id])



  const [guestCodes, setGuestCodes] = useState([]);
  const apiUrl = Platform.OS === "web" ? "http://127.0.0.1:8000" : "http://10.0.2.2:8000";


  const fetchGuestCodes = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/houses/${house_id}/list-guests/`);
      const data = await response.json();

      if (response.ok) {
        setGuestCodes(data.guest_codes.map(item => item.code)); // Extract only codes
      } else {
        //Alert.alert("Error", "Failed to fetch guest codes.");
      }
    } catch (error) {
      console.error("Error fetching guest codes:", error);
    }
  };


  const generateUniqueGuestCode = () => {
    let newCode;
    do {
      newCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit number
    } while (guestCodes.includes(newCode)); // Ensure it's unique
    return newCode;
  };

  
  const addGuestCode = async () => {
    await fetchGuestCodes(); // Refresh guest codes first
    const newCode = generateUniqueGuestCode();

    try {
      const response = await fetch(`${apiUrl}/api/houses/${house_id}/add-guest/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: newCode }),
      });

      const data = await response.json();
      if (response.ok) {
        //Alert.alert("Success", `Guest code ${newCode} added!`);
        setGuestCodes(prev => [...prev, newCode]); // Update state
      } else {
        //Alert.alert("Error", data.error || "Failed to add guest code.");
      }
    } catch (error) {
      console.error("Error adding guest code:", error);
    }
  };

  /*
  useEffect(() => {
      fetchGuestCodes();
  }, []);
  */




  return (

    <View style={{ height: '100%' }}>
      <View style={{ height: '100%', width: '100%', display: 'flex' }}>
        <LavaLampBackground />
      </View>

      {/*Main Screen*/}
      <View style={[styles.screen, themeMode, { position: 'absolute', justifyContent: 'flex-start', flexDirection: 'row' }]}>


        <ScrollView style={[styles.flatlist]} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>



          <TouchableOpacity style={[styles.card, styles.resize]} onPress={() => {//console.log(`Opening setting card for ${id}`); 
            //navigation.navigate(link);
          }}>
            <Text style={styles.text} >Account</Text>
            <Ionicons name="caret-forward-outline" size={22} color={'rgba(33, 32, 32, 0.9)'} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, styles.resize]} onPress={() => {//console.log(`Opening setting card for ${id}`); 
            //navigation.navigate(link);
          }}>
            <Text style={styles.text} >Privacy</Text>
            <Ionicons name="caret-forward-outline" size={22} color={'rgba(33, 32, 32, 0.9)'} />
          </TouchableOpacity>

          <View style={[styles.card, styles.resize, { justifyContent: 'space-between' }]}>
            <View style={[{ alignItems: 'center', flexDirection: 'row' }]}>
              <Text style={styles.text} >Theme</Text>
              <Ionicons name="caret-forward-outline" size={22} color={'rgba(33, 32, 32, 0.9)'} />
            </View>
            <View style={[styles.buttonContainer]}>
              <TouchableOpacity style={[styles.buttonLight]} onPress={() => { toggleTheme("light") }} >
                <Text style={styles.buttonText}>Light</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.buttonDark]} onPress={() => { toggleTheme("dark") }} >
                <Text style={[styles.buttonText, { color: 'white' }]}>Dark</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.buttonCrazy]} onPress={() => { toggleTheme("crazy") }} >
                <Text style={styles.buttonText}>𝓯𝓻𝓮𝓪𝓴𝔂</Text>
              </TouchableOpacity>
            </View>
          </View>


          <View style={[styles.card, {gap:'40%'}]}>
            <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
              style={[{
                alignItems: 'center', flexDirection: 'row',
                backgroundColor: 'rgb(216, 75, 255)', borderRadius: 30,
                padding: 30,
              }]}>
                <TouchableOpacity onPress={()=>{addGuestCode()}}
                  style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
                <Text style={[styles.text, { fontSize: 20, color: 'white', fontWeight: 'bold' }]} >Generate Guest Codes</Text>
                </TouchableOpacity>
              
            </LinearGradient>


            <ScrollView style={{ maxHeight: 200, marginBottom: 10 }}>
                {guestCodes.length > 0 ? (
                    guestCodes.map((code, index) => (
                        <Text key={index} style={{ fontSize: 16, padding: 5 }}>
                            {code}
                        </Text>
                    ))
                ) : (
                    <Text>No guest codes found.</Text>
                )}
            </ScrollView>



          </View>




          <TouchableOpacity style={[styles.card, styles.resize]} onPress={() => {//console.log(`Opening setting card for ${id}`); 
            navigation.navigate("LoginScreen");
          }}>
            <Text style={styles.text} >Logout</Text>
            <Ionicons name="caret-forward-outline" size={22} color={'rgba(33, 32, 32, 0.9)'} />
          </TouchableOpacity>





        </ScrollView>



        {/* 
              <View style={{borderColor:'red', borderWidth:5}}>
                <View style={{height:100, width:100, backgroundColor: 'red', padding:10}}>
                  <Text>{theme}</Text>
                </View>

                <TouchableOpacity style={[{height:100, width:100, backgroundColor:'green'}]} onPress={() => {toggleTheme("light")}} >
                  <Text>Light</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[{height:100, width:100, backgroundColor:'green'}]} onPress={() => {toggleTheme("dark")}} >
                  <Text>Dark</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[{height:100, width:100, backgroundColor:'green'}]} onPress={() => {toggleTheme("crazy")}} >
                  <Text>Crazy</Text>
                </TouchableOpacity>
              </View>
              */}


      </View>

    </View>


  );
}



const styles = StyleSheet.create({
  testBorder: {
    borderColor: 'red',
    borderWidth: 3,
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
  },
  card: {
    width: '90%',
    maxWidth: 1000,
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
    alignItems: 'center',

  },
  buttonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 30,
    right: 50,
  },
  buttonLight: {
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(255, 255, 255)',
    borderWidth: 1,
    borderColor: 'rgb(167, 167, 167)',
    borderRadius: 10,

  },
  buttonDark: {
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(83, 83, 83)',
    borderWidth: 1,
    borderColor: 'rgb(167, 167, 167)',
    borderRadius: 10,
  },
  buttonCrazy: {
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(255, 100, 239)',
    borderWidth: 1,
    borderColor: 'rgb(167, 167, 167)',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'monospace'
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
