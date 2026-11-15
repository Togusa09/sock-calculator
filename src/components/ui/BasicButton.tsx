import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  children: string;
  onPress: () => void;
};

export function BasicButton({ children, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress()}
      style={styles.button}
    >
      <Text style={styles.text}>{children}</Text>
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
  },
});
