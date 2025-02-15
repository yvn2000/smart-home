import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import DynamicStackNavigator from '../components/stacktest';

const ParentScreen = () => {
    return (
        <View style={styles.container}>
            {/* Static content of the screen */}
            <View style={styles.staticContent}>
                <Button title="Some Static Button 1" onPress={() => console.log('Button 1 pressed')} />
                <Button title="Some Static Button 2" onPress={() => console.log('Button 2 pressed')} />
            </View>

            {/* Dynamic content that will change */}
            <View style={styles.dynamicContent}>
                <DynamicStackNavigator />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    staticContent: {
        padding: 20,
        backgroundColor: 'gray',
    },
    dynamicContent: {
        //alignItems:'flex-end',
        flex: 1,
        flexDirection:'row'
    },
});

export default ParentScreen;