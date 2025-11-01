import { useState } from "react";
import { View, TextInput, Text, StyleSheet, Pressable, TouchableOpacity, Image } from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../src/lib/firebase";
import { useRouter } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Auth() {
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState<"tricker" | "owner" | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    try {
      setErr("");
      setLoading(true);
      let userCred: any;
      if (isSignup) {
        if (!role) {
          setErr("Please select a role");
          return;
        }
        userCred = await createUserWithEmailAndPassword(auth, email.trim(), pwd);
        await setDoc(doc(db, "users", userCred.user.uid), {
          email: email.trim(),
          role: role,
          points: role === "owner" ? 10 : 0, // Give 10 points for new owner signup, 0 for trickers
          createdAt: Date.now(),
          hasReceivedSignupBonus: true // Flag to track signup bonus
        });
      } else {
        userCred = await signInWithEmailAndPassword(auth, email.trim(), pwd);
      }
      const udoc = await getDoc(doc(db, "users", userCred.user.uid));
      const userRole = udoc.exists() ? (udoc.data() as any).role : null;
      if (!userRole) r.push("/role" as any);
      else if (userRole === "tricker") r.push("/tricker/home" as any);
      else r.push("/owner/home" as any);
    } catch (e: any) {
      console.error('Auth error:', e);
      if (e.code === 'permission-denied') {
        setErr('Firestore permission denied. Please check Firebase Console rules.');
      } else if (e.code === 'not-found') {
        setErr('Database not found. Please check Firebase Console setup.');
      } else {
        setErr(e?.message || String(e));
      }
    } finally {
      setLoading(false);
    }
  }

  const AuthButton = ({ 
    title, 
    onPress, 
    primary = false 
  }: { 
    title: string; 
    onPress: () => void; 
    primary?: boolean;
  }) => (
    <Pressable 
      style={({pressed}) => [
        styles.button,
        primary ? styles.primaryButton : styles.secondaryButton,
        pressed && styles.buttonPressed
      ]}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={[
        styles.buttonText,
        primary ? styles.primaryButtonText : styles.secondaryButtonText
      ]}>
        {title}
      </Text>
    </Pressable>
  );

  const RadioButton = ({ label, selected, onPress, emoji }: { 
    label: string; 
    selected: boolean; 
    onPress: () => void;
    emoji: string;
  }) => (
    <TouchableOpacity 
      style={[styles.radioButton, selected && styles.radioButtonSelected]} 
      onPress={onPress}
    >
      <View style={[styles.radio, selected && styles.radioSelected]} />
      <Text style={[styles.radioLabel, selected && styles.radioLabelSelected]}>
        {emoji} {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentBox}>
        <Image 
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder="Email" 
            placeholderTextColor="#666"
            style={styles.input} 
            autoCapitalize="none" 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address"
          />
          <TextInput 
            placeholder="Password" 
            placeholderTextColor="#666"
            style={styles.input} 
            secureTextEntry 
            value={pwd} 
            onChangeText={setPwd}
          />
          
          {isSignup && (
            <View style={styles.roleContainer}>
              <Text style={styles.roleTitle}>Choose your role:</Text>
              <RadioButton 
                label="Tricker (Kid)" 
                selected={role === "tricker"}
                onPress={() => setRole("tricker")}
                emoji="👻"
              />
              <RadioButton 
                label="Owner (House/Business)" 
                selected={role === "owner"}
                onPress={() => setRole("owner")}
                emoji="🏠"
              />
            </View>
          )}
        </View>

        {err ? <Text style={styles.error}>{err}</Text> : null}

        <View style={styles.buttonContainer}>
          <AuthButton
            title={loading ? "Casting Spell..." : (isSignup ? "Create Haunted Account" : "Enter if you dare!")}
            onPress={handleAuth}
            primary
          />
          <AuthButton
            title={isSignup ? "Already haunting? Login" : "New ghost? Sign up"}
            onPress={() => setIsSignup(!isSignup)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: '100%',
    height: 120,
    marginBottom: 24,
  },
  contentBox: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#ff6b01',
    shadowColor: '#ff6b01',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  roleContainer: {
    marginTop: 16,
    gap: 12,
  },
  roleTitle: {
    color: '#b5b5b5',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 1, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 1, 0.3)',
  },
  radioButtonSelected: {
    backgroundColor: 'rgba(255, 107, 1, 0.2)',
    borderColor: '#ff6b01',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ff6b01',
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: '#ff6b01',
  },
  radioLabel: {
    color: '#b5b5b5',
    fontSize: 16,
  },
  radioLabelSelected: {
    color: '#ff6b01',
  },
  inputContainer: {
    gap: 16,
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: '#ff6b01',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
  },
  error: {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  primaryButton: {
    backgroundColor: '#ff6b01',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ff6b01',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#000',
  },
  secondaryButtonText: {
    color: '#ff6b01',
  },
});