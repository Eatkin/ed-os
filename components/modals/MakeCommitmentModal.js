import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { COMMITMENT_RELUCTANCE_BONUS } from "../../services/ApiService/DB.constants";
import { useAppState } from "../../context/AppStateContext";
import { getExpiryPreset } from "../../utils/commitments";
import { ApiService } from "../../services/ApiService/ApiService";

const RELUCTANCE_OPTIONS = Object.keys(COMMITMENT_RELUCTANCE_BONUS);
const EXPIRY_PRESETS = [
  { key: "today", label: "By end of today" },
  { key: "tomorrow", label: "By end of tomorrow" },
  { key: "week", label: "By end of the week" },
];

const CommitmentModal = () => {
  const {
    styles,
    commitmentModalVisible,
    closeCommitmentModal,
    commitmentModalTrajectoryId,
    trajectories,
    refreshAll,
  } = useAppState();

  const [selectedTrajId, setSelectedTrajId] = useState(null);
  const [reluctance, setReluctance] = useState(null);
  const [expiryPreset, setExpiryPreset] = useState("tomorrow");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const activeTrajId = commitmentModalTrajectoryId || selectedTrajId;
  const activeTraj = activeTrajId ? trajectories[activeTrajId] : null;

  const reset = () => {
    setSelectedTrajId(null);
    setReluctance(null);
    setExpiryPreset("tomorrow");
    setNotes("");
  };

  const handleClose = () => {
    reset();
    closeCommitmentModal();
  };

  const handleSubmit = async () => {
    if (!activeTrajId || !reluctance) return;
    setSubmitting(true);
    try {
      const bonusXP = COMMITMENT_RELUCTANCE_BONUS[reluctance];
      const expiresAt = getExpiryPreset(expiryPreset);
      await ApiService.createCommitment(
        activeTrajId,
        notes,
        expiresAt,
        bonusXP,
      );
      await refreshAll();
      reset();
      closeCommitmentModal();
    } catch (e) {
      console.error("Failed to create commitment:", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={commitmentModalVisible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}
        activeOpacity={1}
        onPress={handleClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={{
            marginTop: "auto",
            backgroundColor: "#111",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            maxHeight: "85%",
          }}
        >
          <Text style={styles.title}>// MAKE A COMMITMENT</Text>

          {!activeTrajId ? (
            <ScrollView>
              <Text style={styles.subtitle}>PICK A TRAJECTORY</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {Object.values(trajectories)
                  .filter((t) => !t.archived)
                  .map((traj) => (
                    <TouchableOpacity
                      key={traj.id}
                      style={[styles.card, { width: "47%", margin: "1.5%" }]}
                      onPress={() => setSelectedTrajId(traj.id)}
                    >
                      <Text style={styles.statValue}>{traj.name}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </ScrollView>
          ) : (
            <ScrollView>
              <Text style={styles.subtitle}>
                {activeTraj?.name?.toUpperCase()}
              </Text>

              {activeTraj?.minimumUnit ? (
                <Text style={[styles.statLabel, { marginTop: 8 }]}>
                  Suggested minimum: {activeTraj.minimumUnit}
                </Text>
              ) : null}

              <Text style={[styles.subtitle, { marginTop: 16 }]}>
                HOW MUCH DO YOU NOT WANT TO DO THIS?
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {RELUCTANCE_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.card,
                      {
                        marginRight: 8,
                        marginBottom: 8,
                        borderColor:
                          reluctance === opt ? "#FFB300" : "transparent",
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => setReluctance(opt)}
                  >
                    <Text style={styles.statLabel}>{opt}</Text>
                    <Text
                      style={[
                        styles.statLabel,
                        { color: "#00FF00", fontSize: 10 },
                      ]}
                    >
                      +{COMMITMENT_RELUCTANCE_BONUS[opt]} XP bonus
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.subtitle, { marginTop: 16 }]}>
                COMPLETE BY
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {EXPIRY_PRESETS.map((preset) => (
                  <TouchableOpacity
                    key={preset.key}
                    style={[
                      styles.card,
                      {
                        marginRight: 8,
                        marginBottom: 8,
                        borderColor:
                          expiryPreset === preset.key
                            ? "#FFB300"
                            : "transparent",
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => setExpiryPreset(preset.key)}
                  >
                    <Text style={styles.statLabel}>{preset.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.subtitle, { marginTop: 16 }]}>
                REQUIREMENT
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="What are you committing to?"
                placeholderTextColor="#555"
                multiline
                style={{
                  color: "#fff",
                  fontFamily: "monospace",
                  borderColor: "#333",
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 10,
                  minHeight: 60,
                  marginBottom: 20,
                }}
              />

              <TouchableOpacity
                style={[
                  styles.card,
                  { opacity: reluctance && notes.trim() && !submitting ? 1 : 0.4 },
                ]}
                onPress={handleSubmit}
                disabled={!reluctance || !notes.trim() || submitting}
              >
                <Text style={styles.statValue}>
                  {submitting ? "SAVING..." : "+ COMMIT"}
                </Text>
              </TouchableOpacity>

              {!commitmentModalTrajectoryId && (
                <TouchableOpacity
                  onPress={() => setSelectedTrajId(null)}
                  style={{ marginTop: 12 }}
                >
                  <Text style={styles.statLabel}>{"< CHANGE TRAJECTORY"}</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default CommitmentModal;
