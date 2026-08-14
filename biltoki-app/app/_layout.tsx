import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '../constants/Colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({});

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="halle/[id]"
          options={{
            headerShown: true,
            title: '',
            headerBackTitle: 'Retour',
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: Colors.primary,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="evenement/[id]"
          options={{
            headerShown: true,
            title: '',
            headerBackTitle: 'Retour',
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: Colors.primary,
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
