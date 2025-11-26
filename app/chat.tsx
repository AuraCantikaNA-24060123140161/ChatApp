import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Redirect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import {
  addDoc,
  auth,
  getDownloadURL,
  messagesCollection,
  onSnapshot,
  orderBy,
  query,
  ref,
  serverTimestamp,
  signOut,
  storage,
  uploadBytes,
} from "../firebase";

type MessageType = {
  id: string;
  text?: string;
  userId?: string;
  userName?: string;
  imageUrl?: string;
  createdAt?: { seconds: number; nanoseconds: number } | null;
};

const base64ToBlob = (base64: string, contentType = "") => {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

const STORAGE_KEY = "CHAT_MESSAGES";

const BG = "#FFB974";
const CARD = "#FFF7ED";
const DARK = "#3A3838";

export default function Chat() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  // layout khusus web lebar
  const isWideWeb = Platform.OS === "web" && width >= 900;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);

  // kalau belum login, tendang ke login
  if (!auth.currentUser) {
    return <Redirect href="/login" />;
  }

  const currentUid = auth.currentUser.uid;
  const currentUserName =
    auth.currentUser.displayName || auth.currentUser.email || "Anon";

  // load offline history
  useEffect(() => {
    const loadFromStorage = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const saved = JSON.parse(json) as MessageType[];
          setMessages(saved);
        }
      } catch (e) {
        console.log("Failed to load local messages", e);
      }
    };
    loadFromStorage();
  }, []);

  // realtime Firestore
  useEffect(() => {
    const q = query(messagesCollection, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, async (snapshot: any) => {
      const list: MessageType[] = [];
      snapshot.forEach((doc: any) => {
        list.push({
          id: doc.id,
          ...(doc.data() as Omit<MessageType, "id">),
        });
      });
      setMessages(list);
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.log("Failed to save messages", e);
      }
    });
    return () => unsub();
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      await addDoc(messagesCollection, {
        text: message,
        userId: currentUid,
        userName: currentUserName,
        createdAt: serverTimestamp(),
      });
      setMessage("");
    } catch (e) {
      console.log("Failed to send message", e);
    }
  };

 const sendImage = async () => {
  try {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Izin dibutuhkan", "Izin akses galeri diperlukan.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    if (!asset.base64) {
      Alert.alert("Error", "Gambar gagal diambil.");
      return;
    }

    const blob = base64ToBlob(asset.base64, "image/jpeg");

    const filename = `images/${currentUid}_${Date.now()}.jpg`;
    const imageRef = ref(storage, filename);

    await uploadBytes(imageRef, blob);

    const url = await getDownloadURL(imageRef);

    await addDoc(messagesCollection, {
      text: "",
      imageUrl: url,
      userId: currentUid,
      userName: currentUserName,
      createdAt: serverTimestamp(),
    });

  } catch (e) {
    console.log("FAILED UPLOAD IMAGE:", e);
    Alert.alert("Error", "Gagal mengirim gambar.");
  }
};

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem(STORAGE_KEY);
      router.replace("/login");
    } catch (e) {
      console.log("Logout error", e);
    }
  };

  const renderItem = ({ item }: { item: MessageType }) => {
    const isMine = item.userId === currentUid;

    const displayName = isMine ? "You" : item.userName || "Anon";

    return (
      <View
        style={[
          styles.msgRow,
          isMine ? styles.msgRowMine : styles.msgRowOther,
        ]}
      >
        <View
          style={[
            styles.msgBox,
            isMine ? styles.myMsg : styles.otherMsg,
          ]}
        >
          <Text style={styles.sender}>{displayName}</Text>

          {item.text ? (
            <Text
              style={[
                styles.text,
                isMine ? styles.myText : styles.otherText,
              ]}
            >
              {item.text}
            </Text>
          ) : null}

          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.screen, isWideWeb && styles.screenWide]}>
      <View style={[styles.card, isWideWeb && styles.cardWide]}>
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.appName}>OChat</Text>
            <Text style={styles.userNameTop}>{currentUserName}</Text>
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* CHAT LIST + INPUT */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          />

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ketik pesan..."
              placeholderTextColor="#9ca3af"
              value={message}
              onChangeText={setMessage}
            />

            <TouchableOpacity style={styles.iconBtn} onPress={sendImage}>
              <Text style={styles.iconText}>📎</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconBtn, styles.sendBtn]}
              onPress={sendMessage}
            >
              <Text style={[styles.iconText, styles.sendIconText]}>➤</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
    padding: 16,
    justifyContent: "center",
  },
  // khusus web lebar: center card
  screenWide: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flex: 1,
    backgroundColor: CARD,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 25,
    elevation: 8,
  },
  cardWide: {
    maxWidth: 960,
    width: "100%",
  },

  topBar: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: CARD,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1ded0",
  },
  appName: {
    fontSize: 16,
    fontWeight: "700",
    color: DARK,
  },
  userNameTop: {
    fontSize: 12,
    color: "#a1704b",
  },
  logoutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5b98a",
    backgroundColor: "#fff3e3",
  },
  logoutText: {
    fontSize: 12,
    fontWeight: "600",
    color: DARK,
  },

  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: 80,
  },

  // ROW PESAN: kanan/kiri
  msgRow: {
    width: "100%",
    marginVertical: 4,
    flexDirection: "row",
  },
  msgRowMine: {
    justifyContent: "flex-end", // bubble di kanan
  },
  msgRowOther: {
    justifyContent: "flex-start", // bubble di kiri
  },

  msgBox: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    maxWidth: "80%",
  },
  myMsg: {
    backgroundColor: "#3A3838",
  },
  otherMsg: {
    backgroundColor: "#ffffff",
  },
  sender: {
    fontWeight: "700",
    marginBottom: 2,
    fontSize: 11,
    color: "#9b6a3b",
  },
  text: {
    fontSize: 14,
  },
  myText: {
    color: "#f9fafb",
  },
  otherText: {
    color: DARK,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 6,
    borderRadius: 12,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1ded0",
    backgroundColor: CARD,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#f0d4b7",
    color: DARK,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffe8c9",
  },
  sendBtn: {
    backgroundColor: "#3A3838",
  },
  iconText: {
    fontSize: 18,
    color: DARK,
  },
  sendIconText: {
    color: "#ffffff",
  },
});
