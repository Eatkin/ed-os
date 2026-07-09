import { View, Text } from "react-native";
import homeStyles from "../../style/home";
import { useAppState } from "../../context/AppStateContext";
import { formatOrdinalDate } from "../../utils/collections";

const CommitmentItem = ({ commitment }) => {
  // Reuse log styles
  const styles = homeStyles;
  const { trajectories } = useAppState();
  const traj = trajectories[commitment.trajectoryId];

  const createdAt = formatOrdinalDate(commitment.createdAt);

  const expiresAt = formatOrdinalDate(commitment.expiresAt);

  return (
    <View style={styles.logEntry}>
      <Text style={styles.logHeader}>
        {commitment.status === "PENDING"
          ? "⏳️ "
          : commitment.status === "FULFILLED"
            ? "💎 "
            : "🐖 "}
        [Complete by {expiresAt}]
      </Text>
      <Text style={styles.logBody}>Requirement: {traj.minimumUnit}</Text>
      {commitment.notes && (
        <Text style={styles.logBody}>Notes: {commitment.notes}</Text>
      )}
      <Text style={styles.logFooter}>[Commited on {createdAt}]</Text>
    </View>
  );
};

export default CommitmentItem;
