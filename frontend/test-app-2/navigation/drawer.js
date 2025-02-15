import React from 'react';
import { createDrawerNavigator, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import HomeScreen from '../screens/home-screen';
import EventDetailScreen from '../screens/event-detail-screen';
import { HomeStack, ProfileStack, PetTestStack2, SettingsStack } from './stack';
import { Image, SafeAreaView, View, StyleSheet, Linking } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

//Checkout react navigation documentation for more ideas like options navigations bar at the bottom

const Drawer = createDrawerNavigator();


export const MyDrawer = () => {

    const theme = "light"


    return (
        <Drawer.Navigator 
            drawerContent={(props) => { //props are the different drawer stacks: homestack, profilesstack
                return (
                    <SafeAreaView style={{flex:1, paddingTop: 20, backgroundColor:'#99f6e4'}}>
                        <View style={{justifyContent: 'center', alignItems:'center', height:140}}>
                            <Image
                                style={{width: 100, resizeMode: 'contain'}}
                                source={require("../assets/images/adaptive-icon.png")}
                            />
                        </View>
                        <DrawerItemList {...props} />
                        <DrawerItem
                            label="More Info"
                            onPress={()=> Linking.openURL('https://www.google.com')}
                            icon={()=> (
                                <Ionicons name="information" size={22} />
                            )}
                            
                        />
                    </SafeAreaView>
                );
            }}
            screenOptions={{headerShown:false}}
        >
            

            <Drawer.Screen name="HomeStack" component={HomeStack}
                options={{ title: 'Home', drawerIcon: ()=><Ionicons name="home" size={22} /> }} />

            <Drawer.Screen name="ProfilesStack" component={ProfileStack} options={{
                title: 'Profile', drawerIcon: ()=><MaterialCommunityIcons name="face-man-profile" size={22} /> }} />

            <Drawer.Screen name="PetTestStack2" component={PetTestStack2} options={{
                title: 'Pet2', drawerIcon: ()=><Ionicons name="home" size={22} /> }} />

            <Drawer.Screen name="SettingsStack" component={SettingsStack}
                options={{ title: 'Settings', drawerIcon: ()=><Ionicons name="settings-outline" size={22} /> }} />

            
            
            {/* <Drawer.Screen name="Home" component={HomeScreen} /> */}
            {/* <Drawer.Screen name="Event" component={EventDetailScreen} /> */}
        </Drawer.Navigator>
    )

}

const styles = StyleSheet.create({
  
});







