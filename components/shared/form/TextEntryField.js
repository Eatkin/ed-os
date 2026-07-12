import { View, Text, TextInput } from "react-native";
import { useAppState } from "../../../context/AppStateContext";

const TextEntryField = ({
  label,
  placeholder,
  value,
  onChange,
  multiline = true,
}) => {
  const { styles } = useAppState();

  return (
    <View style={{ marginTop: 16 }}>
      {label && <Text style={styles.subtitle}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#555"
        multiline={multiline}
        style={{
          color: "#fff",
          fontFamily: "monospace",
          borderColor: "#333",
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
          minHeight: multiline ? 60 : undefined,
          marginTop: 6,
        }}
      />
    </View>
  );
};

export default TextEntryField;
