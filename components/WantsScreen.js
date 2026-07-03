import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { useAppState } from '../context/AppStateContext';

export const WantsScreen = () => {
  const { styles } = useAppState();
  return (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>// WANTS_LOCKER</Text>
    <Text style={styles.monospaceText}>Gated reward matrix offline.</Text>
  </SafeAreaView>
  );
};
