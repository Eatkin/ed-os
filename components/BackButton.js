import { Text, TouchableOpacity } from "react-native";
import { useAppState } from "../context/AppStateContext";

const BackButton = ({ navigation }) => {
  const { styles } = useAppState();

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.backButton}
    >
      <Text style={styles.backButtonText}>{"< BACK"}</Text>
    </TouchableOpacity>
  );
};

export default BackButton;
