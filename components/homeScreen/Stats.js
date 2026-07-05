import { Text, View } from "react-native";
import { useAppState } from "../../context/AppStateContext";

const HomeScreenStats = () => {
  const { styles, profile } = useAppState();

  return (
      <View style={styles.card}>
        {/* Header Section */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <View>
            <Text style={styles.statLabel}>IDENTITY</Text>
            <Text style={styles.statValue}>{profile.name.toUpperCase()}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.statLabel}>RANK</Text>
            <Text style={styles.statValue}>LVL {profile.level}</Text>
          </View>
        </View>

        {/* XP Progress Bar */}
        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.statLabel}>EXPERIENCE</Text>
            <Text style={styles.statLabel}>
              {profile.currentLevelXP} / {profile.xpToNextLevel}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${profile.xpProgress}%` },
              ]}
            />
          </View>
        </View>

        {/* Currency Row */}
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
        >
          <Text style={styles.statLabel}>ASSETS: </Text>
          <Text style={[styles.statValue, { color: "#FFD700" }]}>
            {profile.heroPoints} <Text style={{ fontSize: 12 }}>Hero Points</Text>
          </Text>
        </View>
      </View>
  );
};

export default HomeScreenStats;
