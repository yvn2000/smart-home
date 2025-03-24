import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, Dimensions, Alert, ActivityIndicator

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "../components/themes/theme";

import LavaLampBackground from "../components/themes/lava-lamp-bg";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


import { BarChart, barDataItem } from "react-native-gifted-charts";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Easing, useSharedValue, withTiming, useAnimatedStyle, withSequence, withRepeat, withSpring } from 'react-native-reanimated';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { captureRef } from "react-native-view-shot";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { LineChart } from "react-native-gifted-charts"; // Adjust based on your chart library


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

//pdfMake.vfs = pdfFonts.pdfMake.vfs; // Set up font files for pdfmake


import { API_BASE_URL } from "../src/config";




export default function ShareStatsScreen() {

    const navigation = useNavigation()
    const route = useRoute();

    const { energyData, energyThreshold, lineChartData, lineChartWidth, barChartData, total_energy1, house_id, allRooms } = route.params

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


    const [firstName, setFirstName] = useState("name")
    const [lastName, setLastName] = useState("name")
    const [userType, setUserType] = useState("name")
    const [loading, setLoading] = useState(true);

    const getFirstName = async () => {
        setFirstName(await AsyncStorage.getItem("first_name"))
        setLastName(await AsyncStorage.getItem("last_name"))
        setUserType(await AsyncStorage.getItem("user_type"))
    }

    useFocusEffect(

        useCallback(() => {
            const reloadData = async () => {
                setShared(false)
                await getFirstName();
                await fetchHouseOwnership(house_id)
            }
            console.log(energyData)
            reloadData()
            console.log(allRooms)
            console.log(allRooms.flatMap(room => room.devices)  // Flatten devices from all rooms into a single array
                .sort((a, b) => b.energy_consumption - a.energy_consumption) // Sort by energy consumption (descending)
                .slice(0, 5))
        }, []) // Still empty array - we're using latest state in callbacks
    )

    const [houseName, setHouseName] = useState('House')
    const [ownerFN, setOwnerFN] = useState('OFN')
    const [ownerLN, setOwnerLN] = useState('OLN')
    const [landlordFN, setLandlordFN] = useState('LFN')
    const [landlordLN, setLandlordLN] = useState('LLN')



    const fetchHouseOwnership = async (houseid) => {


        //const url = Platform.OS == 'web' ? `http://127.0.0.1:8000/api/houses/${houseid}/get-owner-landlord/` : `http://10.0.2.2:8000/api/houses/${houseid}/get-owner-landlord/`
        const url = `${API_BASE_URL}/api/houses/${houseid}/get-owner-landlord/`

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                console.log(data.house_name)
                console.log(data.owner_fn)
                console.log(data.owner_ln)
                console.log(data.landlord_fn)
                console.log(data.landlord_ln)
                setHouseName(data.house_name)
                setOwnerFN(data.owner_fn)
                setOwnerLN(data.owner_ln)
                setLandlordFN(data.landlord_fn)
                setLandlordLN(data.landlord_ln)
                //console.log("Data: " + arrayData)
                //console.log(rooms)
                //console.log(stringData[0].room_id)
                //console.log(rooms[0].room_id)
                //console.log("Data: "+stringData)
                //console.log("Rooms: "+rooms)
            } else {
                //setError(data.error || "Failed to fetch rooms");
                console.log(data.error || "Failed to fetch ownerships")
            }
        } catch (error) {
            //setError("Network error, please try again.");
            console.log(error)
        } finally {

        }
    };
















    const graphRef = useRef();


    var currentdate = new Date();

    const generatePDF = async () => {
        try {
            // Capture the chart as an image
            const uri = await captureRef(graphRef, {
                format: "png",
                quality: 1,
            });

            if (true || Platform.OS == "web") {
                const docDefinition = {
                    content: [
                        { text: "Smart Home Energy Statistics Report", style: "header" },
                        { text: `\tHouse: ${houseName}  |  House ID: ${house_id}`, fontSize: 10 },
                        { text: `\tHome Owner: ${ownerFN + " " + ownerLN}  |  Landlord: ${landlordFN} ${landlordLN}`, fontSize: 10 },
                        {
                            text: `\tTime & Date: ${((currentdate.getHours() < 10) ? "0" : "") + currentdate.getHours() + ":" +
                                ((currentdate.getMinutes() < 10) ? "0" : "") + currentdate.getMinutes() + ":" +
                                ((currentdate.getSeconds() < 10) ? "0" : "") + currentdate.getSeconds() + "  " +
                                currentdate.getDate() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getFullYear()
                                }`, fontSize: 10
                        },
                        { image: uri, width: 300, alignment: 'center' }, // Embed captured image
                    ],
                    styles: {
                        header: { fontSize: 18, bold: true, marginBottom: 10 },
                    },
                };

                // Create and download the PDF
                pdfMake.createPdf(docDefinition).download("Smart_Home_Report.pdf");
                return;
            }

            console.log("BEFORE HTMLCONTENT")
            // Generate the PDF with the captured image
            const htmlContent = `
              <html>
                <body style="text-align: center; font-family: Arial;">
                  <h1>Smart Home Energy Statistics Report</h1>
                  <p>Energy consumption over time</p>
                  <img src="${uri}" style="width: 100%; height: auto;" />
                </body>
              </html>
            `;

            console.log("BEFORE PDFURI")
            const { uri: pdfUri } = await Print.printToFileAsync({ htmlContent });
            console.log("AFTER PDFURI")

            // Share on mobile
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(pdfUri);
            } else {
                //Alert.alert("Sharing not available");
                console.log("Sharing not available")
            }
        } catch (error) {
            console.error("PDF Generation Error:", error);
        }
    };



    const [shared, setShared] = useState(false);

    if (Platform.OS != 'web') {
        return (



            <View style={{ height: '100%', flex: 1 }}>
                <StatusBar style={theme == 'light' ? 'dark' : 'light'} />
                <View style={{ height: '100%', width: '100%', display: 'flex' }}>
                    {(theme == 'crazy') && <LavaLampBackground />}
                </View>

                {/*Main Screen*/}
                <View style={[styles.screen, themeMode, { position: 'absolute', /*flexDirection: 'row'*/ }]}>

                    <View style={[{ height: '100%' }]}>

                        <SafeAreaProvider style={[{ height: '100%', width: '100%' }]}>
                            <SafeAreaView style={[{ height: '100%', width: '100%' }]}>

                                <TouchableOpacity style={[styles.backButton,{maxHeight:80, padding:0}]} >
                                    <MaterialCommunityIcons name="chevron-left" color={theme == 'crazy' ? 'white' : 'rgb(255, 3, 184)'} size={50} onPress={() => navigation.goBack()} />
                                </TouchableOpacity>

                                <View style={[{ width: '100%', alignItems: 'center', padding: 20, marginTop:-40 }]}>
                                    <Text style={{ fontSize: Platform.OS == 'web' ? 35 : 20, fontWeight: 'bold', color: theme == 'crazy' ? 'white' : 'rgb(255, 3, 184)' }}>
                                        Share Statistics
                                    </Text>
                                </View>

                                <View style={[styles.mainContainer, {}]}>

                                    {/*<Button title="Download PDF" onPress={generatePDF} />*/}


                                    {userType.toLowerCase() != 'landlord' && <View style={{
                                        width: '90%', maxWidth: 600, padding: 30,
                                        backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255,255,255)',
                                        borderRadius: 50,
                                    }}>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, }}>

                                            <MaterialCommunityIcons name={"account-circle"} size={30} color={'rgb(255, 3, 184)'} />

                                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'rgb(255, 3, 184)' }}>
                                                {firstName + " " + lastName}
                                            </Text>

                                        </View>

                                        <View style={{ padding: 10 }}>

                                            <Text style={{ color: theme == 'dark' ? 'white' : 'black' }}>

                                                I just checked my home’s energy usage with AuraTech Smart Home and optimized my consumption! ⚡🌍 Saving energy, saving money, and making a difference! #SmartHome #EnergySaver

                                            </Text>


                                        </View>

                                        <View style={{ alignItems: 'center', padding: 20 }}>
                                            <LineChart

                                                data={lineChartData}
                                                width={lineChartWidth - 100}
                                                spacing={0.145 * (lineChartWidth)}
                                                noOfSections={4}
                                                height={150}

                                                color={'rgb(216, 75, 255)'}
                                                thickness={8}
                                                dataPointsColor={'rgb(255, 3, 184)'}
                                                dataPointsRadius={5}

                                                textFontSize={15}
                                                textColor={'rgb(255, 3, 184)'}
                                                textShiftY={-10}
                                                textShiftX={-5}

                                                yAxisLabelSuffix=' kWh '
                                                yAxisLabelWidth={50}
                                                yAxisTextStyle={{ color: "gray", fontSize: 15 }}
                                                xAxisLabelTextStyle={{ color: "gray", fontSize: 10, }}
                                                yAxisColor={'gray'}
                                                xAxisColor={'gray'}


                                                //maxValue={250}
                                                //maxValue={(checkEnergyThreshold(totalEnergyData)) ? graphMax : 30}
                                                //maxValue={1000}
                                                //maxValue={totalEnergyData ? totalEnergyData.total_energy + 180 : 150}
                                                maxValue={energyData ? energyThreshold + 180 : 150}
                                                yAxisOffset={0}
                                                //yAxisOffset={50}
                                                //yAxisOffset={Math.max(0, deviceInfo.base_energy-100)}
                                                mostNegativeValue={0}

                                                curved




                                            //isAnimated

                                            />
                                        </View>

                                        <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', justifyContent: 'center' }}>
                                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                                                <MaterialCommunityIcons name={"chart-bell-curve-cumulative"} size={25} color={'rgb(255, 3, 184)'} />
                                                <Text style={{ fontWeight: 'bold', color: 'rgb(255, 3, 184)', fontSize: 20 }}>5</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                                                <MaterialCommunityIcons name={"repeat-variant"} size={25} color={'rgb(255, 3, 184)'} />
                                                <Text style={{ fontWeight: 'bold', color: 'rgb(255, 3, 184)', fontSize: 20 }}>3</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                                                <MaterialCommunityIcons name={"comment-outline"} size={25} color={'rgb(255, 3, 184)'} />
                                                <Text style={{ fontWeight: 'bold', color: 'rgb(255, 3, 184)', fontSize: 20 }}>3</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                                                <MaterialCommunityIcons name={"heart-outline"} size={25} color={'rgb(255, 3, 184)'} />
                                                <Text style={{ fontWeight: 'bold', color: 'rgb(255, 3, 184)', fontSize: 20 }}>12</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                                                <MaterialCommunityIcons name={"share-variant"} size={25} color={'rgb(255, 3, 184)'} />

                                            </View>

                                        </View>



                                    </View>}


                                    {userType.toLowerCase() != 'landlord' && <View style={{ flexDirection: 'row', gap: 20, }} >

                                        <TouchableOpacity
                                            onPress={() => { setShared(true) }}
                                        >
                                            <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                                style={{
                                                    backgroundColor: 'rgb(216, 75, 255)', padding: 20, borderRadius: 30,
                                                    minWidth: 100, alignItems: 'center', height: 60, justifyContent: 'center'
                                                }}
                                            >
                                                {!shared && <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 15 }}>Share</Text>}
                                                {shared && <MaterialCommunityIcons name={'check'} size={20} color={'white'} />}
                                            </LinearGradient>


                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => { navigation.goBack() }}
                                        >
                                            <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                                style={{
                                                    backgroundColor: 'rgb(216, 75, 255)', padding: 20, borderRadius: 30,
                                                    alignItems: 'center', height: 60, justifyContent: 'center'
                                                }}
                                            >
                                                <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 15 }}>Cancel</Text>
                                            </LinearGradient>


                                        </TouchableOpacity>

                                    </View>}




                                    {userType.toLowerCase() != 'landlord' && <View><Text style={{ color: 'gray' }}>----------------------------</Text></View>}



                                    <TouchableOpacity
                                        onPress={() => { generatePDF() }}
                                    >
                                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                            style={{
                                                backgroundColor: 'rgb(216, 75, 255)', padding: 20, borderRadius: 30,
                                            }}
                                        >
                                            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 15 }}>Download Statistics PDF</Text>
                                        </LinearGradient>


                                    </TouchableOpacity>


                                    <View style={{ height: 1000 }}></View>


                                    {true && <View ref={graphRef} collapsable={false} style={{
                                        padding: 10, alignItems: 'center'

                                    }}>


                                        <View style={{ height: 40, }}></View>

                                        <View style={{
                                            //flexDirection:'row', 
                                            gap: 20
                                        }}>
                                            <View style={{ alignItems: 'center' }}>
                                                <Text style={{ fontWeight: 'bold' }}>Current Home Energy Usage</Text>
                                                <LineChart

                                                    data={lineChartData}
                                                    width={lineChartWidth - 100}
                                                    spacing={0.145 * (lineChartWidth)}
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
                                                    maxValue={energyData ? energyThreshold + 180 : 150}
                                                    yAxisOffset={0}
                                                    //yAxisOffset={50}
                                                    //yAxisOffset={Math.max(0, deviceInfo.base_energy-100)}
                                                    mostNegativeValue={0}

                                                    curved




                                                //isAnimated

                                                />
                                            </View>

                                            <View style={{ alignItems: 'center' }}>
                                                <Text style={{ fontWeight: 'bold' }}>Current Week Energy Usage</Text>
                                                <BarChart

                                                    //key={chartKey}
                                                    //data={[{ value: 100, frontColor: 'green' }, { value: 50, frontColor: 'yellow' }]}
                                                    data={barChartData}
                                                    //width={550}
                                                    //width={750}
                                                    width={lineChartWidth}
                                                    //barWidth={30}
                                                    barWidth={0.05 * (lineChartWidth)}
                                                    //spacing={40}
                                                    spacing={0.07 * (lineChartWidth)}
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


                                        <View style={{ height: 40 }}></View>


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
                                                    <Text style={{ fontWeight: 'bold', fontSize: 25, color: theme == 'dark' ? 'white' : 'dark' }}>{total_energy1 ? Math.floor(total_energy1) : 0} kWh</Text>
                                                </View>

                                                {/*
                                                    <View style={[{ justifyContent: 'center', }]}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'rgb(149, 149, 149)' }}>Today</Text>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 25, color: theme == 'dark' ? 'white' : 'dark' }}>20 kWh</Text>
                                                    </View>
                                                    */}

                                            </LinearGradient>

                                            <View style={{ height: 70, borderColor: 'rgb(199, 199, 199)', borderWidth: 1 }}>

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
                                                    <Text style={{ fontWeight: 'bold', fontSize: 25, color: theme == 'dark' ? 'white' : 'dark' }}>${total_energy1 ? Math.floor(total_energy1 * 0.29) : 0}</Text>
                                                </View>

                                            </LinearGradient>


                                        </View>

                                        <View style={{ height: 70 }}></View>

                                        <Text style={[{ fontSize: 27, fontWeight: 'bold', color: 'black' }]}>
                                            Highest Energy Using Devices
                                        </Text>


                                        {(
                                            allRooms.flatMap(room => room.devices)  // Flatten devices from all rooms into a single array
                                                .sort((a, b) => b.energy_consumption - a.energy_consumption) // Sort by energy consumption (descending)
                                                .slice(0, 5)
                                        ).map((device, index) => (
                                            <View key={device.device_id}
                                                style={[styles.shadow, {
                                                    width: 700, borderRadius: 50, marginTop: 40, backgroundColor: 'rgb(255, 3, 184)',
                                                    flexDirection: 'row',
                                                    padding: 20,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }]}>


                                                <View
                                                    style={[
                                                        {
                                                            width: '10%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', padding: 20,
                                                            backgroundColor: 'white', borderRadius: 500,
                                                        }
                                                    ]}>
                                                    <MaterialCommunityIcons
                                                        name={device.logo} size={50} //color='rgb(255, 255, 255)'
                                                        style={{ color: 'rgb(255, 3, 184)', backgroundColor: 'transparent', }}
                                                    />
                                                </View>

                                                <View style={[{ width: '80%', justifyContent: 'center' }]}>

                                                    <View style={{ bottom: '0%', left: '5%' }}>
                                                        <Text style={[{ fontSize: 27, fontWeight: 'bold', color: 'white' }]}>
                                                            {device.name}
                                                        </Text>
                                                        <Text style={[{
                                                            fontSize: 20, fontWeight: 'bold', color: 'rgb(255, 255, 255)',
                                                            position: 'absolute', right: 30,
                                                        }]}>
                                                            {device.energy_consumption} kWh
                                                        </Text>
                                                    </View>

                                                </View>


                                            </View>
                                        ))}


                                    </View>}




                                </View>

                                <View style={{ height: 130 }}></View>






                            </SafeAreaView>
                        </SafeAreaProvider>

                    </View >



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

                <View style={[{ height: '100%' }]}>

                    <SafeAreaProvider style={[{ height: '100%', width: '100%' }]}>
                        <SafeAreaView style={[{ height: '100%', width: '100%' }]}>

                            <TouchableOpacity style={[styles.backButton]} >
                                <MaterialCommunityIcons name="chevron-left" color={theme == 'crazy' ? 'white' : 'rgb(255, 3, 184)'} size={50} onPress={() => navigation.goBack()} />
                            </TouchableOpacity>

                            <View style={[{ width: '100%', alignItems: 'center', padding: 20 }]}>
                                <Text style={{ fontSize: Platform.OS == 'web' ? 35 : 15, fontWeight: 'bold', color: theme == 'crazy' ? 'white' : 'rgb(255, 3, 184)' }}>
                                    Share Statistics
                                </Text>
                            </View>

                            <View style={[styles.mainContainer, {}]}>

                                {/*<Button title="Download PDF" onPress={generatePDF} />*/}


                                {userType.toLowerCase() != 'landlord' && <View style={{
                                    width: '90%', maxWidth: 600, padding: 30,
                                    backgroundColor: theme == 'dark' ? 'rgb(26, 28, 77)' : 'rgb(255,255,255)',
                                    borderRadius: 50,
                                }}>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, }}>

                                        <MaterialCommunityIcons name={"account-circle"} size={30} color={'rgb(255, 3, 184)'} />

                                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'rgb(255, 3, 184)' }}>
                                            {firstName + " " + lastName}
                                        </Text>

                                    </View>

                                    <View style={{ padding: 10 }}>

                                        <Text style={{ color: theme == 'dark' ? 'white' : 'black' }}>

                                            I just checked my home’s energy usage with AuraTech Smart Home and optimized my consumption! ⚡🌍 Saving energy, saving money, and making a difference! #SmartHome #EnergySaver

                                        </Text>


                                    </View>

                                    <View style={{ alignItems: 'center', padding: 20 }}>
                                        <LineChart

                                            data={lineChartData}
                                            width={lineChartWidth - 100}
                                            spacing={0.145 * (lineChartWidth)}
                                            noOfSections={4}
                                            height={150}

                                            color={'rgb(216, 75, 255)'}
                                            thickness={8}
                                            dataPointsColor={'rgb(255, 3, 184)'}
                                            dataPointsRadius={5}

                                            textFontSize={15}
                                            textColor={'rgb(255, 3, 184)'}
                                            textShiftY={-10}
                                            textShiftX={-5}

                                            yAxisLabelSuffix=' kWh '
                                            yAxisLabelWidth={50}
                                            yAxisTextStyle={{ color: "gray", fontSize: 15 }}
                                            xAxisLabelTextStyle={{ color: "gray", fontSize: 10, }}
                                            yAxisColor={'gray'}
                                            xAxisColor={'gray'}


                                            //maxValue={250}
                                            //maxValue={(checkEnergyThreshold(totalEnergyData)) ? graphMax : 30}
                                            //maxValue={1000}
                                            //maxValue={totalEnergyData ? totalEnergyData.total_energy + 180 : 150}
                                            maxValue={energyData ? energyThreshold + 180 : 150}
                                            yAxisOffset={0}
                                            //yAxisOffset={50}
                                            //yAxisOffset={Math.max(0, deviceInfo.base_energy-100)}
                                            mostNegativeValue={0}

                                            curved




                                        //isAnimated

                                        />
                                    </View>

                                    <View style={{ flexDirection: 'row', gap: 40, alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                                            <MaterialCommunityIcons name={"chart-bell-curve-cumulative"} size={25} color={'rgb(255, 3, 184)'} />
                                            <Text style={{ fontWeight: 'bold', color: 'rgb(255, 3, 184)', fontSize: 20 }}>5</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                                            <MaterialCommunityIcons name={"repeat-variant"} size={25} color={'rgb(255, 3, 184)'} />
                                            <Text style={{ fontWeight: 'bold', color: 'rgb(255, 3, 184)', fontSize: 20 }}>3</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                                            <MaterialCommunityIcons name={"comment-outline"} size={25} color={'rgb(255, 3, 184)'} />
                                            <Text style={{ fontWeight: 'bold', color: 'rgb(255, 3, 184)', fontSize: 20 }}>3</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                                            <MaterialCommunityIcons name={"heart-outline"} size={25} color={'rgb(255, 3, 184)'} />
                                            <Text style={{ fontWeight: 'bold', color: 'rgb(255, 3, 184)', fontSize: 20 }}>12</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                                            <MaterialCommunityIcons name={"share-variant"} size={25} color={'rgb(255, 3, 184)'} />

                                        </View>

                                    </View>



                                </View>}


                                {userType.toLowerCase() != 'landlord' && <View style={{ flexDirection: 'row', gap: 20, }} >

                                    <TouchableOpacity
                                        onPress={() => { setShared(true) }}
                                    >
                                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                            style={{
                                                backgroundColor: 'rgb(216, 75, 255)', padding: 20, borderRadius: 30,
                                                minWidth: 100, alignItems: 'center', maxHeight: 50, justifyContent: 'center'
                                            }}
                                        >
                                            {!shared && <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 15 }}>Share</Text>}
                                            {shared && <MaterialCommunityIcons name={'check'} size={30} color={'white'} />}
                                        </LinearGradient>


                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => { navigation.goBack() }}
                                    >
                                        <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                            style={{
                                                backgroundColor: 'rgb(216, 75, 255)', padding: 20, borderRadius: 30,
                                                alignItems: 'center', maxHeight: 50, justifyContent: 'center'
                                            }}
                                        >
                                            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 15 }}>Cancel</Text>
                                        </LinearGradient>


                                    </TouchableOpacity>

                                </View>}




                                {userType.toLowerCase() != 'landlord' && <View><Text style={{ color: 'gray' }}>----------------------------</Text></View>}



                                <TouchableOpacity
                                    onPress={() => { generatePDF() }}
                                >
                                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                        style={{
                                            backgroundColor: 'rgb(216, 75, 255)', padding: 20, borderRadius: 30,
                                        }}
                                    >
                                        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 15 }}>Download Statistics PDF</Text>
                                    </LinearGradient>


                                </TouchableOpacity>


                                <View style={{ height: 1000 }}></View>


                                {true && <View ref={graphRef} collapsable={false} style={{
                                    padding: 10, alignItems: 'center'

                                }}>


                                    <View style={{ height: 40, }}></View>

                                    <View style={{
                                        //flexDirection:'row', 
                                        gap: 20
                                    }}>
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ fontWeight: 'bold' }}>Current Home Energy Usage</Text>
                                            <LineChart

                                                data={lineChartData}
                                                width={lineChartWidth - 100}
                                                spacing={0.145 * (lineChartWidth)}
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
                                                maxValue={energyData ? energyThreshold + 180 : 150}
                                                yAxisOffset={0}
                                                //yAxisOffset={50}
                                                //yAxisOffset={Math.max(0, deviceInfo.base_energy-100)}
                                                mostNegativeValue={0}

                                                curved




                                            //isAnimated

                                            />
                                        </View>

                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ fontWeight: 'bold' }}>Current Week Energy Usage</Text>
                                            <BarChart

                                                //key={chartKey}
                                                //data={[{ value: 100, frontColor: 'green' }, { value: 50, frontColor: 'yellow' }]}
                                                data={barChartData}
                                                //width={550}
                                                //width={750}
                                                width={lineChartWidth}
                                                //barWidth={30}
                                                barWidth={0.05 * (lineChartWidth)}
                                                //spacing={40}
                                                spacing={0.07 * (lineChartWidth)}
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


                                    <View style={{ height: 40 }}></View>


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
                                                <Text style={{ fontWeight: 'bold', fontSize: 25, color: theme == 'dark' ? 'white' : 'dark' }}>{total_energy1 ? Math.floor(total_energy1) : 0} kWh</Text>
                                            </View>

                                            {/*
                                                    <View style={[{ justifyContent: 'center', }]}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'rgb(149, 149, 149)' }}>Today</Text>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 25, color: theme == 'dark' ? 'white' : 'dark' }}>20 kWh</Text>
                                                    </View>
                                                    */}

                                        </LinearGradient>

                                        <View style={{ height: 70, borderColor: 'rgb(199, 199, 199)', borderWidth: 1 }}>

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
                                                <Text style={{ fontWeight: 'bold', fontSize: 25, color: theme == 'dark' ? 'white' : 'dark' }}>${total_energy1 ? Math.floor(total_energy1 * 0.29) : 0}</Text>
                                            </View>

                                        </LinearGradient>


                                    </View>

                                    <View style={{ height: 70 }}></View>

                                    <Text style={[{ fontSize: 27, fontWeight: 'bold', color: 'black' }]}>
                                        Highest Energy Using Devices
                                    </Text>


                                    {(
                                        allRooms.flatMap(room => room.devices)  // Flatten devices from all rooms into a single array
                                            .sort((a, b) => b.energy_consumption - a.energy_consumption) // Sort by energy consumption (descending)
                                            .slice(0, 5)
                                    ).map((device, index) => (
                                        <View key={device.device_id}
                                            style={[styles.shadow, {
                                                width: 700, borderRadius: 50, marginTop: 40, backgroundColor: 'rgb(255, 3, 184)',
                                                flexDirection: 'row',
                                                padding: 20,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }]}>


                                            <View
                                                style={[
                                                    {
                                                        width: '10%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', padding: 20,
                                                        backgroundColor: 'white', borderRadius: 500,
                                                    }
                                                ]}>
                                                <MaterialCommunityIcons
                                                    name={device.logo} size={50} //color='rgb(255, 255, 255)'
                                                    style={{ color: 'rgb(255, 3, 184)', backgroundColor: 'transparent', }}
                                                />
                                            </View>

                                            <View style={[{ width: '80%', justifyContent: 'center' }]}>

                                                <View style={{ bottom: '0%', left: '5%' }}>
                                                    <Text style={[{ fontSize: 27, fontWeight: 'bold', color: 'white' }]}>
                                                        {device.name}
                                                    </Text>
                                                    <Text style={[{
                                                        fontSize: 20, fontWeight: 'bold', color: 'rgb(255, 255, 255)',
                                                        position: 'absolute', right: 30,
                                                    }]}>
                                                        {device.energy_consumption} kWh
                                                    </Text>
                                                </View>

                                            </View>


                                        </View>
                                    ))}


                                </View>}




                            </View>

                            <View style={{ height: 130 }}></View>






                        </SafeAreaView>
                    </SafeAreaProvider>

                </View >



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

    backButton: {
        //width:'10%',
        maxWidth: 80,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
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

