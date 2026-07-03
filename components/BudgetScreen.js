import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppState } from '../context/AppStateContext';

export const BudgetScreen = () => {
  const { budget, styles } = useAppState();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>// POKEMON_LEDGER</Text>
      <Text style={styles.monospaceText}>
        Remaining: ${budget.remaining} / ${budget.allowance}
      </Text>
    </SafeAreaView>
  );
};
