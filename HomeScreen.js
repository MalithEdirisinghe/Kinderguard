// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import { auth, db, app } from './firebase';
// import {getAuth, signOut } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import { getDownloadURL, ref, getStorage } from 'firebase/storage';
// import ConfirmationDialog from './ConfirmationDialog';
// import * as Location from 'expo-location';
// import { BackHandler } from 'react-native';


// const HomeScreen = ({ navigation }) => {
//     const [username, setUsername] = useState(null);
//     const [volunteerId, setVolunteerId] = useState(null);
//     const [profileImageUrl, setProfileImageUrl] = useState(null);
//     const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

//     useEffect(() => {
//         const user = getAuth().currentUser;

//         if (user) {
//             setUsername(user.displayName);

//             const storage = getStorage(app);
//             const storageRef = ref(storage, `user_images/${user.uid}.jpeg`);

//             getDownloadURL(storageRef)
//                 .then((url) => {
//                     setProfileImageUrl(url);
//                 })
//                 .catch((error) => {
//                     console.error('Error fetching profile picture:', error);
//                 });

//             (async () => {
//                 const userRef = doc(db, 'users', user.uid);

//                 try {
//                     const docSnapshot = await getDoc(userRef);

//                     if (docSnapshot.exists()) {
//                         setVolunteerId(docSnapshot.data().volunteerID);
//                     } else {
//                         console.warn('Volunteer ID not found in Firestore for the user.');
//                     }
//                 } catch (error) {
//                     console.error('Error fetching user document:', error);
//                 }
//             })();
//         }

//         const backAction = () => {
//             if (navigation.isFocused()) {
//                 BackHandler.exitApp();
//             return true;
//             }
//             return false;
//         };

//         const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

//         return () => {
//             backHandler.remove();
//         };
//     }, [navigation]);

//     const handleButtonPress = () => {
//         // Define the action to take when the button is pressed
//         // You can navigate to another screen or perform a specific action here
//     };

//     const handleLogoutButtonPress = () => {
//         setShowConfirmationDialog(true);
//     };

//     const handleLogoutConfirmed = () => {
//         setShowConfirmationDialog(false);
//         signOut(auth)
//             .then(() => {
//                 navigation.navigate('Login');
//             })
//             .catch((error) => {
//                 console.error('Error logging out:', error);
//             });
//     };

//     const handleLogoutCancelled = () => {
//         setShowConfirmationDialog(false);
//     };

//     return (
//         <View style={styles.container}>
//             {profileImageUrl ? (
//                 <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
//             ) : (
//                 <Image source={require('./assets/users.png')} style={styles.image} />
//             )}
//             <Text style={styles.username}>Welcome {username || 'Guest'}</Text>
//             <Text style={styles.volunteerId}>Volunteer ID: {volunteerId}</Text>

//             <Text style={styles.option}>Options</Text>

//             <TouchableOpacity
//                 style={styles.button}
//                 onPress={handleButtonPress}
//             >
//                 <Image source={require('./assets/VectorUpdate.png')} style={styles.vectorIcon} />
//                 <Text style={styles.buttonText}>Update</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//                 style={styles.buttonSupport}
//                 onPress={handleButtonPress}
//             >
//                 <Image source={require('./assets/VectorSupport.png')} style={styles.vectorIcon} />
//                 <Text style={styles.buttonTextSupport}>Support</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//                 style={styles.buttonReport}
//                 onPress={handleButtonPress}
//             >
//                 <Image source={require('./assets/VectorReport.png')} style={styles.vectorIcon} />
//                 <Text style={styles.buttonTextReport}>Reports</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//                 style={styles.buttonLogout}
//                 onPress={handleLogoutButtonPress}
//             >
//                 <Image source={require('./assets/VectorLogout.png')} style={styles.vectorIcon} />
//                 <Text style={styles.buttonTextLogout}>Logout</Text>
//             </TouchableOpacity>

//             <ConfirmationDialog
//                 isVisible={showConfirmationDialog}
//                 message="Are you sure you want to logout?"
//                 onCancel={handleLogoutCancelled}
//                 onConfirm={handleLogoutConfirmed}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         top: 100,
//         flex: 1,
//         justifyContent: 'flex-start',
//         alignItems: 'center',
//     },
//     username: {
//         fontSize: 24,
//         fontWeight: 'bold',
//     },
//     volunteerId: {
//         fontSize: 18,
//         marginTop: 20,
//     },
//     option: {
//         fontSize: 35,
//         fontWeight: 'bold',
//         textAlign: 'left',
//         top: 100,
//         right: 105,
//     },
//     profileImage: {
//         width: 120,
//         height: 120,
//         borderRadius: 60,
//     },
//     button: {
//         position: 'absolute',
//         width: 150,
//         height: 80,
//         left: 25,
//         top: 350,
//         backgroundColor: '#9DE0A8',
//         borderRadius: 12,
//         justifyContent: 'center',
//         alignItems: 'center',
//         shadowColor: 'rgba(64, 145, 108, 0.75)',
//         shadowOffset: {
//             width: 0,
//             height: 1,
//         },
//         shadowOpacity: 6,
//         elevation: 6,
//     },
//     buttonSupport: {
//         position: 'absolute',
//         width: 150,
//         height: 80,
//         left: 210,
//         top: 350,
//         backgroundColor: '#9DE0A8',
//         borderRadius: 12,
//         justifyContent: 'center',
//         alignItems: 'center',
//         shadowColor: 'rgba(64, 145, 108, 0.75)',
//         shadowOffset: {
//             width: 0,
//             height: 1,
//         },
//         shadowOpacity: 6,
//         elevation: 6,
//     },
//     buttonReport: {
//         position: 'absolute',
//         width: 150,
//         height: 80,
//         left: 25,
//         top: 450,
//         backgroundColor: '#9DE0A8',
//         borderRadius: 12,
//         justifyContent: 'center',
//         alignItems: 'center',
//         shadowColor: 'rgba(64, 145, 108, 0.75)',
//         shadowOffset: {
//             width: 0,
//             height: 1,
//         },
//         shadowOpacity: 6,
//         elevation: 6,
//     },
//     buttonLogout: {
//         position: 'absolute',
//         width: 150,
//         height: 80,
//         left: 210,
//         top: 450,
//         backgroundColor: '#9DE0A8',
//         borderRadius: 12,
//         justifyContent: 'center',
//         alignItems: 'center',
//         shadowColor: 'rgba(64, 145, 108, 0.75)',
//         shadowOffset: {
//             width: 0,
//             height: 1,
//         },
//         shadowOpacity: 6,
//         elevation: 6,
//     },
//     vectorIcon: {
//         position: 'absolute',
//         left: 10,
//         top: 10,
//         width: 25,
//         height: 25,
//     },
//     buttonText: {
//         color: '#0D5C2A',
//         fontWeight: '400',
//         position: 'absolute',
//         fontStyle: 'normal',
//         lineHeight: 24,
//         fontSize: 20,
//         left: 10,
//         top: 40,
//         width: 70,
//         height: 28,
//     },
//     buttonTextSupport: {
//         color: '#0D5C2A',
//         fontWeight: '400',
//         position: 'absolute',
//         fontStyle: 'normal',
//         lineHeight: 24,
//         fontSize: 20,
//         left: 10,
//         top: 40,
//         width: 80,
//         height: 28,
//     },
//     buttonTextReport: {
//         color: '#0D5C2A',
//         fontWeight: '400',
//         position: 'absolute',
//         fontStyle: 'normal',
//         lineHeight: 24,
//         fontSize: 20,
//         left: 10,
//         top: 40,
//         width: 80,
//         height: 28,
//     },
//     buttonTextLogout: {
//         color: '#0D5C2A',
//         fontWeight: '400',
//         position: 'absolute',
//         fontStyle: 'normal',
//         lineHeight: 24,
//         fontSize: 20,
//         left: 10,
//         top: 40,
//         width: 80,
//         height: 28,
//     },
// });

// export default HomeScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, db, app } from './firebase';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref, getStorage } from 'firebase/storage';
import ConfirmationDialog from './ConfirmationDialog';
import { BackHandler } from 'react-native';
import * as Location from 'expo-location';

const HomeScreen = ({ navigation }) => {
    const [username, setUsername] = useState(null);
    const [volunteerId, setVolunteerId] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    useEffect(() => {
        const LOCATION_TASK_NAME = 'background-location-task';

        Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 3000, // 3 seconds
            foregroundService: {
                notificationTitle: 'Location Tracking',
                notificationBody: 'Location tracking is running',
            },
        });

        const user = getAuth().currentUser;

        if (user) {
            setUsername(user.displayName);

            const storage = getStorage(app);
            const storageRef = ref(storage, `user_images/${user.uid}.jpeg`);

            getDownloadURL(storageRef)
                .then((url) => {
                    setProfileImageUrl(url);
                })
                .catch((error) => {
                    console.error('Error fetching profile picture:', error);
                });

            (async () => {
                const userRef = doc(db, 'users', user.uid);

                try {
                    const docSnapshot = await getDoc(userRef);

                    if (docSnapshot.exists()) {
                        setVolunteerId(docSnapshot.data().volunteerID);
                    } else {
                        console.warn('Volunteer ID not found in Firestore for the user.');
                    }
                } catch (error) {
                    console.error('Error fetching user document:', error);
                }
            })();
        }

        const backAction = () => {
            if (navigation.isFocused()) {
                BackHandler.exitApp();
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => {
            backHandler.remove();
            Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        };
    }, [navigation]);


    // Function to send location to the API
    const sendLocationToAPI = async (userId, latitude, longitude) => {
        const apiUrl = 'https://tame-undershirt-ant.cyclic.app/api/updateSharedCordinates';
        const requestBody = {
            userId,
            userLat: latitude.toString(),
            userLong: longitude.toString(),
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const responseText = await response.text();
                console.log('Location sent to API successfully.');
                console.log('Response is: ',responseText);
            } else {
                console.error('Failed to send location to API. Status:', response.status);
                const responseText = await response.text();
                console.error('API Responses:', responseText);
            }
        } catch (error) {
            console.error('Error sending the location to API:', error);
        }
    };

    // Periodically send the location to the API
    useEffect(() => {
        const locationUpdateInterval = setInterval(() => {
            const LOCATION_TASK_NAME = 'background-location-task';

            Location.getLastKnownPositionAsync({ accuracy: Location.Accuracy.BestForNavigation })
                .then((location) => {
                    if (location) {
                        const { latitude, longitude } = location.coords;
                        const user = getAuth().currentUser;

                        if (user) {
                            sendLocationToAPI(user.uid, latitude, longitude);
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user location:', error);
                });
        }, 3000); // Update location every 3 seconds

        return () => {
            clearInterval(locationUpdateInterval);
        };
    }, []);

    const handleButtonPress = () => {
            // Define the action to take when the button is pressed
            // You can navigate to another screen or perform a specific action here
        };

    const handleLogoutButtonPress = () => {
            setShowConfirmationDialog(true);
        };
    const handleLogoutConfirmed = () => {
            setShowConfirmationDialog(false);
            signOut(auth)
                .then(() => {
                    navigation.navigate('Login');
                })
                .catch((error) => {
                    console.error('Error logging out:', error);
                });
        };

        const handleLogoutCancelled = () => {
            setShowConfirmationDialog(false);
        };

    return (
        <View style={styles.container}>
            {profileImageUrl ? (
                <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
            ) : (
                <Image source={require('./assets/users.png')} style={styles.image} />
            )}
            <Text style={styles.username}>Welcome {username || 'Guest'}</Text>
            <Text style={styles.volunteerId}>Volunteer ID: {volunteerId}</Text>

            <Text style={styles.option}>Options</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={handleButtonPress}
            >
                <Image source={require('./assets/VectorUpdate.png')} style={styles.vectorIcon} />
                <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonSupport}
                onPress={handleButtonPress}
            >
                <Image source={require('./assets/VectorSupport.png')} style={styles.vectorIcon} />
                <Text style={styles.buttonTextSupport}>Support</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.buttonReport}
                onPress={handleButtonPress}
            >
                <Image source={require('./assets/VectorReport.png')} style={styles.vectorIcon} />
                <Text style={styles.buttonTextReport}>Reports</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.buttonLogout}
                onPress={handleLogoutButtonPress}
            >
                <Image source={require('./assets/VectorLogout.png')} style={styles.vectorIcon} />
                <Text style={styles.buttonTextLogout}>Logout</Text>
            </TouchableOpacity>

            <ConfirmationDialog
                isVisible={showConfirmationDialog}
                message="Are you sure you want to logout?"
                onCancel={handleLogoutCancelled}
                onConfirm={handleLogoutConfirmed}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        top: 100,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    volunteerId: {
        fontSize: 18,
        marginTop: 20,
    },
    option: {
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'left',
        top: 100,
        right: 105,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    button: {
        position: 'absolute',
        width: 150,
        height: 80,
        left: 25,
        top: 350,
        backgroundColor: '#9DE0A8',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'rgba(64, 145, 108, 0.75)',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 6,
        elevation: 6,
    },
    buttonSupport: {
        position: 'absolute',
        width: 150,
        height: 80,
        left: 210,
        top: 350,
        backgroundColor: '#9DE0A8',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'rgba(64, 145, 108, 0.75)',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 6,
        elevation: 6,
    },
    buttonReport: {
        position: 'absolute',
        width: 150,
        height: 80,
        left: 25,
        top: 450,
        backgroundColor: '#9DE0A8',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'rgba(64, 145, 108, 0.75)',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 6,
        elevation: 6,
    },
    buttonLogout: {
        position: 'absolute',
        width: 150,
        height: 80,
        left: 210,
        top: 450,
        backgroundColor: '#9DE0A8',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'rgba(64, 145, 108, 0.75)',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 6,
        elevation: 6,
    },
    vectorIcon: {
        position: 'absolute',
        left: 10,
        top: 10,
        width: 25,
        height: 25,
    },
    buttonText: {
        color: '#0D5C2A',
        fontWeight: '400',
        position: 'absolute',
        fontStyle: 'normal',
        lineHeight: 24,
        fontSize: 20,
        left: 10,
        top: 40,
        width: 70,
        height: 28,
    },
    buttonTextSupport: {
        color: '#0D5C2A',
        fontWeight: '400',
        position: 'absolute',
        fontStyle: 'normal',
        lineHeight: 24,
        fontSize: 20,
        left: 10,
        top: 40,
        width: 80,
        height: 28,
    },
    buttonTextReport: {
        color: '#0D5C2A',
        fontWeight: '400',
        position: 'absolute',
        fontStyle: 'normal',
        lineHeight: 24,
        fontSize: 20,
        left: 10,
        top: 40,
        width: 80,
        height: 28,
    },
    buttonTextLogout: {
        color: '#0D5C2A',
        fontWeight: '400',
        position: 'absolute',
        fontStyle: 'normal',
        lineHeight: 24,
        fontSize: 20,
        left: 10,
        top: 40,
        width: 80,
        height: 28,
    },
});

export default HomeScreen;
