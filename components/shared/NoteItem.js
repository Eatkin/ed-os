import { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { useAppState } from "../../context/AppStateContext";

const NoteItem = ({ note }) => {
  const { styles, trajectories } = useAppState();
  const [expanded, setExpanded] = useState(false);
  const traj = note.trajectoryId ? trajectories[note.trajectoryId] : null;

  const headerLabel = note.trajectoryId
    ? (traj?.name ?? note.trajectoryId) // has a trajectoryId — show its name, or the raw id if somehow missing
    : "GENERAL"; // no trajectory attached — general/unassociated note

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
        <Text style={styles.statValue}>{headerLabel}</Text>
        <Text style={styles.statLabel}>
          {expanded && note.formattedDate} {note.formattedTime}
        </Text>
      </View>
      <View style={{ marginTop: 8 }}>
        <Text style={styles.monospaceText}>
          {note.note?.trim() ? note.note : "No note added."}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NoteItem;
