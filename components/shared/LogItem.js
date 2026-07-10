import { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { useAppState } from "../../context/AppStateContext";

const LogItem = ({ log }) => {
  const { styles, trajectories } = useAppState();
  const [expanded, setExpanded] = useState(false);
  const traj = trajectories[log.trajectoryId];
  const milestone = log.milestoneId
    ? traj?.milestones.find((m) => m.id === log.milestoneId)
    : null;

  return (
    <TouchableOpacity
      onPress={() => setExpanded((e) => !e)}
      style={{
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#222",
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.statValue}>{traj?.name ?? log.trajectoryId}</Text>
        <Text style={styles.statLabel}>
          {expanded && log.formattedDate} {log.formattedTime}
        </Text>
      </View>

      <Text style={styles.statLabel}>
        {log.resistance} · +{log.pointsAwarded} XP
      </Text>

      {log.commitmentId && (
        <Text style={[styles.statLabel, { color: "#00FFAA", marginTop: 4 }]}>
          ✅ Committed!
        </Text>
      )}

      {milestone && (
        <Text style={[styles.statLabel, { color: "#FFB300", marginTop: 4 }]}>
          🏆 MILESTONE: {milestone.text}
        </Text>
      )}

      {log.bonusXP > 0 && (
        <Text style={[styles.statLabel, { color: "#00FF00", marginTop: 4 }]}>
          🎯 BONUS · +{log.bonusXP} XP
        </Text>
      )}

      {expanded && (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.monospaceText}>
            {log.note?.trim() ? log.note : "No note added."}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default LogItem;
