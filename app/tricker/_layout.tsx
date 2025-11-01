import { Tabs } from 'expo-router/tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TrickerLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0b0f1a',
          borderTopColor: '#FF7A1C33',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: '#FF7A1C',
        tabBarInactiveTintColor: '#666',
        headerStyle: {
          backgroundColor: '#0b0f1a',
          borderBottomColor: '#FF7A1C33',
          borderBottomWidth: 1,
        },
        headerTintColor: '#FF7A1C',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="map-marker" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: 'Store',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="store" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="wallet" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: 'Logout',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="logout" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}