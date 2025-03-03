import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Button, Text, StyleSheet } from 'react-native';

// Step 1: Create the screens
const ScreenA = ({ navigation }) => {
    return (
        <View>
            <Text>Screen A</Text>
            <Button title="Go to Screen B" onPress={() => navigation.navigate('ScreenB')} />
        </View>
    );
};

const ScreenB = ({ navigation }) => {
    return (
        <View>
            <Text>Screen B</Text>
            <Button title="Back to Screen A" onPress={() => navigation.goBack()} />
        </View>
    );
};

// Step 2: Create Stack Navigator
const Stack = createStackNavigator();

const DynamicStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="ScreenA">
            <Stack.Screen name="ScreenA" component={ScreenA} />
            <Stack.Screen name="ScreenB" component={ScreenB} />
        </Stack.Navigator>
    );
};

export default DynamicStackNavigator;