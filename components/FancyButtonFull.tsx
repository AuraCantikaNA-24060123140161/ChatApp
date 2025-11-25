import React, { useRef } from "react";
import {
    Animated,
    Platform,
    Pressable,
    StyleSheet
} from "react-native";

interface Props {
  title: string;
  onPress?: () => void;
}

export default function FancyButtonFull({ title, onPress }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  const onEnter = () => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const onLeave = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const bgColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#3A3838", "#FFB974"],
  });

  const textColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFB974", "#FFFFFF"],
  });

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={Platform.OS === "web" ? onEnter : undefined}
      onHoverOut={Platform.OS === "web" ? onLeave : undefined}
      onPressIn={onEnter}
      onPressOut={onLeave}
      style={styles.wrapper}
    >
      <Animated.View style={[styles.button, { backgroundColor: bgColor }]}>
        <Animated.Text style={[styles.text, { color: textColor }]}>
          {title}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: 22,
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFB974",
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
});
