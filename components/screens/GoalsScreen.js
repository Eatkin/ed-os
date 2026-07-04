import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../../context/AppStateContext";

const GoalsScreen = () => {
  const { styles, trajectories } = useAppState();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>// GOALS</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GoalsScreen;
