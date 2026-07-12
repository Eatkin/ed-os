import { Text, TouchableOpacity } from "react-native";
import { useAppState } from "../../context/AppStateContext";
import { navigate } from "../../navigation/navigationRef";

const ViewAllLink = ({
  title,
  dataKey,
  ItemComponent,
  itemProp,
  emptyLabel,
  computeData,
}) => {
  const { styles } = useAppState();
  

  return (
    <TouchableOpacity
      onPress={() =>
        navigate("ListScreen", {
          title,
          dataKey,
          ItemComponent,
          itemProp,
          emptyLabel,
          computeData,
        })
      }
    >
      <Text style={styles.statLabel}>VIEW ALL →</Text>
    </TouchableOpacity>
  );
};

export default ViewAllLink;
