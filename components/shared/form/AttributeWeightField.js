import { View, Text, TouchableOpacity } from "react-native";
import { useAppState } from "../../../context/AppStateContext";

const AttributeWeightField = ({ label, value = {}, onChange }) => {
  const { styles, profile } = useAppState();
  const attributes = profile.attributes.list;

  const setWeight = (attrId, weight) => {
    onChange({ ...value, [attrId]: weight });
  };

  return (
    <View style={{ marginTop: 16 }}>
      {label && <Text style={styles.subtitle}>{label}</Text>}
      {attributes.map((attr) => {
        const current = value[attr.id] ?? 0;
        return (
          <View key={attr.id} style={{ marginBottom: 10 }}>
            <Text style={styles.statLabel}>
              {attr.emoji} {attr.label}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 4 }}>
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity
                  key={n}
                  onPress={() => setWeight(attr.id, n)}
                  style={[
                    styles.card,
                    {
                      width: 36,
                      height: 36,
                      marginRight: 6,
                      justifyContent: "center",
                      alignItems: "center",
                      borderColor: current === n ? "#FFB300" : "#FFF",
                      borderWidth: 2,
                    },
                  ]}
                >
                  <Text style={[styles.statValue, { color: current === n ? "#FFB300" : "#fff" }]}>
                    {n}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default AttributeWeightField;
