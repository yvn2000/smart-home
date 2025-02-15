import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home-screen';
import QrCodeScreen from '../screens/qr-code-screen';
import EventDetailScreen from '../screens/event-detail-screen';
import ProfilesScreen from '../screens/profiles/profiles-screen';
import ProfileDetailScreen from '../screens/profiles/profile-detail-screen';
import { navOptions } from './options';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();


export const HomeTabs = () => {

    //Title will make it appear as Home in the app, variable name is HomeTabs
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,         //show 'home' next to home icon
                tabBarStyle: {
                    backgroundColor: 'black'
                },
                tabBarActiveTintColor: 'yellow',
                //tabBarInactiveTintColor: "red"
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    if (route.name === 'HomeTabs') {
                        iconName = focused ? 'home' : 'home-outline'
                    }
                    else if (route.name === 'QrCode') {
                        iconName = focused ? 'qr-code' : 'qr-code-outline'
                    }

                    return <Ionicons name={iconName} size={focused ? 28: size} color={color} />
                }
            })}
            
        >
            <Tab.Screen name="HomeTabs" options={{title: 'Home'}} component={HomeScreen}/>
            <Tab.Screen name="QrCode" component={QrCodeScreen} />
        </Tab.Navigator>
    )

}







