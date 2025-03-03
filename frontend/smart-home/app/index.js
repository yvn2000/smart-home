import { Text, View } from "react-native";

import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { CentralTab } from '../navigation/tabs';
import { MainStack } from "../navigation/stack";
//import { EventDetailStack } from '../navigation/stack';

//Ctrl + K + C to comment out highlighted code


import 'react-native-gesture-handler';    //important for some reason

import { StatusBar } from "expo-status-bar";

import { ThemeProvider } from '../components/themes/theme';
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

export default function Index() {

  /*
  <NavigationIndependentTree>
      <ThemeProvider>
        <NavigationContainer>
          <MyDrawer />
          <StatusBar style='light' />
        </NavigationContainer>
      </ThemeProvider>
    </NavigationIndependentTree>
  */

  /*
  <NavigationIndependentTree>
    <SafeAreaProvider>
      <ThemeProvider>
        <ScrollView>
          <NavigationContainer>
            <CentralTab />
          <StatusBar style='light' />
        </NavigationContainer>
        </ScrollView>
      </ThemeProvider>
    </SafeAreaProvider>
  </NavigationIndependentTree>
  */


  return (
    
    <NavigationIndependentTree>
      <SafeAreaProvider>
        <ThemeProvider>
          
          <NavigationContainer>
              {/* <CentralTab /> */}
              <MainStack />
            <StatusBar style='light' />
          </NavigationContainer>
          
        </ThemeProvider>
      </SafeAreaProvider>
    </NavigationIndependentTree>
    
  );
}






