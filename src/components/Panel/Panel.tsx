import { ReactNode } from "react";
import { View } from "react-native";

type Props = {
  children: ReactNode;
};

export function Panel({ children }: Props) {
  return <View>{children}</View>;
}
