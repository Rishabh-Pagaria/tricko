import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { auth, db } from '../../src/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function WalletScreen() {
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
        <Text style={styles.subtitle}>Earn points when trick-or-treaters visit your house!</Text>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>How to Earn Points</Text>
        <Text style={styles.infoText}>• 5 points for each trick-or-treater visit</Text>
        <Text style={styles.infoText}>• 10 bonus points for positive ratings</Text>
        <Text style={styles.infoText}>• Special event bonuses during Halloween night!</Text>
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
    fontSize: 20,
    fontWeight: '600',
    color: '#FF7A1C',
    marginBottom: 12,
  },
  points: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#1a1f2e',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF7A1C',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    opacity: 0.9,
  },
});