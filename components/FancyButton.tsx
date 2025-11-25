import React, { useRef } from "react";
import {
    Animated,
    GestureResponderEvent,
    Platform,
    Pressable,
    StyleSheet
} from "react-native";

type Props = {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
};

export default function FancyButton({ title, onPress }: Props) {
  const circle = useRef(new Animated.ValueXY({ x: 120, y: 120 })).current;
  const bg = useRef(new Animated.Value(0)).current;

  const enter = () => {
    Animated.parallel([
      Animated.timing(circle, {
        toValue: { x: -30, y: -30 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(bg, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const leave = () => {
    Animated.parallel([
      Animated.timing(circle, {
        toValue: { x: 120, y: 120 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(bg, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const textColor = bg.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFB974", "#FFFFFF"],
  });

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={Platform.OS === "web" ? enter : undefined}
      onHoverOut={Platform.OS === "web" ? leave : undefined}
      onPressIn={enter}
      onPressOut={leave}
      style={styles.button}
    >
      <Animated.View
        style={[
          styles.circle,
          { top: circle.y, left: circle.x, backgroundColor: "#FFB974" },
        ]}
      />
      <Animated.Text style={[styles.text, { color: textColor }]}>
        {title}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3A3838",
    borderWidth: 2,
    borderColor: "#FFB974",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
    zIndex: 2,
  },
  circle: {
    width: 220,
    height: 220,
    borderRadius: 999,
    position: "absolute",
  },
});
