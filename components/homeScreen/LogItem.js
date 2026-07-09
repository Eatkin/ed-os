import { View, Text } from "react-native";
import homeStyles from "../../style/home";
import { useAppState } from "../../context/AppStateContext";

const LogItem = ({ log }) => {
  const styles = homeStyles;
  const { trajectories } = useAppState();
  const traj = trajectories[log.trajectoryId];
  const milestone = log.milestoneId
    ? traj?.milestones.find((m) => m.id === log.milestoneId)
    : null;

  const getStatusEmoji = (res) => {
    switch (res.toLowerCase()) {
      case "flow":
        return "🟢";
      case "neutral":
        return "🟡";
      case "resistant":
        return "🔴";
      case "soul-crushing":
        return "⚡";
      default:
        return "⚪";
    }
  };

  return (
    <View style={styles.logEntry}>
      <Text style={styles.logHeader}>
        [{log.formattedDate}] {getStatusEmoji(log.resistance)}{" "}
        {log.trajectoryId.toUpperCase()}
        {milestone ? " 🏆" : ""}
      </Text>
      {milestone && (
        <Text style={[styles.logBody, { color: "#FFB300" }]}>
          🏆 {milestone.text}
        </Text>
      )}
      <Text style={styles.logBody}>&gt; {log.note}</Text>
      <Text style={styles.logFooter}>
        ⌬ {log.resistance.toUpperCase()} | 💎 +{log.pointsAwarded}
        {log.bonusXP > 0 ? ` (+${log.bonusXP} 🎯)` : ""} XP
      </Text>
    </View>
  );
};

export default LogItem;
