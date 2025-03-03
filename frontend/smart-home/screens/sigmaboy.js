import { Text, View, StyleSheet, Platform, ScrollView } from "react-native";


import { StatusBar } from "expo-status-bar";

import { useEffect, useState } from "react";
import { useTheme } from "../components/themes/theme";

import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import LavaLampBackground from "../components/themes/lava-lamp-bg";

export default function Sigma() {

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

    <View style={[{ height: '100%', flex: 1 }]}>
      <View style={{ height: '100%', width: '100%', display: 'flex' }}>
        <LavaLampBackground />
      </View>
      <View style={[{ position: 'absolute', height: '100%' }, themeMode]}>

        <ScrollView style={[{ height: '100%' }]} /*contentContainerStyle={{padding:20}}*/>

          <View style={[]}>
            <Text style={{ fontSize: 206 }}>
              [Intro: Betsy & Maria Yankovskaya]
              Sigma, sigma boy, sigma boy, sigma boy
              Every girl wants to dance with you
              Sigma, sigma boy, sigma boy, sigma boy
              I'm the kind of person you'll need a year to win over
              ...
              [Rest of the lyrics]
            </Text>
          </View>
        </ScrollView>
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
  }
});






