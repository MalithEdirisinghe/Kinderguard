import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const NotificationScreen = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Fetch notifications when the component mounts
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('https://tame-undershirt-ant.cyclic.app/api/getLocation', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                // Process the response and get the latest 3 notifications
                const latestNotifications = data.slice(0, 3);
                setNotifications(latestNotifications);
            } else {
                console.error('Failed to fetch notifications');
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.locationStartTime}
                renderItem={({ item }) => (
                    <View style={styles.notificationItem}>
                        <Text>{item.sharedUserId}</Text>
                        <Text>Lat: {item.sharedLat}, Long: {item.sharedLong}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    notificationItem: {
        backgroundColor: '#ECECEC',
        padding: 16,
        marginVertical: 8,
    },
});

export default NotificationScreen;
