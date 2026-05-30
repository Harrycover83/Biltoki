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
          height: 64,
          paddingBottom: 10,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        },
        headerStyle: { backgroundColor: Colors.navy },
        headerTintColor: Colors.cream,
        headerTitleStyle: { fontWeight: '800', fontSize: 17, letterSpacing: 1 },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          headerTitle: 'Biltoki',
        }}
      />
      <Tabs.Screen
        name="halles"
        options={{
          title: 'Nos Halles',
          tabBarIcon: ({ color, size }) => <Ionicons name="storefront" size={size} color={color} />,
          headerTitle: 'Nos Halles',
        }}
      />
      <Tabs.Screen
        name="evenements"
        options={{
          title: 'Événements',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
          headerTitle: 'Programme',
        }}
      />
      <Tabs.Screen
        name="actualites"
        options={{
          title: 'Actualités',
          tabBarIcon: ({ color, size }) => <Ionicons name="newspaper" size={size} color={color} />,
          headerTitle: 'Actualités',
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Mon B!',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" size={size} color={color} />,
          headerTitle: 'Mon Compte B!',
        }}
      />
    </Tabs>
  );
}
