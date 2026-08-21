import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          letterSpacing: 1,
          textTransform: 'uppercase',
        },
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.primary,
        headerTitleStyle: { fontWeight: '900', fontSize: 16, letterSpacing: 1.8, textTransform: 'uppercase' },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          headerTitle: 'Biltoki',
        }}
      />
      <Tabs.Screen
        name="halles"
        options={{
          title: 'Nos Halles',
          tabBarIcon: ({ color, size }) => <Ionicons name="storefront-outline" size={size} color={color} />,
          headerTitle: 'Nos Halles',
        }}
      />
      <Tabs.Screen
        name="evenements"
        options={{
          title: 'Événements',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
          headerTitle: 'Programme',
        }}
      />
      <Tabs.Screen
        name="actualites"
        options={{
          title: 'Actualités',
          tabBarIcon: ({ color, size }) => <Ionicons name="newspaper-outline" size={size} color={color} />,
          headerTitle: 'Actualités',
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Socios',
          tabBarIcon: ({ color, size }) => <Ionicons name="flame-outline" size={size} color={color} />,
          headerTitle: 'Socios',
        }}
      />
    </Tabs>
  );
}
