import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../context/AppStateContext";
import LogItem from "./shared/LogItem";
import CommitmentItem from "./shared/CommitmentItem";
import { ApiService } from "../services/ApiService/ApiService";
import BackButton from "./shared/BackButton";
import { getHeatColour } from "../utils/trajectories";
import NoteItem from "./shared/NoteItem";

const TrajectoryDetailScreen = ({ route, navigation }) => {
  const { trajectoryId } = route.params;
  const {
    refreshAll,
    styles,
    trajectories,
    vault,
    openLogModal,
    openMilestoneModal,
    openMilestoneAdderModal,
    openConfirmModal,
    openCommitmentModal,
    openNoteModal,
  } = useAppState();
  const traj = trajectories[trajectoryId];

  if (!traj) return null; // shouldn't happen, but guards a bad/stale id

  const trajVaultEntries = vault.filter((v) => v.trajectoryId === trajectoryId);

  const handleArchive = () => {
    openConfirmModal({
      title: "Archive this trajectory?",
      message: `"${traj.name}" will move to your archive with its final stats.`,
      confirmLabel: "Archive",
      onConfirm: async () => {
        await ApiService.setTrajectoryArchived(trajectoryId, true);
        await refreshAll();
        navigation.goBack();
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton navigation={navigation} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={[styles.title, { flex: 1, marginRight: 8 }]}
          numberOfLines={1}
        >
          // {traj.name.toUpperCase()}
        </Text>
        {/* Subtle temperature indicator badge */}
        <Text
          style={[
            styles.statLabel,
            { color: getHeatColour(traj.temperature), flexShrink: 0 },
          ]}
        >
          [ {traj.temperature?.toUpperCase() ?? "COLD"} ]
        </Text>
      </View>
      <Text style={styles.subtitle}>{traj.description}</Text>

      <View style={styles.card}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.statLabel}>LEVEL {traj.level}</Text>
          {/* Displaying raw numbers next to the level */}
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

        {/* Displaying percentage text under the bar */}
        <Text
          style={[
            styles.statLabel,
            { marginBottom: 6, fontSize: 11, color: "#666" },
          ]}
        >
          {traj.xpProgress ?? 0}% to Level {traj.level + 1}
        </Text>

        {/* Attributes display */}
        {traj.attributeValues.map((attr) => (
          <View key={attr.name} style={styles.attributeRow}>
            <Text style={styles.attributeName}>{attr.name.toUpperCase()}</Text>
            <View style={styles.pipContainer}>
              {[1, 2, 3, 4, 5].map((level) => (
                <View
                  key={level}
                  style={[
                    styles.pip,
                    level <= attr.rating ? styles.pipFilled : styles.pipEmpty,
                  ]}
                />
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.statLabel}>
          {traj.weeklyLogCount}/{traj.weeklyTarget} this week
        </Text>
        <Text style={styles.statLabel}>
          Logged {traj.totalLogs} time{traj.totalLogs === 1 ? "" : "s"}!
        </Text>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        <TouchableOpacity
          style={[styles.card, { width: "48%", marginBottom: 0 }]}
          onPress={() => openLogModal(trajectoryId)}
        >
          <Text style={[styles.statValue, { textAlign: "center" }]}>
            + LOG ACTIVITY
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { width: "48%", marginBottom: 0 }]}
          onPress={() => openCommitmentModal(trajectoryId)}
        >
          <Text style={[styles.statValue, { textAlign: "center" }]}>
            + COMMITMENT
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { width: "48%", marginBottom: 0 }]}
          onPress={() => openMilestoneAdderModal(trajectoryId)}
        >
          <Text style={[styles.statValue, { textAlign: "center" }]}>
            + MILESTONE
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { width: "48%", marginBottom: 0 }]}
          onPress={() => openNoteModal(trajectoryId)}
        >
          <Text style={[styles.statValue, { textAlign: "center" }]}>
            + NOTE
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ marginTop: 10 }}>
        {traj.activeCommitments.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.subtitle}>ACTIVE COMMITMENTS</Text>
            {traj.activeCommitments.map((c) => (
              <CommitmentItem key={c.id} commitment={c} />
            ))}
          </View>
        )}

        {traj.milestones.length > 0 && (
          <>
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
          </>
        )}
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

        {traj.recentLogs.length > 0 && (
          <>
            <Text style={styles.subtitle}>RECENT LOGS</Text>
            {traj.recentLogs.map((l) => (
              <LogItem key={l.id} log={l} />
            ))}
          </>
        )}

        {traj.recentNotes.length > 0 && (
          <>
            <Text style={styles.subtitle}>RECENT NOTES</Text>
            {traj.recentNotes.map((n) => (
              <NoteItem key={n.id} note={n} />
            ))}
          </>
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={handleArchive}
        style={{
          marginTop: 24,
          marginBottom: 12,
          alignItems: "center",
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderColor: "#FFB300",
          borderRadius: 8,
        }}
      >
        <Text style={[styles.statLabel, { color: "#AAA" }]}>
          ARCHIVE THIS TRAJECTORY
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TrajectoryDetailScreen;
