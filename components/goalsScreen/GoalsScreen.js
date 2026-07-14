import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../../context/AppStateContext";
import { getArchiveStats, getHeatColour } from "../../utils/trajectories";
import { ApiService } from "../../services/ApiService/ApiService";

const GoalsScreen = ({ navigation }) => {
  const { styles, trajectories, logs, refreshAll, openConfirmModal } = useAppState();

  const sortedTrajectories = Object.values(trajectories).sort((a, b) => {
    if (!a.lastLoggedAt) return 1; // never-logged sinks to bottom
    if (!b.lastLoggedAt) return -1;
    return new Date(b.lastLoggedAt) - new Date(a.lastLoggedAt);
  });

  const active = sortedTrajectories.filter((t) => !t.archived);
  const archived = Object.values(trajectories).filter((t) => t.archived);

  const handleUnarchive = (traj) => {
    openConfirmModal({
      title: "Bring back to active?",
      message: `"${traj.name}" will return to your active trajectories.`,
      confirmLabel: "Unarchive",
      onConfirm: async () => {
        await ApiService.setTrajectoryArchived(traj.id, false);
        await refreshAll();
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>// GOALS</Text>
      <ScrollView>
        {active.map((traj) => (
          <TouchableOpacity
            key={traj.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("TrajectoryDetail", { trajectoryId: traj.id })
            }
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.statValue}>{traj.name}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: getHeatColour(traj.temperature),
                    marginRight: 6,
                  }}
                />
                <Text style={styles.statLabel}>
                  {traj.temperature.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.subtitle}>LVL {traj.level}</Text>
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
          </TouchableOpacity>
        ))}

        {archived.length > 0 && (
          <>
            <Text style={[styles.subtitle, { marginTop: 20 }]}>
              // ARCHIVED
            </Text>
            {archived.map((traj) => {
              const stats = getArchiveStats(traj.id, logs);
              return (
                <TouchableOpacity
                  key={traj.id}
                  style={[styles.card, { opacity: 0.6 }]}
                  onPress={() => handleUnarchive(traj)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.statValue}>{traj.name}</Text>
                    <Text style={[styles.statLabel, { color: "#00FFAA" }]}>
                      ↩ UNARCHIVE
                    </Text>
                  </View>
                  {stats && (
                    <Text style={styles.statLabel}>
                      {stats.totalXP} XP · {stats.totalLogs} logs ·{" "}
                      {new Date(stats.startDate).toLocaleDateString()} –{" "}
                      {new Date(stats.endDate).toLocaleDateString()}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default GoalsScreen;
