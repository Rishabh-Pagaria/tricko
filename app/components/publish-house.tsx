import { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  Alert,
  ScrollView,
  ActivityIndicator
} from "react-native";
import * as Location from "expo-location";
import { auth, db } from "../../src/lib/firebase";
import { addDoc, collection } from "firebase/firestore";

type HouseData = {
  title: string;
  description: string;
  persona: string;
  treatsAvailable: string;
};

const INITIAL_DATA: HouseData = {
  title: "",
  description: "",
  persona: "",
  treatsAvailable: "",
};

interface PublishHouseProps {
  onPublished?: () => void;
}

export default function PublishHouse({ onPublished }: PublishHouseProps) {
  const [data, setData] = useState<HouseData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = async () => {
    try {
      setLoading(true);
      
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        Alert.alert(
          "Location Services Disabled",
          "Please enable location services in your device settings.",
          [{ text: "OK" }]
        );
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setPermissionDenied(true);
        Alert.alert(
          "Location Required",
          "We need your location to show your house on the map. Please enable location in your device settings.",
          [
            { 
              text: "Try Again", 
              onPress: () => {
                setPermissionDenied(false);
                requestLocation();
              }
            }
          ]
        );
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        mayShowUserSettingsDialog: true
      });
      
      if (!location) {
        throw new Error("Could not get location");
      }
      
      setLocation(location);
      setPermissionDenied(false);
    } catch (err) {
      console.error("Detailed location error:", err);
      
      let message = "Could not get your location. ";
      if (err instanceof Error) {
        if (err.message.includes("Location request timed out")) {
          message += "The request timed out. Please try again.";
        } else if (err.message.includes("Location provider is unavailable")) {
          message += "Please make sure you are in an area with GPS coverage.";
        } else {
          message += "Please make sure location services are enabled.";
        }
      }
      
      Alert.alert(
        "Location Error",
        message,
        [
          { 
            text: "Try Again", 
            onPress: requestLocation 
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    if (!data.title.trim()) return "House title is required";
    if (!data.description.trim()) return "Description is required";
    if (!data.persona.trim()) return "Treat giver persona is required";
    if (!data.treatsAvailable.trim()) return "Available treats info is required";
    return null;
  };

  const publish = async () => {
    try {
      const error = validate();
      if (error) {
        Alert.alert("Required Fields", error);
        return;
      }
      
      const uid = auth.currentUser?.uid;
      if (!uid) {
        Alert.alert("Error", "You must be logged in to publish");
        return;
      }

      setLoading(true);

      let currentLocation = location;
      if (!currentLocation) {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            currentLocation = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
          }
        } catch (err) {
          console.error("Location error:", err);
        }
      }

      const houseData: any = {
        ownerUid: uid,
        title: data.title,
        description: data.description,
        trickPersona: data.persona,
        treatsAvailable: data.treatsAvailable,
        isActive: true,
        createdAt: Date.now(),
      };

      if (currentLocation) {
        houseData.lat = currentLocation.coords.latitude;
        houseData.lng = currentLocation.coords.longitude;
      }

      await addDoc(collection(db, "houses"), houseData);

      Alert.alert(
        "Published!", 
        "Your house is now discoverable to trick-or-treaters!",
        [{ text: "OK", onPress: () => {
          setData(INITIAL_DATA);
          onPublished?.();
        }}]
      );
    } catch (err) {
      console.error("Error publishing house:", err);
      Alert.alert(
        "Error", 
        `Could not publish your house: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Publish Your Haunted House</Text>
      
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>House Title</Text>
          <TextInput
            style={styles.input}
            value={data.title}
            onChangeText={(text) => setData(prev => ({ ...prev, title: text }))}
            placeholder="e.g., The Spooky Manor"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={data.description}
            onChangeText={(text) => setData(prev => ({ ...prev, description: text }))}
            placeholder="Describe your haunted house and what trick-or-treaters can expect..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Your Spooky Persona</Text>
          <TextInput
            style={styles.input}
            value={data.persona}
            onChangeText={(text) => setData(prev => ({ ...prev, persona: text }))}
            placeholder="e.g., Friendly Ghost, Witch, Vampire"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Available Treats</Text>
          <TextInput
            style={styles.input}
            value={data.treatsAvailable}
            onChangeText={(text) => setData(prev => ({ ...prev, treatsAvailable: text }))}
            placeholder="What treats are you giving out?"
            placeholderTextColor="#666"
          />
        </View>

        <Pressable 
          style={[
            styles.locationButton,
            location && styles.locationButtonSuccess
          ]} 
          onPress={requestLocation}
        >
          <Text style={styles.locationButtonText}>
            {location ? '📍 Location Set - Tap to Update' : '📍 Set Location (Required)'}
          </Text>
          {permissionDenied && (
            <Text style={styles.locationError}>
              Please enable location access
            </Text>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.publishButton,
            pressed && styles.publishButtonPressed
          ]}
          onPress={publish}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.publishButtonText}>
              🎃 Publish House
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF7A1C',
    marginVertical: 20,
    textAlign: 'center',
  },
  form: {
    padding: 20,
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF7A1C',
  },
  input: {
    backgroundColor: '#1a1f2e',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#FF7A1C33',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  locationButton: {
    backgroundColor: '#1a1f2e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF7A1C33',
  },
  locationButtonText: {
    color: '#FF7A1C',
    fontSize: 16,
    fontWeight: '600',
  },
  publishButton: {
    backgroundColor: '#FF7A1C',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  publishButtonPressed: {
    opacity: 0.8,
  },
  publishButtonText: {
    color: '#0b0f1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationButtonSuccess: {
    backgroundColor: '#1a2f1e',
    borderColor: '#4CAF5033',
  },
  locationError: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
});