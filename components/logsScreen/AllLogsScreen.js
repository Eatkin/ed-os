import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LogItem from "./LogItem";
import { useAppState } from "../../context/AppStateContext";
import BackButton from "../BackButton";

const AllLogsScreen = ({ navigation }) => {
  const { styles, logs } = useAppState();

  return (
    <SafeAreaView style={styles.container}>
      <BackButton navigation={navigation} />
      <Text style={styles.title}>// ALL LOGS</Text>
      <ScrollView>
        {logs.length > 0 ? (
          logs.map((entry) => <LogItem key={entry.id} log={entry} />)
        ) : (
          <Text style={styles.monospaceText}>&gt; NO_LOGS_FOUND</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllLogsScreen;
