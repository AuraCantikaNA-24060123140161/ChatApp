import { Redirect, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import FancyButton from "../components/FancyButton";
import FancyButtonOutline from "../components/FancyButtonOutline";
import { auth } from "../firebase";

const ORANGE = "#FFB974";

export default function Index() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isWide = width >= 900;

  // Auto-login
  if (auth.currentUser) {
    return <Redirect href="/chat" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.card}>
          {isWide ? (
            // WEB
            <View style={styles.row}>
              <View style={[styles.left, { paddingRight: 40 }]}>
                <BrandAndText />
                <View style={[styles.ctaRow, { marginTop: 24 }]}>
                  <FancyButton
                    title="Sign-In"
                    onPress={() => router.push("/login")}
                  />
                  <FancyButtonOutline
                    title="Sign-up"
                    onPress={() => router.push("/register")}
                  />
                </View>
              </View>

              <View style={styles.right}>
                <HeroImage variant="wide" />
              </View>
            </View>
          ) : (
            // MOBILE
            <View style={styles.column}>
              <BrandAndText />

              <View style={{ marginTop: 24, marginBottom: 32 }}>
                <HeroImage variant="mobile" />
              </View>

              <View style={[styles.ctaRow, { marginTop: 8 }]}>
                <FancyButton
                  title="Get Started"
                  onPress={() => router.push("/login")}
                />
                <FancyButtonOutline
                  title="Learn More"
                  onPress={() => router.push("/register")}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

function BrandAndText() {
  return (
    <>
      <Text style={styles.brand}>OChat</Text>
      <Text style={styles.title}>
        Connect Instantly,{"\n"}Share Your World
      </Text>
      <Text style={styles.subtitle}>
       Mulai ngobrol dengan teman, keluarga, dan tim dalam satu aplikasi.
      </Text>
    </>
  );
}

function HeroImage({ variant }: { variant: "mobile" | "wide" }) {
  return (
    <View style={styles.heroWrapper}>
      <Image
        source={require("../assets/images/ChitChat.png")}
        style={variant === "wide" ? styles.heroImageWide : styles.heroImageMobile}
        resizeMode="contain"
      />
      <Text style={styles.heroCaption}>
        Bring your conversations together.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ORANGE,
  },
  screen: {
    flex: 1,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 1000,
    backgroundColor: "#FFF7ED",
    borderRadius: 32,
    padding: 24,
  },

  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },

  left: {
    flex: 1,
    justifyContent: "center",
  },
  right: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  brand: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3a3838ff",
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#3a3838ff",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#3a3838ff",
    marginBottom: 16,
    maxWidth: 380,
  },

  ctaRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 12,
  },

  heroWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  heroImageMobile: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  heroImageWide: {
    width: "150%",
    height: 280,
    borderRadius: 10,
  },
  heroCaption: {
    marginTop: 10,
    fontSize: 12,
    color: "#3a3838ff",
  },
});
