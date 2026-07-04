import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../../context/AppStateContext";
import LogItem from "../LogItem";
import { getHeatColor } from "../../utils/trajectories";

const HomeScreen = () => {
  // Pull loading from context, not local state
  const { styles, profile, logs, loading, trajectories } = useAppState();

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>// BOOTING_SYSTEM...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>// EdOS</Text>

      {/* Level */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Text
          style={styles.subtitle}
        >
          Welcome, Hero {profile.name}
        </Text>
      </View>

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
            {profile.heroPoints} <Text style={{ fontSize: 12 }}>HP</Text>
          </Text>
        </View>
      </View>

      {/* Attributes */}
      <View style={styles.card}>
        <Text style={styles.monospaceText}>// CORE_ATTRIBUTES</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
          {profile.attributes.list.map((attr) => (
            <View key={attr.key} style={{ width: "50%", padding: 5 }}>
              <Text style={styles.monospaceText}>
                {attr.emoji} {attr.label}
              </Text>
              {/* Simple inline progress bar */}
              <View
                style={{ height: 4, backgroundColor: "#333", marginTop: 4 }}
              >
                <View
                  style={{
                    width: `${(attr.val / profile.attributes.maxVal) * 100}%`,
                    height: 4,
                    backgroundColor: "#0f0",
                  }}
                />
              </View>
              <Text
                style={[
                  styles.monospaceText,
                  { fontSize: 10, textAlign: "right" },
                ]}
              >
                LVL {attr.val}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Trajectories */}
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
                    backgroundColor: getHeatColor(traj.temperature),
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

      {/* Logs */}
      <View style={styles.card}>
        <Text style={styles.monospaceText}>// RECENT_LOGS</Text>
        <ScrollView style={{ maxHeight: 200 }}>
          {logs && logs.length > 0 ? (
            logs.map((entry) => <LogItem key={entry.id} log={entry} />)
          ) : (
            <Text style={styles.monospaceText}>&gt; NO_LOGS_FOUND</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
