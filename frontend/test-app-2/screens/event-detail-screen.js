import { useNavigation, useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useState, useLayoutEffect } from 'react';
import { Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
  TouchableOpacity 

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { HeaderBackButton } from "@react-navigation/elements";

export default function EventDetailScreen() {
  
  const route = useRoute()
  const navigation = useNavigation()

  const { eventId, name, description, date } = route.params

  useLayoutEffect(()=> {
    navigation.setOptions({
      headerTitle: name,
      headerLeft: () => (
        <HeaderBackButton
          tintColor="white"
          onPress={()=> navigation.goBack()}
        />
      )
    })
  }, [])

  return (

    <View style={styles.screen}>
        <Text style={{fontSize: 20}}>This is the event detail screen for {eventId}</Text>
        <Text style={{fontSize: 14}}>{name}</Text>
        <Text style={{fontSize: 14}}>{description}</Text>
        <Text style={{fontSize: 14}}>Scheduled on {date}</Text>
    </View>
    
  );
}



const styles = StyleSheet.create({
  screen: {
    padding: 20,
  }
});
