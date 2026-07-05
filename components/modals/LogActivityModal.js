import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { RESISTANCE_MULTIPLIERS } from "../../services/ApiService/DB.constants";
import { useAppState } from "../../context/AppStateContext";
import { ApiService } from "../../services/ApiService/ApiService";

const RESISTANCE_OPTIONS = Object.keys(RESISTANCE_MULTIPLIERS);

const LogActivityModal = () => {
  const {
    styles,
    logModalVisible,
    closeLogModal,
    logModalTrajectoryId,
    trajectories,
    refreshAll,
  } = useAppState();

  const [selectedTrajId, setSelectedTrajId] = useState(null);
  const [resistance, setResistance] = useState(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const activeTrajId = logModalTrajectoryId || selectedTrajId;
  const activeTraj = activeTrajId ? trajectories[activeTrajId] : null;

  const reset = () => {
    setSelectedTrajId(null);
    setResistance(null);
    setNote("");
  };

  const handleClose = () => {
    reset();
    closeLogModal();
  };

  const handleSubmit = async () => {
    if (!activeTrajId || !resistance) return;
    setSubmitting(true);
    try {
      await ApiService.saveActivityLog(activeTrajId, resistance, note);
      await refreshAll?.();
      reset();
      closeLogModal();
    } catch (e) {
      console.error("Failed to save log:", e);
      // TODO: surface an error state in the UI rather than just console
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={logModalVisible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      {/* Tap outside the sheet to dismiss */}
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}
        activeOpacity={1}
        onPress={handleClose}
      >
        {/* Stop taps inside the sheet from bubbling up and closing it */}
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
          <Text style={styles.title}>// LOG ACTIVITY</Text>

          {!activeTrajId ? (
            // Step 1: no trajectory pre-picked — show the grid
            <ScrollView>
              <Text style={styles.subtitle}>PICK A TRAJECTORY</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {Object.values(trajectories).map((traj) => (
                  <TouchableOpacity
                    key={traj.id}
                    style={[styles.card, { width: "47%", margin: "1.5%" }]}
                    onPress={() => setSelectedTrajId(traj.id)}
                  >
                    <Text style={styles.statValue}>{traj.name}</Text>
                    <Text style={styles.statLabel}>LVL {traj.level}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          ) : (
            // Step 2: trajectory known — resistance + note
            <ScrollView>
              <Text style={styles.subtitle}>{activeTraj?.name?.toUpperCase()}</Text>

              <Text style={[styles.subtitle, { marginTop: 16 }]}>RESISTANCE</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {RESISTANCE_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.card,
                      {
                        marginRight: 8,
                        marginBottom: 8,
                        borderColor: resistance === opt ? "#FFB300" : "transparent",
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => setResistance(opt)}
                  >
                    <Text style={styles.statLabel}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.subtitle, { marginTop: 16 }]}>NOTE (OPTIONAL)</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="What did you work on?"
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
                  { opacity: resistance && !submitting ? 1 : 0.4 },
                ]}
                onPress={handleSubmit}
                disabled={!resistance || submitting}
              >
                <Text style={styles.statValue}>
                  {submitting ? "SAVING..." : "+ SAVE LOG"}
                </Text>
              </TouchableOpacity>

              {!logModalTrajectoryId && (
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

export default LogActivityModal;
