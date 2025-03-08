import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, Dimensions, Alert, ActivityIndicator

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState, useLayoutEffect } from "react";
import { useTheme } from "../components/themes/theme";

import LavaLampBackground from "../components/themes/lava-lamp-bg";
import TempDial from "../components/dial";
import Switch from '../components/switch';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { BarChart, LineChart, barDataItem, Stop } from "react-native-gifted-charts";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

import { HeaderBackButton } from "@react-navigation/elements";
import { LinearGradient } from 'expo-linear-gradient';

import Modal from "react-native-modal";


export default function DeviceStatisticsScreen() {

    const route = useRoute()
    const navigation = useNavigation()

    const { device, device_id, name, logo, status, temp, room, } = route.params

    useLayoutEffect(() => {
        navigation.setOptions({
            gestureEnabled: true,
            headerBackTitle: 'Back',
            headerStyle: [themeMode, {
                //backgroundColor:'red'
                borderWidth: 0,
            }],

            headerTitle: name,
            headerTitleStyle: {
                fontSize: 20,
                color: 'rgb(216, 75, 255)',
                fontWeight: 'bold',

            },
            headerLeft: () => (
                <HeaderBackButton
                    tintColor='rgb(216, 75, 255)'
                    onPress={() => navigation.goBack()}
                />
            )
        })
    }, [])

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


    const [deviceInfo, setDeviceInfo] = useState({});
    const [loading, setLoading] = useState(true);



    //energy data realtime (every 5 sec)
    const [energyData, setEnergyData] = useState(null);
    const [avgEnergy, setAvg] = useState(0);

    const fetchEnergyData = async () => {
        try {
            const response = await fetch(
                Platform.OS == 'android' ? `http://10.0.2.2:8000/api/energy/${device_id}/` : `http://127.0.0.1:8000/api/energy/${device_id}/`,
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            //console.log("Energy Data:", data);
            setEnergyData(data);
        } catch (error) {
            console.error("Error fetching energy data:", error);
        }
    };


    function makeBarChartData(energyData) {

        if (!energyData) return [];

        const energyDataList = [
            {
                value: energyData.energy5, label: '25 sec',
                topLabelComponent: () => (<Text style={{ color: 'rgb(216, 75, 255)', fontSize: 18, marginBottom: 6 }}>{Math.floor(energyData.energy5)}</Text>),
            },
            {
                value: energyData.energy4, label: '20 sec',
                topLabelComponent: () => (<Text style={{ color: 'rgb(216, 75, 255)', fontSize: 18, marginBottom: 6 }}>{Math.floor(energyData.energy4)}</Text>),
            },
            {
                value: energyData.energy3, label: '15 sec',
                topLabelComponent: () => (<Text style={{ color: 'rgb(216, 75, 255)', fontSize: 18, marginBottom: 6 }}>{Math.floor(energyData.energy3)}</Text>),
            },
            {
                value: energyData.energy2, label: '10 sec',
                topLabelComponent: () => (<Text style={{ color: 'rgb(216, 75, 255)', fontSize: 18, marginBottom: 6 }}>{Math.floor(energyData.energy2)}</Text>),
            },
            {
                value: energyData.energy1, label: '5 sec',
                topLabelComponent: () => (<Text style={{ color: 'rgb(216, 75, 255)', fontSize: 18, marginBottom: 6 }}>{Math.floor(energyData.energy1)}</Text>),
            },

        ];

        return energyDataList;

    }

    function makeLineChartData(energyData) {

        //console.log(energyData)

        if (!energyData) return [];

        const energyDataList = [
            {
                value: energyData.energy7, label: '30 sec',
                dataPointText: String(Math.floor(energyData.energy7))
            },
            {
                value: energyData.energy6, label: '25 sec',
                dataPointText: String(Math.floor(energyData.energy6))
            },
            {
                value: energyData.energy5, label: '20 sec',
                dataPointText: String(Math.floor(energyData.energy5))
            },
            {
                value: energyData.energy4, label: '15 sec',
                dataPointText: String(Math.floor(energyData.energy4))
            },
            {
                value: energyData.energy3, label: '10 sec',
                dataPointText: String(Math.floor(energyData.energy3))
            },
            {
                value: energyData.energy2, label: '5 sec',
                dataPointText: String(Math.floor(energyData.energy2))
            },
            {
                value: energyData.energy1, label: 'Now',
                dataPointText: String(Math.floor(energyData.energy1))
            },

        ];

        return energyDataList;

    }

    useEffect(() => {


        fetchEnergyData();
        //const interval = setInterval(fetchEnergyData, 5000);    //every 5 sec
        const interval = setInterval(fetchEnergyData, 2000);    //every 2 sec


        //console.log(energyData)

        return () => clearInterval(interval);

    }, [device_id]);

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










    const [activityLog, setActivityLog] = useState([]);


    const fetchActivityLog = async () => {
        try {
            const response = await fetch(
                Platform.OS == 'android' ? `http://10.0.2.2:8000/api/device/${device_id}/get-activity/` : `http://127.0.0.1:8000/api/device/${device_id}/get-activity/`
            );

            const data = await response.json();
            if (response.ok) {
                setActivityLog(data.activity_log);
            } else {
                //Alert.alert("Error", "Failed to fetch activity log");
            }
        } catch (error) {
            //Alert.alert("Error", "Network request failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivityLog();
        //console.log(activityLog)
    }, []);


    const [statusDisplay, setStatusDisplay] = useState("off");


    const fetchDeviceInfo = async () => {
        try {
            const response = await fetch(
                //getDeviceInfoURLS()
                Platform.OS == 'android'
                    ? `http://10.0.2.2:8000/api/device/${device_id}/get_device_info/`
                    : `http://127.0.0.1:8000/api/device/${device_id}/get_device_info/`
            );

            const data = await response.json();
            //console.log(data)
            if (response.ok) {
                setDeviceInfo(data); // Update state with fetched device information
                //console.log(deviceInfo)
            } else {
                //Alert.alert("Error", "Failed to fetch device information");
            }
        } catch (error) {
            //Alert.alert("Error", "Network request failed");
        } finally {
            setLoading(false); // Stop the loading indicator once the fetch is complete
        }
    };

    //fetchDeviceInfo()

    useEffect(() => {
        fetchDeviceInfo(); // Fetch device info when the component mounts
        //setStatusDisplay(deviceInfo.status)
        //console.log(deviceInfo)
        //console.log("Device Info: " + deviceInfo)
    }, [device_id]); // Fetch whenever device_id changes



    //Device Health (Only TV for Now)
    const [healthStatus, setHealthStatus] = useState(null);

    const fetchHealthStatus = async () => {
        try {
            const apiUrl = Platform.OS === 'android'
                ? `http://10.0.2.2:8000/api/device/${device_id}/get_device_health/`//`http://10.0.2.2:8000/api/device/${device_id}/television_health/` 
                : `http://127.0.0.1:8000/api/device/${device_id}/get_device_health/`//`http://127.0.0.1:8000/api/device/${device_id}/television_health/`;

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (response.ok) {
                setHealthStatus(data.health_status);
            } else {
                //Alert.alert("Error", data.error || "Failed to fetch health status");
            }
        } catch (error) {
            //Alert.alert("Error", "Network request failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealthStatus();
    }, [device_id]);

    const [graphMax, setGraphMax] = useState(30)

    useEffect(() => {
        if (deviceInfo.data) {
            //console.log(graphMax)
            setGraphMax(deviceInfo.data.energy_consumption + 150)
        }
    }, [deviceInfo])



    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };



    if (loading) {
        return (

            <View style={{}}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>

        )
    }


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

                                <View style={[{ position: 'absolute', alignSelf: 'flex-end', paddingRight: 15, top: 85 }]}>
                                    <TouchableOpacity style={[{}]} onPress={toggleDropdown}>
                                        <MaterialCommunityIcons name="lightbulb-outline" size={Platform.OS == 'web' ? 40 : 30} color={'rgb(255, 3, 184)'} />
                                    </TouchableOpacity>

                                    <Modal
                                        isVisible={isDropdownVisible}
                                        onBackdropPress={() => setDropdownVisible(false)} // Close when tapping outside
                                        animationIn="fadeInDown"
                                        animationOut="fadeOutUp"
                                        backdropOpacity={0.2}
                                        style={[{}]}
                                    >

                                        <View style={[styles.shadow, styles.dropdownContainer, {}]}>
                                            <View style={[styles.shadow, styles.recommend, {backgroundColor:theme=='dark' ? 'rgb(26, 28, 77)' : 'white'}]}>
                                                <Text style={[styles.recText, { alignSelf: 'center' }]}>--- Recommendations ---</Text>
                                                {healthStatus != 'Faulty' && <Text style={[styles.recText, {}]}>• A good time to run {device.name} would be 00:00 - 00:00</Text>}
                                                {healthStatus != 'Faulty' && <Text style={[styles.recText, {}]}>• {device.name} has been running for too long, turn it off?</Text>}

                                                {healthStatus == 'Sick' && <Text style={[styles.recText, {}]}>• Enable Low Power Mode</Text>}


                                                {/*AC*/}
                                                {healthStatus == 'Sick' && (device.logo == 'air-conditioner') && <Text style={[styles.recText, {}]}>• Lower Fan Speed</Text>}

                                                {/*Light*/}
                                                {healthStatus == 'Sick' && (device.logo == 'lamp-outline') && <Text style={[styles.recText, {}]}>• Reduce Intensity</Text>}

                                                {/*TV*/}
                                                {healthStatus == 'Sick' && (device.logo == 'television') && <Text style={[styles.recText, {}]}>• Switch From Streaming</Text>}
                                                {healthStatus == 'Sick' && (device.logo == 'television') && <Text style={[styles.recText, {}]}>• Reduce Brightness</Text>}


                                                {/*Roomba*/}
                                                {healthStatus == 'Sick' && (device.logo == 'robot-vacuum') && <Text style={[styles.recText, {}]}>• Turn Off Spotless Mode</Text>}




                                                {healthStatus == 'Faulty' && <Text style={[styles.recText, {}]}>• Turn Off {device.name}</Text>}
                                                {healthStatus == 'Faulty' && <Text style={[styles.recText, {}]}>• Clean {device.name}</Text>}
                                                {healthStatus == 'Faulty' && <Text style={[styles.recText, {}]}>• Repair {device.name}</Text>}

                                            </View>

                                        </View>


                                    </Modal>

                                </View>


                                <TouchableOpacity style={[styles.backButton, { maxHeight: 100 }]} >
                                    <MaterialCommunityIcons name="chevron-left" color='rgb(255, 3, 184)' size={50} onPress={() => navigation.goBack()} />
                                </TouchableOpacity>


                                <View style={[styles.mainContainer, { gap: 10, top: -20 }]}>



                                    <LinearGradient
                                        colors={['rgb(255, 3, 184)', 'transparent']}
                                        style={[styles.shadow, styles.deviceCard, { width: '95%' }]}
                                    >
                                        <View style={[styles.deviceCardPart, { width: '20%' }]}>
                                            <View style={{ backgroundColor: 'white', borderRadius: 500 }}>
                                                <MaterialCommunityIcons name={logo} color='rgb(255, 3, 184)' size={30} style={{ left: 0, padding: 10 }} />
                                            </View>
                                        </View>
                                        <View style={[styles.deviceCardPart, { width: '20%', alignItems: 'baseline' }]}>
                                            <View>
                                                <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>{name}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ fontSize: 12, color: 'rgb(225, 224, 224)', fontWeight: 'bold' }}>
                                                    {room} {/* • */} {/*deviceInfo.status ? deviceInfo.status.charAt(0).toUpperCase() + deviceInfo.status.slice(1) : "Loading..."*/}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={[{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', padding: 5, gap: 0 }]}>
                                            <Ionicons name="flash" color='rgb(255, 255, 255)' size={30}
                                                style={{ margin: 5 }} />
                                            <View style={[{ justifyContent: 'center', gap: -10 }]}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'rgb(216, 216, 216)' }}>Average</Text>
                                                <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'rgb(255, 255, 255)' }}>
                                                    {(!energyData) ? 0 : Math.floor(energyData.average)}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={[{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', padding: 5, gap: 10 }]}>
                                            <MaterialCommunityIcons name='heart-pulse' size={Platform.OS == 'web' ? 65 : 30} color={'rgba(255, 255, 255, 1)'} />
                                            <View style={[]} >
                                                <Text style={{
                                                    /* Idk why, but the bold weight for text is necessary else the last word doesnt show up on android, idk */
                                                    fontWeight: 'bold',
                                                    fontSize: Platform.OS == 'web' ? 30 : 15,
                                                    color: (healthStatus == 'Healthy') ? 'rgb(56, 253, 109)' : (healthStatus == 'Sick' ? 'rgb(230, 255, 4)' : 'rgb(212, 6, 6)')
                                                }} >
                                                    {healthStatus}
                                                </Text>
                                            </View>
                                        </View>
                                    </LinearGradient>

                                    <View style={[styles.shadow, styles.homePanel, {backgroundColor:theme=='dark' ? 'black' : 'black' }]}>

                                        <View style={{ padding: 20 }}>
                                            <Text style={{ color: 'rgb(147, 147, 147)' }}>---- {name} Energy Consumption ----</Text>
                                        </View>

                                        <View style={[styles.homeStats, { width: '95%' }]}>

                                            <View style={[styles.graphStats, { width: '100%', overflow: 'hidden' }]}>

                                                <View style={[{ paddingTop: 20, paddingBottom: 20, paddingLeft: 10, width: '100%', backgroundColor:theme=='dark' ? 'rgb(26, 28, 77)' : 'rgb(255,255,255)' }]}>



                                                    <LineChart

                                                        data={makeLineChartData(energyData)}
                                                        width={calculateChartWidth() - 0}
                                                        spacing={0.145 * (calculateChartWidth())}
                                                        noOfSections={4}
                                                        height={250}

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


                                                        //maxValue={250}
                                                        maxValue={(checkEnergyThreshold(energyData)) ? graphMax : 30}
                                                        yAxisOffset={0}
                                                        //yAxisOffset={50}
                                                        //yAxisOffset={Math.max(0, deviceInfo.base_energy-100)}
                                                        mostNegativeValue={0}

                                                        curved




                                                    //isAnimated

                                                    />



                                                </View>

                                            </View>



                                        </View>




                                    </View>


                                    <Text style={{ color: 'rgb(147, 147, 147)', marginTop: 10, fontSize: 20 }}>--- Activity Log ---</Text>

                                    <View
                                        style={[styles.activity, { alignItems: 'center' }]}
                                    >

                                        {loading ? (
                                            <ActivityIndicator size="large" color="#007BFF" />
                                        ) : (
                                            <View style={[{ width: '100%', alignItems: 'center' }]}>
                                                {activityLog.map((item, index) => (
                                                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                                        key={index}
                                                        style={[styles.activityLog]}
                                                    >
                                                        <Text style={{ fontSize: 25, color: 'white', fontWeight: 'bold' }}>{item}</Text>
                                                    </LinearGradient>
                                                ))}
                                            </View>
                                        )}



                                    </View>







                                </View>


                                <View style={{ height: 150 }}>{/*To allow space for tab bar to not overlap elements*/}</View>


                            </SafeAreaView>
                        </SafeAreaProvider >

                    </ScrollView >



                </View >
            </View >


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


                            <TouchableOpacity style={[styles.backButton]} >
                                <MaterialCommunityIcons name="chevron-left" color='rgb(255, 3, 184)' size={50} onPress={() => navigation.goBack()} />
                            </TouchableOpacity>


                            <View style={[styles.mainContainer]}>



                                <LinearGradient
                                    colors={['rgb(255, 3, 184)', 'transparent']}
                                    style={[styles.shadow, styles.deviceCard]}
                                >
                                    <View style={[styles.deviceCardPart, { width: '20%' }]}>
                                        <View style={{ backgroundColor: 'white', borderRadius: 500 }}>
                                            <MaterialCommunityIcons name={logo} color='rgb(255, 3, 184)' size={50} style={{ left: 0, padding: 10 }} />
                                        </View>
                                    </View>
                                    <View style={[styles.deviceCardPart, { width: '60%', alignItems: 'baseline' }]}>
                                        <View>
                                            <Text style={{ fontSize: 30, color: 'white', fontWeight: 'bold' }}>{name}</Text>
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 17, color: 'rgb(225, 224, 224)', fontWeight: 'bold' }}>
                                                {room} {/* • */} {/*deviceInfo.status ? deviceInfo.status.charAt(0).toUpperCase() + deviceInfo.status.slice(1) : "Loading..."*/}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[styles.deviceCardPart, { width: '20%' }]}>


                                    </View>
                                </LinearGradient>

                                <View style={[styles.shadow, styles.homePanel, {backgroundColor:theme=='dark' ? 'rgb(26, 28, 77)' : 'white'}]}>

                                    <View style={{ padding: 20 }}>
                                        <Text style={{ color: 'rgb(147, 147, 147)' }}>---- {name} Energy Consumption ----</Text>
                                    </View>

                                    <View style={[styles.homeStats]}>

                                        <View style={[styles.graphStats]}>

                                            <View style={[{ paddingTop: 20, paddingBottom: 20, paddingLeft: 10, width: '100%' }]}>



                                                <LineChart

                                                    data={makeLineChartData(energyData)}
                                                    width={calculateChartWidth()}
                                                    spacing={0.15 * (calculateChartWidth())}
                                                    noOfSections={4}
                                                    height={250}

                                                    color={'rgb(216, 75, 255)'}
                                                    thickness={10}
                                                    dataPointsColor={'rgb(255, 3, 184)'}
                                                    dataPointsRadius={8}

                                                    textFontSize={20}
                                                    textColor={'rgb(255, 3, 184)'}
                                                    textShiftY={-10}
                                                    textShiftX={-5}
                                                    xAxisColor={'gray'}

                                                    yAxisLabelSuffix=' kWh '
                                                    yAxisLabelWidth={80}
                                                    yAxisColor={'gray'}

                                                    xAxisLabelTextStyle={{ color: "gray" }}
                                                    yAxisTextStyle={{ color: "gray" }}


                                                    //maxValue={250}
                                                    maxValue={(checkEnergyThreshold(energyData)) ? graphMax : 30}
                                                    yAxisOffset={0}
                                                    //yAxisOffset={50}
                                                    //yAxisOffset={Math.max(0, deviceInfo.base_energy-100)}
                                                    mostNegativeValue={0}

                                                    curved




                                                //isAnimated

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
                                                    padding: 15,
                                                    flexDirection: 'row',
                                                    gap: 40,
                                                    borderRadius: 500,
                                                    backgroundColor: 'rgb(216, 75, 255)',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    paddingRight: 40,
                                                }
                                                ]}>
                                                <View style={[{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', padding: 5, gap: 10 }]}>
                                                    <Ionicons name="flash" color='rgb(255, 255, 255)' size={50}
                                                        style={{ margin: 5 }} />
                                                    <View style={[{ justifyContent: 'center' }]}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'rgb(216, 216, 216)' }}>Average</Text>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'rgb(255, 255, 255)' }}>
                                                            {(!energyData) ? 0 : Math.floor(energyData.average)}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View style={[{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', padding: 5, gap: 10 }]}>
                                                    <MaterialCommunityIcons name='heart-pulse' size={Platform.OS == 'web' ? 65 : 40} color={'rgba(255, 255, 255, 1)'} />
                                                    <View style={[]} >
                                                        <Text style={{
                                                            /* Idk why, but the bold weight for text is necessary else the last word doesnt show up on android, idk */
                                                            fontWeight: 'bold',
                                                            fontSize: Platform.OS == 'web' ? 30 : 15,
                                                            color: (healthStatus == 'Healthy') ? 'rgb(56, 253, 109)' : (healthStatus == 'Sick' ? 'rgb(230, 255, 4)' : 'rgb(212, 6, 6)')
                                                        }} >
                                                            {healthStatus}
                                                        </Text>
                                                    </View>
                                                </View>


                                            </LinearGradient>


                                            <View style={{ height: 20 }}></View>


                                            <View style={[styles.shadow, styles.recommend, {backgroundColor:theme=='dark' ? 'rgb(39, 41, 112)' : 'rgb(243, 243, 243)'}]}>
                                                <Text style={[styles.recText, { alignSelf: 'center' }]}>--- Recommendations ---</Text>
                                                {healthStatus != 'Faulty' && <Text style={[styles.recText, {}]}>• A good time to run {device.name} would be 00:00 - 00:00</Text>}
                                                {healthStatus != 'Faulty' && <Text style={[styles.recText, {}]}>• {device.name} has been running for too long, turn it off?</Text>}

                                                {healthStatus == 'Sick' && <Text style={[styles.recText, {}]}>• Enable Low Power Mode</Text>}


                                                {/*AC*/}
                                                {healthStatus == 'Sick' && (device.logo == 'air-conditioner') && <Text style={[styles.recText, {}]}>• Lower Fan Speed</Text>}

                                                {/*Light*/}
                                                {healthStatus == 'Sick' && (device.logo == 'lamp-outline') && <Text style={[styles.recText, {}]}>• Reduce Intensity</Text>}

                                                {/*TV*/}
                                                {healthStatus == 'Sick' && (device.logo == 'television') && <Text style={[styles.recText, {}]}>• Switch From Streaming</Text>}
                                                {healthStatus == 'Sick' && (device.logo == 'television') && <Text style={[styles.recText, {}]}>• Reduce Brightness</Text>}


                                                {/*Roomba*/}
                                                {healthStatus == 'Sick' && (device.logo == 'robot-vacuum') && <Text style={[styles.recText, {}]}>• Turn Off Spotless Mode</Text>}




                                                {healthStatus == 'Faulty' && <Text style={[styles.recText, {}]}>• Turn Off {device.name}</Text>}
                                                {healthStatus == 'Faulty' && <Text style={[styles.recText, {}]}>• Clean {device.name}</Text>}
                                                {healthStatus == 'Faulty' && <Text style={[styles.recText, {}]}>• Repair {device.name}</Text>}

                                            </View>


                                        </View>

                                    </View>




                                </View>


                                <Text style={{ color: 'rgb(147, 147, 147)', marginTop: 10, fontSize: 20 }}>--- Activity Log ---</Text>

                                <View
                                    style={[styles.activity, { alignItems: 'center' }]}
                                >

                                    {loading ? (
                                        <ActivityIndicator size="large" color="#007BFF" />
                                    ) : (
                                        <View style={[{ width: '100%', alignItems: 'center' }]}>
                                            {activityLog.map((item, index) => (
                                                <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                                    key={index}
                                                    style={[styles.activityLog]}
                                                >
                                                    <Text style={{ fontSize: 25, color: 'white', fontWeight: 'bold' }}>{item}</Text>
                                                </LinearGradient>
                                            ))}
                                        </View>
                                    )}



                                </View>







                            </View>


                            <View style={{ height: 150 }}>{/*To allow space for tab bar to not overlap elements*/}</View>


                        </SafeAreaView>
                    </SafeAreaProvider >

                </ScrollView >



            </View >
        </View >


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
    mainContainer: {
        alignItems: 'center',     //horizontal
        gap: 40,
        width: '100%',
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

    backButton: {
        //width:'10%',
        maxWidth: 80,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },

    deviceCard: {
        flexDirection: 'row',
        borderRadius: 50,
        backgroundColor: 'rgb(216, 75, 255)',
        width: '100%',
        maxWidth: 500,
        alignItems: 'center',
        justifyContent: 'center'
    },
    deviceCardPart: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    switch: {
        //width: '100%',
        //height: '100%',
        width: '90%',
        borderRadius: 500,
        aspectRatio: 2 / 1,
        flexDirection: 'row',
        backgroundColor: 'rgba(200, 200, 200, 0.9)',
    },
    switchCircle: {
        height: '100%',
        aspectRatio: 1,
        backgroundColor: 'white',
        borderRadius: 500,
        justifyContent: 'center',
        alignItems: 'center',

    },

    options: {
        width: '100%',
        maxWidth: 650,
        flexDirection: 'row',
    },
    optionButton: {
        width: '60&',       //& apparently makes it centered perfectly idk
        aspectRatio: 1,
        borderRadius: 40,
        backgroundColor: 'rgb(235, 235, 235)',
        justifyContent: 'center',
        alignItems: 'center',
    },


    statsBar: {
        width: '90%',
        maxWidth: 900,
        flexDirection: 'row',
        backgroundColor: "rgb(255, 255, 255)",
        borderRadius: 70,
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


    activity: {
        width: '80%',
        //alignItems:'center',
        //justifyContent:'center'
    },

    activityLog: {
        width: '100%',
        marginBottom: 30,
        padding: 25,
        maxWidth: 1000,
        backgroundColor: 'rgba(216, 75, 255, 1)',
        borderRadius: 50,
        alignItems: 'center'
    },


    recommend: {
        //alignItems: 'center',
        padding: 25,
        backgroundColor: 'rgb(243, 243, 243)',
        borderRadius: 50,
    },

    recText: {
        color: 'rgba(216, 75, 255, 1)',
        fontSize: 22,
        fontWeight: 'bold',
    },


    dropdownContainer: {
        width: '100%',
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
