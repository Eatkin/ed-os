import { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { useAppState } from "../../context/AppStateContext";
import { ApiService } from "../../services/ApiService/ApiService";

const NoteItem = ({ note }) => {
  const { styles, trajectories, refreshAll, openConfirmModal } = useAppState();
  const [expanded, setExpanded] = useState(false);
  const traj = note.trajectoryId ? trajectories[note.trajectoryId] : null;

  const headerLabel = note.trajectoryId
    ? (traj?.name ?? note.trajectoryId)
    : "GENERAL";

  const archived = note?.archived ?? false;

  const handleArchive = async () => {
    const title = !archived ? "Archive this note?" : "Unarchive note?";
    const message = !archived
      ? `"${note.id}" will move to your archive.`
      : `"${note.id}" will be removed from archive.`;
    const confirm = !archived ? "Archive" : "Unarchive";
    openConfirmModal({
      title: title,
      message: message,
      confirmLabel: confirm,
      onConfirm: async () => {
        setExpanded(false);
        await ApiService.setNoteArchived(note.id, !archived);
        await refreshAll();
      },
    });
  };

  return (
    <TouchableOpacity
      onPress={() => setExpanded((e) => !e)}
      style={{
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#222",
        opacity: note.archived ? 0.75 : 1,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.statValue}>
          {headerLabel} {archived && "[archived]"}
        </Text>
        <Text style={styles.statLabel}>
          {note.formattedDate} {note.formattedTime}
        </Text>
      </View>

      <View style={{ marginTop: 8 }}>
        <Text
          style={[styles.monospaceText, !expanded && { color: "#888" }]}
          numberOfLines={expanded ? undefined : 1}
          ellipsizeMode="tail"
        >
          {note.note?.trim() ? note.note : "No note added."}
        </Text>

        {expanded && (
          <TouchableOpacity
            onPress={handleArchive}
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
            <Text style={[styles.statLabel, { color: "#555" }]}>
              {!archived ? "ARCHIVE" : "UNARCHIVE"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default NoteItem;
