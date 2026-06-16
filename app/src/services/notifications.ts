import * as Notifications from 'expo-notifications';

export async function registerForPushNotificationsAsync() {
  const permissions = await Notifications.getPermissionsAsync();

  if (permissions.status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }

  return Notifications.getExpoPushTokenAsync();
}
