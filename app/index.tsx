import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        TrickO
      </Text>

      <Text style={styles.hook}>
        Find spooky houses.{"\n"}
        Earn points.{"\n"}
        Redeem locally.
      </Text>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => router.push('/auth')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF7A1C',
    marginBottom: 24,
  },
  hook: {
    color: '#ff8a33',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 28,
  },
  button: {
    backgroundColor: '#FF7A1C',
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    color: '#0b0f1a',
    fontWeight: '800',
    fontSize: 16,
  },
});