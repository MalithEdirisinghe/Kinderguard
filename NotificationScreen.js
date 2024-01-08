import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { auth } from './firebase';
import { scheduleNotificationAsync } from 'expo-notifications';
import SocketIOClient from 'socket.io-client'; 
import axios from 'axios';

const NotificationScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const [userId, setUserId] = useState(auth.currentUser ? auth.currentUser.uid : null);
    const [lastResponseTime, setLastResponseTime] = useState(null);
    // Function to clear old notifications
    
    const clearOldNotifications = () => {
        const now = new Date();
        const oneDayAgo = new Date(now);
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        // Filter out notifications that are older than one day
        const filteredNotifications = notifications.filter((item) => {
            const itemDate = new Date(item.locationStartTime);
            return itemDate >= oneDayAgo;
        });

        setNotifications(filteredNotifications);
    };

    const falseReport = useCallback(async (sharedUserId, sharedUsername) => {
        // Prepare data for the PATCH request
        const data = {
            sharedUserId: sharedUserId,
            sharedUsername: sharedUsername,
            isActive: false,
        };

        try {
            // Make a PATCH request to the API endpoint
            const response = await axios.patch('https://kids-app.adaptable.app/api/updateIsActive', data);

            // Check if the request was successful
            if (response.status === 200) {
                console.log('API call successful:', response.data);
                // You can perform additional actions here if needed
            } else {
                console.error('API call failed:', response.statusText);
                // Handle the error accordingly
            }
        } catch (error) {
            console.error('Error during API call:', error.message);
            // Handle the error accordingly
        }

        // You can perform additional actions after the API call if needed
        // ...
        Alert.alert('False Report Submitted', 'Thank you for reporting. We will review the case.');
        // You may want to refresh the notifications after a false report
        fetchNotifications(userId);
    }, [userId]);
    
    const socket = SocketIOClient('wss://kids-app.adaptable.app');
    useEffect(()=>{


        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        socket.on('getLocation', (data) => {
            console.log("Incoming data", data);
        });

    });

    const sendRequestID = (ID) => {
        socket.emit('getLocation', ID);
    }
    const fetchNotifications =()=>{
        const data = { requestID: userId };
        sendRequestID(data);

        socket.on('getLocation', (data) => {
            const latestNotifications = data.slice(-9);
            setNotifications(latestNotifications);
            const latestNotification = latestNotifications.length > 0 ? latestNotifications[latestNotifications.length - 1] : null;
            // console.log('Love : ', latestNotification);

            if (latestNotification && (latestNotification.locationStartTime !== lastResponseTime && userId !== lastResponseTime)) {
                showPushNotification(`New notification: ${latestNotification.sharedUsername}`);
                setLastResponseTime(latestNotification.locationStartTime);
                setUserId(userId);
            }
        })
    };

    const showPushNotification = async (message) => {
        await scheduleNotificationAsync({
            content: {
                title: 'New Notification',
                body: message,
            },
            trigger: null,
        });
    };

    const openGoogleMaps = (latitude, longitude) => {
        const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(mapUrl);
    };

    useEffect(() => {
        if (userId) {
            // Fetch notifications when the component mounts
            fetchNotifications(userId);
        }

        // Use an interval to fetch notifications every 3 seconds
        const interval = setInterval(() => {
            if (userId) {
                fetchNotifications(userId);
            }
        }, 1000);

        // Clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, [userId, lastResponseTime]);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.notification}>Notification</Text>
            <FlatList
                data={notifications.reverse()} // Reverse the order of notifications
                keyExtractor={(item, index) => `${item.locationStartTime}-${index}`}
                renderItem={({ item }) => (
                    <View style={styles.notificationItem}>
                        <Text>{item.sharedUsername} Reported some case</Text>
                        <Text>Time: {formatTime(item.locationStartTime)}</Text>
                        <TouchableOpacity
                            style={styles.directionButton}
                            onPress={() => openGoogleMaps(item.sharedLat, item.sharedLong)}
                        >
                            <Text style={styles.buttonText}>Get Direction</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.directionButton}
                            onPress={() => falseReport(item.sharedUserId, item.sharedUsername)}
                        >
                            <Text style={styles.buttonText}>False Report</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        top: 50,
        flex: 1,
        justifyContent: 'flex-end',
    },
    notificationItem: {
        backgroundColor: '#D3F2E6',
        padding: 16,
        marginVertical: 8,
        top: 10,
        borderRadius: 12,
        width: 350,
        left: 20,
    },
    directionButton: {
        marginTop: 10,
        backgroundColor: '#40916C',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
    },
    notification: {
        fontSize: 30,
        fontWeight: 'bold',
        left: 20,
    },
});

export default NotificationScreen;