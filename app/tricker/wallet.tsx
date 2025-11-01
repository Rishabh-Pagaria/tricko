import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { auth, db } from '../../src/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function TrickerWalletScreen() {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    loadPoints();
  }, []);

  const loadPoints = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setPoints(userData?.points || 0);
      }
    } catch (err) {
      console.error('Error loading points:', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Your Points</Text>
        <Text style={styles.points}>{points}</Text>
        <Text style={styles.subtitle}>Collect points by visiting spooky houses!</Text>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>How to Earn Points</Text>
        <Text style={styles.infoText}>• Visit decorated houses in your area</Text>
        <Text style={styles.infoText}>• Rate your trick-or-treating experience</Text>
        <Text style={styles.infoText}>• Complete special Halloween challenges</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f1a',
    padding: 20,
  },
  card: {
    backgroundColor: '#1a1f2e',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 12,
  },
  points: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF7A1C',
    marginBottom: 8,
  },
  subtitle: {
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#1a1f2e',
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF7A1C',
    marginBottom: 12,
  },
  infoText: {
    color: '#fff',
    opacity: 0.8,
    marginBottom: 8,
    fontSize: 14,
  },
});