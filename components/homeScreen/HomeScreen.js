import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../../context/AppStateContext";
import HomeScreenTitle from "./Title";
import HomeScreenStats from "./Stats";
import HomeScreenAttributes from "./Attributes";
import HomeScreenTrajectories from "./Trajectories";
import HomeScreenLogs from "./Logs";

const HomeScreen = () => {
  // Pull loading from context, not local state
  const { styles, profile, loading } = useAppState();

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>// BOOTING_SYSTEM...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>// EdOS</Text>
      <HomeScreenTitle />
      <HomeScreenStats />
      <HomeScreenAttributes />
      <HomeScreenTrajectories />
      <HomeScreenLogs />
    </SafeAreaView>
  );
};

export default HomeScreen;
