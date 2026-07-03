import { Text} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../context/AppStateContext"; 

export const GoalsScreen = () => {
  const { goals, styles } = useAppState();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>// GOALS_CORE</Text>
      {goals.map((goal) => (
        <Text key={goal.id} style={styles.monospaceText}>
          {goal.name} - Streak: {goal.streak}w
        </Text>
      ))}
    </SafeAreaView>
  );
};
