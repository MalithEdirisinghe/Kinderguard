// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Button, ToastAndroid } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import * as Location from 'expo-location';
// import { auth } from './firebase';
// import { onAuthStateChanged } from 'firebase/auth';

// const MapScreen = () => {
//     const [location, setLocation] = useState(null);
//     const [errorMsg, setErrorMsg] = useState(null);
//     const [username, setUsername] = useState(null);

//     useEffect(() => {
//         (async () => {
//             let { status } = await Location.requestForegroundPermissionsAsync();
//             if (status !== 'granted') {
//                 setErrorMsg('Permission to access location was denied');
//                 return;
//             }

//             let location = await Location.getCurrentPositionAsync({});
//             setLocation(location.coords);
//         })();

//         const unsubscribe = onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 setUsername(user.displayName);
//             }
//         });
//         return () => unsubscribe();
//     }, []);


//     const reloadMap = useCallback(() => {
//         setLocation(null);
//         (async () => {
//             let { status } = await Location.requestForegroundPermissionsAsync();
//             if (status !== 'granted') {
//                 setErrorMsg('Permission to access location was denied');
//                 return;
//             }
//             let newLocation = await Location.getCurrentPositionAsync({});
//             setLocation(newLocation.coords);
//         })();
//     }, []);

//     const reportUserLocation = async () => {
//         if (location) {
//             console.log('Location: ',location);
//             const apiUrl = `https://tame-undershirt-ant.cyclic.app/api/getUsers`;
//             const requestBody = {
//                 userId: auth.currentUser.uid, 
//                 userLat: location.latitude.toString(),
//                 userLong: location.longitude.toString(),
//             };
//             console.log(requestBody);

//             try {
//                 const response = await fetch(apiUrl, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(requestBody),
//                 });
                
                
//                 if (response.ok) {
//                     response.json()  // Convert response to JSON
//                         .then(data => {
//                             console.log('User location reported successfully.');
//                             console.log('Response:', data);
//                         })
//                         .catch(error => {
//                             console.error('Error parsing response as JSON:', error);
//                         });
//                 } else {
//                     const value = 'Does not have any user in your 500 radius range';
//                     ToastAndroid.showWithGravityAndOffset(
//                         value,
//                         ToastAndroid.SHORT,
//                         ToastAndroid.BOTTOM,
//                         25,
//                         50
//                     );
//                 }

//             } catch (error) {
//                 console.error('Error sending the report:', error);
//             }
//         } else {
//             console.warn('Location not available yet.');
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text style = {styles.mapText}>
//                 Hi, <Text>{username || 'Guest'}</Text>
//             </Text>
//             <View style={styles.mapContainer}>
//                 {location ? (
//                     <MapView
//                         style={styles.map}
//                         initialRegion={{
//                             latitude: location.latitude,
//                             longitude: location.longitude,
//                             latitudeDelta: 0.0922,
//                             longitudeDelta: 0.0421,
//                         }}
//                     >
//                         <Marker
//                             coordinate={{
//                                 latitude: location.latitude,
//                                 longitude: location.longitude,
//                             }}
//                             title="Your Location"
//                         />
//                     </MapView>
//                 ) : (
//                     <Text style = {styles.loadText}>Loading...</Text>
//                 )}

//                 <View style={styles.reloadButtonContainer}>
//                     <Button title="Reload Map" onPress={reloadMap} />
//                 </View>
//             </View>
//             <TouchableOpacity onPress={reportUserLocation} style={styles.shareLocationButton}>
//                 <Text style={styles.shareLocationButtonText}>Report</Text>
//             </TouchableOpacity>

//             {/* <TouchableOpacity onPress={openGoogleMapsDirections} style={styles.directionsButton}>
//                 <Text style={styles.directionsButtonText}>Get Directions</Text>
//             </TouchableOpacity> */}

//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         top:40
//     },
//     mapContainer: {
//         flex: 1,
//         width: 395,
//         height: 450,
//         backgroundColor: 'rgba(183, 228, 199, 0.75)',
//         borderRadius: 40,
//         top: 60,
//         bottom: 20,
//     },
//     map: {
//         flex: 1,
//         top: 70,
//         width:350,
//         left: 20,
//         bottom:20,
//         marginBottom:250
//     },
//     mapText:{
//         fontSize: 20,
//         fontWeight: 'bold',
//         left: 20,
//         top: 20,
//     },
//     loadText:{
//         fontSize: 20,
//         fontWeight: 'bold',
//         left: 150,
//         top: 250,
//     },
//     directionsButton: {
//         backgroundColor: 'blue',
//         padding: 10,
//         alignItems: 'center',
//     },
//     directionsButtonText: {
//         color: 'white',
//         fontWeight: 'bold',
//     },
//     reloadButtonContainer: {
//         position: 'absolute',
//         top: 25,
//         right: 28,
//         zIndex: 1,
//     },
//     shareLocationButton: {
//         position: 'absolute',
//         backgroundColor: '#40916C',
//         width: 134,
//         height: 40,
//         left: 113,
//         top: 650,
//         borderRadius: 8,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     shareLocationButtonText: {
//         color: '#D8F3DC',
//         fontWeight: '600',
//         fontSize: 14,
//         textAlign: 'center',
//         lineHeight: 17,
//     },

// });

// export default MapScreen;

import React, { useState, useEffect, useCallback, responseData } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Button,
    ToastAndroid,
    Modal, 
    FlatList
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const MapScreen = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [username, setUsername] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [responseData, setResponseData] = useState(null); 

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
        })();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUsername(user.displayName);
            }
        });
        return () => unsubscribe();
    }, []);


    const reloadMap = useCallback(() => {
        setLocation(null);
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let newLocation = await Location.getCurrentPositionAsync({});
            setLocation(newLocation.coords);
        })();
    }, []);

    const reportUserLocation = async () => {
        if (location) {
            console.log('Location: ', location);
            const apiUrl = `https://tame-undershirt-ant.cyclic.app/api/getUsers`;
            const requestBody = {
                userId: auth.currentUser.uid,
                userLat: location.latitude.toString(),
                userLong: location.longitude.toString(),
            };
            console.log(requestBody);

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });


                if (response.ok) {
                    response.json()  // Convert response to JSON
                        .then(data => {
                            console.log('User location reported successfully.');
                            console.log('Response:', data); setResponseData(data); 
                            setResponseData(data);
                            setModalVisible(true);
                        })
                        .catch(error => {
                            console.error('Error parsing response as JSON:', error);
                        });
                } else {
                    const value = 'Does not have any user in your 500 radius range';
                    ToastAndroid.showWithGravityAndOffset(
                        value,
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                }

            } catch (error) {
                console.error('Error sending the report:', error);
            }
        } else {
            console.warn('Location not available yet.');
        }
    };
    // Create a function to render the table rows
    const renderTableRows = () => {
        if (!responseData || !responseData.usersWithinRadius) {
            return null;
        }

        return responseData.usersWithinRadius.map((user) => (
            <View key={user.userId} style={styles.tableRow}>
                <Text style={styles.tableCell}>{user.userId}</Text>
                <Text style={styles.tableCell}>{user.distance} meters</Text>
            </View>
        ));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.mapText}>
                Hi, <Text>{username || 'Guest'}</Text>
            </Text>
            <View style={styles.mapContainer}>
                {location ? (
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            title="Your Location"
                        />
                    </MapView>
                ) : (
                    <Text style={styles.loadText}>Loading...</Text>
                )}

                <View style={styles.reloadButtonContainer}>
                    <Button title="Reload Map" onPress={reloadMap} />
                </View>
            </View>
            <TouchableOpacity onPress={reportUserLocation} style={styles.shareLocationButton}>
                <Text style={styles.shareLocationButtonText}>Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.showResponseButton}
            >
                <Text style={styles.showResponseButtonText}>Show Response</Text>
            </TouchableOpacity>

            {/* Modal to display response */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalView}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Response Data:</Text>
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableHeaderCell}>User ID</Text>
                            <Text style={styles.tableHeaderCell}>Distance</Text>
                        </View>
                        {renderTableRows()}
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.closeModalButton}
                        >
                            <Text style={styles.closeModalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        top: 40
    },
    mapContainer: {
        flex: 1,
        width: 395,
        height: 450,
        backgroundColor: 'rgba(183, 228, 199, 0.75)',
        borderRadius: 40,
        top: 60,
        bottom: 20,
    },
    map: {
        flex: 1,
        top: 70,
        width: 350,
        left: 20,
        bottom: 20,
        marginBottom: 250
    },
    mapText: {
        fontSize: 20,
        fontWeight: 'bold',
        left: 20,
        top: 20,
    },
    loadText: {
        fontSize: 20,
        fontWeight: 'bold',
        left: 150,
        top: 250,
    },
    directionsButton: {
        backgroundColor: 'blue',
        padding: 10,
        alignItems: 'center',
    },
    directionsButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    reloadButtonContainer: {
        position: 'absolute',
        top: 25,
        right: 28,
        zIndex: 1,
    },
    shareLocationButton: {
        position: 'absolute',
        backgroundColor: '#40916C',
        width: 134,
        height: 40,
        left: 113,
        top: 650,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareLocationButtonText: {
        color: '#D8F3DC',
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 17,
    }, modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: 300,
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    userId: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    distance: {
        fontSize: 16,
    },
    closeModalButton: {
        backgroundColor: '#40916C',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    closeModalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#DDD',
        padding: 5,
    },
    tableHeaderCell: {
        fontWeight: 'bold',
        padding: 5,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
    },
    tableCell: {
        padding: 5,
    },
});

export default MapScreen;