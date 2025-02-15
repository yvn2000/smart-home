import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Animated } from "react-native";

const { width, height } = Dimensions.get("window");

const LavaLampBackground = () => {
  // Create animated values for multiple lava blobs
  const [moveAnimation1, setMoveAnimation1] = useState(new Animated.Value(0));
  const [moveAnimation2, setMoveAnimation2] = useState(new Animated.Value(0));
  const [moveAnimation3, setMoveAnimation3] = useState(new Animated.Value(0));

  // Initialize the animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnimation1, {
          toValue: width,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnimation1, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnimation2, {
          toValue: width,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnimation2, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnimation3, {
          toValue: width,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnimation3, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated Lava Blob 1 */}
      <Animated.View
        style={[
          styles.lavaBlob,
          {
            transform: [{ translateX: moveAnimation1 }],
            backgroundColor: "rgba(255, 0, 0, 0.6)",
            borderRadius: moveAnimation1.interpolate({
              inputRange: [0, width],
              outputRange: [100, 150],
            }),
            width: moveAnimation1.interpolate({
              inputRange: [0, width],
              outputRange: [100, 120],
            }),
            height: moveAnimation1.interpolate({
              inputRange: [0, width],
              outputRange: [150, 180],
            }),
          },
        ]}
      />
      {/* Animated Lava Blob 2 */}
      <Animated.View
        style={[
          styles.lavaBlob,
          {
            transform: [{ translateX: moveAnimation2 }],
            backgroundColor: "rgba(255, 165, 0, 0.6)",
            borderRadius: moveAnimation2.interpolate({
              inputRange: [0, width],
              outputRange: [50, 100],
            }),
            width: moveAnimation2.interpolate({
              inputRange: [0, width],
              outputRange: [100, 120],
            }),
            height: moveAnimation2.interpolate({
              inputRange: [0, width],
              outputRange: [150, 200],
            }),
          },
        ]}
      />
      {/* Animated Lava Blob 3 */}
      <Animated.View
        style={[
          styles.lavaBlob,
          {
            transform: [{ translateX: moveAnimation3 }],
            backgroundColor: "rgba(0, 255, 0, 0.6)",
            borderRadius: moveAnimation3.interpolate({
              inputRange: [0, width],
              outputRange: [60, 100],
            }),
            width: moveAnimation3.interpolate({
              inputRange: [0, width],
              outputRange: [100, 140],
            }),
            height: moveAnimation3.interpolate({
              inputRange: [0, width],
              outputRange: [130, 170],
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  lavaBlob: {
    position: "absolute",
    top: height / 2,
    width: 100,
    height: 150,
    borderRadius: 50,
  },
});

export default LavaLampBackground;