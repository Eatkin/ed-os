import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useAppState } from "../../context/AppStateContext";
import { RESISTANCE_MULTIPLIERS } from "../../services/ApiService/DB.constants";
import { ApiService } from "../../services/ApiService/ApiService";

const RESISTANCE_OPTIONS = Object.keys(RESISTANCE_MULTIPLIERS);

const MilestoneCompleteModal = () => {
  const {
    styles,
    milestoneModalVisible,
    closeMilestoneModal,
    milestoneModalData, // { trajectoryId, milestoneId }
    trajectories,
    refreshAll,
  } = useAppState();

  const [resistance, setResistance] = useState(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const traj = milestoneModalData
    ? trajectories[milestoneModalData.trajectoryId]
    : null;
  const milestone = traj?.milestones.find(
    (m) => m.id === milestoneModalData?.milestoneId,
  );

  const reset = () => {
    setResistance(null);
    setNote("");
  };

  const handleClose = () => {
    reset();
    closeMilestoneModal();
  };

  const handleSubmit = async () => {
    if (!resistance || !milestoneModalData) return;
    setSubmitting(true);
    try {
      await ApiService.clearMilestoneWithLog(
        milestoneModalData.trajectoryId,
        milestoneModalData.milestoneId,
        resistance,
        note,
      );
      await refreshAll();
      reset();
      closeMilestoneModal();
    } catch (e) {
      console.error("Failed to clear milestone:", e);
    } finally {
      setSubmitting(false);
    }
  };

  if (!milestone) return null;

  return (
    <Modal
      visible={milestoneModalVisible}
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
          <Text style={styles.title}>// MILESTONE CLEARED</Text>
          <Text style={styles.subtitle}>{milestone.text}</Text>

          <ScrollView>
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
                      borderColor:
                        resistance === opt ? "#FFB300" : "transparent",
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => setResistance(opt)}
                >
                  <Text style={styles.statLabel}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.subtitle, { marginTop: 16 }]}>
              NOTE (OPTIONAL)
            </Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="How did it go?"
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
                {submitting ? "SAVING..." : "✅ CONFIRM CLEARED"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default MilestoneCompleteModal;
