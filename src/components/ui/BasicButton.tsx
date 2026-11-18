import { Pressable, StyleSheet, Text, TextStyle } from "react-native";

type TextAlignValues = TextStyle["textAlign"];

type Props = {
  children: string;
  onPress: () => void;
  width?: number;
  textAlignment?: TextAlignValues;
};

export function BasicButton({
  children,
  onPress,
  width,
  textAlignment = "center",
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress()}
      style={[styles.button, width !== undefined && { width }]}
    >
      <Text
        style={[
          styles.text,
          textAlignment !== undefined && { textAlign: textAlignment },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    backgroundColor: "lightgray",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "black",
  },
  text: {
    color: "black",
    width: "100%",
  },
});
