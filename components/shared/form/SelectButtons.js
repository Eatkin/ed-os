// components/shared/form/SelectButtons.js
import { View, Text, TouchableOpacity } from "react-native";
import { useAppState } from "../../../context/AppStateContext";

const normalise = (opt) =>
  typeof opt === "string" ? { value: opt, label: opt } : opt;

const SelectButtons = ({ label, options, value, onChange, optionSubtext }) => {
  const { styles } = useAppState();

  return (
    <View style={{ marginTop: 16 }}>
      {label && <Text style={styles.subtitle}>{label}</Text>}
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {options.map((rawOpt) => {
          const opt = normalise(rawOpt);
          return (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.card,
                {
                  marginRight: 8,
                  marginBottom: 8,
                  borderColor: value === opt.value ? "#FFB300" : "transparent",
                  borderWidth: 2,
                },
              ]}
              onPress={() => onChange(opt.value)}
            >
              <Text style={styles.statLabel}>{opt.label}</Text>
              {optionSubtext && (
                <Text
                  style={[styles.statLabel, { color: "#00FF00", fontSize: 10 }]}
                >
                  {optionSubtext(opt.value)}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default SelectButtons;
