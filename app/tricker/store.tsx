import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { useAuth } from '../../src/lib/auth';

type StoreItem = {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  imageUrl: string;
  vendor: string;
};

// Dummy store items
const STORE_ITEMS: StoreItem[] = [
  {
    id: '1',
    name: 'Texas A&M T-Shirt',
    description: 'Limited edition Halloween themed Aggie shirt',
    pointsCost: 100,
    imageUrl: 'https://placeholder.com/150',
    vendor: 'Aggie Store'
  },
  {
    id: '2',
    name: 'Free Burger',
    description: 'Redeem a free burger at Northgate Burgers',
    pointsCost: 50,
    imageUrl: 'https://placeholder.com/150',
    vendor: 'Northgate Burgers'
  },
  {
    id: '3',
    name: 'Movie Ticket',
    description: 'One free movie ticket at Century Theater',
    pointsCost: 75,
    imageUrl: 'https://placeholder.com/150',
    vendor: 'Century Theater'
  },
  {
    id: '4',
    name: 'Coffee Voucher',
    description: 'Free coffee at Sweet Eugene\'s',
    pointsCost: 25,
    imageUrl: 'https://placeholder.com/150',
    vendor: 'Sweet Eugene\'s'
  },
  {
    id: '5',
    name: 'Pizza Discount',
    description: '50% off on any large pizza',
    pointsCost: 40,
    imageUrl: 'https://placeholder.com/150',
    vendor: 'Northgate Pizza'
  }
];

export default function StoreScreen() {
  const { user } = useAuth();
  const [userPoints, setUserPoints] = useState<number>(120); // Default points for testing

  const handlePurchase = (item: StoreItem) => {
    if (userPoints >= item.pointsCost) {
      Alert.alert(
        'Confirm Purchase',
        `Would you like to redeem ${item.name} for ${item.pointsCost} points?`,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Redeem',
            onPress: () => {
              setUserPoints(prev => prev - item.pointsCost);
              Alert.alert(
                'Success!',
                `You've redeemed ${item.name}. Show this screen to ${item.vendor} to claim your reward!`
              );
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'Insufficient Points',
        `You need ${item.pointsCost - userPoints} more points to redeem this item.`
      );
    }
  };

  const renderItem = ({ item }: { item: StoreItem }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => handlePurchase(item)}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemInfo}>
          <ThemedText style={styles.itemName}>{item.name}</ThemedText>
          <ThemedText style={styles.itemVendor}>{item.vendor}</ThemedText>
          <ThemedText style={styles.itemDescription}>{item.description}</ThemedText>
          <ThemedText style={styles.pointsCost}>{item.pointsCost} points</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.pointsBalance}>
          Your Points: {userPoints}
        </ThemedText>
      </View>
      <FlatList
        data={STORE_ITEMS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#FF7A1C33',
  },
  pointsBalance: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF7A1C',
  },
  listContainer: {
    gap: 16,
  },
  itemCard: {
    backgroundColor: '#1a1f2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FF7A1C33',
  },
  itemContent: {
    flexDirection: 'row',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#FF7A1C',
  },
  itemVendor: {
    fontSize: 14,
    color: '#FF7A1C99',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    marginBottom: 8,
    color: '#fff',
    opacity: 0.8,
  },
  pointsCost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF7A1C',
  },
});