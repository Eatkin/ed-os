import { View, Text } from "react-native";
import homeStyles from "../style/home";

const LogItem = ({ log }) => {
  const styles = homeStyles;

  const time = new Date(log.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Helper to map status to emojis
  const getStatusEmoji = (res) => {
    switch (res.toLowerCase()) {
      case 'flow': return '🟢';
      case 'neutral': return '🟡';
      case 'resistant': return '🔴';
      case 'soul-crushing': return '⚡';
      default: return '⚪';
    }
  };

  return (
    <View style={styles.logEntry}>
      <Text style={styles.logHeader}>
        [{time}] {getStatusEmoji(log.resistance)} {log.trajectoryId.toUpperCase()}
      </Text>
      <Text style={styles.logBody}>
        &gt; {log.note}
      </Text>
      <Text style={styles.logFooter}>
        ⌬ {log.resistance.toUpperCase()} | 💎 +{log.pointsAwarded} XP
      </Text>
    </View>
  );
};

export default LogItem;
