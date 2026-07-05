import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppState } from "../../context/AppStateContext";
import LogItem from "./LogItem";

const PREVIEW_COUNT = 5;

const HomeScreenLogs = () => {
  const { logs, styles } = useAppState();
  const navigation = useNavigation();
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
        {logs.length > 0 && (
          <TouchableOpacity onPress={() => navigation.navigate("AllLogs")}>
            <Text style={styles.statLabel}>VIEW ALL →</Text>
          </TouchableOpacity>
        )}
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
