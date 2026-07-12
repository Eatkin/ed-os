import { Text, TouchableOpacity } from "react-native";
import { useAppState } from "../../context/AppStateContext";
import { navigationRef } from "../../navigation/navigationRef";

const BackButton = () => {
  const { styles } = useAppState();

  const handleBack = () => {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  };

  return (
    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
      <Text style={styles.backButtonText}>{"< BACK"}</Text>
    </TouchableOpacity>
  );
};

export default BackButton;
