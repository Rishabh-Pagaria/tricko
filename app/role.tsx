import { View, Text, Button, StyleSheet } from "react-native";
import { auth, db } from "../src/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function Role() {
  const r = useRouter();
  const uid = auth.currentUser?.uid;

  async function chooseRole(role: "tricker" | "owner") {
    if (!uid) return;
    await setDoc(doc(db, "users", uid), { role }, { merge: true });
    if (role === "tricker") r.replace("/tricker/home");
    else r.replace("/owner/home");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your role</Text>
      <Button title="I'm a Tricker (Kid)" onPress={() => chooseRole("tricker")} />
      <View style={{height:12}} />
      <Button title="I'm an Owner (House/Business)" onPress={() => chooseRole("owner")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", padding:20 },
  title: { fontSize:20, fontWeight:"700", marginBottom:20, textAlign:"center" }
});
