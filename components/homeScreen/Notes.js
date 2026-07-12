import { View, Text } from "react-native";
import { useAppState } from "../../context/AppStateContext";
import NoteItem from "../shared/NoteItem";
import ViewAllLink from "../shared/ViewAllLink";

const PREVIEW_COUNT = 5;

const HomeScreenNotes = () => {
  const { notes, styles } = useAppState();
  const previewLogs = notes.slice(0, PREVIEW_COUNT);

  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.monospaceText}>// RECENT_NOTES</Text>
        <ViewAllLink
          title="// ALL NOTES"
          dataKey="notes"
          ItemComponent={NoteItem}
          itemProp="note"
          emptyLabel="NO_NOTES_MADE"
        />
      </View>

      {previewLogs.length > 0 ? (
        previewLogs.map((entry) => <NoteItem key={entry.id} note={entry} />)
      ) : (
        <Text style={styles.monospaceText}>&gt; NO_NOTES_YET</Text>
      )}
    </View>
  );
};

export default HomeScreenNotes;
