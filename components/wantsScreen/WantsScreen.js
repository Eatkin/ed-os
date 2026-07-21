import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../../context/AppStateContext";
import LootItem from "../shared/LootItem";
import LootHistory from "./LootHistory";

const STATUS_ORDER = { AVAILABLE: 0, LOCKED: 1, OWNED: 2 };

const WantsScreen = () => {
  const { styles, loot, loading } = useAppState();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>// LOADING...</Text>
      </SafeAreaView>
    );
  }

  const sortedLoot = [...loot].sort(
    (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>// WANTS</Text>
      <ScrollView>
        <LootHistory />
        {sortedLoot.map((item) => (
          <LootItem key={item.id} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WantsScreen;
