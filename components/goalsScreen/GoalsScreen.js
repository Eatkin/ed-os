import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../../context/AppStateContext";
import { getHeatColour } from "../../utils/trajectories";

const GoalsScreen = ({ navigation }) => {
  const { styles, trajectories } = useAppState();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>// GOALS</Text>
      <ScrollView>
        {Object.values(trajectories).map((traj) => (
          <TouchableOpacity
            key={traj.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("TrajectoryDetail", { trajectoryId: traj.id })
            }
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
                <Text style={styles.statLabel}>{traj.temperature.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>LVL {traj.level}</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${traj.xpProgress ?? 0}%` }]} />
            </View>
            <Text style={styles.statLabel}>
              {traj.weeklyLogCount}/{traj.weeklyTarget} this week
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default GoalsScreen;
