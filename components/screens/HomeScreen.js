import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "../../context/AppStateContext";
import { useEffect, useState } from "react";
import LogItem from "../LogItem";

const HomeScreen = () => {
  const { styles, getAppData } = useAppState();

  // Local state to safely hold the asynchronously resolved profile object
  const [profile, setProfile] = useState(null);
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProfileData = async () => {
      try {
        const data = await getAppData();
        if (data && isMounted) {
          if (data.profile) {
            setProfile(data.profile);
          }
          if (data.logs) {
            setLog(data.logs);
          }
        }
      } catch (err) {
        console.error("Error loading profile within HomeScreen:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, [getAppData]);

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>// BOOTING_SYSTEM...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>// Welcome, Hero {profile.name}</Text>

      {/* Experience and currency reading systems */}
      <View style={styles.card}>
        <Text style={styles.monospaceText}>LEVEL: {profile.level}</Text>
        <Text style={styles.monospaceText}>TOTAL_XP: {profile.totalXP}</Text>
        <Text style={styles.monospaceText}>
          HERO_POINTS: {profile.heroPoints} HP
        </Text>
      </View>

      {/* Attributes table mapping */}
      <View style={styles.card}>
        <Text style={[styles.monospaceText]}>// CORE_ATTRIBUTES</Text>
        {profile.attributes &&
          Object.entries(profile.attributes).map(([key, value]) => (
            <Text key={key} style={styles.monospaceText}>
              &gt; {key.toUpperCase()}: +{value}
            </Text>
          ))}
      </View>

      {/* Log */}
      <View style={styles.card}>
        <Text style={styles.monospaceText}>// RECENT_LOGS</Text>
        <ScrollView style={{ maxHeight: 200 }}>
          {log && log.length > 0 ? (
            log.map((entry) => (
                <LogItem key={entry.id} log={entry}/>
            ))
          ) : (
            <Text style={styles.monospaceText}>&gt; NO_LOGS_FOUND</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
