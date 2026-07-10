import { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { useAppState } from "../../context/AppStateContext";
import { formatOrdinalDate } from "../../utils/collections";

const STATUS_ICON = { PENDING: "⏳", FULFILLED: "💎", MISSED: "🐖" };

const CommitmentItem = ({ commitment }) => {
  const { styles, trajectories, openLogModal, refreshAll } = useAppState();
  const [expanded, setExpanded] = useState(false);
  const traj = trajectories[commitment.trajectoryId];

  const isPending = commitment.status === "PENDING";

  const handleMarkMissed = async () => {
    await ApiService.missCommitment(commitment.id);
    await refreshAll();
  };

  const handleLogItNow = () => {
    setExpanded(false);
    openLogModal(commitment.trajectoryId); // saving a log here auto-fulfills via tryFulfillCommitment
  };

  return (
    <TouchableOpacity
      onPress={() => setExpanded((e) => !e)}
      style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#222" }}
    >
      <Text style={styles.statValue}>
        {STATUS_ICON[commitment.status]} Complete by {formatOrdinalDate(commitment.expiresAt)}
      </Text>
      <Text style={styles.statLabel}>Requirement: {traj?.minimumUnit}</Text>
      {commitment.notes && (
        <Text style={styles.statLabel}>Notes: {commitment.notes}</Text>
      )}
      <Text style={styles.statLabel}>Committed on {formatOrdinalDate(commitment.createdAt)}</Text>

      {expanded && isPending && (
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <TouchableOpacity
            style={[styles.card, { marginRight: 8, flex: 1 }]}
            onPress={handleLogItNow}
          >
            <Text style={styles.statValue}>✅ LOG IT NOW</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, { flex: 1 }]}
            onPress={handleMarkMissed}
          >
            <Text style={styles.statValue}>😿 MARK MISSED</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CommitmentItem;
