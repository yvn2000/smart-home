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

export default function HomeScreen() {

  const navigation = useNavigation()

  const [data, setData] = useState([])
  const [refresh, setRefresh] = useState(false)   //initial is false

  const handleRefresh = () => {
    console.log('refreshing...')
    setRefresh(prevState => !prevState)
  }

  useEffect(()=> {
    fetchData()
  }, [refresh])       //when refresh changes, data gets fetched again

  const fetchData = async() => {

    const response = await fetch('http://127.0.0.1:8000/api/events/')     //Works for PC
    //const response = await fetch('http://10.0.2.2:8000/api/events/')      //Works for Android Emulator

    const data = await response.json()

    setData(data)
  }


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

      <View style={[styles.screen, themeMode, {position:'absolute'}]}>

        <View>

          <EventList data={data} onRefresh={handleRefresh} />

          <View style={{height:100, width:100, backgroundColor: 'red', padding:10}}>

            <Text>{theme}</Text>

          </View>

        </View>

      </View>

    </View>
    
    
  );
}



const styles = StyleSheet.create({
  screen: {
    padding: 20,
    //backgroundColor: "#4A4A4A",
    height: '100%',
    width: '100%',
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
