import { View, Text, TouchableOpacity } from "react-native";
import { useAppState } from "../../../context/AppStateContext";

const MilestonePickerField = ({ label, value, onChange, allowNone = true }) => {
  const { styles, trajectories } = useAppState();
  const trajList = Object.values(trajectories).filter((t) => !t.archived);

  return (
    <View style={{ marginTop: 16 }}>
      {label && <Text style={styles.subtitle}>{label}</Text>}

      {allowNone && (
        <TouchableOpacity
          style={[
            styles.card,
            {
              marginBottom: 8,
              borderColor: value === null ? "#FFB300" : "transparent",
              borderWidth: 2,
            },
          ]}
          onPress={() => onChange(null)}
        >
          <Text style={styles.statValue}>— NO MILESTONE (FREE UNLOCK) —</Text>
        </TouchableOpacity>
      )}

      {trajList.map((traj) =>
        traj.milestones.length > 0 ? (
          <View key={traj.id} style={{ marginBottom: 8 }}>
            <Text style={[styles.statLabel, { marginBottom: 4 }]}>
              {traj.name}
            </Text>
            {traj.milestones.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.card,
                  {
                    marginBottom: 4,
                    opacity: m.cleared ? 0.5 : 1,
                    borderColor: value === m.id ? "#FFB300" : "transparent",
                    borderWidth: 2,
                  },
                ]}
                onPress={() => onChange(m.id)}
              >
                <Text style={styles.statLabel}>
                  {m.cleared ? "✅ " : ""}
                  {m.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null,
      )}
    </View>
  );
};

export default MilestonePickerField;
