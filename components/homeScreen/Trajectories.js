import { Text, View } from "react-native";
import { useAppState } from "../../context/AppStateContext";
import { getHeatColour } from "../../utils/trajectories";

const HomeScreenTrajectories = () => {
  const { trajectories, styles } = useAppState();
  return (
    <View style={styles.card}>
      <Text style={styles.monospaceText}>// ACTIVE_TRAJECTORIES</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Object.values(trajectories).map((traj) => (
          <View
            key={traj.id}
            style={[styles.card, { marginRight: 10, minWidth: 100 }]}
          >
            <Text style={[styles.monospaceText, { fontSize: 12 }]}>
              {traj.name}
            </Text>
            {/* Heat indicator: simple colored dot */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: getHeatColour(traj.temperature),
                }}
              />
              <Text style={{ fontSize: 10, marginLeft: 5 }}>
                {traj.temperature.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.monospaceText}>
              {traj.weeklyLogCount}/{traj.weeklyTarget} W
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreenTrajectories;
