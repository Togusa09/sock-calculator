export interface PlatformPickerItem {
  label: string;
  value: string | number;
}

export interface PlatformPickerProps {
  selectedValue: string | number;
  onValueChange: (itemValue: string | number) => void;
  items: PlatformPickerItem[];
  label?: string;
  flush?: boolean;
}
