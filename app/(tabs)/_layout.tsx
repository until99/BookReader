import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';
import Header from '../components/layout/Header';


export default function TabLayout() {
  return (
    <>
      <Header />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#6096db',
          tabBarInactiveTintColor: '#8b92a0',
          headerShown: false,
          tabBarShowLabel: false,
          tabBarItemStyle: {
            paddingVertical: 8,
          },
          tabBarStyle: {
            margin: 10,
            borderRadius: 10,
            backgroundColor: '#0e0f13',
            borderTopWidth: 0,
            height: 60,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
            ),

          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'book-sharp' : 'book-outline'} color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="book/[id]"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}
