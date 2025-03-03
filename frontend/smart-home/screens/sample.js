import { Text, View, StyleSheet, Platform, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";


import { StatusBar } from "expo-status-bar";

import { useEffect, useState } from "react";
import { useTheme } from "../components/themes/theme";

import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import LavaLampBackground from "../components/themes/lava-lamp-bg";

export default function Sample() {

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

  /*
  <View style={[styles.main, themeMode]}>
          <Text>Edit app/index.tsx to edit this screen.</Text>
          <Text>Platform: {Platform.OS}.</Text>
          
        </View>
  */

  /*
  <LavaLampBackground />
   */

  return (

    <View style={[{ flex: 1 }]}>
      <View style={{ height: '100%', width: '100%', zIndex: -1, display: 'flex' }}>
        <LavaLampBackground />
      </View>
      <View style={[{ position: 'absolute', height: '100%', width: '100%' }, themeMode]}>
        <View style={[styles.main, themeMode]}>

          {/* Idk why, but the style for text is necessary else the last word doesnt show up on android, idk */}
          <Text style={{ width: '100%' }}>Edit app/index.tsx to edit this screen.</Text>
          <Text style={{ width: '100%' }}>Platform: {Platform.OS}.</Text>
          <TouchableOpacity style={[styles.testBorder, { height: 100, width: 100 }]} onPress={() => { navigation.navigate("LoginScreen") }}>
            <Text>Logout</Text>
          </TouchableOpacity>


        </View>

      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
    alignItems: "center",
    height: '100%',
    position: 'absolute',
    width: '100%',
    padding: 20,
  },
  darkMode: {
    backgroundColor: "#4A4A4A",
  },
  lightMode: {
    backgroundColor: "rgb(245, 238, 246)",
  },
  crazyMode: {
    backgroundColor: 'rgba(216, 83, 196, 0)'
  },
  testBorder: {
    borderColor: 'red',
    borderWidth: 3,
  },
});






