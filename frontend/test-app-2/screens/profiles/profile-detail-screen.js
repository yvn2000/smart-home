import { useNavigation, useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useState, useLayoutEffect } from 'react';
import { Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
  TouchableOpacity 

} from "react-native";
import { HeaderBackButton } from "@react-navigation/elements";

export default function ProfileDetailScreen() {
  
  const route = useRoute()
  const navigation = useNavigation()

  const { profileId } = route.params

  useLayoutEffect(()=> {
    navigation.setOptions({
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
        <Text style={{fontSize: 20}}>Profile id: {profileId}</Text>
    </View>
    
  );
}



const styles = StyleSheet.create({
  screen: {
    padding: 20,
  }
});
