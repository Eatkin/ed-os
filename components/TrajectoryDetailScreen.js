import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../context/AppStateContext";
import BackButton from "./BackButton";

const TrajectoryDetailScreen = ({ route, navigation }) => {
  const { trajectoryId } = route.params;
  const { styles, trajectories, vault, openLogModal, openMilestoneModal } = useAppState();
  const traj = trajectories[trajectoryId];

  if (!traj) return null; // shouldn't happen, but guards a bad/stale id

  const trajVaultEntries = vault.filter((v) => v.trajectoryId === trajectoryId);

  return (
    <SafeAreaView style={styles.container}>
      <BackButton navigation={navigation} />

      <Text style={styles.title}>// {traj.name.toUpperCase()}</Text>
      <Text style={styles.subtitle}>{traj.description}</Text>

      <View style={styles.card}>
        <Text style={styles.statLabel}>LEVEL {traj.level}</Text>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${traj.xpProgress ?? 0}%` },
            ]}
          />
        </View>
        <Text style={styles.statLabel}>
          {traj.weeklyLogCount}/{traj.weeklyTarget} this week
        </Text>
      </View>

      <TouchableOpacity
        style={styles.card}
        onPress={() => openLogModal(trajectoryId)}
      >
        <Text style={styles.statValue}>+ LOG ACTIVITY</Text>
      </TouchableOpacity>

      <ScrollView style={{ marginTop: 10 }}>
        <Text style={styles.subtitle}>MILESTONES</Text>
        {traj.milestones.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={styles.card}
            disabled={m.cleared}
            onPress={() => openMilestoneModal(traj.id, m.id)}
          >
            <Text style={styles.statValue}>
              {m.cleared ? "✅" : "⬜️"} {m.text}
            </Text>
          </TouchableOpacity>
        ))}
        {trajVaultEntries.length > 0 && (
          <>
            <Text style={styles.subtitle}>VAULT</Text>
            {trajVaultEntries.map((v) => (
              <View key={v.id} style={styles.card}>
                <Text style={styles.statLabel}>{v.text}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrajectoryDetailScreen;
