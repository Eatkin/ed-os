import { View, Text, TouchableOpacity } from "react-native";
import { useAppState } from "../../../context/AppStateContext";

const TrajectoryPickerField = ({
  label,
  value,
  onChange,
  includeArchived = false,
  allowNone = false,
}) => {
  const { styles, trajectories } = useAppState();

  const options = Object.values(trajectories).filter(
    (t) => includeArchived || !t.archived,
  );

  return (
    <View style={{ marginTop: 16 }}>
      {label && <Text style={styles.subtitle}>{label}</Text>}
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {allowNone && (
          <TouchableOpacity
            style={[
              styles.card,
              {
                width: "47%",
                margin: "1.5%",
                borderColor: value === null ? "#FFB300" : "transparent",
                borderWidth: 2,
              },
            ]}
            onPress={() => onChange(null)}
          >
            <Text style={styles.statValue}>— NONE —</Text>
          </TouchableOpacity>
        )}
        {options.map((traj) => (
          <TouchableOpacity
            key={traj.id}
            style={[
              styles.card,
              {
                width: "47%",
                margin: "1.5%",
                borderColor: value === traj.id ? "#FFB300" : "transparent",
                borderWidth: 2,
              },
            ]}
            onPress={() => onChange(traj.id)}
          >
            <Text style={styles.statValue}>{traj.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default TrajectoryPickerField;
