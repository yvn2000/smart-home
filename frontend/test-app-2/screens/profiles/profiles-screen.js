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

  return (
    <View>
        <Text>profiles screen</Text>
        <Button title="some profile" onPress={()=>navigation.navigate('Profile', {profileId: 1})} />
    </View>
    
  );
}


