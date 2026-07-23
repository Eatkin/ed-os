import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../../context/AppStateContext";
import { getArchiveStats, getHeatColour } from "../../utils/trajectories";
import { ApiService } from "../../services/ApiService/ApiService";
import SelectButtons from "../shared/form/SelectButtons";

const SORT_OPTIONS = [
  { value: "momentum", label: "MOMENTUM" },
  { value: "name", label: "NAME" },
  { value: "lastLogged", label: "LAST LOGGED" },
];

const SORT_COMPARATORS = {
  momentum: (a, b) => {
    if (!a.lastLoggedAt) return 1; // never-logged sinks to bottom
    if (!b.lastLoggedAt) return -1;

    const aMomentum = a.momentum ?? -Infinity;
    const bMomentum = b.momentum ?? -Infinity;

    if (aMomentum !== bMomentum) return bMomentum - aMomentum;

    // Tiebreak (including both-null momentum) with recency, same as before
    return new Date(b.lastLoggedAt) - new Date(a.lastLoggedAt);
  },
  name: (a, b) => a.name.localeCompare(b.name),
  lastLogged: (a, b) => {
    if (!a.lastLoggedAt) return 1; // never-logged sinks to bottom
    if (!b.lastLoggedAt) return -1;
    return new Date(b.lastLoggedAt) - new Date(a.lastLoggedAt);
  },
};

const GoalsScreen = ({ navigation }) => {
  const { styles, trajectories, logs, refreshAll, openConfirmModal } =
    useAppState();
  const [sortBy, setSortBy] = useState("momentum");

  const sortedTrajectories = Object.values(trajectories).sort(
    SORT_COMPARATORS[sortBy],
  );

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
      <SelectButtons
        label="SORT BY"
        options={SORT_OPTIONS}
        value={sortBy}
        onChange={setSortBy}
      />
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: 6,
              }}
            >
              <Text style={styles.levelLabel}>LV. {traj.level}</Text>
              <Text style={[styles.statLabel, { color: "#888" }]}>
                {traj.currentLevelXP} / {traj.xpToNextLevel} XP
              </Text>
            </View>
            <View style={[styles.progressBarBg, { marginVertical: 6 }]}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${traj.xpProgress ?? 0}%` },
                ]}
              />
            </View>
            <Text
              style={[
                styles.statLabel,
                { marginBottom: 6, fontSize: 11, color: "#666" },
              ]}
            >
              {traj.xpProgress ?? 0}% to Level {traj.level + 1}
            </Text>
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
