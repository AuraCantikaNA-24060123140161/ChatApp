import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import FancyButtonFull from "../components/FancyButtonFull";
import FloatingInput from "../components/FloatingInput";
import {
  auth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "../firebase";

const BG = "#FFB974";
const CARD = "#FFF7ED";
const TEXT = "#3A3838";

export default function Register() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 800;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (loading) return;

    if (!username || !email || !password) {
      Alert.alert("Oops", "Semua field harus diisi.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Oops", "Password minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);
      console.log("[REGISTER] start", { email, username });

      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      console.log("[REGISTER] user created:", cred.user.uid);

      // simpan username
      await updateProfile(cred.user, {
        displayName: username.trim(),
      });

      console.log("[REGISTER] updateProfile OK");

      Alert.alert("Berhasil!", "Akun berhasil dibuat. Silakan login.");

      router.replace("/login");
    } catch (e: any) {
      console.log("[REGISTER] ERROR:", e?.code, e?.message);
      Alert.alert(
        "Register gagal",
        `${e?.code ?? "unknown"}\n${e?.message ?? String(e)}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.card, isWide && { width: 420 }]}>
        <Text style={styles.title}>Sign up</Text>
        <Text style={styles.subtitle}>
          Buat akun baru untuk mulai ngobrol dengan teman dan keluarga.
        </Text>

        <FloatingInput
          label="Username"
          value={username}
          onChangeText={setUsername}
        />

        <FloatingInput
          label="Email"
          value={email}
          onChangeText={setEmail}
        />

        <FloatingInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <FancyButtonFull
          title={loading ? "Creating..." : "Create Account"}
          onPress={handleRegister}
        />

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={styles.linkText}>Log in</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.replace("/")}
          style={{ marginTop: 8 }}
        >
          <Text style={styles.backHome}>← Back to landing</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: CARD,
    borderRadius: 30,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 25,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT,
    opacity: 0.7,
    marginBottom: 24,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    color: "#A5A5A5",
    fontSize: 12,
    marginHorizontal: 10,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  bottomText: {
    color: TEXT,
    fontSize: 13,
  },
  linkText: {
    color: BG,
    fontWeight: "700",
    fontSize: 13,
  },
  backHome: {
    textAlign: "center",
    fontSize: 12,
    color: "#b28b6a",
    marginTop: 12,
  },
});
