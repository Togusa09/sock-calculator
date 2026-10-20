// // components/PlatformPicker.web.tsx
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
//       <div style={webStyles.selectWrapper}>
//         <select
//           value={selectedValue}
//           onChange={(e) => onValueChange(e.target.value)}
//           style={webStyles.select}
//         >
//           {items.map((item) => (
//             <option
//               key={item.value}
//               value={item.value}
//               style={webStyles.option}
//             >
//               {item.label}
//             </option>
//           ))}
//         </select>
//       </div>
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
// });

// const webStyles = {
//   selectWrapper: {
//     position: "relative" as const,
//     width: "100%",
//   },
//   select: {
//     width: "100%",
//     padding: "12px 16px",
//     fontSize: "16px",
//     color: "#1F2937",
//     backgroundColor: "#FFFFFF",
//     border: "1px solid #D1D5DB",
//     borderRadius: "8px",
//     outline: "none",
//     cursor: "pointer",
//     appearance: "none" as const,
//     WebkitAppearance: "none" as const,
//     MozAppearance: "none" as const,
//     backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://w3.org' viewBox='0 0 24 24' fill='none' stroke='%234B5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
//     backgroundRepeat: "no-repeat",
//     backgroundPosition: "right 16px center",
//     backgroundSize: "16px",
//   },
//   option: {
//     padding: "10px",
//     fontSize: "16px",
//     color: "#1F2937",
//   },
// };
