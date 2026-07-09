import { View, Text } from "react-native";
import { useAppState } from "../../context/AppStateContext";
import CommitmentItem from "./CommitmentItem";

const HomeScreenCommitments = () => {
  const { styles, commitments } = useAppState();

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

      {commitments.length > 0 ? (
        commitments.map((entry) => (
          <CommitmentItem key={entry.id} commitment={entry} />
        ))
      ) : (
        <Text style={styles.monospaceText}>&gt; NO_COMMITMENTS_MADE</Text>
      )}
    </View>
  );
};

export default HomeScreenCommitments;
