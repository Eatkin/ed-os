import { Text, View } from "react-native";
import { useAppState } from "../../context/AppStateContext";
import { getHeatColour } from "../../utils/trajectories";

const HEAT_WEIGHT = { hot: 1, warm: 2, cold: 3, frozen: 4 };
// 3 trajectories × weight 1–4 each => total ranges from 3 (all hot) to 12 (all frozen)

const getSectionLabel = (total) => {
  if (total <= 4) return "// ALL WARMED UP";
  if (total <= 7) return "// TICKING ALONG";
  if (total <= 9) return "// GETTING CHILLY";
  return "// NEEDS ATTENTION";
};

const HomeScreenTrajectories = () => {
  const { trajectories, styles } = useAppState();

  const coldest = Object.values(trajectories)
    .sort((a, b) => HEAT_WEIGHT[b.temperature] - HEAT_WEIGHT[a.temperature])
    .slice(0, 3);

  const totalWeight = coldest.reduce(
    (sum, traj) => sum + HEAT_WEIGHT[traj.temperature],
    0,
  );

  return (
    <View style={styles.card}>
      <Text style={styles.monospaceText}>{getSectionLabel(totalWeight)}</Text>
      {coldest.map((traj) => (
        <View
          key={traj.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: "#222",
          }}
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
            <Text style={styles.statLabel}>{traj.temperature.toUpperCase()}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default HomeScreenTrajectories;
