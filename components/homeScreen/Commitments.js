import { View, Text } from "react-native";
import { useAppState } from "../../context/AppStateContext";
import CommitmentItem from "../shared/CommitmentItem";
import ViewAllLink from "../shared/ViewAllLink";

const HomeScreenCommitments = () => {
  const { styles, commitments } = useAppState();

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
        <Text style={styles.monospaceText}>// COMMITMENTS</Text>
        <ViewAllLink
          title="// ALL COMMITMENTS"
          dataKey="commitments"
          ItemComponent={CommitmentItem}
          itemProp="commitment"
          emptyLabel="NO_COMMITMENTS_MADE"
        />
      </View>

      {activeCommitments.length > 0
        ? activeCommitments.map((entry) => (
            <CommitmentItem key={entry.id} commitment={entry} />
          ))
        : <Text style={styles.monospaceText}>&gt; NO_COMMITMENTS_FOUND</Text>}
    </View>
  );
};

export default HomeScreenCommitments;
