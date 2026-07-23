import { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { useAppState } from "../../context/AppStateContext";
import { formatOrdinalDate } from "../../utils/collections";
import { ApiService } from "../../services/ApiService/ApiService";

const STATUS_ICON = { PENDING: "⏳", FULFILLED: "💎", MISSED: "🐖" };

const CommitmentItem = ({ commitment }) => {
  const {
    styles,
    openLogModal,
    openCommitmentModal,
    refreshAll,
    openConfirmModal,
    trajectories,
  } = useAppState();
  const [expanded, setExpanded] = useState(false);

  const isPending = commitment.status === "PENDING";
  const traj = trajectories[commitment.trajectoryId];

  const handleMarkMissed = async () => {
    // Yeets the commitment
    openConfirmModal({
      title: "Mark this commitment as missed?",
      message: `"${commitment.id}" will be missed and you will no longer be able to complete it.`,
      confirmLabel: "Miss Commitment",
      onConfirm: async () => {
        await ApiService.missCommitment(commitment.id);
        await refreshAll();
      },
    });
  };

  const handleLogItNow = () => {
    setExpanded(false);
    openLogModal(commitment.trajectoryId, commitment.id); // saving a log here auto-fulfills via tryFulfillCommitment
  };

  return (
    <TouchableOpacity
      onPress={() => setExpanded((e) => !e)}
      style={{
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#222",
      }}
    >
      <Text style={styles.statValue}>
        {STATUS_ICON[commitment.status]} Complete by{" "}
        {formatOrdinalDate(commitment.expiresAt)}
      </Text>
      <Text style={styles.statValue}>Trajectory: {traj && traj.name}</Text>
      <Text style={styles.statLabel}>Requirement: {commitment.notes}</Text>
      <Text style={styles.statLabel}>
        Committed on {formatOrdinalDate(commitment.createdAt)}
      </Text>

      {expanded && isPending && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10, gap: 8 }}>
          <TouchableOpacity style={[styles.card, { flex: 1 }]} onPress={handleLogItNow}>
            <Text style={styles.statValue}>✅ LOG IT NOW</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, { flex: 1 }]}
            onPress={handleMarkMissed}
          >
            <Text style={styles.statValue}>😿 MARK MISSED</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, { flex: 1 }]}
            onPress={() =>
              openCommitmentModal(commitment.trajectoryId, commitment.id)
            }
          >
            <Text style={styles.statValue}>✏️ EDIT</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CommitmentItem;
