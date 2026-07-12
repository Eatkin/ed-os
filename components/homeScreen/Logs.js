import { View, Text} from "react-native";
import { useAppState } from "../../context/AppStateContext";
import LogItem from "../shared/LogItem";
import ViewAllLink from "../shared/ViewAllLink";

const PREVIEW_COUNT = 5;

const HomeScreenLogs = () => {
  const { logs, styles } = useAppState();
  const previewLogs = logs.slice(0, PREVIEW_COUNT);

  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.monospaceText}>// RECENT_LOGS</Text>
        <ViewAllLink
          title="// ALL LOGS"
          dataKey="logs"
          ItemComponent={LogItem}
          itemProp="log"
          emptyLabel="NO_LOGS_MADE"
        />
      </View>

      {previewLogs.length > 0 ? (
        previewLogs.map((entry) => <LogItem key={entry.id} log={entry} />)
      ) : (
        <Text style={styles.monospaceText}>&gt; NO_LOGS_FOUND</Text>
      )}
    </View>
  );
};

export default HomeScreenLogs;
