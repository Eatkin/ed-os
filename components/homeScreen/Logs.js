import { View, Text} from "react-native";
import { useAppState } from "../../context/AppStateContext";
import LogItem from "../shared/LogItem";

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
