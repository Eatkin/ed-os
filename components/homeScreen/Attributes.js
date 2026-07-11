import { Text, View } from "react-native";
import { useAppState } from "../../context/AppStateContext";

const HomeScreenAttributes = () => {
  const { styles, profile } = useAppState();

  return (
    <View style={styles.card}>
      <Text style={styles.monospaceText}>// CORE_ATTRIBUTES</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
       {profile.attributes.list.map((attr) => (
          <View key={attr.id} style={{ width: "50%", padding: 5 }}>
            <Text style={styles.monospaceText}>
              {attr.emoji} {attr.label}
            </Text>
            <View style={{ height: 4, backgroundColor: "#333", marginTop: 4 }}>
              <View
                style={{
                  width: `${attr.progress.xpProgress}%`,
                  height: 4,
                  backgroundColor: "#0f0",
                }}
              />
            </View>
            <Text
              style={[
                styles.monospaceText,
                { fontSize: 10, textAlign: "right" },
              ]}
            >
              LVL {attr.progress.level}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default HomeScreenAttributes;
