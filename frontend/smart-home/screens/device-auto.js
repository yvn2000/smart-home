import { useNavigation, useRoute } from "@react-navigation/native";

import { StatusBar } from "expo-status-bar";
import {
    Platform, StyleSheet, ScrollView, Text, View, TextInput, Button,
    TouchableOpacity, FlatList, PanResponder

} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { useTheme } from "../components/themes/theme";

import LavaLampBackground from "../components/themes/lava-lamp-bg";

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


import { HeaderBackButton } from "@react-navigation/elements";
import { LinearGradient } from 'expo-linear-gradient';

import Modal from "react-native-modal";
import { Dropdown } from 'react-native-element-dropdown';
import { TimePickerModal } from 'react-native-paper';

import { Switch } from 'react-native-switch';


export default function DeviceAuto() {

    const route = useRoute()
    const navigation = useNavigation()

    const { device, device_id } = route.params
    //console.log("Status: "+status)

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        //console.log("GOAT: " + device_id)
        setLoading(false)
    }, [device, device_id]); // Logs when devices update

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

    const data = [
        { label: 'Time', value: 'time' },
        { label: 'Voice', value: 'voice' },
    ];

    //Add auto parameters
    const [autoType, setAutoType] = useState('time')
    const [func, setFunc] = useState('')
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)
    const [active, setActive] = useState(true)

    const [phrase, setPhrase] = useState('')


    const setStart = (value) => {
        //console.log("Start :" + value)
        setStartTime(value)
    }
    const setEnd = (value) => {
        //console.log("End: " + value)
        setEndTime(value)
    }


    const [isFocus, setIsFocus] = useState(false);


    const toggleDropdown = () => {
        setAutoType('time')
        setFunc('')
        setStartTime(null)
        setEndTime(null)
        setActive(true)
        setPhrase('')
        setDropdownVisible(!isDropdownVisible);
    };


    const TimePicker = ({ time, onChange }) => {
        const hours = Array.from({ length: 24 }, (_, i) => i);
        const minutes = Array.from({ length: 60 }, (_, i) => i);
        const hourScrollRef = useRef(null);
        const minuteScrollRef = useRef(null);

        const currentHour = time?.getHours() || new Date().getHours();
        const currentMinute = time?.getMinutes() || new Date().getMinutes();

        // Scroll to initial position on mount
        useEffect(() => {
            if (hourScrollRef.current) {
                hourScrollRef.current.scrollTo({ y: currentHour * 40, animated: false });
            }
            if (minuteScrollRef.current) {
                minuteScrollRef.current.scrollTo({ y: currentMinute * 40, animated: false });
            }
        }, []);

        const handleHourChange = (hour) => {
            const newTime = new Date(time || new Date());
            newTime.setHours(hour);
            onChange(newTime);
            hourScrollRef.current.scrollTo({ y: hour * 40, animated: true });
        };

        const handleMinuteChange = (minute) => {
            const newTime = new Date(time || new Date());
            newTime.setMinutes(minute);
            onChange(newTime);
            minuteScrollRef.current.scrollTo({ y: minute * 40, animated: true });
        };

        return (
            <View style={styles.timePickerContainer}>
                <View style={styles.timeColumn}>
                    <ScrollView
                        ref={hourScrollRef}
                        showsVerticalScrollIndicator={false}
                        snapToInterval={40}
                        decelerationRate="fast"
                        contentContainerStyle={styles.scrollContent}
                    >
                        {hours.map((hour) => (
                            <TouchableOpacity
                                key={`hour-${hour}`}
                                style={[
                                    styles.timeItem,
                                    currentHour === hour && styles.selectedTimeItem
                                ]}
                                onPress={() => handleHourChange(hour)}
                            >
                                <Text style={styles.timeText}>
                                    {hour.toString().padStart(2, '0')}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <Text style={styles.timeSeparator}>:</Text>

                <View style={styles.timeColumn}>
                    <ScrollView
                        ref={minuteScrollRef}
                        showsVerticalScrollIndicator={false}
                        snapToInterval={40}
                        decelerationRate="fast"
                        contentContainerStyle={styles.scrollContent}
                    >
                        {minutes.map((minute) => (
                            <TouchableOpacity
                                key={`minute-${minute}`}
                                style={[
                                    styles.timeItem,
                                    currentMinute === minute && styles.selectedTimeItem
                                ]}
                                onPress={() => handleMinuteChange(minute)}
                            >
                                <Text style={styles.timeText}>
                                    {minute.toString().padStart(2, '0')}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        );
    };









    const addAutomation = async () => {
        try {

            const url = Platform.OS == "android" ? `http://10.0.2.2:8000/api/automations/add/` : `http://127.0.0.1:8000/api/automations/add/`

            if (autoType == 'time' && (!startTime && !endTime)) {
                console.log("Give start and end times")
                return "Give start and end times"
            }
            else if (autoType == 'voice' && (phrase == '')) {
                console.log("Give activation phrase")
                return "Give activation phrase"
            }

            //console.log(startTime)
            //console.log(endTime)


            const payload = {
                device_id: device_id,
                automation_type: autoType,
                //function: automationData.function,
                active: active,
                function: autoType === 'time'
                    ? `Time Based: ${startTime.toISOString()} to ${endTime.toISOString()}`
                    : `Voice Based: Phrase-> ${phrase}`
            };

            if (autoType === 'time') {
                payload.start_time = startTime.toISOString();
                payload.end_time = endTime.toISOString();
            } else if (autoType === 'voice') {
                payload.phrase = phrase;
            }

            //console.log(payload)

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authentication header if needed
                    // 'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors || 'Failed to create automation');
            }
            return await response.json();
        } catch (error) {
            console.error('Add automation error:', error);
            throw error;
        }
    };

    const deleteAutomation = async (automationId) => {
        try {
            const url = Platform.OS === "android" 
                ? `http://10.0.2.2:8000/api/automations/delete/` 
                : `http://127.0.0.1:8000/api/automations/delete/`;
    
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    automation_id: automationId
                }),
            });

            if (response.status === 204) {
                return { status: 'success' };
            }
    
            const data = await response.json();
    
            if (!response.ok) {
                console.log("Fetch error1: "+data.message)
                throw new Error(data.message || 'Failed to delete automation');
            }
    
            return data;
        } catch (error) {
            console.error('Delete error:', error);
            throw error;
        }
    };



    const [automations, setAutomations] = useState([]);
    const [error, setError] = useState('');


    const fetchAutomations = async () => {
        try {
            const url = Platform.OS === "android"
                ? `http://10.0.2.2:8000/api/automations-list/device/${device_id}/`
                : `http://127.0.0.1:8000/api/automations-list/device/${device_id}/`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'success') {
                setAutomations(data.automations);
                //console.log(automations)
            } else {
                setError(data.message || 'Failed to fetch automations');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchAutomations();
    }, [device_id]);




    const addAction = async (action) => {
        try {
            const actionUrl = Platform.OS === 'android' ? `http://10.0.2.2:8000/api/device/${device_id}/activity/add-action/` : `http://127.0.0.1:8000/api/device/${device_id}/activity/add-action/`;

            const response = await fetch(actionUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });

            if (!response.ok) {
                //Alert.alert('Error', 'Failed to add action');
            }
        } catch (error) {
            //Alert.alert('Error', 'Failed to connect to server');
        }
    };






    if (loading) {
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


                            <TouchableOpacity style={[styles.backButton, { maxHeight: 80 }]} >
                                <MaterialCommunityIcons name="chevron-left" color='rgb(255, 3, 184)' size={50} onPress={() => navigation.goBack()} />
                            </TouchableOpacity>





                            <View style={[styles.mainContainer, { gap: 40 }]}>


                                <ScrollView
                                    style={[{ width: '60%' }]}
                                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', gap: 30, }}
                                >

                                    <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                        style={[styles.autoItem, styles.shadow, {}]}
                                    >
                                        <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                                            onPress={() => {
                                                toggleDropdown()
                                            }}
                                        >
                                            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                                                Add Automation
                                            </Text>
                                        </TouchableOpacity>

                                    </LinearGradient>


                                    {automations.length === 0 ? (
                                        <Text style={styles.emptyText}>No automations found for this device</Text>
                                    ) : (
                                        automations.map((item) => (
                                            <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']} style={[styles.autoItem, styles.shadow, { flexDirection: 'row', justifyContent: 'flex-start' }]}>
                                                <MaterialCommunityIcons
                                                    name={item.automation_type === 'time' ? 'clock-outline' : 'account-voice'}
                                                    size={50}
                                                    color="white"
                                                    style={{ marginLeft: 10 }}
                                                />
                                                <View style={{ left: '10%' }}>
                                                    <Text style={styles.detailText}>
                                                        {item.automation_type === 'time'
                                                            //? `Active: ${new Date(item.start_time).toLocaleString()} - ${new Date(item.end_time).toLocaleString()}`
                                                            ? `Time: ${new Date(item.start_time).getHours().toString().padStart(2, '0')}:${new Date(item.start_time).getMinutes().toString().padStart(2, '0')} - ${new Date(item.end_time).getHours().toString().padStart(2, '0')}:${new Date(item.end_time).getMinutes().toString().padStart(2, '0')}`
                                                            : `Phrase: "${item.phrase}"`}
                                                    </Text>
                                                    <Text style={[styles.detailText, {color:'rgb(194, 194, 194)'}]}>
                                                        Status: {item.active ? 'Active' : 'Inactive'}
                                                    </Text>
                                                </View>

                                                <TouchableOpacity
                                                    style={{
                                                        position: 'absolute', padding:8,
                                                        right: '3%', backgroundColor:'red',
                                                        borderRadius:50,
                                                    }}
                                                    onPress={async () => {  // Make the handler async
                                                        try {
                                                            // Wait for the automation to be added
                                                            await deleteAutomation(item.auto_id);

                                                            // Refresh the automations list
                                                            await fetchAutomations();

                                                            await addAction("Deleted An Automation");

                                                            // Optional: Reset form state
                                                            setAutoType(null);
                                                            setFunc('')
                                                            setPhrase('');
                                                            setStartTime(null);
                                                            setEndTime(null);
                                                        } catch (error) {

                                                            console.log('Error:', error);
                                                            setError(error.message);
                                                        }
                                                    }}
                                                >
                                                    <MaterialCommunityIcons name="delete" color='white' size={50} />
                                                </TouchableOpacity>

                                            </LinearGradient>


                                        ))
                                    )}



                                    <View style={{ height: 30 }}>

                                    </View>


                                </ScrollView>



                                <Modal
                                    isVisible={isDropdownVisible}
                                    onBackdropPress={() => setDropdownVisible(false)} // Close when tapping outside
                                    animationIn="zoomInRight"
                                    animationOut="zoomOutRight"
                                    backdropOpacity={0.1}
                                    style={[{}]}
                                >

                                    <View style={[styles.dropdownContainer, styles.shadow, {}]}>



                                        <TouchableOpacity style={[{ maxHeight: 80, position: 'absolute', top: 15, right: 30 }]} >
                                            <MaterialCommunityIcons name="close" color='rgb(255, 3, 184)' size={50}
                                                onPress={() => { setDropdownVisible(false) }}
                                            />
                                        </TouchableOpacity>



                                        <View style={[{
                                            flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20,
                                            width: '80%'
                                        }]}>

                                            <Text style={{ color: 'rgb(255, 3, 184)', fontSize: 20, fontWeight: 'bold' }}>
                                                Select Activation
                                            </Text>


                                            <Dropdown
                                                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                inputSearchStyle={styles.inputSearchStyle}
                                                iconStyle={styles.iconStyle}
                                                data={data}
                                                maxHeight={300}
                                                labelField="label"
                                                valueField="value"
                                                placeholder={!isFocus ? 'Select item' : '...'}
                                                searchPlaceholder="Search..."
                                                value={autoType}
                                                onFocus={() => setIsFocus(true)}
                                                onBlur={() => setIsFocus(false)}
                                                onChange={item => {
                                                    setAutoType(item.value);
                                                    setIsFocus(false);
                                                }}
                                            />

                                        </View>



                                        {autoType == 'time' && <View style={[{
                                            flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20,
                                            width: '80%', height: '30%', overflow: 'hidden'
                                        }]}>

                                            <Text style={{ color: 'rgb(255, 3, 184)', fontSize: 20, fontWeight: 'bold' }}>
                                                Start Time
                                            </Text>

                                            <TimePicker
                                                time={startTime}
                                                onChange={setStart}
                                            />



                                            <Text style={{ color: 'rgb(255, 3, 184)', fontSize: 20, fontWeight: 'bold' }}>
                                                End Time
                                            </Text>

                                            <TimePicker
                                                time={endTime}
                                                onChange={setEnd}
                                            />



                                        </View>}


                                        {autoType == 'voice' && <View style={[{
                                            flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20,
                                            width: '80%', height: '30%', overflow: 'hidden'
                                        }]}>

                                            <Text style={{ color: 'rgb(255, 3, 184)', fontSize: 20, fontWeight: 'bold' }}>
                                                Phrase
                                            </Text>

                                            <TextInput
                                                //style={[styles.shadow, styles.input]}
                                                placeholder="Enter Activation Phrase"
                                                maxLength={20}
                                                placeholderTextColor={'rgb(156, 156, 156)'}
                                                style={[{ borderColor: 'rgb(156, 156, 156)', borderWidth: 1, padding: 10, width: '70%', borderRadius: 15, }]}
                                                value={phrase}
                                                onChangeText={setPhrase}
                                            />




                                        </View>}





                                        <View style={{ flexDirection: 'row', gap: 30, }}>

                                            <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                                style={[{ padding: 20, backgroundColor: 'rgb(216, 75, 255)', borderRadius: 50, }]}
                                            >
                                                <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                                                    onPress={async () => {  // Make the handler async
                                                        try {
                                                            // Wait for the automation to be added
                                                            await addAutomation();


                                                            toggleDropdown();

                                                            // Refresh the automations list
                                                            await fetchAutomations();

                                                            await addAction("Added An Automation")

                                                            // Optional: Reset form state
                                                            setAutoType(null);
                                                            setFunc('')
                                                            setPhrase('');
                                                            setStartTime(null);
                                                            setEndTime(null);
                                                        } catch (error) {
                                                            // Handle errors without closing the modal
                                                            console.log('Error adding automation:', error);
                                                            setError(error.message);
                                                        }
                                                    }}
                                                >
                                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                                                        Add Automation
                                                    </Text>
                                                </TouchableOpacity>

                                            </LinearGradient>



                                            <LinearGradient colors={['rgb(255, 3, 184)', 'transparent']}
                                                style={[{ padding: 20, backgroundColor: 'rgb(216, 75, 255)', borderRadius: 50, }]}
                                            >
                                                <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                                                    onPress={() => {
                                                        toggleDropdown()
                                                    }}
                                                >
                                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                                                        Cancel
                                                    </Text>
                                                </TouchableOpacity>

                                            </LinearGradient>

                                        </View>









                                    </View>




                                </Modal>







                            </View>


                            <View style={{ height: 150 }}>{/*To allow space for tab bar to not overlap elements*/}</View>


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
            height: 10,
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


    autoItem: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(216, 75, 255)',
        padding: 20,
        borderRadius: 40,
    },


    dropdownContainer: {
        width: '95%',
        maxWidth: 1000,
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: 'white',
        height: '80%',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3%',

    },




    dropdown: {
        //height: 50,
        width: '30%',
        height: '100%',
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        padding: 10
    },



    detailText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },





    timePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 160,
        marginVertical: 10,
    },
    timeColumn: {
        height: 160,
        width: 80,
        overflow: 'hidden',
    },
    scrollContent: {
        paddingVertical: 60,
    },
    timeItem: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedTimeItem: {
        backgroundColor: 'rgba(255, 3, 184, 0.2)',
        borderRadius: 8,
    },
    timeText: {
        color: 'rgb(255, 3, 184)',
        fontSize: 18,
    },
    timeSeparator: {
        color: 'rgb(255, 3, 184)',
        fontSize: 24,
        marginHorizontal: 4,
    },
    timeSection: {
        marginVertical: 15,
        width: '100%',
    },
    timeLabel: {
        color: 'rgb(255, 3, 184)',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },





    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
















    chosenButton: {
        backgroundColor: 'rgba(216, 75, 255, 1)'
    },
    notChosenButton: {
        backgroundColor: 'rgb(235, 235, 235)'
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
