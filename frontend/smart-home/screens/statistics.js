import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, Dimensions, Alert, ActivityIndicator

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "../components/themes/theme";

import LavaLampBackground from "../components/themes/lava-lamp-bg";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


import { BarChart, barDataItem, LineChart } from "react-native-gifted-charts";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Easing, useSharedValue, withTiming, useAnimatedStyle, withSequence, withRepeat, withSpring } from 'react-native-reanimated';

import Modal from "react-native-modal";


import AsyncStorage from "@react-native-async-storage/async-storage";




export default function StatisticsScreen() {

    const navigation = useNavigation()

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

    const [windowDimensions, setWindowDimensions] = useState(Dimensions.get("window"));
    //console.log("Width: " + windowDimensions.width + ", Height: " + windowDimensions.height)


    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions(Dimensions.get("window"));
        };

        if (Platform.OS == 'web') {
            Dimensions.addEventListener("change", handleResize);        //checks if size changed

            return () => {
                Dimensions.removeEventListener("change", handleResize);       //cleanup
            };

        }
    }, []);



    //Chart
    const [currentWeek, setCurrentWeek] = useState(1)

    const energyDataOld = [

        {
            device1: [
                { "Sun": 50 },
                { "Mon": 30 },
                { "Tue": 40 },
                { "Wed": 60 },
                { "Thu": 25 },
                { "Fri": 45 },
                { "Sat": 40 },
            ]
        },
        {
            device2: [
                { "Sun": 50 },
                { "Mon": 30 },
                { "Tue": 40 },
                { "Wed": 60 },
                { "Thu": 25 },
                { "Fri": 45 },
                { "Sat": 40 },
            ]
        },
        {
            device3: [
                { "Sun": 50 },
                { "Mon": 30 },
                { "Tue": 40 },
                { "Wed": 60 },
                { "Thu": 25 },
                { "Fri": 45 },
                { "Sat": 40 },
            ]
        },

    ];

    const energyData = [

        {
            week1: [
                {
                    device1: [
                        { "Sun": 50 },
                        { "Mon": 30 },
                        { "Tue": 40 },
                        { "Wed": 60 },
                        { "Thu": 25 },
                        { "Fri": 45 },
                        { "Sat": 40 },
                    ]
                },
                {
                    device2: [
                        { "Sun": 50 },
                        { "Mon": 30 },
                        { "Tue": 40 },
                        { "Wed": 60 },
                        { "Thu": 25 },
                        { "Fri": 45 },
                        { "Sat": 40 },
                    ]
                },
                {
                    device3: [
                        { "Sun": 50 },
                        { "Mon": 30 },
                        { "Tue": 40 },
                        { "Wed": 60 },
                        { "Thu": 25 },
                        { "Fri": 45 },
                        { "Sat": 40 },
                    ]
                },
            ]
        },
        {
            week2: [
                {
                    device1: [
                        { "Sun": 10 },
                        { "Mon": 10 },
                        { "Tue": 10 },
                        { "Wed": 10 },
                        { "Thu": 15 },
                        { "Fri": 15 },
                        { "Sat": 10 },
                    ]
                },
                {
                    device2: [
                        { "Sun": 10 },
                        { "Mon": 10 },
                        { "Tue": 10 },
                        { "Wed": 10 },
                        { "Thu": 15 },
                        { "Fri": 15 },
                        { "Sat": 10 },
                    ]
                },
                {
                    device3: [
                        { "Sun": 10 },
                        { "Mon": 10 },
                        { "Tue": 10 },
                        { "Wed": 10 },
                        { "Thu": 15 },
                        { "Fri": 15 },
                        { "Sat": 10 },
                    ]
                },
            ]
        },
        {
            week3: [
                {
                    device1: [
                        { "Sun": 100 },
                        { "Mon": 12 },
                        { "Tue": 60 },
                        { "Wed": 80 },
                        { "Thu": 25 },
                        { "Fri": 40 },
                        { "Sat": 70 },
                    ]
                },
                {
                    device2: [
                        { "Sun": 35 },
                        { "Mon": 20 },
                        { "Tue": 70 },
                        { "Wed": 50 },
                        { "Thu": 65 },
                        { "Fri": 15 },
                        { "Sat": 20 },
                    ]
                },
                {
                    device3: [
                        { "Sun": 40 },
                        { "Mon": 70 },
                        { "Tue": 35 },
                        { "Wed": 40 },
                        { "Thu": 80 },
                        { "Fri": 15 },
                        { "Sat": 40 },
                    ]
                },
            ]
        }

    ];

    const totalWeeks = 3

    function makeChartData(energyData) {

        const weeklySums = {};

        energyData.forEach(weekData => {
            Object.entries(weekData).forEach(([week, devices]) => {
                if (!weeklySums[week]) {
                    weeklySums[week] = {
                        Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0
                    };
                }

                devices.forEach(device => {
                    Object.values(device).forEach(dayValues => {
                        dayValues.forEach(dayObj => {
                            Object.entries(dayObj).forEach(([day, value]) => {
                                weeklySums[week][day] += value;
                            });
                        });
                    });
                });
            });
        });

        //console.log(weeklySums)

        const weeks = Object.keys(weeklySums);

        for (var j = 0; j < totalWeeks; j++) {

            const chartData = Object.values(weeklySums[weeks[j]]);
            const chartDays = Object.keys(weeklySums[weeks[j]]);

            const data = [
                { value: 0, label: '' },
                { value: 0, label: '' },
                { value: 0, label: '' },
                { value: 0, label: '' },
                { value: 0, label: '' },
                { value: 0, label: '' },
                { value: 0, label: '' },
            ]

            for (var i = 0; i < data.length; i++) {
                data[i].value = chartData[i];
                data[i].label = chartDays[i];
                //data[i].frontColor = 'rgb(255, 3, 184)'
            }

            weeklySums[weeks[j]] = data

        }



        return weeklySums[weeks[currentWeek - 1]]

    }

    const handleLeftArrow = () => {
        const chosenWeek = currentWeek;
        const nextWeek = (chosenWeek - 2 + totalWeeks) % totalWeeks + 1; //looparound
        setCurrentWeek(nextWeek);
    };

    const handleRightArrow = () => {
        const chosenWeek = currentWeek;
        const nextWeek = (chosenWeek % totalWeeks) + 1; //looparound
        setCurrentWeek(nextWeek);
    };


    function calculateChartWidth() {

        if (Platform.OS != 'web') {
            return windowDimensions.width - 100
        }

        var width = 0

        if ((windowDimensions.width * 0.9) > 1500) {
            //console.log("stats width: " + 0.9*1500)
            //console.log("graph section width with padding 10: " + (0.5*0.9*1500 - 10))
            //console.log("y label width: " + 60)
            width = 0.5 * 0.9 * 1500 - 10 - 60 - 60
            //console.log("chart total width: " + width)
        }
        else {
            width = 0.5 * 0.9 * (windowDimensions.width * 0.9) - 10 - 60 - 60
        }



        //console.log("Window Dimension width: "+ windowDimensions.width)
        //console.log("Would be card dimension width: " + 0.9 * windowDimensions.width)
        //console.log(width)
        return width
    }


    /*


    //Devices
    const [currentRoom, setCurrentRoom] = useState(1);

    const [allRooms, setRooms] = useState([]);
    const [devices, setDevices] = useState([]);

    const fetchRooms = async () => {
        try {
            const response = await fetch(Platform.OS == 'android' ? "http://10.0.2.2:8000/api/rooms/" : "http://127.0.0.1:8000/api/rooms/");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            //console.log("Fetched Rooms:", data);
            setRooms(data);
        } catch (err) {
            //setError(err.message);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [currentRoom])

    const fetchDevices = async () => {
        //console.log("Devices changes")
        const roomData = allRooms.find((item) => item.room_id === currentRoom);
        //console.log("Fetched Room:", roomData);
        if (roomData) {
            //console.log("Fetched Devices:", roomData.devices);
            setDevices(roomData.devices)
        } else {
            setDevices([])
        }
    };

    useEffect(() => {
        fetchDevices()
    }, [currentRoom, allRooms]);

    */


    /*
    const renderRoom = ({ item }) => {

        return (
            <View style={[{ alignItems: 'center' }]}>
                <TouchableOpacity
                    style={[styles.room,
                    { backgroundColor: (item.room_id == currentRoom) ? 'rgb(216, 75, 255)' : 'rgb(255, 255, 255)' }]}
                    onPress={() => {
                        //console.log("Current Room is: " + item.room);
                        setCurrentRoom(item.room_id)
                    }}>
                    <Text style={[{
                        //width:50,
                        fontSize: Platform.OS == 'web' ? 30 : 10,
                        color: (item.room_id == currentRoom) ? 'rgb(255, 255, 255)' : 'rgb(3, 3, 3)'
                    }]}>
                        {item.room}
                    </Text>
                </TouchableOpacity>
                {item.room_id == currentRoom &&
                    <View
                        style={[{
                            backgroundColor: 'rgb(216, 75, 255)',
                            borderColor: 'rgb(216, 75, 255)',
                            borderWidth: 2, width: '70%', top: 3
                        }]}></View>
                }
            </View>

        )
    }

    function randomBetweenTwo(item1, item2) {
        const array = [item1, item2]
        const i = Math.floor(Math.random() * 2)

        return array[i]
    }
    */

    const alertProg = useSharedValue(1)

    const animatedAlertStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: alertProg.value }],
        }
    })

    useEffect(() => {

        alertProg.value = withRepeat(
            withTiming(1.5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        )

    }, [])





    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };


    const [graphMode, setGraphMode] = useState('total');

    const [graphMax, setGraphMax] = useState(30)

    const [totalEnergyData, setTotalEnergyData] = useState(null);


    const fetchTotalEnergyData = async () => {
        try {
            const response = await fetch(
                Platform.OS == 'android' ? `http://10.0.2.2:8000/api/houses/${house_id}/total-energy/` : `http://127.0.0.1:8000/api/houses/${house_id}/total-energy/`,
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            //console.log("Energy Data:", data);
            setTotalEnergyData(data);
            console.log(data)
        } catch (error) {
            console.error("Error fetching energy data:", error);
        }
    };


    function makeLineChartData(energyData) {

        //console.log(energyData)

        if (!energyData) {
            console.log("no line energy returned")
            return [];
        }

        const energyDataList = [
            {
                value: energyData.total_energy6, label: '25 sec',
                dataPointText: String(Math.floor(energyData.total_energy6))
            },
            {
                value: energyData.total_energy5, label: '20 sec',
                dataPointText: String(Math.floor(energyData.total_energy5))
            },
            {
                value: energyData.total_energy4, label: '15 sec',
                dataPointText: String(Math.floor(energyData.total_energy4))
            },
            {
                value: energyData.total_energy3, label: '10 sec',
                dataPointText: String(Math.floor(energyData.total_energy3))
            },
            {
                value: energyData.total_energy2, label: '5 sec',
                dataPointText: String(Math.floor(energyData.total_energy2))
            },
            {
                value: energyData.total_energy1, label: 'Now',
                dataPointText: String(Math.floor(energyData.total_energy1))
            },

        ];

        console.log(energyDataList)
        //setGraphMax(energyData.total_energy1 + 150)

        return energyDataList;

    }

    const checkEnergyThreshold = (data) => {
        // Loop through the object keys
        for (const key in data) {
            // Check if the key starts with "energy" and its value is greater than 20
            if (key.startsWith("energy") && data[key] > 20) {
                //console.log(true)
                return true; // Return true immediately if any value exceeds 20
            }
        }
        return false; // Return false if none of the values exceed 20
    };

    const getEnergyThreshold = () => {
        return Math.max(totalEnergyData.total_energy1, totalEnergyData.total_energy2, totalEnergyData.total_energy3, totalEnergyData.total_energy4
            , totalEnergyData.total_energy5, totalEnergyData.total_energy6, totalEnergyData.total_energy7
        )
    }
















    const [house_id, setHouseId] = useState(0)

    const [loading, setLoading] = useState(true);
    const [currentRoomName, setCurrentRoomName] = useState('')

    useFocusEffect(
        useCallback(() => {

            let isActive = true;

            const reloadData = async () => {
                const id = await getHouse() // Get fresh ID on focus
                console.log("House ID inside useFocus: "+id)
                if (isActive && id) {
                    await fetchRooms2(id);
                    await fetchDevices2(id);
                    //await fetchTotalEnergyData();
                }
                else {
                    console.log("no id")
                    //const id = await getHouse()
                }
            }
            reloadData()
            setLoading(false)


            /*
            const interval = setInterval(reloadData, 5000);  // Optional refresh interval

            return () => {
                isActive = false;
                clearInterval(interval);
            };
            */
        }, []) // Still empty array - we're using latest state in callbacks
    )


    const getHouse = async () => {
        const storedId = await AsyncStorage.getItem("house_id");
        setHouseId(storedId)
        //console.log("houseID " + house_id)
        //setLoading(false)
        /*
        if (storedId != 0) {
            fetchRooms2()
            fetchDevices2()
        }
        */
        return storedId

    }

    useEffect(() => {
        getHouse()
        fetchRooms2(house_id)
        fetchDevices2(house_id)
    }, [house_id])


    const fetchAllData = async (id) => {
        if (id && id !== "0") {
            await fetchRooms2(id);
            await fetchDevices2(id);
            //await fetchTotalEnergyData();
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const id = await getHouse();
            console.log("House ID inside useEffect: "+id)
            await fetchAllData(id);
        };
        loadData();
    }, [house_id]);  // Proper dependency


    const [allRooms, setRooms2] = useState([])
    const [currentRoom, setCurrentRoom] = useState(null);
    const [devices, setDevices] = useState([])


    const fetchRooms2 = async (houseid) => {

        //const roomsUrl = Platform.OS == 'web' ? `http://127.0.0.1:8000/api/houses/${house_id}/rooms/` : `http://10.0.2.2:8000/api/houses/${house_id}/rooms/`

        const roomsUrl = Platform.OS == 'web' ? `http://127.0.0.1:8000/api/houses/${houseid}/rooms/` : `http://10.0.2.2:8000/api/houses/${houseid}/rooms/`


        try {
            const response = await fetch(roomsUrl);
            const data = await response.json();

            const stringData = JSON.stringify(data)
            const arrayData = JSON.parse(stringData)

            if (response.ok) {
                setRooms2(arrayData);
                //console.log("Data: " + arrayData)
                //console.log(rooms)
                //console.log(stringData[0].room_id)
                //console.log(rooms[0].room_id)
                //console.log("Data: "+stringData)
                //console.log("Rooms: "+rooms)
            } else {
                //setError(data.error || "Failed to fetch rooms");
                console.log(data.error || "Failed to fetch rooms")
            }
        } catch (error) {
            //setError("Network error, please try again.");
            console.log(error)
        } finally {

            if (!currentRoom) {
                //setCurrentRoom(allRooms[0].room_id)
            }

            //setLoading(false);
        }
    };


    const fetchDevices2 = async (isThreeD) => {
        //console.log("Devices changes")
        const roomData = allRooms.find((item) => item.room_id === currentRoom);
        //console.log("Fetched Room:", roomData);
        if (roomData) {
            console.log("Fetched Devices:", roomData.devices);
            setDevices(roomData.devices)
        } else {
            setDevices([])
        }
        setLoading(false)
    };


    useEffect(() => {
        if (allRooms.length > 0) {
            //setRoomCount(rooms.length)

            var pres = false
            for (var i = 0; i < allRooms.length; i++) {
                if (currentRoom == allRooms[i].room_id) {
                    pres = true
                }
            }

            if (pres == false) {
                setCurrentRoom(allRooms[0].room_id); // Set first room's ID only if currentRoom is undefined or null
                setCurrentRoomName(allRooms[0].name)
            }
        }
    }, [allRooms]);


    useEffect(() => {
        fetchRooms2(house_id);
    }, [currentRoom])

    useEffect(() => {
        fetchDevices2()
        fetchTotalEnergyData()
    }, [currentRoom, allRooms]);







    const [healthStatus, setHealthStatus] = useState(null);

    const [deviceHealth, setDeviceHealth] = useState({});

    const fetchHealthStatus = async (device_id) => {
        let health = null
        try {
            const apiUrl = Platform.OS === 'android'
                ? `http://10.0.2.2:8000/api/device/${device_id}/get_device_health/`//`http://10.0.2.2:8000/api/device/${device_id}/television_health/` 
                : `http://127.0.0.1:8000/api/device/${device_id}/get_device_health/`//`http://127.0.0.1:8000/api/device/${device_id}/television_health/`;

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok) {
                //health = data.health_status
                //setHealthStatus(data.health_status);
                setDeviceHealth((prevState) => ({
                    ...prevState,
                    [device_id]: data.health_status, // Store health status for each device
                }));
            } else {
                Alert.alert("Error", data.error || "Failed to fetch health status");
            }
        } catch (error) {
            Alert.alert("Error", "Network request failed");
        }

        //console.log(health)
        //return health
        //return healthStatus
    };

    useEffect(() => {
        devices.forEach((device) => {
            fetchHealthStatus(device.device_id);
        });
    }, [devices]);

    const getHealth = (device_id) => {
        fetchHealthStatus(device_id)
        var health = healthStatus
        //setHealthStatus(null)
        return health
    }

    //console.log("Health Status for 99: " + fetchHealthStatus(99))
    //console.log(healthStatus)













    useEffect(() => {


        fetchTotalEnergyData();
        const interval = setInterval(fetchTotalEnergyData, 5000);    //every 5 sec
        //const interval = setInterval(fetchEnergyData, 2000);    //every 2 sec


        //console.log(energyData)

        return () => clearInterval(interval);

    }, [house_id]);










    if (loading || !house_id || house_id == 0) {
        console.log("Not loaded")
        return (
            <View>

            </View>
        )
    }










    /*NOTES
    The application should enable the user to display simple
    statistics for the house as a whole and for individual devices based on energy profiles and usage
    over a period of time (e.g., comparing this week to last week, today to this day last year, etc.).

    The system should also be able to simulate faults in smart
    devices, including those that generate energy.

    A mechanism that enables users to share statistics, perhaps via social media, could be useful.

    A system that makes simple recommendations to users about usage could be useful (e.g., a
    good time to run device X would be time T; device X is still running, should it be turned off?).
    Textual suggestions are provided for improving energy efficiency.

    Daily summary reports for energy use and the overall system would be useful.

    Battery levels for devices (also display in device control?)

    Activity Logs: Device activity is recorded in daily summaries and displayed.
    Only one month of past daily summaries is stored.

    The system integrates external data (e.g., climate,
    humidity) for better user decision-making.

    User-set goals for comparisons and notifications, etc.

    */


    if (Platform.OS != 'web') {
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

                                <View style={[{ position: 'absolute', alignSelf: 'flex-end', paddingRight: 15, top: 65 }]}>
                                    <TouchableOpacity style={[{}]} onPress={toggleDropdown}>
                                        <MaterialCommunityIcons name="menu" size={Platform.OS == 'web' ? 40 : 30} color={'rgb(255, 3, 184)'} />
                                    </TouchableOpacity>

                                    <Modal
                                        isVisible={isDropdownVisible}
                                        onBackdropPress={() => setDropdownVisible(false)} // Close when tapping outside
                                        animationIn="fadeInDown"
                                        animationOut="fadeOutUp"
                                        backdropOpacity={0.3}
                                        style={[{}]}
                                    >

                                        <View style={[styles.shadow, styles.dropdownContainer]}>
                                            {/* Custom View Items */}
                                            <TouchableOpacity style={styles.dropdownItem} onPress={() => { navigation.navigate("ShareStats") }}>
                                                <View style={{ backgroundColor: 'white', padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                    <MaterialCommunityIcons name="share-variant" size={Platform.OS == 'web' ? 70 : 20} color={"black"} />
                                                    <Text style={{ color: 'black', fontWeight: 'bold' }}>Share</Text>
                                                </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{}} onPress={() => { navigation.navigate("DailySummary") }}>
                                                <LinearGradient colors={['rgb(255, 255, 255)', 'transparent']}
                                                    style={{ backgroundColor: 'white', padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                    <MaterialCommunityIcons name="menu" size={Platform.OS == 'web' ? 70 : 20} color={"black"} />
                                                    <Text style={{ color: 'black', fontWeight: 'bold' }}>Daily Summary</Text>
                                                </LinearGradient>
                                            </TouchableOpacity>

                                        </View>


                                    </Modal>

                                </View>

                                <View style={[{ width: '100%', alignItems: 'center', padding: 20 }]}>
                                    <Text style={{ fontSize: Platform.OS == 'web' ? 35 : 15, fontWeight: 'bold', color: theme=='crazy' ? 'white' : 'rgb(255, 3, 184)' }}>
                                        Statistics
                                    </Text>
                                </View>

                                <View style={[styles.mainContainer]}>


                                    <View style={[styles.shadow, styles.homePanel, { paddingBottom: 0, backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white' }]}>

                                        <View style={{ padding: 10 }}>
                                            <Text style={{ color: 'rgb(147, 147, 147)' }}>---- Home Statistics ----</Text>
                                        </View>

                                        <View style={[styles.homeStats, { marginTop: -20, flexDirection: 'column' }]}>

                                            <View style={[styles.graphStats, { overflow: 'hidden' }]}>

                                                <View style={[{ paddingTop: 20, paddingBottom: 20, paddingLeft: 10, width: '100%' }]}>

                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>

                                                        {graphMode == 'week' && <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                                                            onPress={() => {
                                                                handleLeftArrow()
                                                            }}>
                                                            <MaterialCommunityIcons name="chevron-left" size={30} color={theme == 'dark' ? 'white' : 'dark'} />
                                                        </TouchableOpacity>}

                                                        <Text style={{ fontSize: Platform.OS == 'web' ? 20 : 15, fontWeight: 'bold', color: theme == 'dark' ? 'white' : 'dark' }}>
                                                            {graphMode == 'week' ? "Week " + currentWeek : "Total Energy"}
                                                        </Text>

                                                        {graphMode == 'week' && <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                                                            onPress={() => {
                                                                handleRightArrow()
                                                            }}>
                                                            <MaterialCommunityIcons name="chevron-right" size={30} color={theme == 'dark' ? 'white' : 'dark'} />
                                                        </TouchableOpacity>}

                                                    </View>

                                                    {graphMode == 'total' && <LineChart

                                                        data={makeLineChartData(totalEnergyData)}
                                                        width={calculateChartWidth() - 0}
                                                        spacing={0.145 * (calculateChartWidth())}
                                                        noOfSections={4}
                                                        height={200}

                                                        color={'rgb(216, 75, 255)'}
                                                        thickness={10}
                                                        dataPointsColor={'rgb(255, 3, 184)'}
                                                        dataPointsRadius={8}

                                                        textFontSize={20}
                                                        textColor={'rgb(255, 3, 184)'}
                                                        textShiftY={-10}
                                                        textShiftX={-5}

                                                        yAxisLabelSuffix=' kWh '
                                                        yAxisLabelWidth={35}
                                                        yAxisTextStyle={{ color: "gray", fontSize: 8 }}
                                                        xAxisLabelTextStyle={{ color: "gray", fontSize: 10, }}
                                                        yAxisColor={'gray'}
                                                        xAxisColor={'gray'}


                                                        //maxValue={250}
                                                        //maxValue={(checkEnergyThreshold(totalEnergyData)) ? graphMax : 30}
                                                        //maxValue={1000}
                                                        //maxValue={totalEnergyData ? totalEnergyData.total_energy + 180 : 150}
                                                        maxValue={totalEnergyData ? getEnergyThreshold() + 180 : 150}
                                                        yAxisOffset={0}
                                                        //yAxisOffset={50}
                                                        //yAxisOffset={Math.max(0, deviceInfo.base_energy-100)}
                                                        mostNegativeValue={0}

                                                        curved




                                                    //isAnimated

                                                    />}


                                                    {graphMode == 'week' && <BarChart

                                                        //key={chartKey}
                                                        //data={[{ value: 100, frontColor: 'green' }, { value: 50, frontColor: 'yellow' }]}
                                                        data={makeChartData(energyData)}
                                                        //width={550}
                                                        //width={750}
                                                        width={calculateChartWidth()}
                                                        //barWidth={30}
                                                        barWidth={0.05 * (calculateChartWidth())}
                                                        //spacing={40}
                                                        spacing={0.07 * (calculateChartWidth())}
                                                        height={200}

                                                        minHeight={3}
                                                        barBorderRadius={4}
                                                        //roundedTop
                                                        showGradient
                                                        frontColor='rgb(255, 3, 184)'
                                                        gradientColor={'rgb(216, 75, 255)'}
                                                        // gradientColor={transactionType === "Expense" ? "#ea580c" : "#7c3aed"}

                                                        noOfSections={3}
                                                        yAxisThickness={0}
                                                        xAxisThickness={0}
                                                        xAxisLabelsVerticalShift={2}
                                                        xAxisLabelTextStyle={{ color: "gray" }}
                                                        yAxisTextStyle={{ color: "gray", fontSize: 10 }}
                                                        //showYAxisIndices
                                                        yAxisLabelSuffix=' kWh '
                                                        yAxisLabelWidth={40}

                                                        //topLabelComponent={() => (<Text style={{ color: 'blue', fontSize: 18, marginBottom: 6 }}>50</Text>)}
                                                        cappedBars
                                                        capColor={'rgba(155, 35, 253, 0.6)'}
                                                        capThickness={4}
                                                        //rulesColor={"#00000020"}
                                                        //backgroundColor={"white"}
                                                        //showGradient
                                                        //barInnerComponent={() => (<View style={{ backgroundColor: "pink", height: "100%" }} />)}
                                                        //showLine
                                                        //dashGap={0}
                                                        //dashWidth={0}
                                                        //isThreeD
                                                        //side="right"
                                                        isAnimated
                                                        animationDuration={300}
                                                    />}






                                                </View>

                                            </View>

                                            <View style={{ flexDirection: 'row', gap: 10, alignSelf: 'center' }}>

                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: graphMode == 'total' ? 'rgb(255, 3, 184)' : 'white',
                                                        alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10,
                                                        borderWidth: graphMode == 'total' ? 0 : 1, borderColor: 'gray',

                                                    }}
                                                    onPress={() => setGraphMode('total')}
                                                >
                                                    <Text style={{ fontWeight: 'bold', color: graphMode == 'total' ? 'white' : 'black' }}>
                                                        Total Average
                                                    </Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: graphMode == 'week' ? 'rgb(255, 3, 184)' : 'white',
                                                        alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10,
                                                        borderWidth: graphMode == 'week' ? 0 : 1, borderColor: 'gray',

                                                    }}
                                                    onPress={() => setGraphMode('week')}
                                                >
                                                    <Text style={{ fontWeight: 'bold', color: graphMode == 'week' ? 'white' : 'black' }}>
                                                        Weekly
                                                    </Text>
                                                </TouchableOpacity>

                                            </View>

                                            <View style={[{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', maxHeight: 100 }]}>

                                                <LinearGradient
                                                    //colors={['rgb(255, 3, 184)', 'transparent']}
                                                    colors={['rgba(255, 255, 255, 0.0)', 'transparent']}
                                                    style={[//styles.shadow,
                                                        {
                                                            //width: '100%',
                                                            //maxWidth: 500,
                                                            padding: 20,
                                                            flexDirection: 'row',
                                                            gap: 10,
                                                            borderRadius: 500,
                                                            //backgroundColor: 'rgb(216, 75, 255)',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            //paddingRight: 40,
                                                        }
                                                    ]}>


                                                    <View style={[{ justifyContent: 'center' }]}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 10, color: 'rgb(161, 161, 161)' }}>Current</Text>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 15, color: theme == 'dark' ? 'white' : 'dark' }}>{totalEnergyData ? Math.floor(totalEnergyData.total_energy1) : 0} kWh</Text>
                                                    </View>



                                                    <Ionicons name="flash" color='rgb(225, 241, 1)'//color='rgb(255, 255, 255)' 
                                                        size={30}
                                                        style={{ margin: 5 }} />

                                                </LinearGradient>

                                                <View style={{ height: '60%', borderColor: 'rgb(199, 199, 199)', borderWidth: 1 }}>

                                                </View>

                                                <LinearGradient
                                                    //colors={['rgb(255, 3, 184)', 'transparent']}
                                                    colors={['rgba(255, 255, 255, 0.0)', 'transparent']}
                                                    style={[//styles.shadow,
                                                        {
                                                            //width: '100%',
                                                            //maxWidth: 500,
                                                            padding: 20,
                                                            flexDirection: 'row',
                                                            gap: 10,
                                                            borderRadius: 500,
                                                            //backgroundColor: 'rgb(216, 75, 255)',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            //paddingRight: 40,
                                                        }
                                                    ]}>
                                                    <MaterialCommunityIcons name="currency-usd" color='rgb(38, 230, 4)' size={30} />

                                                    <View style={[{ justifyContent: 'center' }]}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 10, color: 'rgb(161, 161, 161)' }}>Per kWh</Text>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 15, color: theme == 'dark' ? 'white' : 'dark' }}>$0.29</Text>
                                                    </View>

                                                    <View style={[{ justifyContent: 'center', }]}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 10, color: 'rgb(161, 161, 161)' }}>Current</Text>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 15, color: theme == 'dark' ? 'white' : 'dark' }}>${totalEnergyData ? Math.floor(totalEnergyData.total_energy1 * 0.29) : 0}/kWh</Text>
                                                    </View>

                                                </LinearGradient>


                                            </View>

                                            {false && <View style={[styles.homeStatsDetails]}>

                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                                    <LinearGradient
                                                        //colors={['rgb(255, 3, 184)', 'transparent']}
                                                        colors={['rgba(255, 255, 255, 0.0)', 'transparent']}
                                                        style={[//styles.shadow,
                                                            {
                                                                //width: '100%',
                                                                //maxWidth: 500,
                                                                padding: 20,
                                                                flexDirection: 'row',
                                                                gap: 20,
                                                                borderRadius: 500,
                                                                //backgroundColor: 'rgb(216, 75, 255)',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                paddingRight: 40,
                                                            }
                                                        ]}>
                                                        <Ionicons name="flash" color='rgb(225, 241, 1)'//color='rgb(255, 255, 255)' 
                                                            size={60}
                                                            style={{ margin: 5 }} />

                                                        <View style={[{ justifyContent: 'center' }]}>
                                                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'rgb(161, 161, 161)' }}>Current</Text>
                                                            <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'rgb(0, 0, 0)' }}>1.5 kW</Text>
                                                        </View>

                                                        <View style={[{ justifyContent: 'center', }]}>
                                                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'rgb(149, 149, 149)' }}>Today</Text>
                                                            <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'rgb(0, 0, 0)' }}>20 kWh</Text>
                                                        </View>

                                                    </LinearGradient>

                                                    <View style={{ height: '60%', borderColor: 'rgb(199, 199, 199)', borderWidth: 1 }}>

                                                    </View>

                                                    <LinearGradient
                                                        //colors={['rgb(255, 3, 184)', 'transparent']}
                                                        colors={['rgba(255, 255, 255, 0.0)', 'transparent']}
                                                        style={[//styles.shadow,
                                                            {
                                                                //width: '100%',
                                                                //maxWidth: 500,
                                                                padding: 20,
                                                                flexDirection: 'row',
                                                                gap: 20,
                                                                borderRadius: 500,
                                                                //backgroundColor: 'rgb(216, 75, 255)',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                paddingRight: 40,
                                                            }
                                                        ]}>
                                                        <MaterialCommunityIcons name="currency-usd" color='rgb(38, 230, 4)' size={70} />

                                                        <View style={[{ justifyContent: 'center' }]}>
                                                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'rgb(161, 161, 161)' }}>Per kWh</Text>
                                                            <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'rgb(0, 0, 0)' }}>$0.29</Text>
                                                        </View>

                                                        <View style={[{ justifyContent: 'center', }]}>
                                                            <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'rgb(161, 161, 161)' }}>Weekly</Text>
                                                            <Text style={{ fontWeight: 'bold', fontSize: 25, color: 'rgb(0, 0, 0)' }}>$261</Text>
                                                        </View>

                                                    </LinearGradient>


                                                </View>




                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 30 }}>

                                                    <LinearGradient
                                                        colors={['rgb(255, 3, 184)', 'transparent']}
                                                        style={[//styles.shadow,
                                                            {
                                                                //width: '100%',
                                                                //maxWidth: 500,
                                                                padding: 10,
                                                                flexDirection: 'row',
                                                                gap: 20,
                                                                borderRadius: 30,
                                                                backgroundColor: 'rgb(216, 75, 255)',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                paddingRight: 20,
                                                            }
                                                        ]}>

                                                        <TouchableOpacity
                                                            onPress={() => { navigation.navigate("ShareStats") }}
                                                            style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 }}
                                                        >
                                                            <MaterialCommunityIcons name="share-variant" color='rgb(255, 255, 255)' size={60} />

                                                            <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'rgb(255, 255, 255)' }}>Share</Text>
                                                        </TouchableOpacity>



                                                    </LinearGradient>

                                                    <View style={{ height: '60%', borderColor: 'rgb(199, 199, 199)', borderWidth: 1 }}>

                                                    </View>

                                                    <LinearGradient
                                                        colors={['rgb(255, 3, 184)', 'transparent']}
                                                        style={[//styles.shadow,
                                                            {
                                                                //width: '100%',
                                                                //maxWidth: 500,
                                                                padding: 10,
                                                                flexDirection: 'row',
                                                                gap: 20,
                                                                borderRadius: 30,
                                                                backgroundColor: 'rgb(216, 75, 255)',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                paddingRight: 20,
                                                            }
                                                        ]}>

                                                        <TouchableOpacity
                                                            onPress={() => { navigation.navigate("DailySummary") }}
                                                            style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 }}
                                                        >
                                                            <MaterialCommunityIcons name="menu" color='rgb(255, 255, 255)' size={60} />

                                                            <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'rgb(255, 255, 255)' }}>Daily Summary</Text>
                                                        </TouchableOpacity>



                                                    </LinearGradient>


                                                </View>

                                            </View>
                                            }

                                        </View>




                                    </View>


                                    <View style={[styles.deviceStats, { paddingBottom: 200, marginTop: -10 }]}>

                                        <View style={{ padding: 20, backgroundColor: theme == 'dark' ? 'rgb(17, 18, 44)' : 'rgb(245, 238, 246)', borderRadius: 500, marginBottom: 10 }}>
                                            <Text style={{ color: 'rgb(147, 147, 147)' }}>---- Device Statistics ----</Text>
                                        </View>

                                        <View style={[styles.roomScroller, { height: 75, marginTop: -20 }]}

                                        >
                                            <ScrollView
                                                showsHorizontalScrollIndicator={Platform.OS == 'web' ? true : false}
                                                horizontal={true}
                                                style={[{
                                                    width: '100%',
                                                    //height: '100%',
                                                }]}
                                                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', gap: 10 }}
                                            >

                                                {allRooms.map((room) => (

                                                    <TouchableOpacity onPress={() => { setCurrentRoom(room.room_id) }}>
                                                        <LinearGradient
                                                            colors={[
                                                                (currentRoom == room.room_id) ? 'rgb(255, 3, 184)' : theme == "dark" ? 'rgb(26, 28, 77)' : 'white', 'transparent'
                                                            ]}
                                                            style={[styles.roomButton, styles.shadow, {
                                                                backgroundColor: (currentRoom == room.room_id) ? 'rgb(216, 75, 255)' : theme == "dark" ? 'rgb(26, 28, 77)' : 'white',
                                                                padding: 10, paddingLeft: 20, paddingRight: 20,
                                                            }]}
                                                        >

                                                            <Text style={{
                                                                //fontWeight: 'bold',
                                                                fontSize: 12,
                                                                color: (currentRoom == room.room_id) ? 'white' : theme == "dark" ? 'white' : 'black'
                                                            }}>
                                                                {room.name}
                                                            </Text>

                                                        </LinearGradient>
                                                    </TouchableOpacity>

                                                ))}


                                            </ScrollView>

                                        </View>
                                        <View style={{ width: '100%', alignItems: 'center', gap: -20 }}>
                                            {devices.map((device) => (
                                                <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']} style={[styles.deviceButton, styles.shadow, { maxHeight: 80, marginTop: 20, top: -40 }]}>
                                                    <Animated.View style={[animatedAlertStyle, { position: 'absolute', width: 50, height: '100%', left: -50, justifyContent: 'center', alignItems: 'center', }]}>
                                                        <MaterialCommunityIcons
                                                            name="exclamation-thick"
                                                            color={deviceHealth[device.device_id] === 'Sick' ? 'orange' : (deviceHealth[device.device_id] === 'Faulty' ? 'red' : 'transparent')}
                                                            size={40}
                                                        />
                                                    </Animated.View>
                                                    <TouchableOpacity
                                                        key={device.device_id}
                                                        //style={[styles.gridItem, styles.shadow]}
                                                        style={[styles.deviceButtonContent, { width: '100%', height: '100%', alignItems: 'center' }]}
                                                        onPress={() => {
                                                            navigation.navigate("DeviceStatistics", {
                                                                device: device,
                                                                device_id: device.device_id,
                                                                name: device.name,
                                                                logo: device.logo,
                                                                status: device.status,
                                                                temp: device.temperature,
                                                                room: allRooms.find(item => item.room_id === currentRoom)?.name,
                                                            }
                                                            );
                                                        }}
                                                    >
                                                        <View
                                                            style={[
                                                                {
                                                                    width: '15%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', padding: 0,
                                                                    backgroundColor: 'white', borderRadius: 500,
                                                                }
                                                            ]}>
                                                            <MaterialCommunityIcons
                                                                name={device.logo} size={25} //color='rgb(255, 255, 255)'
                                                                style={{ color: 'rgb(255, 3, 184)', backgroundColor: 'transparent' }}
                                                            />
                                                        </View>

                                                        <View style={[{ width: '80%', justifyContent: 'center' }]}>

                                                            <View style={{ bottom: '0%', left: '5%' }}>
                                                                <Text style={[{ fontSize: 22, fontWeight: 'bold', color: 'white' }]}>
                                                                    {device.name}
                                                                </Text>
                                                                <Text style={[{ fontSize: 15, fontWeight: 'bold', color: 'rgb(218, 218, 218)' }]}>
                                                                    {allRooms.find(item => item.room_id === currentRoom)?.name} • {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                                                                </Text>
                                                            </View>

                                                        </View>

                                                        <View style={[{ width: '10%', justifyContent: 'center', padding: 10, paddingLeft: 30, right: 0, position: 'absolute' }]}>
                                                            <MaterialCommunityIcons name="chevron-right" size={30} color='rgb(255, 255, 255)' />
                                                        </View>

                                                    </TouchableOpacity>
                                                </LinearGradient>
                                            ))}

                                        </View>






                                    </View>










                                </View>

                                <View style={{ height: 30 }}></View>






                            </SafeAreaView>
                        </SafeAreaProvider>

                    </ScrollView >



                </View>
            </View>


        );
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

                            <View style={[{ width: '100%', alignItems: 'center', padding: 20 }]}>
                                <Text style={{ fontSize: Platform.OS == 'web' ? 35 : 15, fontWeight: 'bold', color: theme=='crazy' ? 'white' : 'rgb(255, 3, 184)' }}>
                                    Statistics
                                </Text>
                            </View>

                            <View style={[styles.mainContainer]}>


                                <View style={[styles.shadow, styles.homePanel, { backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'white' }]}>

                                    <View style={{ padding: 20 }}>
                                        <Text style={{ color: 'rgb(147, 147, 147)' }}>---- Home Statistics ----</Text>
                                    </View>

                                    <View style={[styles.homeStats, { height: '90%' }]}>

                                        <View style={[styles.graphStats]}>

                                            <View style={[{ paddingTop: 20, paddingBottom: 20, paddingLeft: 10, width: '100%' }]}>

                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>

                                                    {graphMode == 'week' && <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                                                        onPress={() => {
                                                            handleLeftArrow()
                                                        }}>
                                                        <MaterialCommunityIcons name="chevron-left" size={30} color={theme == 'dark' ? 'white' : 'dark'} />
                                                    </TouchableOpacity>}

                                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme == 'dark' ? 'white' : 'dark' }}>
                                                        {graphMode == 'week' ? "Week " + currentWeek : "Total Energy"}
                                                    </Text>

                                                    {graphMode == 'week' && <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                                                        onPress={() => {
                                                            handleRightArrow()
                                                        }}>
                                                        <MaterialCommunityIcons name="chevron-right" size={30} color={theme == 'dark' ? 'white' : 'dark'} />
                                                    </TouchableOpacity>}

                                                </View>

                                                {graphMode == 'total' && <LineChart

                                                    data={makeLineChartData(totalEnergyData)}
                                                    width={calculateChartWidth() - 0}
                                                    spacing={0.145 * (calculateChartWidth())}
                                                    noOfSections={4}
                                                    height={200}

                                                    color={'rgb(216, 75, 255)'}
                                                    thickness={10}
                                                    dataPointsColor={'rgb(255, 3, 184)'}
                                                    dataPointsRadius={8}

                                                    textFontSize={20}
                                                    textColor={'rgb(255, 3, 184)'}
                                                    textShiftY={-10}
                                                    textShiftX={-5}

                                                    yAxisLabelSuffix=' kWh '
                                                    yAxisLabelWidth={60}
                                                    yAxisTextStyle={{ color: "gray", fontSize: 15 }}
                                                    xAxisLabelTextStyle={{ color: "gray", fontSize: 10, }}
                                                    yAxisColor={'gray'}
                                                    xAxisColor={'gray'}


                                                    //maxValue={250}
                                                    //maxValue={(checkEnergyThreshold(totalEnergyData)) ? graphMax : 30}
                                                    //maxValue={1000}
                                                    //maxValue={totalEnergyData ? totalEnergyData.total_energy + 180 : 150}
                                                    maxValue={totalEnergyData ? getEnergyThreshold() + 180 : 150}
                                                    yAxisOffset={0}
                                                    //yAxisOffset={50}
                                                    //yAxisOffset={Math.max(0, deviceInfo.base_energy-100)}
                                                    mostNegativeValue={0}

                                                    curved




                                                //isAnimated

                                                />}


                                                {graphMode == 'week' && <BarChart

                                                    //key={chartKey}
                                                    //data={[{ value: 100, frontColor: 'green' }, { value: 50, frontColor: 'yellow' }]}
                                                    data={makeChartData(energyData)}
                                                    //width={550}
                                                    //width={750}
                                                    width={calculateChartWidth()}
                                                    //barWidth={30}
                                                    barWidth={0.05 * (calculateChartWidth())}
                                                    //spacing={40}
                                                    spacing={0.07 * (calculateChartWidth())}
                                                    height={200}

                                                    minHeight={3}
                                                    barBorderRadius={4}
                                                    //roundedTop
                                                    showGradient
                                                    frontColor='rgb(255, 3, 184)'
                                                    gradientColor={'rgb(216, 75, 255)'}
                                                    // gradientColor={transactionType === "Expense" ? "#ea580c" : "#7c3aed"}

                                                    noOfSections={3}
                                                    yAxisThickness={0}
                                                    xAxisThickness={0}
                                                    xAxisLabelsVerticalShift={2}
                                                    xAxisLabelTextStyle={{ color: "gray" }}
                                                    yAxisTextStyle={{ color: "gray" }}
                                                    //showYAxisIndices
                                                    yAxisLabelSuffix=' kWh '
                                                    yAxisLabelWidth={60}

                                                    //topLabelComponent={() => (<Text style={{ color: 'blue', fontSize: 18, marginBottom: 6 }}>50</Text>)}
                                                    cappedBars
                                                    capColor={'rgba(155, 35, 253, 0.6)'}
                                                    capThickness={4}
                                                    //rulesColor={"#00000020"}
                                                    //backgroundColor={"white"}
                                                    //showGradient
                                                    //barInnerComponent={() => (<View style={{ backgroundColor: "pink", height: "100%" }} />)}
                                                    //showLine
                                                    //dashGap={0}
                                                    //dashWidth={0}
                                                    //isThreeD
                                                    //side="right"
                                                    isAnimated
                                                    animationDuration={300}
                                                />}






                                            </View>

                                        </View>

                                        <View style={[styles.homeStatsDetails]}>

                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                                <View style={{ flexDirection: 'row', gap: 10 }}>

                                                    <TouchableOpacity
                                                        style={{
                                                            backgroundColor: graphMode == 'total' ? 'rgb(255, 3, 184)' : 'white',
                                                            alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10,
                                                            borderWidth: graphMode == 'total' ? 0 : 1, borderColor: 'gray',

                                                        }}
                                                        onPress={() => setGraphMode('total')}
                                                    >
                                                        <Text style={{ fontWeight: 'bold', color: graphMode == 'total' ? 'white' : 'black' }}>
                                                            Total Average
                                                        </Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        style={{
                                                            backgroundColor: graphMode == 'week' ? 'rgb(255, 3, 184)' : 'white',
                                                            alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10,
                                                            borderWidth: graphMode == 'week' ? 0 : 1, borderColor: 'gray',

                                                        }}
                                                        onPress={() => setGraphMode('week')}
                                                    >
                                                        <Text style={{ fontWeight: 'bold', color: graphMode == 'week' ? 'white' : 'black' }}>
                                                            Weekly
                                                        </Text>
                                                    </TouchableOpacity>

                                                </View>


                                            </View>

                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                                <LinearGradient
                                                    //colors={['rgb(255, 3, 184)', 'transparent']}
                                                    colors={['rgba(255, 255, 255, 0.0)', 'transparent']}
                                                    style={[//styles.shadow,
                                                        {
                                                            //width: '100%',
                                                            //maxWidth: 500,
                                                            padding: 20,
                                                            flexDirection: 'row',
                                                            gap: 20,
                                                            borderRadius: 500,
                                                            //backgroundColor: 'rgb(216, 75, 255)',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            paddingRight: 40,
                                                        }
                                                    ]}>
                                                    <Ionicons name="flash" color='rgb(225, 241, 1)'//color='rgb(255, 255, 255)' 
                                                        size={60}
                                                        style={{ margin: 5 }} />

                                                    <View style={[{ justifyContent: 'center' }]}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'rgb(161, 161, 161)' }}>Current</Text>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 25, color: theme == 'dark' ? 'white' : 'dark' }}>{totalEnergyData ? Math.floor(totalEnergyData.total_energy1) : 0} kWh</Text>
                                                    </View>

                                                    {/*
                                                    <View style={[{ justifyContent: 'center', }]}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'rgb(149, 149, 149)' }}>Today</Text>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 25, color: theme == 'dark' ? 'white' : 'dark' }}>20 kWh</Text>
                                                    </View>
                                                    */}

                                                </LinearGradient>

                                                <View style={{ height: '60%', borderColor: 'rgb(199, 199, 199)', borderWidth: 1 }}>

                                                </View>

                                                <LinearGradient
                                                    //colors={['rgb(255, 3, 184)', 'transparent']}
                                                    colors={['rgba(255, 255, 255, 0.0)', 'transparent']}
                                                    style={[//styles.shadow,
                                                        {
                                                            //width: '100%',
                                                            //maxWidth: 500,
                                                            padding: 20,
                                                            flexDirection: 'row',
                                                            gap: 20,
                                                            borderRadius: 500,
                                                            //backgroundColor: 'rgb(216, 75, 255)',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            paddingRight: 40,
                                                        }
                                                    ]}>
                                                    <MaterialCommunityIcons name="currency-usd" color='rgb(38, 230, 4)' size={70} />

                                                    <View style={[{ justifyContent: 'center' }]}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'rgb(161, 161, 161)' }}>Per kWh</Text>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 25, color: theme == 'dark' ? 'white' : 'dark' }}>$0.29</Text>
                                                    </View>

                                                    <View style={[{ justifyContent: 'center', }]}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'rgb(161, 161, 161)' }}>Current</Text>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 25, color: theme == 'dark' ? 'white' : 'dark' }}>${totalEnergyData ? Math.floor(totalEnergyData.total_energy1 * 0.29) : 0}/kWh</Text>
                                                    </View>

                                                </LinearGradient>


                                            </View>




                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 30 }}>

                                                <LinearGradient
                                                    colors={['rgb(255, 3, 184)', 'transparent']}
                                                    style={[//styles.shadow,
                                                        {
                                                            //width: '100%',
                                                            //maxWidth: 500,
                                                            padding: 10,
                                                            flexDirection: 'row',
                                                            gap: 20,
                                                            borderRadius: 30,
                                                            backgroundColor: 'rgb(216, 75, 255)',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            paddingRight: 20,
                                                        }
                                                    ]}>

                                                    <TouchableOpacity
                                                        onPress={() => { navigation.navigate("ShareStats") }}
                                                        style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 }}
                                                    >
                                                        <MaterialCommunityIcons name="share-variant" color='rgb(255, 255, 255)' size={60} />

                                                        <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'rgb(255, 255, 255)' }}>Share</Text>
                                                    </TouchableOpacity>



                                                </LinearGradient>

                                                <View style={{ height: '60%', borderColor: 'rgb(199, 199, 199)', borderWidth: 1 }}>

                                                </View>

                                                <LinearGradient
                                                    colors={['rgb(255, 3, 184)', 'transparent']}
                                                    style={[//styles.shadow,
                                                        {
                                                            //width: '100%',
                                                            //maxWidth: 500,
                                                            padding: 10,
                                                            flexDirection: 'row',
                                                            gap: 20,
                                                            borderRadius: 30,
                                                            backgroundColor: 'rgb(216, 75, 255)',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            paddingRight: 20,
                                                        }
                                                    ]}>

                                                    <TouchableOpacity
                                                        onPress={() => { navigation.navigate("DailySummary") }}
                                                        style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 }}
                                                    >
                                                        <MaterialCommunityIcons name="menu" color='rgb(255, 255, 255)' size={60} />

                                                        <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'rgb(255, 255, 255)' }}>Daily Summary</Text>
                                                    </TouchableOpacity>



                                                </LinearGradient>


                                            </View>

                                        </View>

                                    </View>




                                </View>


                                <View style={[styles.deviceStats, { paddingBottom: 200 }]}>

                                    <View style={{ padding: 20, backgroundColor: theme == 'dark' ? 'rgb(17, 18, 44)' : 'rgb(245, 238, 246)', borderRadius: 500, marginBottom: 10 }}>
                                        <Text style={{ color: 'rgb(147, 147, 147)' }}>---- Device Statistics ----</Text>
                                    </View>

                                    <View style={[styles.roomScroller, { height: 80 }]}

                                    >
                                        <ScrollView
                                            horizontal={true}
                                            style={[{
                                                width: '100%',
                                                //height: '90%',
                                            }]}
                                            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', gap: 20 }}
                                        >

                                            {allRooms.map((room) => (

                                                <TouchableOpacity onPress={() => { setCurrentRoom(room.room_id) }}>
                                                    <LinearGradient
                                                        colors={[
                                                            (currentRoom == room.room_id) ? 'rgb(255, 3, 184)' : theme == "dark" ? 'rgb(26, 28, 77)' : 'white', 'transparent'
                                                        ]}
                                                        style={[styles.roomButton, styles.shadow, {
                                                            backgroundColor: (currentRoom == room.room_id) ? 'rgb(216, 75, 255)' : theme == "dark" ? 'rgb(26, 28, 77)' : 'white'
                                                        }]}
                                                    >

                                                        <Text style={{
                                                            fontWeight: 'bold',
                                                            fontSize: 18,
                                                            color: (currentRoom == room.room_id) ? 'white' : theme == "dark" ? 'white' : 'black'
                                                        }}>
                                                            {room.name}
                                                        </Text>

                                                    </LinearGradient>
                                                </TouchableOpacity>

                                            ))}


                                        </ScrollView>

                                    </View>

                                    {devices.map((device) => (
                                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']} style={[styles.deviceButton, styles.shadow]}>
                                            <Animated.View style={[animatedAlertStyle, { position: 'absolute', width: 50, height: '100%', left: -50, justifyContent: 'center', alignItems: 'center', }]}>
                                                <MaterialCommunityIcons
                                                    name="exclamation-thick"
                                                    //color={device.status == "on" ? 'red' : 'transparent'}
                                                    //color={fetchHealthStatus(device.device_id)=='Sick' ? 'orange' : (fetchHealthStatus(device.device_id)=='Faulty' ? 'red' : 'transparent')}
                                                    //color={fetchHealthStatus(device.device_id)=='Sick' ? 'red' : 'transparent'}
                                                    //color={getHealth(device.device_id)=='Sick' ? 'red' : 'transparent'}
                                                    //color={deviceHealth[device.device_id] === 'Sick' ? 'red' : 'transparent'}
                                                    color={deviceHealth[device.device_id] === 'Sick' ? 'orange' : (deviceHealth[device.device_id] === 'Faulty' ? 'red' : 'transparent')}
                                                    size={60}
                                                />
                                            </Animated.View>
                                            <TouchableOpacity
                                                key={device.device_id}
                                                //style={[styles.gridItem, styles.shadow]}
                                                style={[styles.deviceButtonContent, { width: '100%', height: '100%', }]}
                                                onPress={() => {
                                                    navigation.navigate("DeviceStatistics", {
                                                        device: device,
                                                        device_id: device.device_id,
                                                        name: device.name,
                                                        logo: device.logo,
                                                        status: device.status,
                                                        temp: device.temperature,
                                                        room: allRooms.find(item => item.room_id === currentRoom)?.name,
                                                    }
                                                    );
                                                }}
                                            >
                                                <View
                                                    style={[
                                                        {
                                                            width: '10%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', padding: 20,
                                                            backgroundColor: 'white', borderRadius: 500,
                                                        }
                                                    ]}>
                                                    <MaterialCommunityIcons
                                                        name={device.logo} size={60} //color='rgb(255, 255, 255)'
                                                        style={{ color: 'rgb(255, 3, 184)', backgroundColor: 'transparent' }}
                                                    />
                                                </View>

                                                <View style={[{ width: '80%', justifyContent: 'center' }]}>

                                                    <View style={{ bottom: '0%', left: '5%' }}>
                                                        <Text style={[{ fontSize: 27, fontWeight: 'bold', color: 'white' }]}>
                                                            {device.name}
                                                        </Text>
                                                        <Text style={[{ fontSize: 20, fontWeight: 'bold', color: 'rgb(218, 218, 218)' }]}>
                                                            {allRooms.find(item => item.room_id === currentRoom)?.name} • {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                                                        </Text>
                                                    </View>

                                                </View>

                                                <View style={[{ width: '10%', justifyContent: 'center', padding: 10, paddingLeft: 30 }]}>
                                                    <MaterialCommunityIcons name="chevron-right" size={60} color='rgb(255, 255, 255)' />
                                                </View>

                                            </TouchableOpacity>
                                        </LinearGradient>
                                    ))}






                                </View>










                            </View>

                            <View style={{ height: 30 }}></View>









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
        gap: 20,
        width: '100%',
    },

    homePanel: {
        width: '90%',
        maxWidth: 1500,
        //height: 600,    //for testing
        backgroundColor: 'white',
        borderRadius: 60,
        alignItems: 'center',
        paddingBottom: 50,
    },

    homeStats: {
        flexDirection: 'row',
        //padding: 20,
        width: '90%',
        //height: '90%',
        //width:0.9*1500,
        justifyContent: 'center'

    },

    graphStats: {
        width: Platform.OS == 'web' ? '50%' : '100%',
        //height: '100%'
    },

    homeStatsDetails: {
        width: '50%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10%'
    },

    deviceStats: {
        width: '90%',
        //justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 1100,
    },

    roomScroller: {
        //width:'100%',
        //flexDirection: 'row',
        //gap: 20,
        width: '100%',
        maxWidth: 1000,
        //borderRadius: 50,
        //height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        //flexDirection:'row'

    },

    roomButton: {
        //width: '100%',
        //height: '100%',
        padding: 20,
        backgroundColor: 'rgb(216, 75, 255)',
        borderRadius: 500,
        //maxHeight:100,
    },

    deviceButton: {
        width: '90%',
        borderRadius: 50,
        marginTop: 40,
        backgroundColor: 'rgb(216, 75, 255)',
    },

    deviceButtonContent: {
        flexDirection: 'row',
        padding: 20,
    },


    dropdownContainer: {
        width: '40%',
        alignSelf: 'flex-end',
        position: 'absolute',
        top: 30,
        right: 0,
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
