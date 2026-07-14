import { View, Text } from "react-native";
import { useAppState } from "../../context/AppStateContext";
import NoteItem from "../shared/NoteItem";
import ViewAllLink from "../shared/ViewAllLink";

const PREVIEW_COUNT = 5;

const HomeScreenNotes = () => {
  const { notes, styles } = useAppState();
  const previewNotes = [...notes]
    .filter((n) => !(n?.archived ?? false))
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, PREVIEW_COUNT);

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
          computeData={(appState) => {
            const allNotes = appState.notes ?? [];
            return [...allNotes].sort((a, b) =>
              a.archived === b.archived ? 0 : a.archived ? 1 : -1,
            );
          }}
          dataKey="notes"
          ItemComponent={NoteItem}
          itemProp="note"
          emptyLabel="NO_NOTES_MADE"
        />
      </View>

      {previewNotes.length > 0 ? (
        previewNotes.map((entry) => <NoteItem key={entry.id} note={entry} />)
      ) : (
        <Text style={styles.monospaceText}>&gt; NO_NOTES_YET</Text>
      )}
    </View>
  );
};

export default HomeScreenNotes;
