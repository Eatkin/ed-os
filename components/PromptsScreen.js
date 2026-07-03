import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import { useAppState } from "../context/AppStateContext";

export const PromptsScreen = () => {
  const { styles } = useAppState();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>// NUDGE_ENGINE</Text>
      <Text style={styles.monospaceText}>Passive system prompts ready.</Text>
    </SafeAreaView>
  );
};
