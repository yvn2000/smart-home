import { View, Text, FlatList, RefreshControl } from "react-native";
import { DUMMY_DATA } from "../../data/dummy";
import EventItem from "./event-item";


const EventList = ({data, onRefresh}) => {
    const renderItem = ({item}) => {
        //return <View style={{padding:40}}><Text>{item.title}</Text></View>
        //return <EventItem id={item.id} title={item.title} description={item.description} />
        return <EventItem id={item.id} name={item.name} description={item.description} qrCode={item.qr_code} date={item.date}  />
    }
    return (
        <View>
            <Text>event list</Text>
            <FlatList
                //data={DUMMY_DATA}
                data={data}
                keyExtractor={item=> item.id}
                renderItem={renderItem}
                refreshControl = {
                    <RefreshControl
                        refreshing={false}
                        //onRefresh={()=> console.log('refreshing...')}
                        onRefresh={onRefresh}
                    />
                }
            />
        </View>
    );
}

export default EventList