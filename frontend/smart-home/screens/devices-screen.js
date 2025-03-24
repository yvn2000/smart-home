import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "../components/themes/theme";

import LavaLampBackground from "../components/themes/lava-lamp-bg";
import Pet from "../components/cat";
import TempDial from "../components/dial";
import DevicesGrid from "../components/devices-grid";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { DUMMY_DATA } from "../data/dummy-device-data";
import { LinearGradient } from 'expo-linear-gradient';

import Modal from "react-native-modal";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE_URL } from "../src/config";


export default function DevicesScreen() {

    const navigation = useNavigation()

    const route = useRoute(); // Get the current route object

    const { theme, toggleTheme } = useTheme()

    const [themeMode, setTheme] = useState(styles.lightMode)

    useEffect(() => {
        if (theme == 'dark') {
            setTheme(styles.darkMode)
        }
        else if (theme == 'light') {
            setTheme(styles.lightMode)
        }
        else if (theme == 'crazy') {
            setTheme(styles.crazyMode)
        }
    }, [theme])





    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };









    const [modeStates, setModeState] = useState({
        cool: true,
        hot: false,
        energy: false,
    })
    const isChosen = (status) => {

        if (status == "cool") {
            if (modeStates.cool == true) {
                return styles.chosenButton
            }
            return styles.notChosenButton
        }
        else if (status == "hot") {
            if (modeStates.hot == true) {
                return styles.chosenButton
            }
            return styles.notChosenButton
        }
        else if (status == "energy") {
            if (modeStates.energy == true) {
                return styles.chosenButton
            }
            return styles.notChosenButton
        }


    }
    const [prevMode, setPrevMode] = useState('cool')
    const changeMode = (newMode) => {
        setModeState((prevModes) => ({
            ...prevModes,
            [prevMode]: !prevModes[prevMode],
            [newMode]: true,
        }));

        setPrevMode(newMode)
    }


    const [house_id, setHouseId] = useState(0)

    const [loading, setLoading] = useState(true);
    const [currentRoomName, setCurrentRoomName] = useState('')

    const [roomCount, upRoomCount] = useState(0)

    const setRoomCount = (val) => {
        upRoomCount(roomCount + val)
    }

    const getHouse = async () => {
        const houseid = await AsyncStorage.getItem("house_id")
        setHouseId(houseid)
        //console.log("houseID " + house_id)
        //setLoading(false)
        /*
        if (house_id != 0) {
            fetchRooms2()
        }
            */
        return houseid;

    }
    const [guest, setGuest] = useState(false)
    const [guestCode, setGuestCode] = useState('')
    const getGuest = async () => {
        try {

            const guestCode = await AsyncStorage.getItem('guestCode')
            if (guestCode && guestCode != null && guestCode != 'null') {
                if (guestCode.length == 4) {
                    console.log("Guest Code: " + guestCode)
                    setGuestCode(guestCode)
                    setGuest(true)
                    return 1;
                }

            }
            setGuest(false)
            return 0;

        } catch (error) {
            console.error('Error :', error);
        } finally {

        }
    }


    /*
    useEffect(() => {
        const id = getHouse()
    }, [house_id])
    */




    const [rooms, setRooms2] = useState([])
    const [currentRoom, setCurrentRoom] = useState(null);
    const [devices, setDevices] = useState([])


    const fetchRooms2 = async (house_id) => {

        //const roomsUrl = Platform.OS == 'web' ? `http://127.0.0.1:8000/api/houses/${house_id}/rooms/` : `http://10.0.2.2:8000/api/houses/${house_id}/rooms/`
        const roomsUrl = `${API_BASE_URL}/api/houses/${house_id}/rooms/`
        try {
            const response = await fetch(roomsUrl);
            console.log(response)
            console.log("House_id" + house_id)
            console.log("response fetched")
            const data = await response.json();
            console.log(data)
            console.log("data fetched")
            const stringData = JSON.stringify(data)
            const arrayData = JSON.parse(stringData)

            if (response.ok) {
                console.log("Rooms Fetched")
                setRooms2(arrayData);

                //setRooms2(data);


                //console.log("Data: " + arrayData)
                //console.log(rooms)
                //console.log(stringData[0].room_id)
                //console.log(rooms[0].room_id)
                //console.log("Data: "+stringData)
                //console.log("Rooms: "+rooms)

                /*
                if (data.length > 0 && !currentRoom) {
                    console.log("currentRoom: " + currentRoom)
                    setCurrentRoom(data[0].room_id);
                }
                */

                return arrayData;


            } else {
                //setError(data.error || "Failed to fetch rooms");
                console.log(data.error || "Failed to fetch rooms")
            }
        } catch (error) {
            //setError("Network error, please try again.");
            console.log("Error:" + error)
        } finally {

            //setLoading(false);
        }
    };

    useEffect(() => {
        if (rooms.length > 0) {
            //setRoomCount(rooms.length)

            var pres = false
            for (var i = 0; i < rooms.length; i++) {
                if (currentRoom == rooms[i].room_id) {
                    pres = true
                }
            }

            if (pres == false && !currentRoom) {
                setCurrentRoom(rooms[0].room_id); // Set first room's ID only if currentRoom is undefined or null
                setCurrentRoomName(rooms[0].name)
            }
        }
    }, [rooms]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            console.log("currentRoom upon return: " + currentRoom)

            const refresh = async () => {
                const id = await getHouse();
                const fetchedRooms = await fetchRooms2(id);
                const guest = await getGuest()

                // Retrieve saved currentRoom
                const savedCurrentRoom = await AsyncStorage.getItem('currentRoom');
                let newCurrentRoom = null;


                if (isActive && id) {
                    if (savedCurrentRoom) {
                        const savedRoomId = parseInt(savedCurrentRoom, 10);
                        const roomExists = fetchedRooms.some(room => room.room_id === savedRoomId);
                        newCurrentRoom = roomExists ? savedRoomId : (fetchedRooms.length != 0 ? fetchedRooms[0].room_id : 0);
                    } else {
                        if (fetchedRooms.length != 0) {
                            newCurrentRoom = fetchedRooms[0].room_id;
                        }
                        else {
                            newCurrentRoom = 0
                        }
                    }
                    // Force devices update
                    if (fetchedRooms.length != 0) {
                        setCurrentRoom(newCurrentRoom);
                        //const roomData = rooms.find(item => item.room_id === currentRoom);
                        const roomData = fetchedRooms.find(room => room.room_id === newCurrentRoom);
                        setDevices(roomData?.devices || []);
                    }
                    //setCurrentRoom(newCurrentRoom);
                    //const roomData = rooms.find(item => item.room_id === currentRoom);
                    //const roomData = fetchedRooms.find(room => room.room_id === newCurrentRoom);
                    //setDevices(roomData?.devices || []);
                }
            };

            refresh();

            return () => {
                isActive = false;
            };
        }, [])//[house_id, currentRoom]) // Add proper dependencies
    );


    // Add useEffect to persist currentRoom
    useEffect(() => {
        const saveCurrentRoom = async () => {
            if (currentRoom !== null) {
                await AsyncStorage.setItem('currentRoom', currentRoom.toString());
            }
        };
        saveCurrentRoom();
    }, [currentRoom]);


    useEffect(() => {

        fetchRooms2(house_id)

        //console.log("fethced rooms")

        //console.log("Checking rom: "+rooms[0].room_id)

        if (!loading) {

            //console.log("Current Room: " + currentRoom)
            const roomData = rooms.find((item) => item.room_id === currentRoom);
            //console.log("Fetched Room:", roomData);
            if (roomData) {
                //console.log("Fetched Devices:", roomData.devices);
                setDevices(roomData.devices);
                //console.log("Devices variable: "+devices);
                //console.log("D: "+d)
                //console.log(devices[0].device_id)
            }
        }

    }, [currentRoom])





    useEffect(() => {
        //console.log("Devices variable:", devices);
        //console.log("D:", d);
        setLoading(false)
    }, [devices]); // Runs when devices or d update




    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (route.params?.refresh) {
                fetchRooms2();
                navigation.setParams({ refresh: false });
            }
        });

        return unsubscribe;
    }, [navigation, route.params]);









    if (loading || !house_id || house_id == 0) {
        return (
            <View>

            </View>
        )
    }







    return (



        <View style={{ height: '100%', flex: 1 }}>
            <StatusBar style={theme == 'light' ? 'dark' : 'light'} />
            <View style={{ height: '100%', width: '100%', display: 'flex' }}>
                {(theme == 'crazy') && <LavaLampBackground />}
            </View>

            {/*Main Screen*/}
            <View style={[styles.screen, themeMode, { position: 'absolute', /*flexDirection: 'row'*/ }]}>

                <ScrollView style={[{ height: '100%' }]}>

                    <SafeAreaProvider style={[{ height: '100%', width: '100%' }]}>
                        <SafeAreaView style={[{ height: '100%', width: '100%' }]}>

                            <View style={[{ width: '100%', alignItems: 'center', padding: 20, justifyContent: 'center' }]}>
                                <Text style={{ fontSize: Platform.OS == 'web' ? 35 : 15, fontWeight: 'bold', color: theme == 'crazy' ? 'white' : 'rgb(255, 3, 184)' }}>
                                    Device Control
                                </Text>
                                {true &&

                                    <View style={[{ position: 'absolute', alignSelf: 'flex-end', paddingRight: 10, }]}>
                                        <TouchableOpacity style={[{}]} onPress={toggleDropdown}>
                                            <MaterialCommunityIcons name="menu" size={Platform.OS == 'web' ? 40 : 30} color={theme == 'crazy' ? 'white' : 'rgb(255, 3, 184)'} />
                                        </TouchableOpacity>

                                        <Modal
                                            isVisible={isDropdownVisible}
                                            onBackdropPress={() => setDropdownVisible(false)} // Close when tapping outside
                                            animationIn="fadeInDown"
                                            animationOut="fadeOutUp"
                                            backdropOpacity={0.3}
                                            style={[{}]}
                                        >

                                            <View style={[styles.dropdownContainer, { borderRadius: 30, }]}>
                                                {guestCode == '' && <TouchableOpacity style={styles.dropdownItem}
                                                    onPress={() => {
                                                        setDropdownVisible(false)
                                                        navigation.navigate("Room-Add", {
                                                            houseId: house_id,
                                                            setRoomCount: setRoomCount,
                                                            onAddSuccess: () => {
                                                                fetchRooms2();
                                                                fetchDevices();
                                                            }
                                                            //addRoom: addRoom,
                                                            //allRooms: allRooms,
                                                            //setRooms, setRooms
                                                        })
                                                    }}
                                                >
                                                    <View style={{
                                                        backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white', padding: 10,
                                                        flexDirection: 'row', alignItems: 'center', gap: 10, borderTopLeftRadius: Platform.OS == 'web' ? 30 : 20, borderTopRightRadius: Platform.OS == 'web' ? 30 : 20
                                                    }}>
                                                        <MaterialCommunityIcons name="plus" size={Platform.OS == 'web' ? 70 : 20} color={theme == 'dark' ? 'white' : 'rgb(255, 3, 184)'} />
                                                        <Text style={{ color: theme == 'dark' ? 'white' : 'rgb(255, 3, 184)', fontWeight: 'bold' }}>Add Room</Text>
                                                    </View>
                                                </TouchableOpacity>}
                                                {rooms.length != 0 && <TouchableOpacity style={styles.dropdownItem}
                                                    onPress={() => {
                                                        setDropdownVisible(false)
                                                        navigation.navigate("RoomAuto", {
                                                            devices: devices
                                                        })
                                                    }}
                                                >
                                                    <View style={{ backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white', padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                        <MaterialCommunityIcons name="refresh-auto" size={Platform.OS == 'web' ? 70 : 20} color={theme == 'dark' ? 'white' : 'rgb(255, 3, 184)'} />
                                                        <Text style={{ color: theme == 'dark' ? 'white' : 'rgb(255, 3, 184)', fontWeight: 'bold' }}>Automations List</Text>
                                                    </View>
                                                </TouchableOpacity>}

                                                {rooms.length != 0 && guestCode == '' && <TouchableOpacity style={{}} onPress={() => {
                                                    toggleDropdown()
                                                    navigation.navigate("Room-Delete", {
                                                        roomName: currentRoomName,
                                                        currentRoom: currentRoom,
                                                        setRoomCount: setRoomCount,
                                                    })

                                                }}>
                                                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                                        style={{ backgroundColor: 'red', padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomLeftRadius: Platform.OS == 'web' ? 30 : 20, borderBottomRightRadius: Platform.OS == 'web' ? 30 : 20 }}>
                                                        <MaterialCommunityIcons name="home-remove-outline" size={Platform.OS == 'web' ? 70 : 20} color={'white'} />
                                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete Room</Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>}

                                            </View>


                                        </Modal>

                                    </View>


                                }
                            </View>

                            <View style={[styles.mainContainer]}>


                                {<View style={[{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }]}>
                                    <View style={[styles.roomScroller, (Platform.OS != 'web') && { height: 55 }]}>

                                        <ScrollView
                                            showsHorizontalScrollIndicator={Platform.OS == 'web' ? true : false}
                                            horizontal={true}
                                            style={[{
                                                width: '100%',
                                                //height: '100%',
                                            }]}
                                            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', gap: 0 }}
                                        >

                                            {rooms.map((item) => (
                                                <View style={[{ alignItems: 'center', marginLeft: 20, height: (Platform.OS == 'web') ? 80 : 50 }]}>


                                                    <LinearGradient colors={[(item.room_id == currentRoom) ? 'rgb(255, 3, 184)' : (theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255, 255, 255)'), 'transparent']}
                                                        style={[styles.room, {
                                                            backgroundColor: (item.room_id == currentRoom) ? 'rgb(216, 75, 255)' : (theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255, 255, 255)'),
                                                            padding: 0,
                                                        }]}
                                                    >

                                                        <TouchableOpacity
                                                            style={[{
                                                                justifyContent: 'center', alignItems: 'center',
                                                                height: '100%',
                                                                width: '100%',
                                                                marginLeft: 25, marginRight: 25, marginTop: 25, marginBottom: 25,
                                                            }]}
                                                            onPress={() => {
                                                                //console.log("Current Room is: " + item.room);
                                                                setCurrentRoom(item.room_id);
                                                                setCurrentRoomName(item.name)
                                                            }}>
                                                            <Text style={[{
                                                                //width:50,
                                                                fontSize: Platform.OS == 'web' ? 30 : 14,
                                                                fontWeight: 'bold',
                                                                color: (item.room_id == currentRoom) ? 'rgb(255, 255, 255)' : (theme == 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)')
                                                            }]}>
                                                                {item.name}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </LinearGradient>



                                                    {item.room_id == currentRoom &&
                                                        <View
                                                            style={[{
                                                                backgroundColor: 'rgb(216, 75, 255)',
                                                                borderColor: 'rgb(216, 75, 255)',
                                                                borderWidth: Platform.OS == 'web' ? 2 : 1, width: '70%', top: 3
                                                            }]}></View>
                                                    }
                                                </View>
                                            ))}



                                            {Platform.OS == 'web' && guestCode == '' && <TouchableOpacity
                                                style={[styles.room,
                                                {
                                                    backgroundColor: (theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255, 255, 255)'), aspectRatio: 1,
                                                    padding: 10, marginLeft: 20, flexDirection: 'row'
                                                }]}
                                                onPress={() => {
                                                    navigation.navigate("Room-Add", {
                                                        houseId: house_id,
                                                        setRoomCount: setRoomCount,
                                                        onAddSuccess: () => {
                                                            fetchRooms2();
                                                            fetchDevices();
                                                        }
                                                        //addRoom: addRoom,
                                                        //allRooms: allRooms,
                                                        //setRooms, setRooms
                                                    })
                                                }}>
                                                <MaterialCommunityIcons name="plus" size={40} color={(theme == 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)')} />
                                            </TouchableOpacity>}




                                        </ScrollView>



                                    </View>

                                </View>}



                                <View style={[styles.roomPanel, { flexDirection: 'row' }]}>

                                    {Platform.OS == 'web' && false &&

                                        <View style={[{ width: '50%', alignItems: 'center' }]}>
                                            <TempDial device_id={999} deviceName={"Air Conditioner"} changeable={true} tempArg={DUMMY_DATA[0].temperature} />
                                        </View>
                                    }




                                    <View style={[{ width: Platform.OS == 'web' ? '100%' : '100%', justifyContent: 'center' }]}>

                                        {Platform.OS == 'web' && false &&
                                            <View style={[{
                                                height: '50%',
                                                width: '100%',
                                            }]}>

                                                <View style={[styles.modePanel, { width: '100%', height: '100%' }]}>
                                                    <TouchableOpacity style={[styles.shadow, styles.modeButton, isChosen("cool"), {}]}
                                                        onPress={() => {
                                                            if (modeStates.cool == false) {
                                                                changeMode('cool')
                                                            }
                                                        }}>
                                                        <LinearGradient colors={[modeStates.cool == true ? 'rgb(255, 3, 184)' : 'rgb(235, 235, 235)', 'transparent']} style={[styles.modeButton, { width: '100%' }]}>
                                                            <Ionicons name="snow-outline" size={60} color={modeStates.cool == true ? 'rgb(255,255,255)' : 'rgb(0, 0, 0)'} />
                                                        </LinearGradient>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={[styles.shadow, styles.modeButton, isChosen("hot"), {}]}
                                                        onPress={() => {
                                                            if (modeStates.hot == false) {
                                                                changeMode('hot')
                                                            }
                                                        }}>
                                                        <LinearGradient colors={[modeStates.hot == true ? 'rgb(255, 3, 184)' : 'rgb(235, 235, 235)', 'transparent']} style={[styles.modeButton, { width: '100%' }]}>
                                                            <Ionicons name="sunny-outline" size={60} color={modeStates.hot == true ? 'rgb(255,255,255)' : 'rgb(0, 0, 0)'} />
                                                        </LinearGradient>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={[styles.shadow, styles.modeButton, isChosen("energy"), {}]}
                                                        onPress={() => {
                                                            if (modeStates.energy == false) {
                                                                changeMode('energy')
                                                            }
                                                        }}>
                                                        <LinearGradient colors={[modeStates.energy == true ? 'rgb(255, 3, 184)' : 'rgb(235, 235, 235)', 'transparent']} style={[styles.modeButton, { width: '100%' }]}>
                                                            <Ionicons name="flash-outline" size={60} color={modeStates.energy == true ? 'rgb(255,255,255)' : 'rgb(0, 0, 0)'} />
                                                        </LinearGradient>
                                                    </TouchableOpacity>
                                                </View>

                                            </View>
                                        }


                                        {Platform.OS == 'web' && rooms.length != 0 && <View style={[{ alignItems: 'center', justifyContent: 'center', marginTop: 40, marginBottom: 20, }]}>

                                            <View style={[{ width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: '5%' }]}>

                                                <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                                    style={[styles.shadow, {
                                                        width: Platform.OS == 'web' ? '50%' : '40%',
                                                        maxWidth: 240,
                                                        //height: '65%',
                                                        aspectRatio: 2 / 1,
                                                        justifyContent: 'center',
                                                        alignItems: 'center', borderRadius: 25,
                                                        backgroundColor: 'rgba(216, 75, 255, 1)',
                                                        padding: 20
                                                    }]}
                                                >
                                                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}
                                                        onPress={() => {
                                                            navigation.navigate("RoomAuto", {
                                                                devices: devices
                                                            })
                                                        }}
                                                    >
                                                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>Automations List</Text>
                                                    </TouchableOpacity>

                                                </LinearGradient>

                                                {guestCode == '' && <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                                    style={[styles.shadow, {
                                                        width: '20%',
                                                        maxWidth: 120,
                                                        //height: '65%',
                                                        aspectRatio: 1,
                                                        justifyContent: 'center',
                                                        alignItems: 'center', borderRadius: 25,
                                                        backgroundColor: 'rgb(255, 0, 0)',
                                                        padding: 20
                                                    }]}
                                                >
                                                    <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}
                                                        onPress={() => {
                                                            navigation.navigate("Room-Delete", {
                                                                //deleteRoom: deleteRoom,
                                                                //allRooms: allRooms,
                                                                roomName: currentRoomName,
                                                                currentRoom: currentRoom,
                                                                setRoomCount: setRoomCount,
                                                            })
                                                        }}
                                                    >
                                                        <MaterialCommunityIcons name="home-remove-outline" size={Platform.OS == 'web' ? 70 : 40} color={"white"} />
                                                    </TouchableOpacity>

                                                </LinearGradient>}

                                            </View>

                                        </View>
                                        }

                                    </View>


                                </View>

                            </View>

                            <View style={[{ height: 30 }]}></View>



                            <View style={[]}>
                                <DevicesGrid currentRoom={currentRoom} house_id={house_id} allRooms={rooms} guestCode={guestCode} />
                            </View>





                        </SafeAreaView>
                    </SafeAreaProvider>

                </ScrollView >



            </View>
        </View>


    );
}



const styles = StyleSheet.create({
    testBorder: {
        borderColor: 'red',
        borderWidth: 3,
    },
    screen: {
        //padding: 20,
        height: '100%',
        width: '100%',
        //display:'none',
    },
    shadow: {
        //shadow
        shadowColor: '#7F5Df0',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },

    mainContainer: {
        alignItems: 'center',     //horizontal
        //gap: 20,
        width: '100%',
    },
    roomScroller: {
        width: '100%',
        maxWidth: 1000,
        //borderRadius: 50,
        //height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        //flexDirection:'row'
    },
    room: {
        height: '70%',
        //height: "40%",
        borderRadius: 100,
        padding: 25,
        justifyContent: 'center',
        alignItems: 'center',

        //shadow
        shadowColor: '#7F5Df0',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },

    roomPanel: {
        width: '100%',
        //height:'100%',
        maxWidth: 1500
    },

    modePanel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5%'
    },

    modeButton: {
        width: '15%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
    },


    dropdownContainer: {
        width: '40%',
        alignSelf: 'flex-end',
        position: 'absolute',
        top: 30,
        right: 0,
    },









    chosenButton: {
        backgroundColor: 'rgba(216, 75, 255, 1)'
    },
    notChosenButton: {
        backgroundColor: 'rgb(235, 235, 235)'
    },



    darkMode: {
        backgroundColor: 'rgb(17, 18, 44)',
    },
    lightMode: {
        backgroundColor: "rgb(245, 238, 246)",
    },
    crazyMode: {
        backgroundColor: 'rgba(216, 83, 196, 0)'
    }
});
