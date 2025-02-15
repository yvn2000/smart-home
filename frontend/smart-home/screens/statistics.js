import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, Dimensions

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState } from "react";
import { useTheme } from "../components/themes/theme";

import LavaLampBackground from "../components/themes/lava-lamp-bg";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { DUMMY_DATA } from "../data/dummy-device-data";

import { BarChart, barDataItem } from "react-native-gifted-charts";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Easing, useSharedValue, withTiming, useAnimatedStyle, withSequence, withRepeat, withSpring } from 'react-native-reanimated';




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

        console.log(weeklySums)

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

    useEffect(() => {
        const roomData = allRooms.find((item) => item.room_id === currentRoom);
        if (roomData) {
            setDevices(roomData.devices)
        } else {
            setDevices([])
        }
    }, [currentRoom, allRooms]);

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
                                <Text style={{ fontSize: Platform.OS == 'web' ? 35 : 15, fontWeight: 'bold', }}>
                                    Statistics
                                </Text>
                            </View>

                            <View style={[styles.mainContainer]}>


                                <View style={[styles.shadow, styles.homePanel]}>

                                    <View style={{ padding: 20 }}>
                                        <Text style={{ color: 'rgb(147, 147, 147)' }}>---- Home Statistics ----</Text>
                                    </View>

                                    <View style={[styles.homeStats]}>

                                        <View style={[styles.graphStats]}>

                                            <View style={[{ paddingTop: 20, paddingBottom: 20, paddingLeft: 10, width: '100%' }]}>

                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>

                                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                                                        onPress={() => {
                                                            handleLeftArrow()
                                                        }}>
                                                        <MaterialCommunityIcons name="chevron-left" size={40} />
                                                    </TouchableOpacity>

                                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                                                        Week {currentWeek}
                                                    </Text>

                                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}
                                                        onPress={() => {
                                                            handleRightArrow()
                                                        }}>
                                                        <MaterialCommunityIcons name="chevron-right" size={40} />
                                                    </TouchableOpacity>

                                                </View>


                                                <BarChart

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
                                                />






                                            </View>

                                        </View>

                                        <View style={[styles.homeStatsDetails]}>

                                            <LinearGradient
                                                colors={['rgb(255, 3, 184)', 'transparent']}
                                                style={[styles.shadow,
                                                {
                                                    //width: '100%',
                                                    //maxWidth: 500,
                                                    padding: 20,
                                                    flexDirection: 'row',
                                                    gap: 40,
                                                    borderRadius: 500,
                                                    backgroundColor: 'rgb(216, 75, 255)',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    paddingRight: 40,
                                                }
                                                ]}>
                                                <View style={[{ justifyContent: 'center', alignItems: 'center', }]}>
                                                    <View
                                                        style={{
                                                            borderRadius: 500,
                                                            borderWidth: 5,
                                                            borderColor: 'rgb(235, 230, 74)',
                                                            backgroundColor: 'white',
                                                        }}
                                                    >
                                                        <View style={{
                                                            position: 'absolute', width: '100%', height: '100%', borderRadius: 500,
                                                            borderWidth: 5,
                                                            borderColor: 'rgb(255, 255, 255)',
                                                            backgroundColor: 'rgb(235, 230, 74)'

                                                        }} />
                                                        <Ionicons name="flash" color='rgb(255, 255, 255)' size={60}
                                                            style={{ margin: 5 }} />
                                                    </View>
                                                </View>

                                                <View style={[{ justifyContent: 'center' }]}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'rgb(216, 216, 216)' }}>Current</Text>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'rgb(255, 255, 255)' }}>1.5 kW</Text>
                                                </View>

                                                <View style={[{ justifyContent: 'center', }]}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'rgb(216, 216, 216)' }}>Today</Text>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'rgb(255, 255, 255)' }}>20 kWh</Text>
                                                </View>

                                            </LinearGradient>

                                            <LinearGradient
                                                colors={['rgb(255, 3, 184)', 'transparent']}
                                                style={[styles.shadow,
                                                {
                                                    //width: '100%',
                                                    //maxWidth: 500,
                                                    padding: 20,
                                                    flexDirection: 'row',
                                                    gap: 40,
                                                    borderRadius: 500,
                                                    backgroundColor: 'rgb(216, 75, 255)',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    paddingRight: 40,
                                                }
                                                ]}>
                                                <View style={[{ justifyContent: 'center', alignItems: 'center', }]}>
                                                    <View
                                                        style={{
                                                            borderRadius: 500,
                                                            borderWidth: 5,
                                                            borderColor: 'rgb(135, 238, 79)',
                                                            backgroundColor: 'white'
                                                        }}
                                                    >
                                                        <View style={{
                                                            position: 'absolute', width: '100%', height: '100%', borderRadius: 500,
                                                            borderWidth: 5,
                                                            borderColor: 'rgb(255, 255, 255)',
                                                            backgroundColor: 'rgb(135, 238, 79)'

                                                        }} />
                                                        <MaterialCommunityIcons name="currency-usd" color='rgb(255, 255, 255)' size={70} />
                                                    </View>
                                                </View>

                                                <View style={[{ justifyContent: 'center' }]}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'rgb(216, 216, 216)' }}>Per kWh</Text>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'rgb(255, 255, 255)' }}>$0.29</Text>
                                                </View>

                                                <View style={[{ justifyContent: 'center', }]}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'rgb(216, 216, 216)' }}>Weekly</Text>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'rgb(255, 255, 255)' }}>$261</Text>
                                                </View>

                                            </LinearGradient>

                                        </View>

                                    </View>




                                </View>


                                <View style={[styles.deviceStats,{paddingBottom:200}]}>

                                    <View style={{ padding: 20, backgroundColor:'rgb(245, 238, 246)', borderRadius:500, marginBottom:10 }}>
                                        <Text style={{ color: 'rgb(147, 147, 147)' }}>---- Device Statistics ----</Text>
                                    </View>

                                    <View style={[styles.roomScroller]}>

                                        {allRooms.map((room) => (

                                            <TouchableOpacity onPress={() => { setCurrentRoom(room.room_id) }}>
                                                <LinearGradient
                                                    colors={[
                                                        (currentRoom == room.room_id) ? 'rgb(255, 3, 184)' : 'white', 'transparent'
                                                    ]}
                                                    style={[styles.roomButton, styles.shadow, {
                                                        backgroundColor: (currentRoom == room.room_id) ? 'rgb(216, 75, 255)' : 'white'
                                                    }]}
                                                >

                                                    <Text style={{
                                                        fontWeight: 'bold',
                                                        fontSize: 18,
                                                        color: (currentRoom == room.room_id) ? 'white' : 'black'
                                                    }}>
                                                        {room.name}
                                                    </Text>

                                                </LinearGradient>
                                            </TouchableOpacity>

                                        ))}


                                    </View>

                                    {devices.map((device) => (
                                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']} style={[styles.deviceButton, styles.shadow]}>
                                            <Animated.View style={[animatedAlertStyle, { position: 'absolute', width: 50, height: '100%', left: -50, justifyContent: 'center', alignItems: 'center', }]}>
                                                <MaterialCommunityIcons
                                                    name="exclamation-thick"
                                                    color={device.status == "on" ? 'red' : 'transparent'}
                                                    size={60}
                                                />
                                            </Animated.View>
                                            <TouchableOpacity
                                                key={device.device_id}
                                                //style={[styles.gridItem, styles.shadow]}
                                                style={[styles.deviceButtonContent, { width: '100%', height: '100%', }]}
                                                onPress={() => {
                                                    navigation.navigate("DeviceStatistics", {
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
            height: 10,
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
        height: '90%',
        //width:0.9*1500,
        justifyContent: 'center'

    },

    graphStats: {
        width: '50%',
        height: '100%'
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
        flexDirection: 'row',
        gap: 20,

    },

    roomButton: {
        width: '100%',
        height: '100%',
        padding: 20,
        backgroundColor: 'rgb(216, 75, 255)',
        borderRadius: 500,
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







    darkMode: {
        backgroundColor: "#4A4A4A",
    },
    lightMode: {
        backgroundColor: "rgb(245, 238, 246)",
    },
    crazyMode: {
        backgroundColor: 'rgba(216, 83, 196, 0)'
    }
});
