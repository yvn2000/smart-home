import { Text, View, StyleSheet } from "react-native";


const QrCodeScreen = () => {
    return (
        <View styles={styles.screen}>
            <Text>qr code scan</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    screen: {
        padding: 20,
    }
})


export default QrCodeScreen;


