import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.error('Background location task error:', error);
        return;
    }

    if (data) {
        const { locations } = data;
        if (locations && locations.length > 0) {
            const { latitude, longitude } = locations[0].coords;

            // Send location data to your API
            sendLocationToAPI('yourUserId', latitude, longitude);
        }
    }
});

const startBackgroundLocationTask = async () => {
    // Check if the task is already registered
    const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);

    if (!isRegistered) {
        // Start the background location task
        Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 30, // 3 seconds
            foregroundService: {
                notificationTitle: 'Location Tracking',
                notificationBody: 'Location tracking is running',
            },
        });
    }
};

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
            console.log('Location sent to API successfully.');
        } else {
            console.error('Failed to send location to API. Status:', response.status);
            const responseText = await response.text();
            console.error('API Responses:', responseText);
        }
    } catch (error) {
        console.error('Error sending the location to API:', error);
    }
};


export { startBackgroundLocationTask };
