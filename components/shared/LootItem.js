import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAppState } from "../../context/AppStateContext";
import { ApiService } from "../../services/ApiService/ApiService";

const STATUS_BADGE = {
  AVAILABLE: { emoji: "✨", color: "#00FF00", label: "AVAILABLE" },
  LOCKED: { emoji: "🔒", color: "#555", label: "LOCKED" },
  OWNED: { emoji: "✅", color: "#FFB300", label: "OWNED" },
};

const LootItem = ({ item }) => {
  const {
    styles,
    profile,
    trajectories,
    refreshAll,
    openConfirmModal,
    openLootAdderModal,
  } = useAppState();
  const [purchasing, setPurchasing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const badge = STATUS_BADGE[item.status];

  const canAfford =
    item.cost == null || (profile?.heroPoints ?? 0) >= item.cost;

  const requiredHP = item.cost - (profile?.heroPoints ?? 0);

  const requiredMilestoneText = (() => {
    if (item.status !== "LOCKED" || !item.requiredMilestoneId) return null;
    for (const traj of Object.values(trajectories)) {
      const m = traj.milestones.find((m) => m.id === item.requiredMilestoneId);
      if (m) return m.text;
    }
    return null;
  })();

  const handlePurchase = async () => {
    setPurchasing(true);
    openConfirmModal({
      title: `Purchase ${item.name}?`,
      message: `This will cost ${item.cost} Hero Points`,
      confirmLabel: "Yes!",
      onConfirm: async () => {
        try {
          await ApiService.purchaseLootItem(item.id);
          await refreshAll();
        } catch (e) {
          console.error("Purchase failed:", e);
        } finally {
          setPurchasing(false);
        }
      },
    });
  };

  return (
    <TouchableOpacity
      onPress={() => setExpanded((e) => !e)}
      style={[
        styles.card,
        {
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#222",
          opacity: item.status === "LOCKED" ? 0.8 : 1,
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.statValue}>{item.name}</Text>
        <Text style={{ color: badge.color, fontSize: 11 }}>
          {badge.emoji} {badge.label}
        </Text>
      </View>

      {item.recurring && item.purchased > 0 && (
        <Text style={styles.statValue}>
          Redeemed {item.purchased} {item.purchased > 1 ? "times" : "time"}
        </Text>
      )}

      {item.notes && <Text style={styles.statLabel}>{item.notes}</Text>}

      {item.status === "LOCKED" && requiredMilestoneText && (
        <Text style={[styles.statLabel, { marginTop: 4 }]}>
          Requires: {requiredMilestoneText}
        </Text>
      )}

      {expanded && (
        <>
          {item.status === "AVAILABLE" && (
            <>
              <Text style={[styles.statLabel, { marginTop: 4 }]}>
                {item.cost != null ? `${item.cost} HP` : "Free unlock"}
              </Text>
              <TouchableOpacity
                style={{ opacity: canAfford && !purchasing ? 1 : 0.4 }}
                onPress={handlePurchase}
                disabled={!canAfford || purchasing}
              >
                <Text style={styles.statValue}>
                  {purchasing
                    ? "..."
                    : canAfford
                      ? "PURCHASE"
                      : `NOT ENOUGH HP (${requiredHP} to go)`}
                </Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            onPress={() => openLootAdderModal(null, item.id)}
            style={{
              marginTop: 10,
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: "#FFB300",
              borderRadius: 8,
              alignSelf: "flex-start",
            }}
          >
            <Text style={[styles.statLabel, { color: "#555" }]}>✏️ EDIT</Text>
          </TouchableOpacity>
        </>
      )}
    </TouchableOpacity>
  );
};

export default LootItem;
