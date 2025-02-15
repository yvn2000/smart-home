import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, StyleSheet, Image } from "react-native";


//const EventItem = ({id, title, description}) => {
const EventItem = ({id, name, description, qrCode, date}) => {

    const navigation = useNavigation()

    return (
        <TouchableOpacity style={styles.card} onPress={()=>{console.log(`Opening card for ${id}`); 
                                                            navigation.navigate("Event", {eventId: id, name, description, date});}}>
            <Text>{name}</Text>
            <Text>{description}</Text>
            <Image 
                style={{width: 100, height: 100}}
                source={{uri: qrCode}}
            />
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#c5c5c5',
        borderRadius: 10,
        marginVertical: 5,
        padding: 30,
    }
})


export default EventItem;