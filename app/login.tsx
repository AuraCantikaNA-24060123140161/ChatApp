import { Redirect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import FancyButtonFull from "../components/FancyButtonFull";
import FloatingInput from "../components/FloatingInput";
import { auth, signInWithEmailAndPassword } from "../firebase";

const BG = "#FFB974";
const CARD = "#FFF7ED";
const TEXT = "#3A3838";

export default function Login() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 800;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  if (auth.currentUser) return <Redirect href="/chat" />;

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Oops", "Email / username dan password harus diisi");
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/chat");
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        "Login gagal",
        err?.message || "Terjadi kesalahan saat login"
      );
    }
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.card, isWide && { width: 420 }]}>
        <Text style={styles.title}>Log in</Text>
        <Text style={styles.subtitle}>
          Welcome back! Please enter your account.
        </Text>

        <FloatingInput
          label="Email / Username"
          value={email}
          onChangeText={setEmail}
        />

        <FloatingInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.optionsRow}>
          <Pressable
            style={styles.rememberRow}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View
              style={[
                styles.checkbox,
                rememberMe && styles.checkboxChecked,
              ]}
            />
            <Text style={styles.rememberText}>Remember me</Text>
          </Pressable>

          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <FancyButtonFull title="Secure Login" onPress={handleLogin} />

        <View className="divider" style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={() => router.replace("/register")}>
            <Text style={styles.bottomLink}>Sign up</Text>
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

  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: TEXT,
    marginRight: 8,
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: TEXT,
  },
  rememberText: {
    fontSize: 12,
    color: TEXT,
  },
  forgotText: {
    fontSize: 12,
    color: "#6b7280",
  },

  loginBtn: {
    width: "100%",
    backgroundColor: "#3A3838",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 22,
    borderWidth: 2,
    borderColor: "#FFB974",
  },
  loginBtnText: {
    color: "#FFB974",
    fontSize: 16,
    fontWeight: "700",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
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
  bottomLink: {
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
