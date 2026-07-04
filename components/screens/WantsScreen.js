import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../../context/AppStateContext";

const GoalsScreen = () => {
  const { styles, vault, loot } = useAppState();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>// WANTS</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GoalsScreen;
