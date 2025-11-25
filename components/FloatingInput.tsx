import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, TextInput, View } from "react-native";

interface Props {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
}

export default function FloatingInput({
  label,
  value,
  onChangeText,
  secureTextEntry,
}: Props) {
  const focusAnim = useRef(new Animated.Value(0)).current;
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: focused || value !== "" ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [focused, value]);

  const labelStyle = {
    top: focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -10],
    }),
    fontSize: focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["#999", "#c68f46ff"],
    }),
  };

  const underlineStyle = {
    width: focusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"],
    }),
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!!secureTextEntry}
        style={styles.input}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      <View style={styles.underlineContainer}>
        <Animated.View style={[styles.underline, underlineStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 28,
    position: "relative",
  },
  input: {
    fontSize: 16,
    paddingVertical: 6,
    color: "#c68f46ff",
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#c68f46ff",
    backgroundColor: "transparent",
    outlineStyle: "none" as any,
    outlineWidth: 0 as any,
  },
  label: {
    position: "absolute",
    left: 0,
    top: 14,
  },
  underlineContainer: {
    height: 2,
    marginTop: 2,
    overflow: "hidden",
  },
  underline: {
    height: 2,
    backgroundColor: "#c68f46ff",
  },
});
