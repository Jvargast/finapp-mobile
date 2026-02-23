import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing } from "react-native";
import { XStack, useTheme } from "tamagui";

interface WouLoaderProps {
  size?: number;
  color?: string;
  space?: string;
}

export const WouLoader = ({ size = 8, color = "$brand", space = "$1" }: WouLoaderProps) => {
  const theme = useTheme();
  const dotColor = useMemo(() => {
    if (color.startsWith("$")) {
      const token = color.replace("$", "");
      return (theme as any)?.[token]?.val || color;
    }
    return color;
  }, [color, theme]);

  const anims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    const loops = anims.map((anim, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 120),
          Animated.timing(anim, {
            toValue: 1,
            duration: 320,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 320,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay((2 - index) * 120),
        ]),
      ),
    );

    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [anims]);

  return (
    <XStack alignItems="center" space={space}>
      {anims.map((anim, idx) => (
        <Animated.View
          key={`wou-dot-${idx}`}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: dotColor,
            opacity: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.4, 1],
            }),
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
              },
            ],
          }}
        />
      ))}
    </XStack>
  );
};
