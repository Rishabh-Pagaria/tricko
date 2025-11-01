import { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { collection, getDocs, addDoc, Timestamp, query, where } from "firebase/firestore";
import { db } from "../../src/lib/firebase";
import { Alert } from "react-native";
import { useAuth } from "../../src/lib/auth";
import { TreatRequestCallout } from "../../components/treat-request-callout";

type House = {
  id: string;
  ownerUid: string;
  title: string;
  lat: number;
  lng: number;
  isActive: boolean;
  description?: string;
  treatsAvailable?: string;
  trickPersona?: string;
  createdAt?: number;
};

export default function TrickerHomeScreen() {
  const [region, setRegion] = useState<any>(null);
  const [houses, setHouses] = useState<House[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const { userId, user } = useAuth();
  const mapRef = useRef<MapView>(null);

  // Debug auth state
  useEffect(() => {
    console.log('Auth State:', { userId, user });
  }, [userId, user]);
  
  const showHouseInfo = (house: House) => {
    if (!house.isActive) {
      Alert.alert('Not Available', 'This house is not currently active.');
      return;
    }

    Alert.alert(
      house.title,
      `Treats: ${house.treatsAvailable || 'Not specified'}\nTrick Persona: ${house.trickPersona || 'Not specified'}`
    );
  };
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get user's current location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationError("Location permission denied");
          // Set default region to a fallback location
          setRegion({
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
          });
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setLocationError("Failed to get location");
      }
    })();
  }, []);

  // Fetch houses from Firestore
  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getDocs(collection(db, "houses"));
        const housesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as House[];
        setHouses(housesList);
      } catch (error) {
        console.error('Error fetching houses:', error);
      }
    })();
  }, []);

  if (!region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF7A1C" />
        {locationError && (
          <Text style={styles.errorText}>{locationError}</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton
      >
        {houses
          .filter(house => house.isActive)
          .map(house => (
            <Marker
              key={house.id}
              coordinate={{ 
                latitude: house.lat, 
                longitude: house.lng 
              }}
              pinColor={house.isActive ? "#FF7A1C" : "#808080"}
              title={house.title}
              description={house.isActive ? "Tap for options" : "Not available"}
              onPress={() => showHouseInfo(house)}
            />
          ))}
      </MapView>
      
      {locationError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{locationError}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f1a',
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#0b0f1a',
    padding: 20,
  },
  errorContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 68, 68, 0.9)',
    padding: 10,
    borderRadius: 8,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
  },
  callout: {
    padding: 15,
    width: 200,
    backgroundColor: '#1a1f2e',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF7A1C33',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF7A1C',
    marginBottom: 4,
  },
  calloutDesc: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  calloutArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1a1f2e',
    position: 'absolute',
    bottom: -15,
    alignSelf: 'center',
  },
});