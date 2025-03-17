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

import Modal from "react-native-modal";



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
    setLoading(false)
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

  if (loading) {
    return (
      <View>
        <Text>Not Loaded Yet</Text>
      </View>
    )
  }



  return (

    <View style={{ height: '100%' }}>
      <View style={{ height: '100%', width: '100%', display: 'flex' }}>
        <LavaLampBackground />
      </View>

      {/*Main Screen*/}
      <View style={[styles.screen, themeMode, { position: 'absolute', justifyContent: 'flex-start', flexDirection: 'row' }]}>


        <ScrollView style={[styles.flatlist, { marginTop: 50 }]} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>



          <TouchableOpacity style={[styles.card, styles.resize, {
            borderColor: theme == 'dark' ? 'rgb(26, 28, 77)' : '#c5c5c5',
            backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255, 255, 255)',
            gap: '3%'
          }]}
            onPress={() => {//console.log(`Opening setting card for ${id}`); 
              navigation.navigate("SettingsItem", {
                house_id: house_id,
                setting_name: "Account",
                logo: "account-circle-outline"
              });
            }}>
            <MaterialCommunityIcons name="account-circle-outline" color={theme == 'dark' ? 'white' : 'black'} size={50} />
            <Text style={[styles.text, { color: theme == 'dark' ? 'white' : 'black' }]} >Account</Text>
            <View style={{ position: 'absolute', right: 20 }}>
              <MaterialCommunityIcons name="chevron-right" size={42} color={theme == 'dark' ? 'white' : 'black'} />
            </View>


          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, styles.resize, {
            borderColor: theme == 'dark' ? 'rgb(26, 28, 77)' : '#c5c5c5',
            backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255, 255, 255)',
            gap: '3%'
          }]}
            onPress={() => {//console.log(`Opening setting card for ${id}`); 
              navigation.navigate("SettingsItem", {
                house_id: house_id,
                setting_name: "Social",
                logo: "share-variant-outline"
              });
            }}>
            <MaterialCommunityIcons name="share-variant-outline" color={theme == 'dark' ? 'white' : 'black'} size={50} />
            <Text style={[styles.text, { color: theme == 'dark' ? 'white' : 'black' }]} >Social</Text>
            <View style={{ position: 'absolute', right: 20 }}>
              <MaterialCommunityIcons name="chevron-right" size={42} color={theme == 'dark' ? 'white' : 'black'} />
            </View>


          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, styles.resize, {
            borderColor: theme == 'dark' ? 'rgb(26, 28, 77)' : '#c5c5c5',
            backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255, 255, 255)',
            gap: '3%'
          }]}
            onPress={() => {//console.log(`Opening setting card for ${id}`); 
              navigation.navigate("SettingsItem", {
                house_id: house_id,
                setting_name: "Language & Region",
                logo: "web",
              });
            }}>
            <MaterialCommunityIcons name="web" color={theme == 'dark' ? 'white' : 'black'} size={50} />
            <Text style={[styles.text, { color: theme == 'dark' ? 'white' : 'black' }]} >Language & Region</Text>
            <View style={{ position: 'absolute', right: 20 }}>
              <MaterialCommunityIcons name="chevron-right" size={42} color={theme == 'dark' ? 'white' : 'black'} />
            </View>
          </TouchableOpacity>


          <TouchableOpacity style={[styles.card, styles.resize, {
            borderColor: theme == 'dark' ? 'rgb(26, 28, 77)' : '#c5c5c5',
            backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255, 255, 255)',
            gap: '3%'
          }]}
            onPress={() => {//console.log(`Opening setting card for ${id}`); 
              navigation.navigate("SettingsItem", {
                house_id: house_id,
                setting_name: "Guest Codes",
                logo: "account-group",
              });
            }}>
            <MaterialCommunityIcons name="account-group" color={theme == 'dark' ? 'white' : 'black'} size={50} />
            <Text style={[styles.text, { color: theme == 'dark' ? 'white' : 'black' }]} >Guest Codes</Text>
            <View style={{ position: 'absolute', right: 20 }}>
              <MaterialCommunityIcons name="chevron-right" size={42} color={theme == 'dark' ? 'white' : 'black'} />
            </View>
          </TouchableOpacity>










          <View style={[styles.card, styles.resize, {
            justifyContent: 'space-between',
            borderColor: theme == 'dark' ? 'rgb(26, 28, 77)' : '#c5c5c5',
            backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255, 255, 255)'
          }]}>
            <View style={[{ alignItems: 'center', flexDirection: 'row', gap: '19%', }]}>
              <MaterialCommunityIcons name="theme-light-dark" color={theme == 'dark' ? 'white' : 'black'} size={50} />
              <Text style={[styles.text, { color: theme == 'dark' ? 'white' : 'black' }]} >Theme</Text>
            </View>
            <View style={[styles.buttonContainer,]}>
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

          <TouchableOpacity style={[styles.card, styles.resize, {
            borderColor: theme == 'dark' ? 'rgb(26, 28, 77)' : '#c5c5c5',
            backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255, 255, 255)',
            gap: '3%'
          }]}
            onPress={() => {//console.log(`Opening setting card for ${id}`); 
              navigation.navigate("SettingsItem", {
                house_id: house_id,
                setting_name: "Tutorial",
                logo: "school-outline",
              });
            }}>
            <MaterialCommunityIcons name="school-outline" color={theme == 'dark' ? 'white' : 'black'} size={50} />
            <Text style={[styles.text, { color: theme == 'dark' ? 'white' : 'black' }]} >Tutorial</Text>
            <View style={{ position: 'absolute', right: 20 }}>
              <MaterialCommunityIcons name="chevron-right" size={42} color={theme == 'dark' ? 'white' : 'black'} />
            </View>
          </TouchableOpacity>





          <TouchableOpacity style={[styles.card, styles.resize, {
            borderColor: theme == 'dark' ? 'rgb(26, 28, 77)' : '#c5c5c5',
            backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255, 255, 255)',
            gap: '3%'
          }]}
            onPress={() => {//console.log(`Opening setting card for ${id}`); 
              navigation.navigate("SettingsItem", {
                house_id: house_id,
                setting_name: "Terms & Conditions",
                logo: "file-document-edit-outline",
              });
            }}>
            <MaterialCommunityIcons name="file-document-edit-outline" color={theme == 'dark' ? 'white' : 'black'} size={50} />
            <Text style={[styles.text, { color: theme == 'dark' ? 'white' : 'black' }]} >Terms & Conditions?</Text>
            <View style={{ position: 'absolute', right: 20 }}>
              <MaterialCommunityIcons name="chevron-right" size={42} color={theme == 'dark' ? 'white' : 'black'} />
            </View>
          </TouchableOpacity>






          <TouchableOpacity style={[styles.card, styles.resize, {
            borderColor: theme == 'dark' ? 'rgb(26, 28, 77)' : '#c5c5c5',
            backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255, 255, 255)',
            gap: '3%',
          }]}
            onPress={() => {//console.log(`Opening setting card for ${id}`); 
              navigation.navigate("SettingsItem", {
                house_id: house_id,
                setting_name: "Delete House",
                logo: "delete",
              });
            }}>
            <MaterialCommunityIcons name="delete" color={theme == 'dark' ? 'white' : 'black'} size={50} />
            <Text style={[styles.text, { color: theme == 'dark' ? 'white' : 'black' }]} >Delete House</Text>
            <View style={{ position: 'absolute', right: 20 }}>
              <MaterialCommunityIcons name="chevron-right" size={42} color={theme == 'dark' ? 'white' : 'black'} />
            </View>
          </TouchableOpacity>



          <TouchableOpacity style={[styles.card, styles.resize, {
            borderColor: theme == 'dark' ? 'rgb(26, 28, 77)' : '#c5c5c5',
            backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255, 255, 255)',
            gap: '3%',
          }]}
            onPress={() => {//console.log(`Opening setting card for ${id}`);
              AsyncStorage.clear(); 
              navigation.navigate("LoginMainStack");
              
            }}>
            <MaterialCommunityIcons name="logout" color={theme == 'dark' ? 'white' : 'black'} size={50} />
            <Text style={[styles.text, { color: theme == 'dark' ? 'white' : 'black' }]} >Logout</Text>
          </TouchableOpacity>





          <View style={{ height: 300 }}>

          </View>








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
    backgroundColor: 'rgb(17, 18, 44)',
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
    backgroundColor: 'rgb(17, 18, 44)',
  },
  lightMode: {
    backgroundColor: "rgb(245, 238, 246)",
  },
  crazyMode: {
    backgroundColor: 'rgba(216, 83, 196, 0)'
  }
});
