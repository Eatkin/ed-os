import { Text, View } from "react-native";
import { useAppState } from "../../context/AppStateContext";

const HomeScreenLogs = () => {
  const { logs, styles } = useAppState();
  return (
    <View style={styles.card}>
      <Text style={styles.monospaceText}>// RECENT_LOGS</Text>
      <ScrollView style={{ maxHeight: 200 }}>
        {logs && logs.length > 0 ? (
          logs.map((entry) => <LogItem key={entry.id} log={entry} />)
        ) : (
          <Text style={styles.monospaceText}>&gt; NO_LOGS_FOUND</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreenLogs;
