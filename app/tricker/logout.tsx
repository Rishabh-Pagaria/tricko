import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../../src/lib/firebase';

export default function LogoutScreen() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await auth.signOut();
        router.replace('/');
      } catch (error) {
        console.error('Logout error:', error);
        router.back();
      }
    };
    logout();
  }, []);

  return <View />; // Empty view while logging out
}