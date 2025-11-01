import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { auth, db } from '../../src/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import PublishHouse from '../components/publish-house';
import { House } from '../types/house';

export default function SettingsScreen() {
  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHouse();
  }, []);

  const loadHouse = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const housesRef = collection(db, 'houses');
      const q = query(housesRef, where('ownerUid', '==', uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setHouse(querySnapshot.docs[0].data() as House);
      }
    } catch (err) {
      console.error('Error loading house:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {house ? (
        <View style={styles.section}>
          <Text style={styles.title}>Your House</Text>
          <Text style={styles.text}>Title: {house.title}</Text>
          <Text style={styles.text}>Description: {house.description}</Text>
          <Text style={styles.text}>Persona: {house.trickPersona}</Text>
          <Text style={styles.text}>Treats: {house.treatsAvailable}</Text>
        </View>
      ) : (
        <PublishHouse onPublished={loadHouse} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f1a',
    padding: 20,
  },
  section: {
    backgroundColor: '#1a1f2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF7A1C',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
});