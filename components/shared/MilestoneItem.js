import { View, Text } from "react-native";
import { useAppState } from "../../context/AppStateContext";

const MilestoneItem = ({ milestone }) => {
  const { styles } = useAppState();

  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.statValue}>
          {milestone.cleared ? "✅ " : "⬜️ "}
          {milestone.text}
        </Text>
      </View>

      {milestone.trajectoryName && (
        <Text style={styles.statLabel}>{milestone.trajectoryName}</Text>
      )}

      {milestone.unlocksLootIds?.length > 0 && (
        <Text style={[styles.statLabel, { color: "#FFB300", marginTop: 4 }]}>
          🎁 Unlocks {milestone.unlocksLootIds.length} loot item
          {milestone.unlocksLootIds.length > 1 ? "s" : ""}
        </Text>
      )}
    </View>
  );
};

export default MilestoneItem;
