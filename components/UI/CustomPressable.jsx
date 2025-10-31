import React, { useRef } from "react";
import { Pressable, Animated } from "react-native";

/**
 * A reusable Pressable component that applies a scale-down animation on press.
 * It forwards all standard Pressable props and wraps its children in an Animated.View.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered inside the pressable area.
 * @param {object} [props.style] - Custom styles for the animated container.
 * @param {number} [props.scaleTo=0.95] - The value to scale down to on press.
 * @param {number} [props.duration=150] - The duration of the animation in milliseconds.
 * @param {function} [props.onPressIn] - Optional custom onPressIn handler.
 * @param {function} [props.onPressOut] - Optional custom onPressOut handler.
 * @returns {JSX.Element}
 */
export default function CustomPressable({
  children,
  style,
  scaleTo = 0.98, // Reverted to default scale down for press effect
  duration = 0, // Reverted to default duration for smoother animation
  onPressIn,
  onPressOut,
  ...rest
}) {
  // Use a ref to hold the animated value; .current is not needed here
  // because we initialize it once and it persists.
  const animatedValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = (e) => {
    Animated.timing(animatedValue, {
      toValue: scaleTo,
      duration,
      useNativeDriver: true,
    }).start();
    onPressIn?.(e); // Call original handler if it exists
  };

  const handlePressOut = (e) => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
    onPressOut?.(e); // Call original handler if it exists
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} {...rest}>
      <Animated.View style={[style, { transform: [{ scale: animatedValue }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
