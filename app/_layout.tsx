import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/lib/auth';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{
        headerShown: false,
        statusBarStyle: 'light',
        statusBarTranslucent: true,
        animation: 'fade'
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="role" />
        <Stack.Screen 
          name="owner" 
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="tricker" 
          options={{
            headerShown: false
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </AuthProvider>
  );
}
