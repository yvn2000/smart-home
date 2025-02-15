import { useNavigation, useRoute } from "@react-navigation/native";
import EventList from "../components/events/event-list";

import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
  TouchableOpacity 

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState } from "react";
import { useTheme } from "../components/themes/theme";
import LavaLampBackground from "../components/themes/lava-lamp-bg";

import Pet from "../components/cat";


export default function SettingsScreen() {

  const navigation = useNavigation()

  const { theme, toggleTheme } = useTheme()

  const [themeMode, setTheme] = useState(styles.lightMode)
  
  useEffect(() => {
    if (theme=='dark') {
      setTheme(styles.darkMode)
    }
    else if (theme=='light') {
      setTheme(styles.lightMode)
    }
    else if (theme=='crazy') {
      setTheme(styles.crazyMode)
    }
  }, [theme])



  
  return (

        <View style={{height:'100%'}}>
            <View style={{height:'100%', width:'100%', display:'flex'}}>
                <LavaLampBackground />
            </View>
            <View style={[styles.screen, themeMode, {position:'absolute', justifyContent:'flex-start', flexDirection:'row'}]}>

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
              <View style={{height:500, width:500}}>
                <Pet />
              </View>

            </View>
        </View>
        
    
  );
}



const styles = StyleSheet.create({
  screen: {
    padding: 20,
    height:'100%',
    width: '100%',
    //display:'none',
  },
  darkMode: {
    backgroundColor: "#4A4A4A",
  },
  lightMode: {
    backgroundColor: "#FFFFFF",
  },
  crazyMode: {
    backgroundColor: 'rgba(216, 83, 196, 0)'
  }
});
