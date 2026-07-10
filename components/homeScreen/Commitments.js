import { View, Text } from "react-native";
import { useAppState } from "../../context/AppStateContext";
import CommitmentItem from "../shared/CommitmentItem";

const HomeScreenCommitments = () => {
  const { styles, commitments } = useAppState();

  // Only show ones still live: PENDING status AND not past their expiry
  // (covers the gap between "expired" and the next sweep actually running)
  const activeCommitments = commitments.filter(
    (c) => c.status === "PENDING" && new Date(c.expiresAt) > new Date(),
  );

  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.monospaceText}>// Commitments</Text>
      </View>
      {activeCommitments.length > 0
        ? activeCommitments.map((entry) => (
            <CommitmentItem key={entry.id} commitment={entry} />
          ))
        : null}
    </View>
  );
};

export default HomeScreenCommitments;
