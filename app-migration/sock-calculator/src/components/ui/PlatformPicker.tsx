// import { Picker } from "@expo/ui";
// import React from "react";
// import { StyleSheet, Text, View } from "react-native";

// interface PickerItem {
//   label: string;
//   value: string | number;
// }

// interface PlatformPickerProps {
//   selectedValue: string | number;
//   onValueChange: (itemValue: string | number) => void;
//   items: PickerItem[];
//   label?: string;
// }

// export const PlatformPicker: React.FC<PlatformPickerProps> = ({
//   selectedValue,
//   onValueChange,
//   items,
//   label,
// }) => {
//   return (
//     <View style={styles.container}>
//       {label && <Text style={styles.label}>{label}</Text>}
//       <View style={styles.mobilePickerWrapper}>
//         <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
//           {items.map((item) => (
//             <Picker.Item
//               key={item.value}
//               label={item.label}
//               value={item.value}
//             />
//           ))}
//         </Picker>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 10,
//     width: "100%",
//     maxWidth: 400,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#374151",
//     marginBottom: 6,
//   },
//   mobilePickerWrapper: {
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 8,
//     backgroundColor: "#FFFFFF",
//     overflow: "hidden",
//   },
// });
