import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAppState } from "../../context/AppStateContext";

const LootHistory = () => {
  const { styles, loot, lootLog } = useAppState();
  const [expanded, setExpanded] = useState(false);

  if (lootLog.length === 0) return null;

  return (
    <View style={[styles.card, { marginBottom: 12 }]}>
      <TouchableOpacity onPress={() => setExpanded((e) => !e)}>
        <Text style={styles.statValue}>
          {expanded ? "▾" : "▸"} REDEMPTION HISTORY ({lootLog.length})
        </Text>
      </TouchableOpacity>

      {expanded &&
        lootLog.map((entry) => {
          const item = loot.find((l) => l.id === entry.lootItemId);
          return (
            <View
              key={entry.id}
              style={{
                marginTop: 8,
                paddingTop: 8,
                borderTopWidth: 1,
                borderTopColor: "#222",
              }}
            >
              <Text style={styles.statLabel}>
                {item ? item.name : "Unknown item"}
              </Text>
              <Text style={[styles.statLabel, { color: "#555" }]}>
                {entry.formattedDate} · {entry.formattedTime} ·{" "}
                {entry.costPaid != null ? `${entry.costPaid} HP` : "Free"}
              </Text>
            </View>
          );
        })}
    </View>
  );
};

export default LootHistory;
