import { Text, View } from "react-native";
import { useAppState } from "../../context/AppStateContext";

const HomeScreenTitle = () => {
  const { styles, profile } = useAppState();
  return (
    <View style={{ alignItems: "center", marginVertical: 20 }}>
      <Text style={styles.subtitle}>Welcome, Hero {profile.name}</Text>
    </View>
  );
};

export default HomeScreenTitle;
