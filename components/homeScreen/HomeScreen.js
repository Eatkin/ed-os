import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../../context/AppStateContext";
import HomeScreenTitle from "./Title";
import HomeScreenStats from "./Stats";
import HomeScreenAttributes from "./Attributes";
import HomeScreenLogs from "./Logs";
import HomeScreenTrajectories from "./Trajectories";
import HomeScreenCommitments from "./Commitments";
import HomeScreenNotes from "./Notes";

const HomeScreen = ({ navigation }) => {
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
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <HomeScreenTitle />
        <HomeScreenStats />
        <HomeScreenTrajectories nTrajectories={4} />
        <HomeScreenAttributes />
        <HomeScreenCommitments />
        <HomeScreenLogs />
        <HomeScreenNotes />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
