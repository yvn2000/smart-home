import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { MyDrawer } from '../navigation/drawer';
//import { EventDetailStack } from '../navigation/stack';

//Ctrl + K + C to comment out highlighted code


import 'react-native-gesture-handler';    //important for some reason

import { StatusBar } from "expo-status-bar";

import { ThemeProvider } from '../components/themes/theme';

export default function Index() {
  /*Notes

  */

  return (

    <NavigationIndependentTree>
      <ThemeProvider>
        <NavigationContainer>
          {/* <HomeStack /> */}
          <MyDrawer />

          {/* wifi and battery icons */}
          <StatusBar style='light' />
        </NavigationContainer>
      </ThemeProvider>
    </NavigationIndependentTree>

  );
    

  
}



