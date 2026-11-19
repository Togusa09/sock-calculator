import { Link, type Href } from "expo-router";
import { Pressable, StyleSheet, Text, TextStyle } from "react-native";

type TextAlignValues = TextStyle["textAlign"];

type Props = {
  children: string;
  href: Href;
  width?: number;
  textAlignment?: TextAlignValues;
};

export function NavButton({
  children,
  href,
  width,
  textAlignment = "center",
}: Props) {
  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityRole="link"
        style={StyleSheet.flatten([
          styles.button,
          width !== undefined && { width },
        ])}
      >
        <Text
          style={StyleSheet.flatten([
            styles.text,
            textAlignment !== undefined && { textAlign: textAlignment },
          ])}
        >
          {children}
        </Text>
      </Pressable>
    </Link>
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
