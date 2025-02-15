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
import SettingItem from "../components/setting-item";

import Pet from "../components/cat";


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


  const settingsData = [
    { id: "1", name: "Account", description: "Set account preferences", link:"" },
    { id: "2", name: "Notifications", description: "Manage notifications", link:"" },
    { id: "3", name: "Privacy", description: "Privacy settings", link:"" },
    { id: "4", name: "Sample Page", description: "Sample Page", link:"Sample" },
    { id: "5", name: "Theme", description: "Set themes for the interface", link:"" },
    { id: "6", name: "Logout", description: "Logout", link:"" },
    { id: "1000", name: "", description: "", link:"LoginScreen" },
  ];




  return (

    <View style={{ height: '100%' }}>
      <View style={{ height: '100%', width: '100%', display: 'flex' }}>
        <LavaLampBackground />
      </View>

      {/*Main Screen*/}
      <View style={[styles.screen, themeMode, { position: 'absolute', justifyContent: 'flex-start', flexDirection: 'row' }]}>


        <View style={[styles.flatlist]}>
          <FlatList
            style={[{ height: '100%', width: '100%', padding:20 }]}
            contentContainerStyle={{ justifyContent: 'center', gap:30 }}
            data={settingsData}
            keyExtractor={(item) => item.id}

            renderItem={({ item }) => (
              <SettingItem
                id={item.id}
                name={item.name}
                description={item.description}
                link={item.link}
              />
            )}

          />

          



        </View>



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
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  screen: {
    padding: 20,
    height: '100%',
    width: '100%',
    //display:'none',
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
